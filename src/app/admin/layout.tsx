import { Badge } from "@/components/ui/badge"
import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { ReactNode } from "react"

export default function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

function Navbar() {
  return (
    <header className="flex h-16 bg-white/10 backdrop-blur-md border-2 border-transparent rounded-xl animated-border shadow-md z-50 relative mx-4 mt-4 px-4">
      <nav className="flex items-center justify-between w-full max-w-7xl mx-auto gap-4">
        <div className="flex items-center gap-3 mr-auto">
          <Link
            className="text-xl font-semibold text-white tracking-wide hover:underline transition"
            href="/admin"
          >
            Course Hub
          </Link>
          <Badge className="bg-blue-600 text-white">Admin</Badge>
        </div>

        <div className="flex gap-2 items-center">
          <Link
            className="text-sm text-white px-3 py-1 rounded-full hover:bg-white/20 transition"
            href="/admin/courses"
          >
            Courses
          </Link>
          <Link
            className="text-sm text-white px-3 py-1 rounded-full hover:bg-white/20 transition"
            href="/admin/products"
          >
            Products
          </Link>
          <Link
            className="text-sm text-white px-3 py-1 rounded-full hover:bg-white/20 transition"
            href="/admin/sales"
          >
            Sales
          </Link>
          <div className="size-9">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: { width: '100%', height: '100%' },
                },
              }}
            />
          </div>
        </div>
      </nav>
    </header>
  );
}