/** @format */

import { Button } from "@/components/ui/button";
import Link from "next/link";

const EmptyOrders = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
      <div className="text-2xl font-bold">You have no orders yet.</div>
      <p className="mt-2 text-sm text-muted-foreground">
        All your future orders will appear here.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Continue Shopping</Link>
      </Button>
    </div>
  );
};

export default EmptyOrders;
