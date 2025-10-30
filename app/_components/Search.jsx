/** @format */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { searchProduct } from "@/lib/product";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Loader2 } from "lucide-react";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const searchContainerRef = useRef(null);

  useEffect(() => {
    // دالة لإغلاق قائمة النتائج عند الضغط خارجها
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const searchResults = await searchProduct(query);
        setResults(searchResults.data || []);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // تأخير 300ms قبل إرسال الطلب

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleResultClick = (slug) => {
    setQuery("");
    setResults([]);
    setIsFocused(false);
    router.push(`/products/${slug}`);
  };

  return (
    <div className="relative w-full max-w-md" ref={searchContainerRef}>
      <Input
        type="search"
        placeholder="Search for products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        className="w-full"
      />
      {isFocused && (query.length > 1) && (
        <Card className="absolute top-full mt-2 w-full z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-2">
            {isLoading && <div className="flex justify-center items-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>}
            {!isLoading && results.length === 0 && query.length > 1 && <p className="p-4 text-sm text-center text-gray-500">No results found for "{query}"</p>}
            {!isLoading && results.length > 0 && (
              <ul className="divide-y">
                {results.map((product) => (
                  <li key={product._id} onClick={() => handleResultClick(product.slug)} className="flex items-center gap-4 p-2 hover:bg-accent rounded-md cursor-pointer">
                    <Image src={product.coverImage.url} alt={product.title} width={40} height={40} className="rounded-md object-cover" />
                    <span className="font-medium">{product.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Search;