/** @format */
import ProductCard from "./ProductCard";

// هذا المكون يستقبل مصفوفة المنتجات ويعرضها
const ProductList = ({ products }) => {
  return (
 <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard product={product} key={product._id} />
      ))}
    </div>
  );
};

export default ProductList;
