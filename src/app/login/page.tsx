"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/i18n";
import { storage } from "@/lib/storage";

type Step = "email" | "code" | "name";

export default function LoginPage() {
  const { t } = useLang();
  const { available, user, sendCode, verifyCode } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already logged in (e.g. came back from the email link): ask for a name if we don't have one, else go to dashboard.
  useEffect(() => {
    if (!user) return;
    if (storage.getName()) router.replace("/dashboard");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    else setStep("name");
  }, [user, router]);

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const err = await sendCode(email.trim());
    setBusy(false);
    setError(err);
    if (!err) setStep("code");
  };

  const submitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const err = await verifyCode(email.trim(), code.trim());
    setBusy(false);
    setError(err);
  };

  const submitName = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) storage.setName(name.trim());
    router.replace(storage.getProfile() ? "/dashboard" : "/check");
  };

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--color-brand-100),_transparent_60%)]" />
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-2 md:py-16">
        {/* Left: why log in */}
        <div className="relative hidden overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-800 to-brand-600 p-10 text-white md:block">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent-400/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-brand-200/20 blur-3xl" />
          <p className="text-5xl">🤝</p>
          <h2 className="mt-6 text-3xl font-extrabold leading-tight">{t("login_title")}</h2>
          <p className="mt-3 text-white/80">{t("tagline")}</p>
          <ul className="mt-8 space-y-4">
            {(["login_perks_1", "login_perks_2", "login_perks_3"] as const).map((k, i) => (
              <li key={k} className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur">
                <span className="text-2xl">{["📱", "📋", "🔔"][i]}</span>
                <span className="font-medium">{t(k)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: the form */}
        <div className="flex flex-col justify-center rounded-[2rem] border border-black/5 bg-white p-6 shadow-xl shadow-brand-900/5 md:p-10">
          {!available ? (
            <div>
              <h1 className="text-2xl font-extrabold">{t("login_title")}</h1>
              <p className="mt-3 rounded-xl bg-amber-50 p-4 text-amber-900">{t("login_unavailable")}</p>
            </div>
          ) : step === "email" ? (
            <form onSubmit={submitEmail}>
              <h1 className="text-2xl font-extrabold md:text-3xl">{t("login_title")}</h1>
              <p className="mt-2 text-gray-600">{t("login_sub")}</p>
              <label className="mt-8 block text-sm font-semibold text-gray-700">{t("email_label")}</label>
              <input
                type="email"
                required
                autoFocus
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="mt-2 w-full rounded-2xl border-2 border-gray-200 px-5 py-4 text-lg outline-none focus:border-brand-600"
              />
              <button disabled={busy} className="mt-4 w-full rounded-2xl bg-brand-700 py-4 text-lg font-bold text-white transition hover:bg-brand-800 disabled:opacity-60">
                {busy ? t("sending") : `${t("send_code")} →`}
              </button>
            </form>
          ) : step === "code" ? (
            <form onSubmit={submitCode}>
              <p className="text-4xl">📩</p>
              <h1 className="mt-3 text-2xl font-extrabold">{t("code_label")}</h1>
              <p className="mt-2 text-gray-600">
                {t("code_sent")} <b>{email}</b>
              </p>
              <input
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="••••••"
                className="mt-6 w-full rounded-2xl border-2 border-gray-200 px-5 py-4 text-center text-3xl font-bold tracking-[0.5em] outline-none focus:border-brand-600"
              />
              <p className="mt-2 text-sm text-gray-500">{t("code_hint")}</p>
              <button
                disabled={busy || code.length < 6}
                className="mt-4 w-full rounded-2xl bg-brand-700 py-4 text-lg font-bold text-white transition hover:bg-brand-800 disabled:opacity-60"
              >
                {busy ? t("checking") : t("verify")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setCode("");
                  setError(null);
                }}
                className="mt-3 w-full text-sm font-semibold text-brand-700 hover:underline"
              >
                {t("change_email")}
              </button>
            </form>
          ) : (
            <form onSubmit={submitName}>
              <p className="text-4xl">🙏</p>
              <h1 className="mt-3 text-2xl font-extrabold">{t("name_title")}</h1>
              <input
                autoFocus
                required
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("name_ph")}
                className="mt-6 w-full rounded-2xl border-2 border-gray-200 px-5 py-4 text-lg outline-none focus:border-brand-600"
              />
              <button className="mt-4 w-full rounded-2xl bg-brand-700 py-4 text-lg font-bold text-white hover:bg-brand-800">{t("continue")} →</button>
            </form>
          )}

          {error && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">⚠️ {error}</p>}

          {step !== "name" && (
            <div className="mt-8 border-t border-gray-100 pt-6 text-center">
              <Link href="/dashboard" className="font-semibold text-gray-700 hover:text-brand-700">
                {t("continue_guest")} →
              </Link>
              <p className="mt-2 text-sm text-gray-500">{t("guest_note")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
