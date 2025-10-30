/** @format */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getAllCategory = async () => {
  try {
    const res = await fetch(`${API_URL}/category/`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json();

      throw new Error(errorData.message || "Failed to fetch categories");
    }
    return await res.json();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Fetch categories error:", error);
    }
    console.error("Fetch categories error:", error);
    throw error;
  }
};
export const createCategory = async (formData, token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    // تأكد من أن هذا هو الرابط الصحيح للـ API الخاص بك
    const res = await fetch(`${API_URL}/category/create`, {
      method: "POST",
      headers: {
        // لا تقم بوضع 'Content-Type'. المتصفح سيقوم بذلك تلقائيًا
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      cache: "no-store",
    });

    const responseData = await res.json();

    if (!res.ok) {
      // السيرفر أرجع خطأ (مثل: اسم التصنيف مكرر)
      throw new Error(responseData.message || "Failed to create category");
    }

    return responseData;
  } catch (error) {
    // هذا الخطأ سيتم التقاطه في صفحة page.jsx لعرضه للمستخدم
    console.error("Create category error:", error);
    throw error;
  }
};

export const getCategoryWithProducts = async (slug) => {
  try {
    const res = await fetch(`${API_URL}/category/${slug}/products`, {
      method: "GET",
      cache: "no-store",
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch category products");
    }
    return await res.json();
  } catch (error) {
    console.error("Fetch category products error:", error);
    throw error;
  }
};
export const getSingleCategory = async (userid) => {
  try {
    const res = await fetch(`${API_URL}/category/${userid}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json();

      throw new Error(errorData.message || "Failed to fetch categories");
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
export const deleteCategory = async (id, token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing.");
    }
    const res = await fetch(`${API_URL}/category/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json();

      throw new Error(errorData.message || "Failed to delete category");
    }
    const responseData = await res.json();
    return responseData;
  } catch (error) {
    console.error("Delete category error:", error);
    throw error;
  }
};
export const updateCategory = async (id, formData, token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    // تأكد من أن هذا هو الرابط الصحيح للـ API الخاص بك
    const res = await fetch(`${API_URL}/category/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      cache: "no-store",
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.message || "Failed to update category");
    }

    return responseData;
  } catch (error) {
    // هذا الخطأ سيتم التقاطه في صفحة page.jsx لعرضه للمستخدم
    console.error("Update category error:", error);
    throw error;
  }
};