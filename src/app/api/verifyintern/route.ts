// File: app/api/verify-intern/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import puppeteer from "puppeteer";

interface VerifyInternRequestBody {
  linkedinUrl: string;
}

export async function POST(req: NextRequest) {
  // 1) Ensure the user is signed in
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // 2) Parse the incoming URL
  let body: VerifyInternRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { linkedinUrl } = body;
  if (typeof linkedinUrl !== "string") {
    return NextResponse.json({ error: "Missing linkedinUrl" }, { status: 400 });
  }

  let browser;
  try {
    // 3) Launch Puppeteer to fetch the live page
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) " +
        "Chrome/114.0.0.0 Safari/537.36"
    );
    await page.goto(linkedinUrl, {
      waitUntil: "domcontentloaded",
      timeout: 10000,
    });

    // 5) Grab raw HTML and scrape the companies using the new selector
    const companies = await page.$$eval(
      ".experience__list > li div h4",
      (nodes) => nodes.map((h4) => h4.textContent?.trim() ?? "")
    );

    await browser.close();

    // 6) Check for exact "Google" match (case-insensitive)
    const verification = companies.some(
      (company) => company.toLowerCase() === "google"
    )
      ? "VERIFIED"
      : "UNVERIFIED";

    // 7) Return rawHtml + scraped companies + verification
    return NextResponse.json({ verification });
  } catch (e: unknown) {
    if (browser) await browser.close();
    console.error("Scraping error:", e);
    let message = "Unknown error";
    if (e instanceof Error) {
      message = e.message;
    }
    return NextResponse.json(
      { error: "Failed to scrape LinkedIn", details: message },
      { status: 502 }
    );
  }
}
