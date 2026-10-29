"use client";

import { FormEvent, useState } from "react";

type Message = { role: "assistant" | "user"; content: string };

export default function KadaiAssistant({ mode = "shop" }: { mode?: "shop" | "admin" }) {
  const [open, setOpen] = useState(mode === "admin");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [provider, setProvider] = useState<"openai" | "local" | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: mode === "admin"
      ? "I can help review inventory priorities and interpret your store snapshot. What should we look at?"
      : "Looking for something for your kitchen? Tell me what you need, your taste, or your budget." },
  ]);

  async function send(e?: FormEvent, prompt?: string) {
    e?.preventDefault();
    const text = (prompt ?? input).trim();
    if (!text || busy) return;
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setInput(""); setBusy(true);
    try {
      const res = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode, message: text }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not get an answer.");
      setProvider(data.provider === "openai" ? "openai" : "local");
      setMessages(prev => [...prev, { role: "assistant", content: data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: err instanceof Error ? err.message : "Please try again." }]);
    } finally { setBusy(false); }
  }

  const suggestions = mode === "admin"
    ? ["What should I restock first?", "Give me 3 actions for today."]
    : ["Help me choose filter coffee", "Find snacks under ₹300"];

  return (
    <div className={mode === "admin" ? "ai-panel" : "ai-float"}>
      {open ? <section className="ai-window" aria-label={mode === "admin" ? "Kadai admin AI assistant" : "Kadai shopping assistant"}>
        <header className="ai-head">
          <div className="flex items-center gap-3">
            <span className="ai-orb" aria-hidden>✦</span>
            <div><p className="font-semibold">Kadai AI</p><p className="text-xs text-white/70">{mode === "admin" ? "Store operations assistant" : "Your pantry shopping guide"}</p></div>
          </div>
          {mode === "shop" && <button type="button" className="ai-close" onClick={() => setOpen(false)} aria-label="Close assistant">×</button>}
        </header>
        <div className="ai-messages" aria-live="polite">
          {messages.map((m, i) => <div key={i} className={`ai-message ${m.role === "user" ? "ai-user" : "ai-bot"}`}><span>{m.content}</span></div>)}
          {busy && <div className="ai-message ai-bot"><span className="ai-dots">Thinking<span>.</span><span>.</span><span>.</span></span></div>}
        </div>
        <div className="ai-suggestions">{suggestions.map(s => <button key={s} type="button" onClick={() => void send(undefined, s)} disabled={busy}>{s}</button>)}</div>
        <form onSubmit={send} className="ai-compose">
          <label className="sr-only" htmlFor={`ai-input-${mode}`}>Message Kadai AI</label>
          <input id={`ai-input-${mode}`} value={input} onChange={e => setInput(e.target.value)} placeholder={mode === "admin" ? "Ask about stock or sales…" : "Ask about products…"} maxLength={1200} />
          <button type="submit" disabled={busy || !input.trim()} aria-label="Send message">↑</button>
        </form>
        <p className="ai-footnote">{provider === "openai" ? "AI-generated · verify important decisions" : "Catalog-grounded demo · add OPENAI_API_KEY for live AI"}</p>
      </section> : <button type="button" className="ai-launch" onClick={() => setOpen(true)}><span className="ai-orb">✦</span><span>Ask Kadai AI</span></button>}
    </div>
  );
}
