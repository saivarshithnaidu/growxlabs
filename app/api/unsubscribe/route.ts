import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email")?.trim().toLowerCase();

    if (!email) {
      return new NextResponse(
        `<html>
          <body style="background-color: #0d0d0d; color: #f5f3ee; font-family: sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #CC1F1F;">Error</h1>
            <p>Invalid unsubscribe request.</p>
          </body>
        </html>`,
        { headers: { "Content-Type": "text/html" }, status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("wish_subscribers")
      .delete()
      .eq("email", email);

    if (error) {
      console.error("Unsubscribe error:", error);
      return new NextResponse(
        `<html>
          <body style="background-color: #0d0d0d; color: #f5f3ee; font-family: sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #CC1F1F;">Error</h1>
            <p>Could not process your unsubscription request at this time.</p>
          </body>
        </html>`,
        { headers: { "Content-Type": "text/html" }, status: 500 }
      );
    }

    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Unsubscribed Successfully</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              background-color: #0d0d0d;
              color: #f5f3ee;
              font-family: 'Courier New', Courier, monospace;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
              box-sizing: border-box;
            }
            .container {
              max-width: 500px;
              width: 100%;
              text-align: center;
              border: 1px solid #27272a;
              border-radius: 8px;
              padding: 40px;
              background-color: #121212;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            }
            h1 {
              color: #CC1F1F;
              font-size: 24px;
              margin-bottom: 20px;
              letter-spacing: 1px;
            }
            p {
              color: #a1a1aa;
              font-size: 15px;
              line-height: 1.6;
              margin-bottom: 30px;
            }
            .divider {
              border: none;
              border-top: 1px double #CC1F1F;
              margin: 30px 0;
            }
            .footer {
              color: #71717a;
              font-size: 11px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>You have been unsubscribed successfully</h1>
            <p>Your details have been removed from the One Wish Willow directory. You will no longer receive notifications of new blog posts.</p>
            <div class="divider"></div>
            <div class="footer">GrowX Labs | AI Engineering & Software</div>
          </div>
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (error) {
    console.error("Unsubscribe API catch error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
