/** @format */
"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const StarRating = ({ rating, onRatingChange, isInput = false }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-5 w-5",
            rating >= star
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300",
            isInput && "cursor-pointer"
          )}
          onClick={() => isInput && onRatingChange(star)}
          onMouseEnter={() => isInput && onRatingChange(star)} // Optional: for hover effect
        />
      ))}
    </div>
  );
};

export default StarRating;
