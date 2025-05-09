"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <>
      <header className="bg-background/95 px-4 md:px-10 lg:px-20 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
        <div className="container flex h-16 md:h-20 lg:h-24 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg md:text-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l3.58-3.58c.94-.94.94-2.48 0-3.42L9 5Z" />
              <path d="M6 9.01V9" />
              <path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19" />
            </svg>
            GetThatJob.
          </div>
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
            <Link href="/login" className="text-xs md:text-sm font-medium hover:underline underline-offset-4">
              Log In
            </Link>
            <Button asChild size="lg" className="inline-flex">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;