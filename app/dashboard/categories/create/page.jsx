/** @format */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/Context/AuthContext';
import { createCategory } from '@/lib/categories';
import CategoriesForm from '../_components/CategoriesForm';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';

const CreateCategoryPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { getValidToken } = useAuth();

  const handleCreateCategory = async (formData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const token = await getValidToken();
      if (!token) {
        throw new Error("Authentication failed. Please log in again.");
      }

      const response = await createCategory(formData, token);
      
      toast.success(response.message || "Category created successfully!");

      router.push('/dashboard/categories');

    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url(/stars1.webp)" }}
    >
      {error && (
        <Alert variant="destructive" className="mb-4 max-w-lg w-full">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <CategoriesForm
        onSubmit={handleCreateCategory}
        isSubmitting={isSubmitting}
        buttonText="Create Category"
      />
    </div>
  );
};

export default CreateCategoryPage;

