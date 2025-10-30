/** @format */

import { Card, CardContent, CardHeader } from "@/components/ui/card";

const OrdersLoading = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="mt-2 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrdersLoading;
