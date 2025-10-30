"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// A simplified Label component that mimics shadcn/ui styling without the radix-ui dependency.
const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));

Label.displayName = "Label";

export { Label };
