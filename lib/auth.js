/** @format */

// احصل على عنوان API من متغيرات البيئة
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * دالة مساعدة لإنشاء طلبات fetch
 * @param {string} endpoint - نقطة النهاية (e.g., '/auth/login')
 * @param {RequestInit} options - خيارات الطلب
 * @returns {Promise<any>}
 */
const apiFetch = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      // لإرسال الكوكيز (مثل refresh token) مع الطلبات
      credentials: "include", 
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.message || `Request failed with status ${res.status}`);
    }

    return responseData;
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error.message);
    // أرجع الخطأ للسماح للمكونات بالتعامل معه
    return { success: false, message: error.message };
  }
};

export const register = async (formData) => {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(formData),
  });
};

export const login = async (formData) => {
  return apiFetch("/auth/login", {
    method: "POST",
    cache: "no-store",
    body: JSON.stringify(formData),
  });
};

export const logout = async () => {
  return apiFetch("/auth/logout", {
    method: "POST",
    cache: "no-store",
  });
};

export const refreshToken = async () => {
  // refreshToken هو طلب GET ولا يحتاج body
  const response = await fetch(`${API_URL}/auth/refreshToken`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
  });

  if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Refresh token failed");
  }

  return await response.json();
};