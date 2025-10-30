/** @format */

"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // مثال باستخدام shadcn/ui
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteButton from "./DeleteButton";

// هذا مكون عميل (Client Component) لأنه يحتوي على تفاعل
export default function ProductsTable({ products }) {
  if (!products || products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product, index) => (
          <TableRow key={product._id}>
            <TableCell>
              <Image
                src={product.coverImage.url}
                alt={product.title}
                priority={index === 0}
                width={64}
                height={64}
                className="rounded-md object-cover"
              />
            </TableCell>
            <TableCell className="font-medium">{product.title}</TableCell>
            <TableCell>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: product.currency,
                minimumFractionDigits: 2,
              }).format(product.price)}
            </TableCell>
            <TableCell>{product.stock}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Link href={`/dashboard/products/edit/${product._id}`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
                <DeleteButton
                  productId={product._id}
                  productTitle={product.title}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
