/** @format */

"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { useAuth } from "@/app/Context/AuthContext"; // (1) استيراد useAuth
import { useCart } from "@/app/Context/CartContext"; // (2) استيراد useCart
import { addToCart as addToCartAPI } from "@/lib/user"; // (3) استيراد دالة الـ API
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StarRating from "../_components/StarRating";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { toast } from "sonner"; // (4) لاستخدام التنبيهات

// Helper to parse colors/sizes which might be comma-separated strings in an array
const parseOptions = (options) => {
  if (!options) return [];
  return options
    .flatMap((opt) => opt.split(","))
    .map((s) => s.trim())
    .filter(Boolean); // This will filter out empty strings
};

const ProductDetailsClient = ({ product }) => {
  const { user, getValidToken } = useAuth(); // (5) الحصول على المستخدم والتوكن
  const { addToCart: addToCartContext } = useCart(); // (6) الحصول على دالة السلة المحلية;
  const [isPending, startTransition] = useTransition(); // (7) لإدارة حالة التحميل

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImage, setMainImage] = useState(product.coverImage.url);

  const colors = parseOptions(product.color);
  const sizes = parseOptions(product.size);

  // Set default selections
  useEffect(() => {
    if (colors.length > 0 && !selectedColor) setSelectedColor(colors[0]);
    if (sizes.length > 0 && !selectedSize) setSelectedSize(sizes[0]);
  }, [colors, sizes]);

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, Math.min(product.stock, prev + amount)));
  };

  const handleAddToCart = async () => {
    // Basic validation
    if (product.stock === 0) {
      toast.error("This product is out of stock.");
      return;
    }
    if (sizes.length > 0 && !selectedSize) {
      toast.warning("Please select a size.");
      return;
    }
    if (colors.length > 0 && !selectedColor) {
      toast.warning("Please select a color.");
      return;
    }

    startTransition(async () => {
      try {
        if (user) {
          // (8) المستخدم مسجل: استدعاء الـ API
          await addToCartAPI(getValidToken, {
            productId: product._id,
            quantity: quantity,
          });
          // Also update the local cart context to keep UI in sync
          addToCartContext(product, quantity, selectedColor, selectedSize);
          toast.success(`${quantity} x ${product.title} added to your cart.`);
        } else {
          // (9) المستخدم زائر: استخدام السلة المحلية (localStorage)
          addToCartContext(product, quantity, selectedColor, selectedSize);
          toast.success(`${quantity} x ${product.title} added to cart!`);
        }
        // ملاحظة: قد تحتاج إلى تحديث حالة السلة العامة (CartContext) بعد استدعاء الـ API
        // لتعكس التغييرات فورًا في أيقونة السلة في الـ Header.
      } catch (error) {
        console.error("Failed to add to cart:", error);
        toast.error(error.message || "Something went wrong.");
      }
    });
  };

  const originalPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currency || "EGP",
  }).format(product.price);
  let salePrice;
  if (product.isOnSale && product.discountPercent > 0) {
    const discountedAmount = product.price * (product.discountPercent / 100);
    salePrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: product.currency || "EGP",
    }).format(product.price - discountedAmount);
  }

  const stockStatus = () => {
    if (product.stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    if (product.stock < 10) {
      return (
        <Badge className="bg-orange-500 text-white">
          Low Stock ({product.stock} left)
        </Badge>
      );
    }
    return <Badge className="bg-green-600 text-white">In Stock</Badge>;
  };

  const allImages = [product.coverImage, ...(product.images || [])];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      {/* Image Gallery */}
      <div className="flex flex-col gap-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative w-full aspect-square">
              <Image
                src={mainImage}
                alt={product.title}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-5 gap-2">
          {allImages.map((image, index) => (
            <button
              key={image.public_id || index}
              className={`relative aspect-square rounded-md overflow-hidden border-2 ${
                mainImage === image.url
                  ? "border-primary"
                  : "border-transparent"
              }`}
              onClick={() => setMainImage(image.url)}
            >
              <Image
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="20vw"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Product Details & Actions */}
      <div className="flex flex-col gap-4">
        <div>
          {product.brand && (
            <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
          )}
          <h1 className="text-3xl lg:text-4xl font-bold">{product.title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <StarRating rating={product.averageRating} />
            <span className="text-gray-600 ml-2 text-sm">
              ({product.numReviews} reviews)
            </span>
          </div>
          <span className="text-sm text-gray-500">|</span>
          {stockStatus()}
        </div>

        <div className="flex items-baseline gap-2">
          <p
            className={`font-bold text-3xl ${
              salePrice ? "text-red-600" : "text-gray-900"
            }`}
          >
            {salePrice || originalPrice}
          </p>
          {salePrice && (
            <p className="text-lg text-gray-500 line-through">
              {originalPrice}
            </p>
          )}
        </div>

        <p className="text-gray-700 leading-relaxed">{product.description}</p>

        {/* Size Options */}
        {sizes.length > 0 && (
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Size:</label>
            <div className="flex gap-2 flex-wrap">
              {sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Color Options */}
        {colors.length > 0 && (
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Color:</label>
            <div className="flex gap-2 flex-wrap">
              {colors.map((color) => (
                <Button
                  key={color}
                  variant={selectedColor === color ? "default" : "outline"}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity & Add to Cart */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-semibold">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= product.stock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            size="lg"
            className="flex-grow"
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isPending}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {isPending ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
        {product.sku && (
          <p className="text-xs text-gray-500 mt-2">SKU: {product.sku}</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsClient;
