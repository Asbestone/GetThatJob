"use client";

import React from "react";
import { useSession, signIn } from "next-auth/react";

export default function LinkedinLogin() {
  const { data: session, status } = useSession();

  // If you want first / last separately, split on the first space:
  const [firstName, lastName] = session?.user?.name
    ? session.user.name.split(" ", 2)
    : ["", ""];

  const handleSignIn = () => {
    signIn("linkedin");
  };

  return (
    <div className="linkedin-login">
      {status === "loading" && <p>Checking authentication…</p>}

      {!session && status !== "loading" && (
        <button onClick={handleSignIn} className="linkedin-button">
          Sign in with LinkedIn
        </button>
      )}

      {session && (
        <div className="profile-data">
          <h2>
            {firstName} {lastName}
          </h2>

          {session.user && session.user.image ? (
            <img
              src={session.user.image}
              alt="Profile Picture"
              style={{ width: 100, borderRadius: "50%" }}
            />
          ) : (
            <p>No profile image available.</p>
          )}
        </div>
      )}
    </div>
  );
}
