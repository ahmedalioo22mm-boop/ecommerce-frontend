/** @format */

import { getAllProducts } from "@/lib/product";
import ProductList from "@/app/(Product)/products/_components/ProductList";
// سنقوم بإنشاء مكون Pagination لاحقًا
// import Pagination from "@/components/Pagination";

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }) {
  // قراءة رقم الصفحة من الرابط، أو استخدام 1 كقيمة افتراضية
  // Explicitly await searchParams to ensure it's fully resolved before accessing properties
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page
    ? Number(resolvedSearchParams.page)
    : 1;
  const productsData = await getAllProducts(page);

  // استخراج البيانات من الرد
  const { data: products, currentPage, totalPages } = productsData;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Products</h1>
      {products && products.length > 0 ? (
        <ProductList products={products} />
      ) : (
        <p className="text-center text-gray-500">No products found.</p>
      )}
    
    </div>
  );
}
