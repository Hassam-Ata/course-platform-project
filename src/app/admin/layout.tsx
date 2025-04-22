import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import Link from "next/link"
import { ReactNode, Suspense } from "react"

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

// function Navbar() {
//   return (
//     <header className="flex h-16 bg-white/10 backdrop-blur-md border-2 border-transparent rounded-xl animated-border shadow-md z-50 relative mx-4 mt-4 px-4">
//       <nav className="flex items-center justify-between w-full max-w-7xl mx-auto gap-4">
//         <div className="flex items-center gap-3 mr-auto">
//           <Link
//             className="text-xl font-semibold text-white tracking-wide hover:underline transition"
//             href="/admin"
//           >
//             Course Hub
//           </Link>
//           <Badge className="bg-blue-600 text-white">Admin</Badge>
//         </div>

//         <div className="flex gap-2 items-center">
//           <Link
//             className="text-sm text-white px-3 py-1 rounded-full hover:bg-white/20 transition"
//             href="/admin/courses"
//           >
//             Courses
//           </Link>
//           <Link
//             className="text-sm text-white px-3 py-1 rounded-full hover:bg-white/20 transition"
//             href="/admin/products"
//           >
//             Products
//           </Link>
//           <Link
//             className="text-sm text-white px-3 py-1 rounded-full hover:bg-white/20 transition"
//             href="/admin/sales"
//           >
//             Sales
//           </Link>
//           <div className="size-9">
//             <UserButton
//               appearance={{
//                 elements: {
//                   userButtonAvatarBox: { width: '100%', height: '100%' },
//                 },
//               }}
//             />
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// }

function Navbar() {
  return (
    <header className="relative z-50 mx-4 mt-6">
      <div className="relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.2)] overflow-hidden before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-purple-500 before:via-blue-500 before:to-indigo-500 before:blur-2xl before:opacity-30 before:z-[-1]">
        <nav className="flex items-center justify-between w-full max-w-7xl mx-auto px-6 py-4">
        
            <div className = "flex items-center gap-3 mr-auto">
            <Link
            className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent animate-text-glow"
            href="/"
          >
            Course Hub
          </Link>
            <Badge className="bg-blue-600 text-white">Admin</Badge>
              </div>

          <div className="flex gap-3 items-center">
            <Suspense>
              <SignedIn>
                <Link
                  className="text-sm font-medium text-white/80 px-3 py-1 rounded-full hover:bg-white/20 hover:scale-[1.05] transition-all duration-200"
                  href="/admin/courses"
                >
                  Courses
                </Link>
                <Link
                  className="text-sm font-medium text-white/80 px-3 py-1 rounded-full hover:bg-white/20 hover:scale-[1.05] transition-all duration-200"
                  href="/admin/products"
                >
                  Products
                </Link>
                <Link
                  className="text-sm font-medium text-white/80 px-3 py-1 rounded-full hover:bg-white/20 hover:scale-[1.05] transition-all duration-200"
                  href="/admin/sales"
                >
                  Sales
                </Link>
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/30 hover:scale-105 transition-all duration-200">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: { width: "100%", height: "100%" },
                      },
                    }}
                  />
                </div>
              </SignedIn>
            </Suspense>

            <Suspense>
              <SignedOut>
                <Button
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:brightness-110 text-white px-5 py-1.5 rounded-full text-sm font-semibold shadow-md hover:scale-105 transition-all duration-200"
                  asChild
                >
                  <SignInButton>Sign In</SignInButton>
                </Button>
              </SignedOut>
            </Suspense>
          </div>
        </nav>
      </div>
    </header>
  );
}
