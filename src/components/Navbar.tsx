import Link from "next/link";
import React from "react";
import ModeToggle from "./ModeToggle";
import { Zap } from "lucide-react";
import GithubButton from "./GithubButton";
import { getUserSession } from "@/actions/auth.action";
import SignOutButton from "./SignOutButton";
import { syncUser } from "@/actions/user.action";
import UserProfileModal from "./UserProfileModal";

export default async function Navbar() {
  const session = await getUserSession();
  // console.log("Session in Navbar: ", session);
  const user = session?.user;
  if (user) {
    await syncUser();
  }

  return (
    <header className="border-1 border-b">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Zap className="h-6 w-6" />
          <span>ChessInsight</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <nav className="flex gap-4 sm:gap-6">
            {!session?.user && (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium hover:underline underline-offset-4"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium hover:underline underline-offset-4"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
          {user && (
            <>
              <Link
                href="/analyze"
                className="text font-medium hover:underline underline-offset-4"
              >
                Analyze
              </Link>
              <Link
                href="/dashboard"
                className="text font-medium hover:underline underline-offset-4"
              >
                Dashboard
              </Link>
            </>
          )}
          {user && <UserProfileModal user={user} />}
          <ModeToggle />
          <GithubButton />
        </div>
      </div>
    </header>
  );
}
