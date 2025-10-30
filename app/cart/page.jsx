/** @format */

"use client";

import React, { useMemo, useState } from "react";
import { useCart } from "../Context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingCart, Minus, Plus } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const EmptyCart = () => (
  <div className="container mx-auto px-4 py-16 text-center">
    <ShoppingCart className="mx-auto h-24 w-24 text-gray-300 dark:text-gray-600" />
    <h1 className="mt-6 text-3xl font-bold">Your Cart is Empty</h1>
    <p className="mt-2 text-gray-500 dark:text-gray-400 mb-8">
      Looks like you haven't added anything to your cart yet.
    </p>
    <Button asChild>
      <Link href="/products">Continue Shopping</Link>
    </Button>
  </div>
);

const CartItem = React.memo(({ item, onUpdate, onRemove }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center p-4 border-b last:border-b-0">
      {/* Product Info */}
      <div className="col-span-1 md:col-span-2 flex items-center gap-4">
        <Image
          src={item.coverImage?.url || "/placeholder.jpg"}
          alt={item.title}
          width={80}
          height={80}
          className="rounded-md object-cover"
        />
        <div>
          <h2 className="font-semibold">{item.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {[item.size, item.color].filter(Boolean).join(" / ")}
          </p>
        </div>
      </div>

      {/* Price (visible on larger screens) */}
      <div className="hidden md:block">{formatPrice(item.price, item.currency)}</div>

      {/* Quantity */}
      <div className="col-span-1 flex items-center justify-between md:justify-start">
        <span className="md:hidden font-semibold mr-2">Quantity:</span>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => onUpdate(item._id, item.size, item.color, -1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={item.quantity}
            readOnly
            className="w-16 text-center h-9 bg-transparent"
          />
          <Button
            size="icon"
            variant="outline"
            onClick={() => onUpdate(item._id, item.size, item.color, 1)}
            disabled={item.quantity >= item.stock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Total */}
      <div className="font-semibold hidden md:block">
        {formatPrice(item.price * item.quantity, item.currency)}
      </div>

      {/* Remove Button */}
      <div className="text-right">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onRemove(item)}
          title="Remove item"
        >
          <Trash2 className="h-5 w-5 text-red-500" />
        </Button>
      </div>
    </div>
  );
});

CartItem.displayName = 'CartItem';

const OrderSummary = ({ total, onClearCart }) => {
  const currency = "EGP"; // Or get from cart items if they can differ
  return (
    <div className="w-full lg:w-80">
      <div className="border rounded-lg p-6 sticky top-24">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>{formatPrice(total, currency)}</span>
        </div>
        <div className="flex justify-between mb-4 text-gray-500 dark:text-gray-400">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="border-t pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatPrice(total, currency)}</span>
        </div>
        <Button asChild className="w-full mt-6">
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full mt-2">
              Clear Cart
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently remove all items from your cart.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onClearCart} className="bg-red-500 hover:bg-red-600">
                Clear Cart
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );

  const handleRemoveItem = (item) => {
    removeFromCart(item._id, item.size, item.color);
    toast.success(`"${item.title}" removed from cart.`);
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("Cart has been cleared.");
  }

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart ({cart.length})</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow">
          <div className="border rounded-lg bg-card">
            {/* Desktop Headers */}
            <div className="hidden md:grid grid-cols-6 gap-4 font-semibold p-4 border-b bg-gray-50 dark:bg-gray-800/50 rounded-t-lg">
              <div className="col-span-2">Product</div>
              <div>Price</div>
              <div>Quantity</div>
              <div>Total</div>
              <div></div>
            </div>
            {/* Cart Items */}
            <div>
              {cart.map((item) => (
                <CartItem
                  key={`${item._id}-${item.size}-${item.color}`}
                  item={item}
                  onUpdate={updateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          </div>
        </div>
        <OrderSummary total={total} onClearCart={handleClearCart} />
      </div>
    </div>
  );
};

export default CartPage;