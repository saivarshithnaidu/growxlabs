import { NextResponse } from "next/server";
 
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    if (!url) {
      return new Response("Missing url parameter", { status: 400 });
    }
 
    const response = await fetch(url);
    if (!response.ok) {
      return new Response(`Failed to fetch image: ${response.statusText}`, { status: response.status });
    }
 
    const blob = await response.blob();
    const contentType = response.headers.get("content-type") || "image/png";
 
    return new Response(blob, {
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=86400"
      }
    });
  } catch (error: any) {
    console.error("Proxy Image Error:", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}
