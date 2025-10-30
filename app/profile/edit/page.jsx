/** @format */

"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { getUser, updateUser } from "../../../lib/user";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import Image from "next/image";

const EditProfilePage = () => {
  const { user, getValidToken } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      if (!user?._id) {
        setLoading(false);
        return;
      }
      try {
        const userData = await getUser(getValidToken, user._id);
        setFormData({
          name: userData.name,
          email: userData.email,
          password: "",
        });
      } catch (error) {
        console.error("Failed to load user data for editing:", error);
        toast.error("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [user, getValidToken]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) return;

    const updateData = new FormData();
    updateData.append("name", formData.name);
    updateData.append("email", formData.email);
    if (formData.password) {
      updateData.append("password", formData.password);
    }
    if (avatar) {
      updateData.append("avatar", avatar);
    }

    try {
      await updateUser(getValidToken, user._id, updateData);
      toast.success("Profile updated successfully!");
      router.push("/profile");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Button variant="outline" onClick={() => router.back()}>
        Back
      </Button>
      <h1 className="text-2xl font-bold my-4">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name">Name</label>
          <Input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <Input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password (leave blank to keep the same)</label>
          <Input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="avatar">Avatar</label>
          <Input
            type="file"
            name="avatar"
            id="avatar"
            onChange={handleAvatarChange}
          />
        </div>
        {avatarPreview && (
          <div className="mt-4">
            <Image
              src={avatarPreview}
              alt="Avatar Preview"
              width={100}
              height={100}
              className="rounded-full object-cover"
            />
          </div>
        )}
        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
};

export default EditProfilePage;
