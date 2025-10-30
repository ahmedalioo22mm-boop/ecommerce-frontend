/** @format */

"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/Context/AuthContext";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { getUser,updateUser } from "@/lib/user";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="text-center text-red-500">{message}</div>
);

export default function EditUserPage({ params }) {
  const { id } = params; // Correct way to get id from params
  const { user: authUser, getValidToken, loading: authLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({ name: "", email: "" });
  const [role, setRole] = useState("user"); // Separate role state for security
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwner = authUser?._id === id;
  const isAdmin = authUser?.role === "admin";

  // 1. Authorization and Data Fetching
  useEffect(() => {
    if (authLoading) return; // Wait for auth state to be loaded

    if (!isOwner && !isAdmin) {
      toast.error("Access Denied. You are not authorized to edit this user.");
      router.push("/dashboard");
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await getUser(getValidToken, id);
        if (userData) {
          setFormData({ name: userData.name, email: userData.email });
          setRole(userData.role);
          if (userData.avatar?.url) {
            setAvatarPreview(userData.avatar.url);
          }
        } else {
          throw new Error("User not found.");
        }
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, getValidToken, authLoading, isOwner, isAdmin, router]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e) => {
    // Only admins can change roles
    if (isAdmin) {
      setRole(e.target.value);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading("Updating user...");

    try {
      const updateData = { ...formData };
      if (isAdmin) {
        updateData.role = role;
      }
      if (avatarFile) {
        updateData.avatar = avatarFile;
      }

      await updateUser(getValidToken, id, updateData);
      
      toast.success("User updated successfully!", { id: toastId });
      router.push(`/dashboard/users/${id}`);
    } catch (err) {
      toast.error(err.message || "Failed to update user.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || authLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;
  if (!isOwner && !isAdmin) return <ErrorDisplay message="Access Denied" />;


  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href={`/dashboard/users/${id}`}
          className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
        >
          <ArrowLeft size={20} />
          Back to User Details
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold mb-6">
            Edit User: {formData.name}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex items-center gap-4">
                {avatarPreview && (
                    <Image
                    src={avatarPreview}
                    alt="Avatar preview"
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                    />
                )}
                <label htmlFor="avatar" className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <Upload size={20} />
                    <span>Change Avatar</span>
                </label>
                <input
                    type="file"
                    name="avatar"
                    id="avatar"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                />
            </div>

            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleFormChange}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleFormChange}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Role Select (Admin only) */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Role
              </label>
              <select
                name="role"
                id="role"
                value={role}
                onChange={handleRoleChange}
                disabled={!isAdmin}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-200 dark:disabled:bg-gray-600"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {!isAdmin && <p className="text-xs text-gray-500 mt-1">Only administrators can change roles.</p>}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
