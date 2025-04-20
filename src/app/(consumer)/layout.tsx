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
    <header className="flex h-16 bg-white/10 backdrop-blur-md border-2 border-transparent rounded-xl animated-border shadow-md z-50 relative mx-4 mt-4 px-4">
      <nav className="flex items-center justify-between w-full max-w-7xl mx-auto gap-4">
        <Link
          className="text-xl font-semibold text-white tracking-wide hover:underline transition"
          href="/"
        >
          Course Hub
        </Link>

        <div className="flex gap-2 items-center">
          <Suspense>
            <SignedIn>
              <AdminLink />
              <Link
                className="text-sm text-white px-3 py-1 rounded-full hover:bg-white/20 transition"
                href="/courses"
              >
                My Courses
              </Link>
              <Link
                className="text-sm text-white px-3 py-1 rounded-full hover:bg-white/20 transition"
                href="/purchases"
              >
                Purchase History
              </Link>
              <div className="size-9">
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
                className="text-white bg-blue-600 hover:bg-blue-700 transition rounded-full px-4 py-1 text-sm"
                asChild
              >
                <SignInButton>Sign In</SignInButton>
              </Button>
            </SignedOut>
          </Suspense>
        </div>
      </nav>
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
