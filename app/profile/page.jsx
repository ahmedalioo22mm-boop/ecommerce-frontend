/** @format */

"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { getUser } from "@/lib/user";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart } from "lucide-react";

// --- Loading Skeleton Component ---
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

// --- Error Display Component ---
const ProfileError = () => (
  <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center">
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-red-700 dark:text-red-300">
        Loading Failed
      </h2>
      <p className="text-red-600 dark:text-red-400 mt-2">
        Could not load user profile. Please ensure you are logged in and try
        again later.
      </p>
    </div>
  </div>
);

const ProfilePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, getValidToken } = useAuth();

  useEffect(() => {
    async function fetchData() {
      if (!user?._id) {
        setLoading(false);
        return;
      }
      try {
        const userData = await getUser(getValidToken, user._id);
        setData(userData);
      } catch (error) {
        console.error("Failed to load user profile:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, getValidToken]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!data) {
    return <ProfileError />;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
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
                <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                  {data.role}
                </span>
                {data.createdAt && (
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Joined: {new Date(data.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <Link
              href="/profile/edit"
              className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Edit Profile
            </Link>
          </div>

          {/* --- Dashboard Sections --- */}
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order History */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <ShoppingBag className="h-6 w-6" />
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                  Order History
                </h2>
              </div>
              {data.orders && data.orders.length > 0 ? (
                <ul className="space-y-2">
                  {/* Map through orders here */}
                  <li className="text-gray-500 dark:text-gray-400">
                    Order display not implemented yet.
                  </li>
                </ul>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 dark:text-gray-400">
                    You haven't placed any orders yet.
                  </p>
                  <Link
                    href="/"
                    className="mt-2 inline-block text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="h-6 w-6" />
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                  Wishlist
                </h2>
              </div>
              {data.wishlist && data.wishlist.length > 0 ? (
                <ul className="space-y-2">
                  {/* Map through wishlist items here */}
                  <li className="text-gray-500 dark:text-gray-400">
                    Wishlist display not implemented yet.
                  </li>
                </ul>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 dark:text-gray-400">
                    Your wishlist is empty.
                  </p>
                  <Link
                    href="/"
                    className="mt-2 inline-block text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Browse Products
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;