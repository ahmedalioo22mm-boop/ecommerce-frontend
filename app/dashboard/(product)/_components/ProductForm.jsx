/** @format */

"use client";
import { useState, useEffect } from "react";
import { Terminal, X, Image as ImageIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Helper Component for Image Preview ---
const ImagePreview = ({ src, alt, onRemove }) => (
  <div className="relative group">
    <img src={src} alt={alt} className="h-24 w-24 rounded-md object-cover" />
    <button
      type="button"
      onClick={onRemove}
      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <X className="h-3 w-3" />
    </button>
  </div>
);

export default function ProductForm({
  categories = [],
  onSubmit,
  isSubmitting,
  buttonText,
  product: initialData,
}) {
  const isEditMode = !!initialData;

  // --- State for all form fields (Controlled Component) ---
  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    description: "",
    price: "",
    currency: "EGP",
    sku: "",
    stock: "",
    category: "",
    color: "",
    size: "",
    isFeatured: false,
    isOnSale: false,
    discountPercent: 0,
  });

  // --- State for files and previews ---
  const [coverImage, setCoverImage] = useState(null); // File object
  const [coverImagePreview, setCoverImagePreview] = useState(null); // URL for preview
  const [productImages, setProductImages] = useState([]); // File objects
  const [productImagesPreview, setProductImagesPreview] = useState([]); // URLs for preview

  const [validationError, setValidationError] = useState(null);

  // --- Effect to populate form when in edit mode ---
  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        title: initialData.title || "",
        brand: initialData.brand || "",
        description: initialData.description || "",
        price: initialData.price || "",
        currency: initialData.currency || "EGP",
        sku: initialData.sku || "",
        stock: initialData.stock || "",
        category: initialData.category?._id || initialData.category || "",
        color: Array.isArray(initialData.color)
          ? initialData.color.join(", ")
          : "",
        size: Array.isArray(initialData.size)
          ? initialData.size.join(", ")
          : "",
        isFeatured: initialData.isFeatured || false,
        isOnSale: initialData.isOnSale || false,
        discountPercent: initialData.discountPercent || 0,
      });
      if (initialData.coverImage?.url) {
        setCoverImagePreview(initialData.coverImage.url);
      }
      if (initialData.images?.length > 0) {
        setProductImagesPreview(initialData.images.map((img) => img.url));
      }
    }
  }, [initialData, isEditMode]);

  const currencySymbols = { EGP: "EGP", USD: "$" };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImagesChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setProductImages((prevFiles) => [...prevFiles, ...newFiles]);

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setProductImagesPreview((prevPreviews) => [
      ...prevPreviews,
      ...newPreviews,
    ]);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError(null);

    if (
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.stock
    ) {
      setValidationError(
        "Please fill out all required fields: Title, Description, Price, and Stock."
      );
      return;
    }

    if (!isEditMode && !coverImage) {
      setValidationError("A cover image is required for new products.");
      return;
    }

    const submissionData = new FormData();
    for (const key in formData) {
      submissionData.append(key, formData[key]);
    }

    if (coverImage) {
      submissionData.append("coverImage", coverImage);
    }
    if (productImages.length > 0) {
      productImages.forEach((file) => {
        submissionData.append("images", file);
      });
    }

    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {validationError && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}

      {/* --- Product Details Section --- */}
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            Provide the main details for your product.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                name="title"
                value={formData.title}
                placeholder="e.g., Premium Wireless Headphones"
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                name="brand"
                value={formData.brand}
                placeholder="e.g., Sony, Apple, etc."
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              placeholder="Describe the product's features, benefits, and specifications."
              onChange={handleChange}
              required
              rows={5}
            />
          </div>
        </CardContent>
      </Card>

      {/* --- Pricing and Inventory Section --- */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing & Inventory</CardTitle>
          <CardDescription>Manage stock and pricing details.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-grow">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    {currencySymbols[formData.currency]}
                  </span>
                  <Input
                    name="price"
                    type="number"
                    value={formData.price}
                    placeholder="e.g., 199.99"
                    onChange={handleChange}
                    required
                    className="pl-10" // Padding left to make space for the symbol
                  />
                </div>
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, currency: value }))
                  }
                  required
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EGP">EGP</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                name="stock"
                type="number"
                value={formData.stock}
                placeholder="e.g., 50"
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                name="sku"
                value={formData.sku}
                placeholder="e.g., WH-1000XM5-BLK"
                onChange={handleChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- Organization Section --- */}
      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
          <CardDescription>Categorize your product.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="color">Colors</Label>
              <Input
                name="color"
                value={formData.color}
                placeholder="e.g., Black, Silver, Midnight Blue"
                onChange={handleChange}
              />
              <p className="text-sm text-muted-foreground">
                Enter comma-separated values.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="size">Sizes</Label>
              <Input
                name="size"
                value={formData.size}
                placeholder="e.g., Small, Medium, Large"
                onChange={handleChange}
              />
              <p className="text-sm text-muted-foreground">
                Enter comma-separated values.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                name="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isFeatured: checked }))
                }
              />
              <Label
                htmlFor="isFeatured"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Featured Product
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                name="isOnSale"
                checked={formData.isOnSale}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isOnSale: checked }))
                }
              />
              <Label
                htmlFor="isOnSale"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                On Sale
              </Label>
            </div>
          </div>

          {formData.isOnSale && (
            <div className="grid gap-2 md:w-1/3">
              <Label htmlFor="discountPercent">Discount Percentage</Label>
              <Input
                name="discountPercent"
                type="number"
                value={formData.discountPercent}
                placeholder="e.g. 10"
                onChange={handleChange}
              />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="coverImage">Cover Image</Label>
              <Input
                name="coverImage"
                type="file"
                onChange={handleCoverImageChange}
              />
              {coverImagePreview && (
                <div className="mt-2">
                  <img
                    src={coverImagePreview}
                    alt="Cover preview"
                    className="h-24 w-24 rounded-md object-cover"
                  />
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="images">Product Images</Label>
              <Input
                name="images"
                type="file"
                multiple
                onChange={handleImagesChange}
              />
              {productImagesPreview.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {productImagesPreview.map((src, index) => (
                    <ImagePreview
                      key={index}
                      src={src}
                      alt={`Preview ${index}`}
                      onRemove={() => {
                        // This is a simplified removal. For edit mode, you'd need more logic.
                        setProductImagesPreview((p) =>
                          p.filter((_, i) => i !== index)
                        );
                        setProductImages((p) =>
                          p.filter((_, i) => i !== index)
                        );
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting ? "Saving..." : buttonText}
        </Button>
      </div>
    </form>
  );
}
