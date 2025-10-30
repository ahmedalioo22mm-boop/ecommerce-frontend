/** @format */

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Pagination({ currentPage, totalPages, totalProducts }) {
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `/dashboard/products?${params.toString()}`;
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="text-sm text-gray-700">
        Total Products: <span className="font-semibold">{totalProducts}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <Link href={createPageURL(currentPage - 1)}>
            <Button variant="outline" size="sm" disabled={isFirstPage}>
              Previous
            </Button>
          </Link>
          <Link href={createPageURL(currentPage + 1)}>
            <Button variant="outline" size="sm" disabled={isLastPage}>
              Next
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
