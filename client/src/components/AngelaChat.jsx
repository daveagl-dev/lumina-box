import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Bot, SendHorizontal, X, SquarePen, Copy, Check, RefreshCw, Sparkles } from "lucide-react";
import { sendChat } from "../lib/api";
import { useLanguage } from "../lib/i18n";

const SUGGESTIONS = ["angelaSuggestion1", "angelaSuggestion2", "angelaSuggestion3"];

const markdownComponents = {
  p: (props) => <p className="mb-2 last:mb-0" {...props} />,
  ul: (props) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0" {...props} />,
  ol: (props) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0" {...props} />,
  strong: (props) => <strong className="font-semibold text-slate-800" {...props} />,
  a: (props) => <a className="text-coral underline" target="_blank" rel="noreferrer" {...props} />,
  code: (props) => <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[0.85em]" {...props} />,
  pre: (props) => <pre className="mb-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100 last:mb-0 [&_code]:bg-transparent [&_code]:p-0" {...props} />,
  h1: (props) => <h3 className="mb-1 font-semibold text-slate-800" {...props} />,
  h2: (props) => <h3 className="mb-1 font-semibold text-slate-800" {...props} />,
  h3: (props) => <h3 className="mb-1 font-semibold text-slate-800" {...props} />,
};

function AngelaAvatar() {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-coral text-white">
      <Bot size={14} />
    </div>
  );
}

// Floating chat window, opened by the "ask-angela" event from the header button
export default function AngelaChat() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const inputRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    const open = () => {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 0);
    };
    window.addEventListener("ask-angela", open);
    return () => window.removeEventListener("ask-angela", open);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSending, hasError, isOpen]);

  // Grow the textarea with its content, up to a few lines
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input, isOpen]);

  async function ask(history) {
    setMessages(history);
    setHasError(false);
    setIsSending(true);
    try {
      const { reply } = await sendChat(history);
      setMessages([...history, { role: "assistant", content: reply }]);
    } catch {
      setHasError(true);
    } finally {
      setIsSending(false);
    }
  }

  function send(text) {
    const content = text.trim();
    if (!content || isSending) return;
    setInput("");
    ask([...messages, { role: "user", content }]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    send(input);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send(input);
    }
  }

  // Re-ask the last question (drops the last answer first, if there is one)
  function regenerate() {
    if (isSending) return;
    const history = messages[messages.length - 1]?.role === "assistant" ? messages.slice(0, -1) : messages;
    if (history.length) ask(history);
  }

  function newChat() {
    setMessages([]);
    setInput("");
    setHasError(false);
    setIsSending(false);
    inputRef.current?.focus();
  }

  async function copy(text, index) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex((c) => (c === index ? null : c)), 1500);
    } catch {
      // clipboard unavailable
    }
  }

  if (!isOpen) return null;

  const lastIndex = messages.length - 1;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-3 backdrop-blur-sm"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="flex h-[28rem] max-h-[80vh] w-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl sm:w-96 2xl:h-[40rem] 2xl:w-[34rem] min-[2000px]:h-[48rem] min-[2000px]:w-[42rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-coral text-white">
            <Bot size={17} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-800">Angela</p>
            <p className="text-[11px] text-emerald-500">● {t("online")}</p>
          </div>
          <button
            onClick={newChat}
            disabled={messages.length === 0 && !input}
            title={t("newChat")}
            aria-label={t("newChat")}
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <SquarePen size={17} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            title={t("close")}
            aria-label={t("close")}
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto bg-slate-50 px-4 py-4">
          {messages.length === 0 ? (
            <div className="m-auto flex w-full flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-coral/10 text-coral">
                <Sparkles size={22} />
              </div>
              <p className="max-w-xs text-sm text-slate-600">{t("angelaGreeting")}</p>
              <div className="flex w-full flex-col gap-2">
                {SUGGESTIONS.map((key) => (
                  <button
                    key={key}
                    onClick={() => send(t(key))}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-600 shadow-sm transition hover:border-coral hover:text-coral"
                  >
                    {t(key)}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) =>
              m.role === "user" ? (
                <div
                  key={i}
                  className="max-w-[85%] self-end whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-coral px-3.5 py-2 text-sm text-white"
                >
                  {m.content}
                </div>
              ) : (
                <div key={i} className="flex items-start gap-2">
                  <AngelaAvatar />
                  <div className="min-w-0 max-w-[85%]">
                    <div className="break-words rounded-2xl rounded-tl-md bg-white px-3.5 py-2 text-sm text-slate-600 shadow-sm">
                      <ReactMarkdown components={markdownComponents}>{m.content}</ReactMarkdown>
                    </div>
                    <div className="mt-1 flex gap-1 text-slate-400">
                      <button
                        onClick={() => copy(m.content, i)}
                        title={t("copy")}
                        aria-label={t("copy")}
                        className="rounded-md p-1 transition hover:bg-slate-200/60 hover:text-slate-600"
                      >
                        {copiedIndex === i ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      </button>
                      {i === lastIndex && (
                        <button
                          onClick={regenerate}
                          disabled={isSending}
                          title={t("regenerate")}
                          aria-label={t("regenerate")}
                          className="rounded-md p-1 transition hover:bg-slate-200/60 hover:text-slate-600 disabled:opacity-40"
                        >
                          <RefreshCw size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            )
          )}

          {isSending && (
            <div className="flex items-start gap-2" aria-label={t("angelaTyping")}>
              <AngelaAvatar />
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-white px-3.5 py-3 shadow-sm">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          )}

          {hasError && !isSending && (
            <div className="flex items-center gap-2 self-start rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">
              {t("angelaError")}
              <button onClick={regenerate} className="font-semibold underline">
                {t("retry")}
              </button>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form onSubmit={handleSubmit} className="border-t border-slate-100 bg-white px-3 py-3">
          <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-white py-1.5 pl-3.5 pr-1.5 transition focus-within:border-coral focus-within:ring-2 focus-within:ring-coral/20">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={2000}
              placeholder={t("askAngelaPlaceholder")}
              className="max-h-[120px] min-w-0 flex-1 resize-none bg-transparent py-1.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              aria-label={t("send")}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-coral text-white transition hover:bg-coral/90 disabled:opacity-40"
            >
              <SendHorizontal size={16} />
            </button>
          </div>
          <p className="mt-1.5 text-center text-[11px] text-slate-400">{t("angelaDisclaimer")}</p>
        </form>
      </div>
    </div>
  );
}
