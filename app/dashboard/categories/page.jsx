'use client';

import { useState, useEffect } from 'react';
import { getAllCategory } from '@/lib/categories';
import Link from 'next/link';
import CategoriesTable from './_components/CategoriesTable';
import { LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CategoriesPage() {
  // --- State Management ---
  const [allCategories, setAllCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // You can change this number
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getAllCategory();
        setAllCategories(response.data || []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch categories.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // --- Pagination Logic ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allCategories.length / itemsPerPage);

  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // --- Render ---
  return (
    <div className="container mx-auto py-10 w-full h-full ">
      {/* Main header container */}
      <div className="flex flex-col gap-4 mb-8">
        {/* Top part: Title and subtitle */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Categories Dashboard
          </h1>
          <p className="mt-1 text-gray-600">Manage your product categories.</p>
        </div>
        {/* Bottom part: Button and Stats Card */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <Link
            href="/dashboard/categories/create"
            className="bg-blue-500 text-white px-4 py-2 flex items-center justify-center rounded-lg shadow hover:bg-blue-600 transition-colors"
          >
            Create New
          </Link>
          {/* --- Category Stats Card --- */}
          <div className="relative p-5 w-full md:w-64 bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div className="flex flex-col space-y-1">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  All Categories
                </h2>
                {/* The count now comes from the state */}
                <p className="text-4xl font-extrabold text-gray-900">
                  {loading ? '...' : allCategories.length}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-xl">
                <LayoutGrid className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The table now receives only the data for the current page */}
      <CategoriesTable data={currentItems} />

      {/* Pagination Controls are placed here, after the table */}
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
          disabled={currentPage === totalPages || allCategories.length === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
}