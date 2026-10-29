import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ProductContext = { name: string; category: string; description: string; price: number; stock: number; reorder_level: number };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const mode = body?.mode === "admin" ? "admin" : "shop";
    const message = typeof body?.message === "string" ? body.message.trim().slice(0, 1200) : "";
    if (!message) return NextResponse.json({ error: "Enter a question first." }, { status: 400 });
    if (mode === "admin" && !(await isAdmin())) return NextResponse.json({ error: "Please sign in to use the admin assistant." }, { status: 401 });

    const products = await query<ProductContext>(
      `select name, category, description, price, stock, reorder_level from products where active = true order by name limit 100`,
    );
    let context = `ACTIVE PRODUCTS (price in INR):\n${products.map(p => `- ${p.name} | ${p.category} | ₹${p.price} | stock ${p.stock} | ${p.description}`).join("\n")}`;

    if (mode === "admin") {
      const [metrics] = await query<{ revenue: number; orders: number; pending: number; low_stock: number }>(
        `select coalesce(sum(total) filter (where status <> 'cancelled'),0)::int as revenue,
          count(*) filter (where status <> 'cancelled')::int as orders,
          count(*) filter (where status = 'placed')::int as pending,
          (select count(*)::int from products where active and stock <= reorder_level) as low_stock from orders`,
      );
      const low = products.filter(p => p.stock <= p.reorder_level).map(p => `${p.name} (stock ${p.stock}, reorder at ${p.reorder_level})`).join(", ") || "none in the first 100 active products";
      context += `\nADMIN SNAPSHOT: total revenue ₹${metrics.revenue}; non-cancelled orders ${metrics.orders}; awaiting packing ${metrics.pending}; low-stock products ${metrics.low_stock}. Products at or below configured reorder level: ${low}.`;
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      const system = mode === "admin"
        ? "You are Kadai AI, a practical assistant for a small South Indian pantry store administrator. Use only the supplied business snapshot; do not invent metrics. Give concise, actionable advice. Flag assumptions. Never claim to execute changes or orders."
        : "You are Kadai AI, a helpful shopping assistant for Kadai & Co., a South Indian pantry and kitchenware store. Recommend only products in the supplied catalog, use the listed prices, and ask a clarifying question when needed. Do not invent stock, ingredients, health benefits, delivery promises, or discounts. Keep answers concise."
      ;
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4o-mini", temperature: 0.35, max_tokens: 350,
          messages: [{ role: "system", content: `${system}\n\n${context}` }, { role: "user", content: message }] }),
        signal: AbortSignal.timeout(18000),
      });
      if (!response.ok) return NextResponse.json({ error: "The AI provider could not answer right now. Check the server AI configuration and try again." }, { status: 502 });
      const data = await response.json();
      const answer = data?.choices?.[0]?.message?.content;
      if (typeof answer !== "string" || !answer.trim()) throw new Error("Empty AI response");
      return NextResponse.json({ answer: answer.trim(), provider: "openai" });
    }

    // Useful local fallback so the assistant remains demonstrable without an API key.
    const lower = message.toLowerCase();
    if (mode === "admin") {
      const lowStock = products.filter(p => p.stock <= p.reorder_level).sort((a,b) => a.stock-b.stock).slice(0,5);
      if (/stock|restock|inventory|purchase|reorder/.test(lower)) {
        const answer = lowStock.length
          ? `Suggested inventory review:\n${lowStock.map(p => `• ${p.name}: ${p.stock} units left (${p.category}).`).join("\n")}\n\nConfirm each product's reorder level and recent sales before creating a purchase order.`
          : "No products in the current catalog snapshot are below their configured reorder levels. Review recent sales before making purchasing decisions.";
        return NextResponse.json({ answer, provider: "local" });
      }
      return NextResponse.json({ answer: "I can help prioritize low stock, explain the dashboard snapshot, and suggest next steps. Try: ‘Which products should I restock first?’ For generated business-specific recommendations, add OPENAI_API_KEY to the server environment.", provider: "local" });
    }
    const matches = products.filter(p => `${p.name} ${p.category} ${p.description}`.toLowerCase().split(/\W+/).some((w: string) => w.length > 3 && lower.includes(w)) && p.stock > 0).slice(0,4);
    if (matches.length) return NextResponse.json({ answer: `These catalog items may fit:\n${matches.map(p => `• ${p.name} — ₹${p.price} (${p.category})`).join("\n")}\n\nTell me your budget or what you plan to make, and I can narrow the choices.`, provider: "local" });
    return NextResponse.json({ answer: "I can help you find coffee and tea, spices, rice and grains, snacks, or kitchenware. Tell me what you need and your budget. Live AI recommendations can be enabled by adding OPENAI_API_KEY to the server environment.", provider: "local" });
  } catch (error) {
    console.error("Assistant route failed", error);
    return NextResponse.json({ error: "Something went wrong while preparing the answer. Please try again." }, { status: 500 });
  }
}
