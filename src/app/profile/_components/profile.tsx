"use client";

import { useState, useEffect } from "react";
import { Input } from "@/app/components/frontend/ui/input";
import { Label } from "@/app/components/frontend/ui/label";
import { Button } from "@/app/components/frontend/ui/button";
import { Logo } from "@/app/components/frontend/Logo";
import Link from "next/link";

export default function Profile({ session }: { session: any }) {
  const [profileUrl, setProfileUrl] = useState(
    session?.user?.id
      ? `https://www.linkedin.com/in/${session.user.id}/`
      : ""
  );
  const [meJson, setMeJson] = useState<any>(null);
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;

    fetch("/api/me")
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then(setMeJson)
      .catch((e) => {
        console.error("Failed to fetch api/me", e);
        setErr(e.message);
      });
  }, [session]);

  const handleVerify = async () => {
    try {
      const res = await fetch("/api/verifyintern", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkedinUrl: profileUrl }),
      });
      const json = await res.json();
      console.log("verify-intern response:", json);
      setVerifyResult(json);
    } catch (e: any) {
      console.error(e);
      alert("Error: " + e.message);
    }
  };

  // User is authenticated - show the profile and verification interface
  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <div className="bg-muted m-auto h-fit w-full max-w-2xl overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div className="text-center">
            <Link href="/" aria-label="go home" className="mx-auto block w-fit">
              <Logo />
            </Link>
            <h1 className="text-title mb-1 mt-4 text-xl font-semibold">
              Welcome, {session.user?.name}!
            </h1>
            <p className="text-sm">
              Verify your LinkedIn experience
            </p>
          </div>

          {err && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">Error loading profile: {err}</p>
            </div>
          )}

          {!meJson && !err && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800 text-sm">Loading your LinkedIn ID…</p>
            </div>
          )}

          {meJson && (
            <div className="mt-6 space-y-6">
              {/* Profile Image */}
              <div className="text-center">
                <img
                  src={meJson.user.image}
                  alt="LinkedIn Profile"
                  className="w-20 h-20 rounded-full mx-auto border-2 border-gray-200"
                />
              </div>

              {/* Profile URL Input */}
              <div className="space-y-2">
                <Label htmlFor="profileUrl" className="block text-sm">
                  Your LinkedIn Profile URL
                </Label>
                <Input
                  type="url"
                  id="profileUrl"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  placeholder="https://www.linkedin.com/in/your-profile/"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.open(profileUrl, "_blank")}
                >
                  Open Profile
                </Button>
                <Button onClick={handleVerify}>
                  Verify Experience
                </Button>
              </div>

              {/* Raw Profile Data (Collapsible) */}
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                  View Raw Profile Data
                </summary>
                <div className="mt-2 p-4 bg-gray-50 rounded-md">
                  <pre className="text-xs text-gray-800 overflow-x-auto">
                    {JSON.stringify(meJson, null, 2)}
                  </pre>
                </div>
              </details>
            </div>
          )}

          {/* Verification Results */}
          {verifyResult && (
            <div className="mt-6 space-y-4">
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-3">Verification Results</h3>
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <pre className="text-sm text-green-800 overflow-x-auto max-h-64">
                    {JSON.stringify(verifyResult, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
