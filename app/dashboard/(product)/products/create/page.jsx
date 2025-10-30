/** @format */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { createProduct } from "@/lib/product";
import { getAllCategory } from "@/lib/categories";
import ProductForm from "../../_components/ProductForm";
import { useAuth } from "@/app/Context/AuthContext";

const CreateProductsPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const { getValidToken } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: categoriesData } = await getAllCategory();
        setCategories(categoriesData || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories for the form.");
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

      toast.success(response.message || "products created successfully!");

      router.push("/dashboard/products");
    } catch (err) {
      const errorMessage = err.message || "An unexpected error occurred.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      {error && (
        <Alert variant="destructive" className="mb-4 max-w-lg w-full">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <ProductForm
        categories={categories}
        onSubmit={handleCreateProduct}
        isSubmitting={isSubmitting}
        buttonText="Create products"
      />
    </div>
  );
};

export default CreateProductsPage;
