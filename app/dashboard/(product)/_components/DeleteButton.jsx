/** @format */

"use client";
import { useState } from "react";
import { useAuth } from "@/app/Context/AuthContext";
import { deleteProduct } from "@/lib/product";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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

const DeleteButton = ({ productId, productTitle }) => {
  const router = useRouter();
  const { getValidToken } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!productId) return;
    setIsDeleting(true);
    try {
      const token = await getValidToken();
      if (!token) {
        throw new Error("Authentication failed. Please log in again.");
      }
      await deleteProduct(productId, token);
      toast.success(`Product '${productTitle}' deleted successfully.`);
      router.refresh(); // Refresh the page to show the updated list
    } catch (error) {
      toast.error(error.message || "Failed to delete product.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            product '<b>{productTitle}</b>'.
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
  );
};

export default DeleteButton;
