import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // 1. Check Cloudflare header
  const cfCountry = request.headers.get("cf-ipcountry");
  
  if (cfCountry) {
    return NextResponse.json({ country: cfCountry });
  }

  // 2. Fallback: ip-api (Using a timeout to prevent slow loads)
  try {
    const res = await fetch("http://ip-api.com/json/", { next: { revalidate: 3600 } });
    const data = await res.json();
    return NextResponse.json({ country: data.countryCode || "US" });
  } catch (error) {
    return NextResponse.json({ country: "US" });
  }
}
