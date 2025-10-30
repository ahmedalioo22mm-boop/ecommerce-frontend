import { getAllCategory } from "@/lib/categories";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const AllCategorys = async () => {
  try {
    const { data: categories } = await getAllCategory();

    return (
      <div className="container mx-auto py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Our Categories</h2>
        {categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link href={`/category/${category.slug || category._id}`} key={category._id}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                    <CardHeader className="p-0">
                      <div className="relative w-full h-48">
                        <Image
                          src={category.image?.url || "/bg.jpg"} // Fallback image
                          alt={category.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-center mt-4 text-lg">{category.name}</CardTitle>
                    </CardContent>
                  </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No categories found.</p>
        )}
      </div>
    );
  } catch (error) {
    console.error("Failed to load categories:", error);
    return (
      <div className="container mx-auto py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Our Categories</h2>
        <p className="text-center text-red-500">Could not load categories. Please try again later.</p>
      </div>
    );
  }
};

export default AllCategorys;
