/** @format */

import { getFeaturedProducts } from "@/lib/product";
import ProductList from "../(Product)/products/_components/ProductList";

const FeaturedProducts = async () => {
 
  const featuredProducts = await getFeaturedProducts();

  
  if (!featuredProducts || featuredProducts.length === 0) {
    return null;
  }

  // 3. عرض المنتجات باستخدام المكونات الموجودة
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
        <ProductList products={featuredProducts} />
      </div>
    </section>
  );
};

export default FeaturedProducts;
