/** @format */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/Context/AuthContext";
import { createProduct } from "@/lib/product";
import { getAllCategory } from "@/lib/categories";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import ProductForm from "../../_components/ProductForm";

const CreateProductPage = () => {
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { getValidToken } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await getAllCategory();
        setCategories(categoriesResponse.data || []);
      } catch (err) {
        const errorMessage =
          err.message || "Failed to fetch categories for the form.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCreateProduct = async (formData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const token = await getValidToken();
      if (!token) {
        throw new Error("Authentication failed. Please log in again.");
      }

      const response = await createProduct(formData, token);
      toast.success(response.message || "Product created successfully!");
      router.push("/dashboard/products");
      router.refresh(); // To ensure the product list is updated
    } catch (err) {
      const errorMessage = err.message || "An unexpected error occurred.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <ProductForm
        onSubmit={handleCreateProduct}
        isSubmitting={isSubmitting}
        categories={categories}
        buttonText="Create Product"
      />
    </div>
  );
};

export default CreateProductPage;
