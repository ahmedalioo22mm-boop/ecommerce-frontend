/** @format */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getAllProducts = async () => {
  try {
    const res = await fetch(`${API_URL}/product`, {
      method: "GET",
      cache: "no-store",
    });
    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.message || "Failed to fetch products");
    }

    return responseData; // إرجاع الكائن الكامل
  } catch (error) {
    console.error("Fetch products error:", error);
    throw error;
  }
};
export const deleteProduct = async (id, token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing.");
    }
    const res = await fetch(`${API_URL}/product/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json();

      throw new Error(errorData.message || "Failed to create product");
    }
    const responseData = await res.json();
    return responseData;
  } catch (error) {
    console.error("Delete product error:", error);
    throw error;
  }
};
export const updateProduct = async (id, formData, token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const res = await fetch(`${API_URL}/product/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      cache: "no-store",
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.message || "Failed to update product");
    }

    return responseData;
  } catch (error) {
    console.error("Update product error:", error);
    throw error;
  }
};
export const createProduct = async (formData, token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const res = await fetch(`${API_URL}/product/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      cache: "no-store",
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.message || "Failed to create product");
    }

    return responseData;
  } catch (error) {
    console.error("Create  error:", error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const res = await fetch(`${API_URL}/product/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json();

      throw new Error(errorData.message || "Failed to create product");
    }
    const responseData = await res.json();
    return responseData;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Fetch categories error:", error);
    }
    console.error("Fetch categories error:", error);
    throw error;
  }
};

export const deleteProductImage = async (productId, imageId, token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing.");
    }
    const res = await fetch(
      `${API_URL}/product/${productId}/${imageId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete product image");
    }
    const responseData = await res.json();
    return responseData;
  } catch (error) {
    console.error("Delete product image error:", error);
    throw error;
  }
};

export const createProductReview = async (productId, reviewData, token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing.");
    }
    const res = await fetch(`${API_URL}/product/${productId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create product review");
    }
    const responseData = await res.json();
    return responseData;
  } catch (error) {
    console.error("Create product review error:", error);
    throw error;
  }
};

export const updateProductReview = async (
  productId,
  reviewId,
  reviewData,
  token
) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing.");
    }
    const res = await fetch(
      `${API_URL}/product/${productId}/${reviewId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update product review");
    }
    const responseData = await res.json();
    return responseData;
  } catch (error) {
    console.error("Update product review error:", error);
    throw error;
  }
};

export const deleteProductReview = async (productId, reviewId, token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing.");
    }
    const res = await fetch(
      `${API_URL}/product/${productId}/${reviewId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete product review");
    }
    const responseData = await res.json();
    return responseData;
  } catch (error) {
    console.error("Delete product review error:", error);
    throw error;
  }
};
export const searchProduct = async (query) => {
  try {
    const res = await fetch(
      `${API_URL}/product/search?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch search results");
    }
    return await res.json();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Search product error:", error);
    }
    throw error;
  }
};

export const getFeaturedProducts = async () => {
  try {
    const res = await fetch(`${API_URL}/product/featured`, {
      method: "GET",
      cache: "no-store",
    });
    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(
        responseData.message || "Failed to fetch featured products"
      );
    }

    return responseData.data; // إرجاع مصفوفة المنتجات مباشرة
  } catch (error) {
    console.error("Fetch featured products error:", error);
    throw error;
  }
};

export const getOnSaleProducts = async () => {
  try {
    const res = await fetch(`${API_URL}/product/sale`, {
      method: "GET",
      cache: "no-store",
    });
    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(
        responseData.message || "Failed to fetch on-sale products"
      );
    }

    return responseData.data;
  } catch (error) {
    console.error("Fetch on-sale products error:", error);
    throw error;
  }
};