'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from "./_components/Sidebar";
import { Menu } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let user = null;
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        user = JSON.parse(storedUser);
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }

    if (!user || user.role !== 'admin') {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex h-screen bg-gray-100 w-full">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header for mobile with hamburger menu */}
        <header className="bg-white shadow-md md:hidden">
          <div className="px-4 py-2 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
        ></div>
      )}
    </div>
  );
}