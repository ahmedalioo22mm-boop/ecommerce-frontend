/** @format */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount
  );
};

const OrderCard = ({ order }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case "Processing":
        return "default";
      case "Shipped":
        return "secondary";
      case "Delivered":
        return "outline"; // Using 'outline' for a success-like feel
      case "Cancelled":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Order ID</CardTitle>
        <p className="text-xs text-muted-foreground">{order.orderId}</p>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(order.totalPrice)}</div>
        <p className="text-xs text-muted-foreground">
          {formatDate(order.createdAt)}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <Badge variant={getStatusVariant(order.orderStatus)}>
            {order.orderStatus}
          </Badge>
          <Button asChild variant="outline" size="sm">
            <Link href={`/order/${order._id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
