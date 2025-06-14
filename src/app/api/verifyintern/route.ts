// File: app/api/verify-intern/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
  // 1) Ensure the user is signed in
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // 2) Parse the incoming URL
  let body: any;
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
      headless: false,
      devtools: true,
      slowMo: 100,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) " +
        "Chrome/114.0.0.0 Safari/537.36"
    );
    await page.goto(linkedinUrl, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // 4) Wait for Experience (if visible)
    await page
      .waitForSelector('section[aria-label="Experience"], .experience-section', {
        timeout: 10000,
      })
      .catch(() => {});

    // 5) Grab raw HTML and scrape the <li> entries
    const rawHtml = await page.content();
    const experiences = await page.$$eval(
      'section[aria-label="Experience"] li, .experience-section li',
      (nodes) =>
        nodes.map((li) => {
          const titleEl = li.querySelector("h3 span");
          const compEl = li.querySelector(
            "p.pv-entity__secondary-title, .pv-entity__company-summary-info a"
          );
          const datesEl = li.querySelector(
            "h4 span:nth-child(2), .pv-entity__date-range span:nth-child(2)"
          );
          return {
            title: titleEl?.textContent?.trim() ?? "",
            company: compEl?.textContent?.trim() ?? "",
            dates: datesEl?.textContent?.trim() ?? "",
          };
        })
    );

    await browser.close();

    // 6) Check for “Google”
    const verification = experiences.some((xp) =>
      xp.company.toLowerCase().includes("google")
    )
      ? "VERIFIED"
      : "NOT VERIFIED";

    // 7) Return rawHtml + scraped experiences + verification
    return NextResponse.json({ rawHtml, experiences, verification });
  } catch (e: any) {
    if (browser) await browser.close();
    console.error("Scraping error:", e);
    return NextResponse.json(
      { error: "Failed to scrape LinkedIn", details: e.message },
      { status: 502 }
    );
  }
}
