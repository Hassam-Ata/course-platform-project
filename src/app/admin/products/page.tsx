import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import Link from "next/link";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { db } from "@/drizzle/db";
import {
  CourseProductTable,
  ProductTable as DbProductTable,
  PurchaseTable,
} from "@/drizzle/schema";
import { asc, countDistinct, eq } from "drizzle-orm";
import { getProductGlobalTag } from "@/features/products/db/cache";
import { Pencil, Trash2 } from "lucide-react";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container my-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white drop-shadow tracking-tight">
          🛒 Products
        </h1>
        <Button
          asChild
          className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:brightness-110 text-white rounded-lg px-4 py-2 shadow"
        >
          <Link href="/admin/products/new">+ New Product</Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 shadow-lg">
        <table className="min-w-full text-sm text-white table-auto">
          <thead className="bg-white/10 text-white uppercase text-xs tracking-wide">
            <tr>
              <th className="px-6 py-4 text-left">Product</th>
              <th className="px-6 py-4 text-left">Price</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Courses</th>
              <th className="px-6 py-4 text-left">Customers</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-white/5">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-white/10 transition-colors duration-150"
              >
                <td className="px-6 py-4 font-medium">
                  <div className="flex items-center gap-3">
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover border border-white/20"
                      />
                    )}
                    <span>{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">${product.priceInDollars}</td>
                <td className="px-6 py-4 capitalize">{product.status}</td>
                <td className="px-6 py-4">{product.coursesCount}</td>
                <td className="px-6 py-4">{product.customersCount}</td>
                <td className="px-6 py-4 space-x-2">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </Link>
                  <Link
                    href={`/admin/products/${product.id}/delete`}
                    className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 transition"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

async function getProducts() {
  "use cache";
  cacheTag(getProductGlobalTag());

  return db
    .select({
      id: DbProductTable.id,
      name: DbProductTable.name,
      status: DbProductTable.status,
      priceInDollars: DbProductTable.priceInDollars,
      description: DbProductTable.description,
      imageUrl: DbProductTable.imageUrl,
      coursesCount: countDistinct(CourseProductTable.courseId),
      customersCount: countDistinct(PurchaseTable.userId),
    })
    .from(DbProductTable)
    .leftJoin(PurchaseTable, eq(PurchaseTable.productId, DbProductTable.id))
    .leftJoin(
      CourseProductTable,
      eq(CourseProductTable.productId, DbProductTable.id)
    )
    .orderBy(asc(DbProductTable.name))
    .groupBy(DbProductTable.id);
}
