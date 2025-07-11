"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { FullLogo } from "./Logo";
import { useSession, signOut } from "next-auth/react";

import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <>
      <header className="bg-background/95 px-4 md:px-10 lg:px-20 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
        <div className="container flex h-16 md:h-20 lg:h-24 items-center justify-between">
          <FullLogo />
          <nav className="hidden md:flex items-center gap-4 md:gap-6">
            <Link href="#features" className="text-md font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="#how-it-works" className="text-md font-medium hover:underline underline-offset-4">
              How It Works
            </Link>
            <Link href="#pricing" className="text-md font-medium hover:underline underline-offset-4">
              Pricing
            </Link>
            <Link href="#testimonials" className="text-md font-medium hover:underline underline-offset-4">
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-2 md:gap-4">
            {/*
            <Link href="/login" className="text-xs md:text-sm font-medium hover:underline underline-offset-4">
              Log In
            </Link>
            */}

            {status === "loading" ? (
              <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-4">

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={session.user?.image || ""} />
                        <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="bg-background rounded-xl shadow-lg p-2 min-w-[150px]"
                  >
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="w-full px-2 py-1.5 rounded hover:bg-muted transition">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="w-full px-2 py-1.5 rounded hover:bg-muted transition">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <button
                        onClick={() => signOut()}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-muted transition"
                      >
                        Sign Out
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

              </div>
            ) : (

              <Button asChild size="lg" className="inline-flex">
                <Link href="/login">Get Started</Link>
              </Button>

            )}

          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;