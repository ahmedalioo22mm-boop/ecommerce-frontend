'use client';

import Link from "next/link";
import {
  Home,
  ShoppingCart,
  Package,
  Users,
  BarChart,
  Settings,
  ListTree,
} from "lucide-react";

const Sidebar = ({ isSidebarOpen }) => {
  return (
    <aside
      className={`transform top-0 left-0 w-64 bg-white fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0`}
    >
      <div className="flex h-screen flex-col overflow-y-auto border-r bg-white px-5 py-8">
        <Link href="/">
          <h1 className="text-2xl font-bold text-gray-800">My Store</h1>
        </Link>
        <div className="mt-6 flex flex-1 flex-col justify-between">
          <nav className="-mx-3 space-y-6 ">
            <div className="space-y-3 ">
              <label className="px-3 text-xs font-semibold uppercase text-gray-900">
                Analytics
              </label>
              <Link
                className="flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                href="/dashboard"
              >
                <Home className="h-5 w-5" aria-hidden="true" />
                <span className="mx-2 text-sm font-medium">Dashboard</span>
              </Link>
              <Link
                className="flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                href="/dashboard/analytics"
              >
                <BarChart className="h-5 w-5" aria-hidden="true" />
                <span className="mx-2 text-sm font-medium">
                  <span className="text-red-500">Ana</span>
                  <span className="text-blue-500">lytics</span>
                </span>
              </Link>
            </div>
            <div className="space-y-3 ">
              <label className="px-3 text-xs font-semibold uppercase text-gray-900">
                Content
              </label>
              <Link
                className="flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                href="/dashboard/products"
              >
                <Package className="h-5 w-5" aria-hidden="true" />
                <span className="mx-2 text-sm font-medium">Products</span>
              </Link>
              <Link
                className="flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                href="/dashboard/categories"
              >
                <ListTree className="h-5 w-5" aria-hidden="true" />
                <span className="mx-2 text-sm font-medium">Categories</span>
              </Link>
             

              <Link
                className="flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                href="/dashboard/users"
              >
                <Users className="h-5 w-5" aria-hidden="true" />
                <span className="mx-2 text-sm font-medium">Users</span>
              </Link>
            </div>

            <div className="space-y-3 ">
              <label className="px-3 text-xs font-semibold uppercase text-gray-900">
                Customization
              </label>
              <Link
                className="flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                href="/dashboard/settings"
              >
                <Settings className="h-5 w-5" aria-hidden="true" />
                <span className="mx-2 text-sm font-medium">Settings</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
