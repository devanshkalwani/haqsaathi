"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { storage } from "./storage";
import type { Lang } from "./types";

/** Saved schemes, kept in localStorage and shared across the page. */
export function useSaved() {
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaved(storage.getSaved());
    // Keep several components in sync when one changes the list.
    const sync = () => setSaved(storage.getSaved());
    window.addEventListener("hs-saved-change", sync);
    return () => window.removeEventListener("hs-saved-change", sync);
  }, []);

  const toggle = useCallback((id: string) => {
    const current = storage.getSaved();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    storage.setSaved(next);
    window.dispatchEvent(new Event("hs-saved-change"));
  }, []);

  return { saved, toggle, isSaved: (id: string) => saved.includes(id) };
}

/* ---------- Voice input (speech to text) using the browser's Web Speech API ---------- */

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

export function useSpeechInput(lang: Lang, onText: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recRef = useRef<SpeechRecognitionLike | null>(null);

  const start = useCallback(() => {
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) {
      setSupported(false);
      return;
    }
    const rec = new Ctor();
    rec.lang = lang === "hi" ? "hi-IN" : "en-IN";
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (e) => {
      const text = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join(" ");
      onText(text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    rec.start();
  }, [lang, onText]);

  const stop = useCallback(() => {
    recRef.current?.stop();
    setListening(false);
  }, []);

  return { listening, supported, start, stop };
}

/* ---------- Read text aloud (text to speech), helpful for people who find reading hard ---------- */

export function useSpeak() {
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback((text: string, lang: Lang) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "hi" ? "hi-IN" : "en-IN";
    u.rate = 0.95;
    u.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  return { speaking, speak, stop };
}

/** Format rupees the Indian way: 1,20,000 */
export function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}
