/** @format */

import { cn } from "@/lib/utils";

const Avatar = ({ className, children }) => (
  <div
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full items-center justify-center bg-muted",
      className
    )}
  >
    {children}
  </div>
);

const AvatarFallback = ({ className, children }) => (
  <span className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}>
    {children}
  </span>
);

export { Avatar, AvatarFallback };
