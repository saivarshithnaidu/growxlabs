import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, phone, service, budget, tasks, chatHistory, turnstileToken } = body;
    
    // 1. Bot Protection (Turnstile)
    if (process.env.TURNSTILE_SECRET_KEY && turnstileToken) {
      const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
        }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        return NextResponse.json(
          { error: "Security check failed. Please refresh and try again." },
          { status: 403 }
        );
      }
    }

    // 2. Basic Validation
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and Email are required fields" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // 3. Format dynamic AI details if available
    let finalMessage = message || "";
    
    if (chatHistory && chatHistory.length > 0) {
      // Build a premium formatted AI brief
      const serviceLabels: Record<string, string> = {
        website: "Website Development",
        automation: "Workflow Automation",
        hosting: "Hosting & Maintenance",
        ai: "AI Integrations",
        bundle: "Full Bundle (Multi-Service)"
      };

      const budgetLabels: Record<string, string> = {
        "under-15k": "Under INR 15,000",
        "15k-35k": "INR 15,000 - INR 35,000",
        "35k-70k": "INR 35,000 - INR 70,000",
        "above-70k": "Above INR 70,000",
        "overseas": "Overseas (USD pricing)"
      };

      const displayService = serviceLabels[service] || service || "Not specified";
      const displayBudget = budgetLabels[budget] || budget || "Not specified";

      let tasksMarkdown = "";
      if (tasks && Array.isArray(tasks)) {
        tasksMarkdown = tasks.map((t: any) => {
          const subtasksStr = t.subtasks?.map((st: any) => `  - [ ] ${st.title} (${st.priority} priority) - ${st.description}`).join("\n") || "";
          return `### 📍 ${t.title}\n*${t.description}*\n${subtasksStr}`;
        }).join("\n\n");
      }

      const transcriptMarkdown = chatHistory.map((h: any) => {
        return `**${h.role === "user" ? "Client" : "GXL Architect"}**: ${h.content}`;
      }).join("\n\n");

      finalMessage = `### 🤖 AI Strategy Blueprint
- **Inferred Service:** ${displayService}
- **Estimated Budget:** ${displayBudget}
- **Lead Phone:** ${phone || "Not provided"}

---

### 📝 Project Brief & Concept
${message || "Details gathered via AI Strategy conversation."}

---

### 🗺️ Live Generated Development Roadmap
${tasksMarkdown || "*No roadmap generated.*"}

---

### 💬 Conversational Transcript
${transcriptMarkdown}`;
    }

    // Prepare lead payload matching DB schema
    const leadPayload: any = {
      name,
      email,
      message: finalMessage,
      phone: phone || null,
      status: "new",
      source: chatHistory ? "AI Strategy Builder" : "Standard Contact Form",
      lead_score: chatHistory ? 7 : 4 // Rate AI leads higher due to structured brief
    };

    // If there is business_name field, we map it or default it to name
    leadPayload.business_name = name;

    const { error } = await supabaseAdmin.from("leads").insert([leadPayload]);

    if (error) {
      console.error("Error submitting lead to Supabase:", error);
      return NextResponse.json(
        { error: "Failed to save lead in database." },
        { status: 500 }
      );
    }

    // 4. Return Success Response
    return NextResponse.json(
      { message: "Message received successfully. We will be in touch soon!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
