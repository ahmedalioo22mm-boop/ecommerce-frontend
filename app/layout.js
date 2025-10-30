/** @format */
import { Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./Context/AuthContext";
import { CartProvider } from "./Context/CartContext";
import Navbar from "./_components/Navbar";
import { Toaster } from "@/components/ui/sonner";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  preload: true,
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "E-commerce Store",
  description:
    "Discover a wide range of products and enjoy a seamless shopping experience.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
          <AuthProvider>
          {/* 2. إضافة CartProvider ليحيط بالتطبيق */}
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Toaster richColors position="top-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
