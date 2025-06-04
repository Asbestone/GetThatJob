"use client"

import React, {useState, useEffect} from "react"
import { useSession, signIn } from "next-auth/react"

export default function LinkedinLogin() {
  const { data: session, status } = useSession()
  const [meJson, setMeJson] = useState<any>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (status !== "authenticated") return

    fetch("/api/me")
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text()
          throw new Error(txt)
        }
        return res.json()
      })
      .then((data) => {
        setMeJson(data)
      })
      .catch((e) => {
        console.error("Failed to fetch api/me", e)
        setErr(e.message)
      })
  }, [status])

  if (status == "loading") {
    return <p>Checking auth…</p>
  }

  if (!session) {
    return (
      <button onClick={() => signIn("linkedin")}>
        Sign in with LinkedIn
      </button>
    )
  }

  return (
    <div>
      <h2 style={{color: 'black'}}>Welcome, {session.user?.name}</h2>

      {err && (
        <p style={{ color: "red" }}>
          Error loading profile: {err}
        </p>
      )}

      {!meJson && !err && <p style={{color: 'black'}}>Loading your LinkedIn ID…</p>}

      {meJson && (
        <div style={{ textAlign: "left", maxWidth: 600 }}>
          <h3 style={{color: 'black'}}>Your LinkedIn Profile (raw JSON):</h3>
          <pre
            style={{
              background: "#f5f5f5",
              color: 'black',
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
            style={{width: 100, height: 100}}
          />
        </div>
      )}
    </div>
  )
}
