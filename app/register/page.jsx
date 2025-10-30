"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, LoaderCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../Context/AuthContext"; // 1. استيراد useAuth
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const RegisterPage = () => {
  const { register } = useAuth(); 
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      
      const response = await register(formData);
 
      if (response.success) {
        toast.success(response.message || "Registration successful! Redirecting...");
        // لا حاجة لـ localStorage هنا، الـ Context يعتني بذلك
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setError(response.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url(/pg8.jpg)" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="w-full max-w-md p-8 space-y-8 bg-white/10 rounded-xl shadow-2xl backdrop-blur-lg z-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Create an Account</h1>
          <p className="mt-2 text-sm text-gray-200">
            Join us and start your journey.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="w-5 h-5 text-gray-300" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border rounded-md bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Full Name"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="w-5 h-5 text-gray-300" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border rounded-md bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Email address"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="w-5 h-5 text-gray-300" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-10 py-2 border rounded-md bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-300" />
              ) : (
                <Eye className="w-5 h-5 text-gray-300" />
              )}
            </button>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {loading && (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              )}
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </div>
          <div className="text-sm text-center text-gray-300">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-indigo-400 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;