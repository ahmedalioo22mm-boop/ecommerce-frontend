/** @format */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const createOrder = async (orderData, token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const res = await fetch(`${API_URL}/order/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
      cache: "no-store",
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.message || "Failed to create order");
    }

    return responseData;
  } catch (error) {
    console.error("Create order error:", error);
    throw error;
  }
};

export const getUserOrders = async (token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const res = await fetch(`${API_URL}/order/my-orders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.message || "Failed to fetch user orders");
    }

    return responseData;
  } catch (error) {
    console.error("Get user orders error:", error);
    throw error;
  }
};

export const getOrderById = async (orderId, token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const res = await fetch(`${API_URL}/order/${orderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.message || "Failed to fetch order");
    }

    return responseData;
  } catch (error) {
    console.error("Get order by ID error:", error);
    throw error;
  }
};

export const getAllOrders = async (token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const res = await fetch(`${API_URL}/order/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.message || "Failed to fetch all orders");
    }

    return responseData;
  } catch (error) {
    console.error("Get all orders error:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status, token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const res = await fetch(`${API_URL}/order/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
      cache: "no-store",
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.message || "Failed to update order status");
    }

    return responseData;
  } catch (error) {
    console.error("Update order status error:", error);
    throw error;
  }
};
