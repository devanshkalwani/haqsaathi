"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSpeak, useSpeechInput } from "@/lib/hooks";
import { useLang } from "@/lib/i18n";
import { PageHero } from "@/components/ui";
import { FileText, Lock, MessagesSquare, Mic, Volume2 } from "lucide-react";

type Msg = { role: "user" | "bot"; text: string; sources?: { id: string; name: string }[] };

const EXAMPLES = {
  en: ["I am a farmer, what can I get?", "Scholarship for SC students", "How to get Ayushman card?", "Pension for old age"],
  hi: ["मैं किसान हूं, मुझे क्या मिल सकता है?", "छात्रवृत्ति कैसे मिलेगी?", "आयुष्मान कार्ड कैसे बनेगा?", "बुढ़ापा पेंशन"],
};

export default function AskClient() {
  const initialQ = useSearchParams().get("q") ?? "";
  const { t, lang } = useLang();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const { speak } = useSpeak();
  const sentInitial = useRef(false);

  const onVoice = useCallback((text: string) => setInput(text), []);
  const mic = useSpeechInput(lang, onVoice);

  const send = useCallback(
    async (text: string) => {
      const q = text.trim();
      if (!q || loading) return;
      setInput("");
      setMessages((m) => [...m, { role: "user", text: q }]);
      setLoading(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ message: q, lang }),
        });
        const data = await res.json();
        setMessages((m) => [...m, { role: "bot", text: data.answer, sources: data.sources }]);
      } catch {
        setMessages((m) => [...m, { role: "bot", text: t("ask_error") }]);
      } finally {
        setLoading(false);
      }
    },
    [lang, loading, t],
  );

  // Coming from a scheme page with ?q=... asks that question straight away.
  useEffect(() => {
    if (sentInitial.current) return;
    if (initialQ) {
      sentInitial.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      send(initialQ);
    }
  }, [initialQ, send]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100vh - 4rem)" }}>
      <PageHero icon={MessagesSquare} title={t("ask_title")} sub={t("ask_sub")} narrow />
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4">

      {/* Messages */}
      <div className="mt-8 flex-1 space-y-4">
        <Bubble role="bot" text={t("ask_hello")} />

        {messages.length === 0 && (
          <div>
            <p className="mb-3 text-sm font-semibold text-muted">{t("ask_try")}:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES[lang].map((e) => (
                <button
                  key={e}
                  onClick={() => send(e)}
                  className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-fg-2 transition hover:border-link hover:text-link"
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i}>
            <Bubble role={m.role} text={m.text} onListen={m.role === "bot" ? () => speak(m.text, lang) : undefined} listenLabel={t("listen")} />
            {m.sources && m.sources.length > 0 && (
              <div className="ml-2 mt-2 flex flex-wrap gap-2">
                {m.sources.map((s) => (
                  <Link
                    key={s.id}
                    href={`/schemes/${s.id}`}
                    className="inline-flex items-center gap-1 rounded-full bg-tint px-3 py-1.5 text-xs font-semibold text-link transition hover:bg-line"
                  >
                    <FileText className="h-3.5 w-3.5" />{s.name} →
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && <p className="animate-pulse text-sm text-muted">{t("ask_thinking")}</p>}
        <div ref={endRef} />
      </div>

      {/* Input bar */}
      <div className="sticky bottom-16 mt-6 pb-2 md:bottom-4">
        {mic.listening && <p className="mb-2 text-center text-sm font-semibold text-bad">{t("mic_listening")}</p>}
        {!mic.supported && <p className="mb-2 text-center text-sm text-muted">{t("mic_unsupported")}</p>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 rounded-2xl border-2 border-line-strong bg-surface p-2 shadow-xl shadow-brand-950/5 transition focus-within:border-link dark:shadow-black/30"
        >
          <button
            type="button"
            onClick={() => (mic.listening ? mic.stop() : mic.start())}
            aria-label="Voice input"
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl transition ${
              mic.listening ? "animate-pulse bg-rose-500 text-white" : "bg-surface-2 text-fg-2 hover:bg-tint hover:text-link"
            }`}
          >
            <Mic className="h-5 w-5" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("ask_ph")}
            className="min-w-0 flex-1 bg-transparent px-2 text-lg text-fg outline-none placeholder:text-muted"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="rounded-xl bg-primary px-5 py-3 font-bold text-on-primary transition hover:bg-primary-hover disabled:opacity-40"
          >
            {t("ask_send")}
          </button>
        </form>
        <p className="mt-2 text-center text-xs text-muted"><Lock className="mr-1 inline h-3.5 w-3.5" />{t("ask_warning")}</p>
      </div>
      </div>
    </div>
  );
}

function Bubble({ role, text, onListen, listenLabel }: { role: "user" | "bot"; text: string; onListen?: () => void; listenLabel?: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-line rounded-3xl px-5 py-3 ${
          isUser ? "rounded-br-md bg-primary text-on-primary" : "rounded-bl-md border border-line bg-surface text-fg shadow-sm"
        }`}
      >
        {text}
        {onListen && (
          <button onClick={onListen} className="mt-2 block text-xs font-semibold text-link hover:underline">
            <Volume2 className="mr-1 inline h-4 w-4" />{listenLabel}
          </button>
        )}
      </div>
    </div>
  );
}
