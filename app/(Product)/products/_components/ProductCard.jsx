/** @format */

"use client";
import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import StarRating from "./StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/app/Context/CartContext";

// Helper to parse options which might be comma-separated strings in an array
const parseOptions = (options) => {
  if (!options) return [];
  return options.flatMap((opt) => opt.split(",").map((s) => s.trim()));
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const { originalPrice, salePrice, colors, sizes } = useMemo(() => {
    const formatPrice = (price) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: product.currency || "EGP",
      }).format(price);

    const original = formatPrice(product.price);
    let sale = null;
    if (product.isOnSale && product.discountPercent > 0) {
      const discountedAmount = product.price * (product.discountPercent / 100);
      sale = formatPrice(product.price - discountedAmount);
    }

    return {
      originalPrice: original,
      salePrice: sale,
      colors: parseOptions(product.color),
      sizes: parseOptions(product.size),
    };
  }, [product]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation(); // منع الانتقال عند الضغط على الزر

    if (product.stock === 0) {
      toast.error("This product is out of stock.");
      return;
    }

    // For product cards, we add with the first available option by default.
    // The user can change this on the product page or in the cart.
    const defaultSize = sizes.length > 0 ? sizes[0] : undefined;
    const defaultColor = colors.length > 0 ? colors[0] : undefined;

    addToCart(product, 1, defaultColor, defaultSize);
    toast.success(`${product.title} has been added to your cart.`);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation(); // منع الانتقال عند الضغط على الزر
    // Quick view logic here - maybe open a modal
    toast.info(`Quick view for: ${product.title}`);
    console.log("Quick view:", product.title);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <Link
      href={`/products/${product.slug || product._id}`}
      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group flex flex-col bg-white no-underline text-current"
      aria-disabled={isOutOfStock}
      onClick={(e) => isOutOfStock && e.preventDefault()}
    >
      <div className="relative w-full h-64 bg-gray-200">
        <Image
          src={product.coverImage.url}
          alt={product.title?.trim() || "Product image"}
          fill
          sizes="(max-width: 640px) 50vw,
                   (max-width: 768px) 50vw,
                   (max-width: 1024px) 33vw,
                   25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <Button
              variant="outline"
              size="icon"
              onClick={handleQuickView}
              title="Quick View"
            >
              <Eye className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleAddToCart}
              title="Add to Cart"
              disabled={isOutOfStock}
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        )}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-y-2">
          {product.isOnSale && (
            <Badge variant="destructive">
              SALE{" "}
              {product.discountPercent > 0 && `${product.discountPercent}%`}
            </Badge>
          )}
          {product.isFeatured && (
            <Badge className="bg-yellow-400 text-black hover:bg-yellow-500">
              Featured
            </Badge>
          )}
        </div>
        {product.stock > 0 && product.stock < 10 && (
          <Badge
            variant="secondary"
            className="absolute top-2 left-2 bg-orange-500 text-white"
          >
            Low Stock
          </Badge>
        )}
        {isOutOfStock && (
          <Badge variant="outline" className="absolute top-2 left-2 bg-white">
            Out of Stock
          </Badge>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        {product.brand && (
          <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
        )}
        <h3 className="font-semibold text-lg flex-grow min-h-[2.5em]">
          <span className="group-hover:text-primary line-clamp-2">
            {product.title}
          </span>
        </h3>
        <div className="flex items-center my-2">
          <StarRating rating={product.averageRating} />
          <span className="text-xs text-gray-500 ml-2">
            ({product.numReviews} reviews)
          </span>
        </div>

        {/* Sizes */}
        {sizes.length > 0 && (
          <div className="text-xs text-gray-600 mb-2 truncate">
            <strong>Sizes:</strong> {sizes.join(", ")}
          </div>
        )}

        {/* Colors Swatches */}
        <ColorSwatches colors={colors} />

        <div className="flex items-baseline gap-2 mt-auto pt-2">
          <p
            className={`font-bold text-xl ${
              salePrice ? "text-red-600" : "text-gray-900"
            }`}
          >
            {salePrice || originalPrice}
          </p>
          {salePrice && (
            <p className="text-sm text-gray-500 line-through">
              {originalPrice}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

// مكون صغير لعرض الألوان
const ColorSwatches = ({ colors }) => {
  if (!colors || colors.length === 0) return null;

  // قاموس لترجمة الألوان من العربية للإنجليزية أو Hex
  const colorMap = {
    أسود: "#000000",
    فضي: "#C0C0C0",
    أبيض: "#FFFFFF",
    أحمر: "#FF0000",
    أزرق: "#0000FF",
    أخضر: "#008000",
    أصفر: "#FFFF00",
    // ... يمكنك إضافة المزيد من الألوان هنا
  };

  return (
    <div className="flex items-center gap-2 mb-2">
      {colors.slice(0, 5).map((colorName) => {
        // ابحث عن اللون في القاموس، وإذا لم تجده، استخدم الاسم كما هو
        const cssColor = colorMap[colorName.trim()] || colorName.trim();

        return (
          <span
            key={colorName}
            title={colorName} // لعرض اسم اللون عند الوقوف بالماوس
            className="h-5 w-5 rounded-full border border-gray-300"
            style={{ backgroundColor: cssColor }}
          />
        );
      })}
      {colors.length > 5 && (
        <span className="text-xs text-gray-500">+{colors.length - 5}</span>
      )}
    </div>
  );
};

export default ProductCard;
