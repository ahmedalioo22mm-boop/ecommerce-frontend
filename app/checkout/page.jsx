/** @format */

"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { createOrder } from "@/lib/order";
import { toast } from "sonner";

const CheckoutPage = () => {
  const { cart, total, clearCart } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        address: user.address || "",
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to place an order.");
      router.push("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        shippingInfo: {
          address: formData.address,
          city: formData.city,
          zipCode: formData.zip,
        },
        orderItems: cart.map((item) => ({
          product: item._id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          color: item.color,
          size: item.size,
        })),
        totalPrice: total,
        paymentInfo: {
          status: "pending", // Or integrate with a real payment provider
        },
      };

      const data = await createOrder(orderData, token);
      toast.success("Order placed successfully!");
      clearCart();
      router.push(`/order/confirmation?orderId=${data.order._id}`);
    } catch (error) {
      console.error("Failed to create order:", error);
      toast.error(error.message || "There was an issue placing your order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !isSubmitting) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          You can't checkout with an empty cart.
        </p>
        <Button onClick={() => router.push("/products")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="123 Main St"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">
                Payment Information
              </h2>
              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                <p className="text-gray-600 dark:text-gray-300">
                  This is a demo. No real payment will be processed.
                </p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || cart.length === 0}
            >
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </Button>
          </form>
        </div>
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2">
              {cart.map((item) => (
                <div
                  key={`${item._id}-${item.size}-${item.color}`}
                  className="flex justify-between text-sm"
                >
                  <span className="truncate pr-2">
                    {item.title} x {item.quantity}
                  </span>
                  <span>
                    {formatPrice(item.price * item.quantity, item.currency)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatPrice(total, cart[0]?.currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;