/** @format */


import AllCategorys from "./_components/AllCategorys";
import OnSaleProducts from "./_components/OnSaleProducts";
import FeaturedProducts from "./_components/FeaturedProducts";
import AllProducts from "./_components/AllProducts";

export default function Home() {
  return (
    <div>
    
      <FeaturedProducts />

   
      <OnSaleProducts />

      <AllCategorys />
      <AllProducts />
    </div>
  );
}
