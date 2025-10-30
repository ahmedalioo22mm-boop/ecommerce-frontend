/** @format */

"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUserRound, Menu, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useCart } from "../Context/CartContext";
import { usePathname, useRouter } from "next/navigation";
import Search from "./Search";

const Navbar = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { href: "/", text: "Home" },
    { href: "/products", text: "All Products" },
    { href: "/categories", text: "Categories" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        <Link href="/" onClick={() => setIsMenuOpen(false)}>
          <Image
            src="/logo7.png"
            alt="Logo"
            width={150}
            height={50}
            className="h-10 w-auto"
            priority
          />
        </Link>

        <div className="hidden md:block flex-1 max-w-md mx-4">
          <Search />
        </div>

        <nav aria-label="Global" className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  className={
                    pathname === link.href
                      ? "text-blue-600 font-semibold"
                      : "text-gray-500 transition hover:text-gray-500/75"
                  }
                  href={link.href}
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="h-8 w-24 animate-pulse rounded-md bg-gray-200"></div>
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <CircleUserRound className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                {user?.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                    router.push("/login");
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex sm:gap-4">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  size="sm"
                >
                  Register
                </Button>
              </Link>
            </div>
          )}

          <Link href="/cart" className="relative">
            <Button size="icon" variant="outline">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Button>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                {cart.length}
              </span>
            )}
          </Link>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-sm bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75"
            >
              <span className="sr-only">Toggle menu</span>
              {isMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-white shadow-lg top-16 left-0">
          <div className="p-4 border-b">
            <Search />
          </div>
          <nav aria-label="Mobile" className="p-4">
            <ul className="flex flex-col items-start gap-4 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    className={
                      pathname === link.href
                        ? "text-blue-600 font-semibold"
                        : "text-gray-500 transition hover:text-gray-500/75"
                    }
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
              {!isAuthenticated && (
                <div className="flex flex-col sm:hidden gap-4 w-full pt-4 border-t border-gray-200">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      className="bg-blue-600 text-white hover:bg-blue-700 w-full"
                      size="sm"
                    >
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;