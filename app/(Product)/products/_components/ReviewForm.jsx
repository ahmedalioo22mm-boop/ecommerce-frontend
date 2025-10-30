/** @format */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/Context/AuthContext";
import { createProductReview } from "@/lib/product";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import StarRating from "./StarRating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const ReviewForm = ({ productId }) => {
  const { isAuthenticated, getValidToken } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a comment.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getValidToken();
      if (!token) {
        toast.error("You must be logged in to submit a review.");
        setIsSubmitting(false);
        return;
      }

      await createProductReview(productId, { rating, comment }, token);
      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <p className="mb-6 text-center text-gray-600">
        Please <Link href="/login" className="text-primary hover:underline">log in</Link> to write a review.
      </p>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a review</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Your Rating</Label>
            <StarRating rating={rating} onRatingChange={setRating} isInput />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">Your Comment</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike?"
              rows="4"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ReviewForm;
