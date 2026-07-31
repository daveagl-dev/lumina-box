import { useState } from "react";
import { Bot, SendHorizontal } from "lucide-react";

export default function AngelaChat() {
  const [messages, setMessages] = useState([
    { from: "angela", text: "Hi, I'm Angela! Need help finding a file?" },
  ]);
  const [input, setInput] = useState("");

  function sendMessage(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { from: "me", text }]);
    setInput("");
  }

  return (
    <div className="mt-auto flex shrink-0 flex-col rounded-2xl border border-slate-100 bg-slate-50">
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-coral text-white">
          <Bot size={15} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-800">Angela</p>
          <p className="text-[11px] text-emerald-500">● Online</p>
        </div>
      </div>

      <div className="flex h-16 flex-col justify-end gap-1.5 overflow-hidden px-4 py-2">
        {messages.slice(-2).map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] truncate rounded-xl px-3 py-1.5 text-xs ${
              m.from === "angela"
                ? "self-start bg-white text-slate-600 shadow-sm"
                : "self-end bg-coral text-white"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <form
        onSubmit={sendMessage}
        className="flex min-w-0 items-center gap-2 border-t border-slate-100 px-3 py-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Angela..."
          className="min-w-0 flex-1 bg-transparent px-1 text-xs text-slate-600 placeholder:text-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-coral text-white transition hover:bg-coral/90"
        >
          <SendHorizontal size={16} />
        </button>
      </form>
    </div>
  );
}
