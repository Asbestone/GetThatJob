"use client";

import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/app/components/frontend/ui/button";
import Link from 'next/link';
import { Logo } from "@/app/components/frontend/Logo";

export default function LinkedinLogin() {
  const { data: session, status } = useSession();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  
  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/me")
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .catch((e) => {
        console.error("Failed to fetch api/me", e);
      });
  }, [status]);

  if (status === "loading") {
    return (
      <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
        <div className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
          <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
            <div className="text-center">
              <Link href="/" aria-label="go home" className="mx-auto block w-fit">
                <Logo />
              </Link>
              <h1 className="text-title mb-1 mt-4 text-xl font-semibold">
                Loading...
              </h1>
              <p className="text-sm">Checking authentication status</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!session) {
    return (
      <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
        <div className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
          <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
            <div className="text-center">
              <Link href="/" aria-label="go home" className="mx-auto block w-fit">
                <Logo />
              </Link>
              <h1 className="text-title mb-1 mt-4 text-xl font-semibold">
                Sign in to GetThatJob
              </h1>
              <p className="text-sm">
                Connect with LinkedIn to get started
              </p>
            </div>

            <div className="mt-6 space-y-6">
              <Button 
                className="w-full"
                onClick={() => 
                  signIn("linkedin", {
                    callbackUrl: callbackUrl || "/",
                  })
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  className="mr-2"
                >
                  <path
                    fill="currentColor"
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037c-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85c3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065c0-1.138.92-2.063 2.063-2.063c1.14 0 2.064.925 2.064 2.063c0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                  />
                </svg>
                Sign in with LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }
}