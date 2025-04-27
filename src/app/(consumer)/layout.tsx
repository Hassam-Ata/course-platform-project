import { Button } from "@/components/ui/button";

import { canAccessAdminPages } from "@/permissions/general";
import { getCurrentUser } from "@/services/clerk";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode, Suspense } from "react";

export default function ConsumerLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Navbar />

      {children}
    </>
  );
}

function Navbar() {
  return (
    <header className="relative z-50 mx-4 mt-6">
      <div className="relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.2)] overflow-hidden before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-purple-500 before:via-blue-500 before:to-indigo-500 before:blur-2xl before:opacity-30 before:z-[-1]">
        <nav className="flex items-center justify-between w-full max-w-7xl mx-auto px-6 py-4">
          <Link
            className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent animate-text-glow"
            href="/"
          >
            Course Hub
          </Link>

          <div className="flex gap-3 items-center">
            <Suspense>
              <SignedIn>
                <AdminLink />
                <Link
                  className="text-sm font-medium text-white/80 px-3 py-1 rounded-full hover:bg-white/20 hover:scale-[1.05] transition-all duration-200"
                  href="/chatbot"
                >
                  AI Chatbot
                </Link>
                <Link
                  className="text-sm font-medium text-white/80 px-3 py-1 rounded-full hover:bg-white/20 hover:scale-[1.05] transition-all duration-200"
                  href="/courses"
                >
                  My Courses
                </Link>
                <Link
                  className="text-sm font-medium text-white/80 px-3 py-1 rounded-full hover:bg-white/20 hover:scale-[1.05] transition-all duration-200"
                  href="/purchases"
                >
                  Purchase History
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



async function AdminLink() {
  const user = await getCurrentUser();
  if (!canAccessAdminPages(user)) return null;

  return (
    <Link className="hover:bg-accent/10 flex items-center px-2" href="/admin">
      Admin
    </Link>
  );
}
