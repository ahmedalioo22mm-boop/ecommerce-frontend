/** @format */

"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  register as apiRegister,
  login as apiLogin,
  logout as apiLogout,
  refreshToken,
} from "../../lib/auth";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);
const parseJwt = (token) => {
  try {
    return jwtDecode(token);
  } catch (e) {
    return null;
  }
};
// 2. إنشاء الـ Provider
// هذا هو المكون الذي سيقوم بتوفير البيانات لكل المكونات الموجودة بداخله
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true); // حالة تحميل أولية للتحقق من وجود مستخدم

  // هذا الـ hook يعمل مرة واحدة عند تحميل التطبيق
  // وظيفته هي التحقق مما إذا كان المستخدم قد سجل دخوله من قبل
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("accessToken");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setAccessToken(storedToken);
      }
    } catch (error) {
      console.error("Failed to parse auth data from localStorage", error);
      // إذا حدث خطأ، قم بتنظيف الـ localStorage لضمان عدم حدوث مشاكل
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    } finally {
      // في كل الحالات، عند انتهاء التحقق، نجعل حالة التحميل false
      setLoading(false);
    }
  }, []);

  // دالة الدخول: تستدعي دالة الـ API وتقوم بتحديث الحالة والـ localStorage
  const login = async (formData) => {
    const response = await apiLogin(formData);
    if (response.success) {
      const { user, accessToken } = response.data;
      setUser(user);
      setAccessToken(accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
    }
    return response; // إرجاع الاستجابة للسماح للصفحة بمعرفة ما حدث
  };

  // دالة التسجيل: نفس منطق الدخول
  const register = async (formData) => {
    const response = await apiRegister(formData);
    if (response.success) {
      const { user, accessToken } = response.data;
      setUser(user);
      setAccessToken(accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
    }
    return response;
  };

  // دالة تسجيل الخروج
  const logout = useCallback(async () => {
    try {
      await apiLogout(); // استدعاء الـ API لمسح الـ httpOnly cookie
    } catch (error) {
      // حتى لو فشل الطلب، يجب علينا تنظيف الحالة من الفرونت اند
      if (process.env.NODE_ENV === "development") {
        console.error(
          "Server logout failed, clearing client state anyway.",
          error
        );
      }
    } finally {
      // قم بإزالة البيانات من الحالة و localStorage
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    }
  }, []);

  const getValidToken = useCallback(async () => {
    if (!accessToken) return null;

    const decodedToken = parseJwt(accessToken);
    // إذا لم يتمكن من فك التشفير، حاول التحديث
    if (!decodedToken) {
      try {
        const response = await refreshToken();
        const newAccessToken = response.accessToken;
        if (newAccessToken) {
          setAccessToken(newAccessToken);
          localStorage.setItem("accessToken", newAccessToken);
          return newAccessToken;
        }
        throw new Error("Unable to refresh token");
      } catch (error) {
        logout();
        return null;
      }
    }

    const buffer = 60 * 1000; // 60 ثانية

    // إذا كان التوكن منتهي الصلاحية أو على وشك الانتهاء
    if (decodedToken.exp * 1000 < Date.now() + buffer) {
      try {
        console.log("Token is expiring, refreshing...");
        const response = await refreshToken();
        const newAccessToken = response.accessToken;

        if (newAccessToken) {
          setAccessToken(newAccessToken);
          localStorage.setItem("accessToken", newAccessToken);
          return newAccessToken;
        }
      } catch (error) {
        console.error("Failed to refresh token", error);
        logout(); // إذا فشل التحديث، سجل خروج المستخدم
        return null;
      }
    }

    return accessToken; // إذا كان التوكن لا يزال صالحًا
  }, [accessToken, logout]);

  // هذه هي القيمة التي سيتم توفيرها لجميع المكونات
  const value = {
    user,
    accessToken,
    setAccessToken,
    isAuthenticated: !!user, // متغير boolean يكون true إذا كان هناك مستخدم، و false إذا لم يكن
    loading, // لتتمكن المكونات من عرض شاشة تحميل إذا لزم الأمر
    login,
    register,
    logout,
    getValidToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. إنشاء Custom Hook
// هذا يسهل على المكونات الأخرى استخدام الـ Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


