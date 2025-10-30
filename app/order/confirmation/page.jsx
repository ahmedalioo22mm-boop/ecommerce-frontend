/** @format */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

const OrderConfirmationPage = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
      <p className="text-gray-500 mb-8">Thank you for your purchase. You will receive an email confirmation shortly.</p>
      <Link href="/products">
        <Button>Continue Shopping</Button>
      </Link>
    </div>
  );
};

export default OrderConfirmationPage;
