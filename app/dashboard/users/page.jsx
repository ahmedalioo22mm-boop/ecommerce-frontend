/** @format */

"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { useAuth } from "@/app/Context/AuthContext";

import { DataTable } from "./_components/DataTable";
import { getAllUsers } from "@/lib/user";
import { Button } from "@/components/ui/button"; // 1. Import the Button component

export default function UsersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, getValidToken } = useAuth();

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // You can change this number

  useEffect(() => {
    async function fetchData() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const response = await getAllUsers(getValidToken);
        setData(response.data || []);
      } catch (error) {
        console.error("Failed to load users:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, getValidToken]);

  const handleDeleteUser = (userId) => {
    setData((prevData) => prevData.filter((user) => user._id !== userId));
  };

  // --- Pagination Logic ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (loading) {
    return <div className="container mx-auto py-10">Loading users...</div>;
  }

  return (
    <div className="container mx-auto py-10 w-full h-full">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Users Dashboard
          </h1>
          <p className="mt-1 text-gray-600">Manage all users in your store.</p>
        </div>

        <div className="relative p-5 w-full md:w-64 bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="flex items-start justify-between">
            <div className="flex flex-col space-y-1">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                All Users
              </h2>
              <p className="text-4xl font-extrabold text-gray-900">{data.length}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-xl">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Pass the paginated data to the DataTable */}
      <DataTable data={currentItems} onDelete={handleDeleteUser} />

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages || 1}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextPage}
          disabled={currentPage === totalPages || data.length === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
}