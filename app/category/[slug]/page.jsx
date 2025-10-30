/** @format */

import { getCategoryWithProducts } from "@/lib/categories";
import ProductList from "@/app/(Product)/products/_components/ProductList";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  try {
    const slug = params.slug;
    const { data } = await getCategoryWithProducts(slug);
    if (!data || !data.category) {
      return { title: "Category Not Found" };
    }
    return {
      title: `${data.category.name} - Our Products`,
      description: `Browse all products in the ${data.category.name} category.`,
    };
  } catch (error) {
    return {
      title: "Error",
      description: "Could not load category details.",
    };
  }
}

export default async function CategoryProductsPage({ params }) {
  const { slug } = params;
  let pageData;

  try {
    pageData = await getCategoryWithProducts(slug);
  } catch (error) {
    // If the API returns a 404 (or any "not found" message), show the not-found page
    if (error.message.toLowerCase().includes("not found")) {
      notFound();
    }
    // For other errors, show a generic error message
    return (
      <p className="text-center text-red-500 py-10">
        Failed to load products. Please try again later.
      </p>
    );
  }

  const { category, products } = pageData.data;

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Products in: {category.name}
      </h1>
      {products.length === 0 ? (
        <p className="text-center text-gray-500">
          There are currently no products in this category.
        </p>
      ) : (
        <ProductList products={products} />
      )}
    </div>
  );
}
