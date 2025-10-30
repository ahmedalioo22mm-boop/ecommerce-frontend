/** @format */
"use client";

import { useAuth } from "@/app/Context/AuthContext";
import { deleteProductReview } from "@/lib/product";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import StarRating from "./StarRating";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";

const ReviewList = ({ reviews, productId }) => {
  const { user, getValidToken } = useAuth();
  const router = useRouter();

  const handleDelete = async (reviewId) => {
    if (!confirm("Are you sure you want to delete your review?")) return;

    try {
      const token = await getValidToken();
      await deleteProductReview(productId, reviewId, token);
      toast.success("Review deleted successfully.");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to delete review.");
    }
  };

  if (!reviews || reviews.length === 0) {
    return <p className="text-center text-gray-500 py-8">No reviews yet.</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Customer Reviews</h2>
      {reviews.map((review) => (
        <Card key={review._id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>
                  {review.user?.name ? review.user.name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{review.user?.name || "Anonymous"}</p>
                <div className="flex items-center gap-2">
                  <StarRating rating={review.rating} />
                  <span className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            {user && user._id === review.user?._id && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(review._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{review.comment}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReviewList;
