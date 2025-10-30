/** @format */

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/Context/AuthContext";

import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { getProductById, updateProduct } from "@/lib/product"; // 1. استيراد updateProduct
import { getAllCategory } from "@/lib/categories"; // 2. استيراد دالة جلب الأقسام
import ProductForm from "../../../_components/ProductForm";

const EditproductPage = () => {
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]); // 3. State لتخزين الأقسام
  const [isLoading, setIsLoading] = useState(true); // لمعرفة هل البيانات قيد التحميل
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const params = useParams();
  const { getValidToken } = useAuth();
  const { id } = params;

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // جلب بيانات المنتج والأقسام في نفس الوقت
        const [productResponse, categoriesResponse] = await Promise.all([
          getProductById(id),
          getAllCategory(),
        ]);

        setProduct(productResponse.data); // 4. تحديث الـ state بـ .data
        setCategories(categoriesResponse.data || []);
      } catch (err) {
        const errorMessage =
          err.message || "Failed to fetch initial product data.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdateProduct = async (formData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const token = await getValidToken();
      if (!token) {
        throw new Error("Authentication failed. Please log in again.");
      }

      const response = await updateProduct(id, formData, token);

      toast.success(response.message || "Product updated successfully!");

      router.push("/dashboard/products");
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
    <div className="flex flex-col items-center justify-center p-4">
      {error &&
        !product && ( // عرض الخطأ فقط إذا فشل تحميل المنتج
          <Alert variant="destructive" className="mb-4 max-w-lg w-full">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error Loading Data</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

      {product && (
        <ProductForm
          onSubmit={handleUpdateProduct}
          isSubmitting={isSubmitting}
          product={product} // 5. تمرير الـ product من الـ state
          categories={categories} // 6. تمرير الأقسام
          buttonText="Update Product" // 7. تصحيح نص الزر
        />
      )}
    </div>
  );
};

export default EditproductPage;
