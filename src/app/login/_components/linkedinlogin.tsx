"use client";

import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function LinkedinLogin() {
  const { data: session, status } = useSession();
  const [meJson, setMeJson] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  // New state for the public URL and for the verify response
  const [profileUrl, setProfileUrl] = useState<string>(
    session?.user?.id
      ? `https://www.linkedin.com/in/${session.user.id}/`
      : ""
  );
  const [verifyResult, setVerifyResult] = useState<any>(null);

  useEffect(() => {
    if (status !== "authenticated") return;

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
  }, [status]);

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

  if (status === "loading") return <p>Checking auth…</p>;
  if (!session)
    return (
      <button 
        onClick={() => 
          signIn("linkedin", {
            // default fallback to homepage after login
            callbackUrl: callbackUrl || "",
          })}>
        Sign in with LinkedIn
      </button>
    );

  return (
    <div>
      <h2 style={{ color: "black" }}>Welcome, {session.user?.name}</h2>

      {err && <p style={{ color: "red" }}>Error loading profile: {err}</p>}

      {!meJson && !err && (
        <p style={{ color: "black" }}>Loading your LinkedIn ID…</p>
      )}

      {meJson && (
        <div style={{ textAlign: "left", maxWidth: 600 }}>
          <h3 style={{ color: "black" }}>
            Your LinkedIn Profile (raw JSON):
          </h3>
          <pre
            style={{
              background: "#f5f5f5",
              color: "black",
              padding: "1rem",
              borderRadius: 4,
              overflowX: "auto",
            }}
          >
            {JSON.stringify(meJson, null, 2)}
          </pre>
          <img
            src={meJson.user.image}
            alt="Linkedin PFP"
            style={{ width: 100, height: 100 }}
          />

          {/* ————— URL & Verify Controls ————— */}
          <div style={{ marginTop: "1.5rem" }}>
            <p style={{ color: "black" }}>Your public LinkedIn URL:</p>
            <input
              type="text"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                marginBottom: 8,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />

            <button
              onClick={() => window.open(profileUrl, "_blank")}
              style={{ marginRight: 8 }}
            >
              Open Profile
            </button>
            <button onClick={handleVerify}>Verify My Experience</button>
          </div>

          {/* ————— Display Verify Result ————— */}
          {verifyResult && (
            <div style={{ marginTop: "1.5rem" }}>
              <h3 style={{ color: "black" }}>Raw Scrape & Verification Result:</h3>
              <pre
                style={{
                  background: "#eef",
                  color: "#000",
                  padding: "1rem",
                  borderRadius: 4,
                  maxHeight: 300,
                  overflowY: "auto",
                }}
              >
                {JSON.stringify(verifyResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
