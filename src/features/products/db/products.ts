import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { revalidateProductCache } from "./cache";
import {
  CourseProductTable,
  ProductTable,
  PurchaseTable,
} from "@/drizzle/schema";

export async function userOwnsProduct({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) {
  "use cache";

  const existingPurchase = await db.query.PurchaseTable.findFirst({
    where: and(
      eq(PurchaseTable.productId, productId),
      eq(PurchaseTable.userId, userId),
      isNull(PurchaseTable.refundedAt)
    ),
  });

  return existingPurchase != null;
}

export async function insertProduct(
  data: typeof ProductTable.$inferInsert & { courseIds: string[] }
) {
  // Step 1: Insert Product
  const [newProduct] = await db.insert(ProductTable).values(data).returning();
  if (!newProduct) {
    throw new Error("Failed to create product");
  }

  // Step 2: Insert related courses
  if (data.courseIds.length > 0) {
    await db.insert(CourseProductTable).values(
      data.courseIds.map((courseId) => ({
        productId: newProduct.id,
        courseId,
      }))
    );
  }

  // Step 3: Revalidate Cache
  revalidateProductCache(newProduct.id);

  return newProduct;
}

export async function updateProduct(
  id: string,
  data: Partial<typeof ProductTable.$inferInsert> & { courseIds: string[] }
) {
  // Step 1: Check if product exists
  const existingProduct = await db.query.ProductTable.findFirst({
    where: eq(ProductTable.id, id),
  });

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  // Step 2: Update Product
  const [updatedProduct] = await db
    .update(ProductTable)
    .set(data)
    .where(eq(ProductTable.id, id))
    .returning();

  if (!updatedProduct) {
    throw new Error("Failed to update product");
  }

  // Step 3: Delete old course-product relations
  await db
    .delete(CourseProductTable)
    .where(eq(CourseProductTable.productId, updatedProduct.id));

  // Step 4: Insert new course-product relations
  if (data.courseIds.length > 0) {
    await db.insert(CourseProductTable).values(
      data.courseIds.map((courseId) => ({
        productId: updatedProduct.id,
        courseId,
      }))
    );
  }

  // Step 5: Revalidate Cache
  revalidateProductCache(updatedProduct.id);

  return updatedProduct;
}

export async function deleteProduct(id: string) {
  // Step 1: Check if product exists
  const existingProduct = await db.query.ProductTable.findFirst({
    where: eq(ProductTable.id, id),
  });

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  // Step 2: Delete product
  const [deletedProduct] = await db
    .delete(ProductTable)
    .where(eq(ProductTable.id, id))
    .returning();

  if (!deletedProduct) {
    throw new Error("Failed to delete product");
  }

  // Step 3: Revalidate Cache
  revalidateProductCache(deletedProduct.id);

  return deletedProduct;
}
