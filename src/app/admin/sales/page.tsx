import { db } from "@/drizzle/db"
import { PurchaseTable as DbPurchaseTable } from "@/drizzle/schema"
import { PurchaseTable } from "@/features/purchases/components/PurchaseTable"
import { getPurchaseGlobalTag } from "@/features/purchases/db/cache"
import { getUserGlobalTag } from "@/features/users/db/cache"
import { desc } from "drizzle-orm"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"

export default async function PurchasesPage() {
  const purchases = await getPurchases()

  return (
    <div className="container my-6 font-sans text-gray-100 bg-black min-h-screen">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-white">Sales</h1>
        <p className="text-sm text-gray-400 mt-2">
          View all recent sales including refunded orders.
        </p>
      </div>

      <div className="rounded-xl border border-gray-700 bg-zinc-900 p-6 shadow-lg">
        <PurchaseTable purchases={purchases} />
      </div>
    </div>
  )
}

async function getPurchases() {
  "use cache"
  cacheTag(getPurchaseGlobalTag(), getUserGlobalTag())

  return db.query.PurchaseTable.findMany({
    columns: {
      id: true,
      pricePaidInCents: true,
      refundedAt: true,
      productDetails: true,
      createdAt: true,
    },
    orderBy: desc(DbPurchaseTable.createdAt),
    with: { user: { columns: { name: true } } },
  })
}
