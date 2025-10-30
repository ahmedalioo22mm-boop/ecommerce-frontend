/** @format */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/app/Context/AuthContext";
import { getUserOrders } from "@/lib/order";

// Import the components we created
import OrderList from "./_components/OrderList";
import EmptyOrders from "./_components/EmptyOrders";
import OrdersLoading from "./_components/OrdersLoading";

export default function MyOrdersPage() {
  const { getValidToken, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setError(null);
      setPageLoading(true);
      const token = await getValidToken();
      if (!token) {
        // This case is handled by redirecting unauthenticated users,
        // but it's good practice to have a safeguard.
        throw new Error("Authentication required.");
      }
      const response = await getUserOrders(token);
      if (response.success) {
        setOrders(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch orders.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setPageLoading(false);
    }
  }, [getValidToken]);

  useEffect(() => {
    // We wait for the initial authentication check to complete
    if (!authLoading) {
      fetchOrders();
    }
  }, [authLoading, fetchOrders]);

  const renderContent = () => {
    // While the page is fetching data, show the loading skeleton
    if (pageLoading || authLoading) {
      return <OrdersLoading />;
    }

    // If there was an error fetching data
    if (error) {
      return (
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <button onClick={fetchOrders} className="mt-2 underline">
            Try again
          </button>
        </div>
      );
    }

    // If there are no orders, show the EmptyOrders component
    if (orders.length === 0) {
      return <EmptyOrders />;
    }

    // If orders are successfully fetched, show the list
    return <OrderList orders={orders} />;
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">My Orders</h1>
      <div>{renderContent()}</div>
    </div>
  );
}
