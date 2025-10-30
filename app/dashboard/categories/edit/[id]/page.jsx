/** @format */

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/Context/AuthContext";
import { getSingleCategory, updateCategory } from "@/lib/categories";
import CategoriesForm from "../../_components/CategoriesForm"; // لاحظ المسار تغير
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const EditCategoryPage = () => {
  const [category, setCategory] = useState(null); // state لتخزين بيانات الفئة
  const [isLoading, setIsLoading] = useState(true); // state لمعرفة هل البيانات قيد التحميل
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const params = useParams();
  const { getValidToken } = useAuth();
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await getSingleCategory(id);
          setCategory(response); // The API returns the category object directly
        } catch (err) {
          const errorMessage = err.message || "Failed to fetch category data.";
          setError(errorMessage);
          toast.error(errorMessage);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCategory();
    }
  }, [id]);

  // --- تحديث البيانات عند الضغط على الزر ---
  const handleUpdateCategory = async (formData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const token = await getValidToken();
      if (!token) {
        throw new Error("Authentication failed. Please log in again.");
      }

      const response = await updateCategory(id, formData, token);

      toast.success(response.message || "Category updated successfully!");

      router.push("/dashboard/categories");
    } catch (err) {
      const errorMessage = err.message || "An unexpected error occurred.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url(/stars1.webp)" }}
    >
      <div className="flex flex-col items-center justify-center p-4">
        {error && (
          <Alert variant="destructive" className="mb-4 max-w-lg w-full">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <CategoriesForm
          onSubmit={handleUpdateCategory}
          isSubmitting={isSubmitting}
          initialData={category} // <-- هنا نمرر البيانات الحالية للنموذج
          buttonText="Update Category"
        />
      </div>
    </div>
  );
};

export default EditCategoryPage;
