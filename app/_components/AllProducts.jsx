import { getAllProducts } from "@/lib/product";
import ProductList from "../(Product)/products/_components/ProductList";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AllProducts = async () => {
  // جلب الصفحة الأولى من المنتجات (عادةً 10 منتجات)
  const productsData = await getAllProducts(1);
  const products = productsData?.data;

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Discover Our Products
        </h2>
        <ProductList products={products} />
        <div className="text-center mt-12">
          <Link href="/products">
            <Button variant="outline">View All Products</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AllProducts;