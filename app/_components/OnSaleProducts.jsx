/** @format */

import { getOnSaleProducts } from "@/lib/product";
import ProductList from "../(Product)/products/_components/ProductList";

const OnSaleProducts = async () => {
  // 1. جلب المنتجات التي عليها خصم من الـ API
  const onSaleProducts = await getOnSaleProducts();

  // 2. إذا لم تكن هناك منتجات، لا تعرض أي شيء
  if (!onSaleProducts || onSaleProducts.length === 0) {
    return null;
  }

  // 3. عرض المنتجات باستخدام المكونات الموجودة
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-red-600">
        Special Offers
        </h2>
        <ProductList products={onSaleProducts} />
      </div>
    </section>
  );
};

export default OnSaleProducts;
