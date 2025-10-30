'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/Context/AuthContext';
import { deleteCategory } from '@/lib/categories';
import { toast } from 'sonner';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

export default function CategoriesTable({ data }) {
  const router = useRouter();
  const { getValidToken } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      const token = await getValidToken();
      if (!token) {
        throw new Error("Authentication failed. Please log in again.");
      }

      await deleteCategory(categoryToDelete._id, token);
      toast.success(`Category '${categoryToDelete.name}' deleted successfully.`);
      setCategoryToDelete(null);
      router.refresh(); // Refresh the page to show the updated list
    } catch (error) {
      toast.error(error.message || "Failed to delete category.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
             
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>
                    {category.image?.url ? (
                      <Image
                        src={category.image.url}
                        alt={category.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-md object-cover"
                        style={{ height: 'auto' }}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        No Img
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                 
                  <TableCell>
                    {new Date(category.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/dashboard/categories/edit/${category._id}`
                            )
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setCategoryToDelete(category)}
                          className="text-red-500 focus:text-red-500"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No categories to display.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!categoryToDelete}
        onOpenChange={() => setCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              category '<b>{categoryToDelete?.name}</b>' and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}