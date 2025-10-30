/** @format */

"use client";

import React, { useEffect, useState, use } from "react";
import { useAuth } from "@/app/Context/AuthContext";
import { getUser } from "@/lib/user";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";

// Re-using the skeleton and error components for consistency
const ProfileSkeleton = () => (
  <div className="container mx-auto p-4 sm:p-6 lg:p-8 animate-pulse">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="bg-gray-300 dark:bg-gray-700 rounded-full w-32 h-32"></div>
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 space-y-4">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  </div>
);

const ProfileError = ({ error }) => (
  <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center">
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-red-700 dark:text-red-300">
        Loading Failed
      </h2>
      <p className="text-red-600 dark:text-red-400 mt-2">
        {error || "Could not load user profile. Please try again later."}
      </p>
    </div>
  </div>
);

// This is the new page to display a single user's details for the admin.
export default function UserDetailPage({ params }) {
  const { id } = use(params); // Get the user ID from the URL
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: authUser, getValidToken } = useAuth();

  const isOwner = authUser?._id === id;
  const isAdmin = authUser?.role === "admin";

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("User ID not found.");
      return;
    }

    async function fetchData() {
      try {
        const userData = await getUser(getValidToken, id);
        setData(userData);
      } catch (err) {
        console.error("Failed to load user profile:", err);
        setError(err.message || "An unknown error occurred.");
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, getValidToken]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !data) {
    return <ProfileError error={error} />;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/dashboard/users"
            className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
          >
            <ArrowLeft size={20} />
            Back to Users List
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            {/* --- Profile Header --- */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
              <div className="relative w-32 h-32 md:w-36 md:h-36 flex-shrink-0">
                <Image
                  src={
                    data.avatar?.url ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  }
                  alt={`${data.name}'s avatar`}
                  fill
                  className="rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md"
                  sizes="(max-width: 768px) 128px, 144px"
                  priority
                />
              </div>
              <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
                  {data.name}
                </h1>
                <p className="text-md text-gray-500 dark:text-gray-400 mt-1">
                  {data.email}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full uppercase ${
                      data.role === "admin"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                        : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300"
                    }`}
                  >
                    {data.role}
                  </span>
                  {data.createdAt && (
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      Joined: {new Date(data.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {/* --- زر التعديل --- */}
                <div className="mt-6">
                  <Link
                    href={`/dashboard/users/${data._id}/edit`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                  >
                    <Edit size={16} /> Edit Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* --- User Stats/Info --- */}
            <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                User Activity
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {data.orders?.length || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Orders
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {data.wishlist?.length || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Items in Wishlist
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {data.cartItems?.length || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Items in Cart
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
