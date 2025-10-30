/** @format */
import { getProductById } from "@/lib/product";
import { notFound } from "next/navigation";
import ReviewList from "../_components/ReviewList";
import ReviewForm from "../_components/ReviewForm";
import ProductDetailsClient from "./ProductDetailsClient"; // Import the new client component

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  try {
    // Explicitly await params to ensure it's fully resolved before accessing properties
    const { slug } = await params;
    const productData = await getProductById(slug);
    if (!productData?.data) {
      return { title: "Product Not Found" };
    }
    const { data: product } = productData;
    return {
      title: product.name,
      description: product.description,
    };
  } catch (error) {
    return {
      title: "Error",
      description: "Could not load product details.",
    };
  }
}

export default async function ProductDetailPage({ params }) {
  // Explicitly await params to ensure it's fully resolved before accessing properties
  const { slug } = await params;
  let productData;

  try {
    productData = await getProductById(slug);
  } catch (error) {
    if (error.message.includes("404") || error.message.includes("not found")) {
      notFound();
    }
    return (
      <div className="container mx-auto text-center py-20">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-red-500">
          Something went wrong while fetching the product. Please try again
          later.
        </p>
        <p className="text-sm text-gray-500 mt-2">Error: {error.message}</p>
      </div>
    );
  }

  if (!productData || !productData.data) {
    notFound();
  }

  const { data: product } = productData;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* The client component now handles the entire top section */}
      <ProductDetailsClient product={product} />

      {/* Reviews Section (can remain on server) */}
      <div className="mt-12 lg:mt-16">
        <h2 className="text-2xl lg:text-3xl font-bold mb-6">
          Customer Reviews
        </h2>
        {/* Pass necessary props to review components */}
        <ReviewForm productId={product._id} />
        <ReviewList reviews={product.reviews || []} productId={product._id} />
      </div>
    </div>
  );
}
