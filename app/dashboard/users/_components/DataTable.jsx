/** @format */
"use client";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { useAuth } from "@/app/Context/AuthContext";
import { deleteUser } from "@/lib/user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DataTable({ data, onDelete }) {
  const { user: authUser, getValidToken } = useAuth(); 
  const router = useRouter();
  const isAdmin = authUser?.role === "admin";

  const handleRowClick = (userId) => {
    router.push(`/dashboard/users/${userId}`);
  };

  const handleDelete = async (userId) => {
    if (!userId) return;

    toast.promise(deleteUser(getValidToken, userId), {
      loading: "Deleting user...",
      success: () => {
        onDelete(userId); 
        return "User has been deleted successfully.";
      },
      error: (err) => {
        return err.message || "Failed to delete user. Please try again.";
      },
    });
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined At</TableHead>
            {/* Only show Actions column to admins */}
            {isAdmin && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.length ? (
            data.map((row) => (
              <TableRow
                key={row._id || row.id}
                onClick={() => handleRowClick(row._id)}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <TableCell>
                  <img
                    src={row.avatar?.url || "/default-avatar.png"}
                    alt={row.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </TableCell>

                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>
                  {new Date(row.createdAt).toLocaleDateString()}
                </TableCell>
                {/* Only show actions cell to admins */}
                {isAdmin && (
                  <TableCell onClick={(e) => e.stopPropagation()}> 
                    <div className="space-x-2">
                      <Link href={`/dashboard/users/${row._id}/edit`} passHref>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently
                              delete the user and remove their data from our
                              servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(row._id)}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={isAdmin ? 6 : 5} className="h-24 text-center">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
