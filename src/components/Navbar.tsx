"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FullLogo } from "@/components/Logo";

const Navbar = () => {
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