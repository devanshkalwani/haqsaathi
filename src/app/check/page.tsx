"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AREAS, CATEGORIES, FLAGS, GENDERS, INCOMES, OCCUPATIONS, STATES } from "@/data/options";
import { useLang, type UIKey } from "@/lib/i18n";
import { storage } from "@/lib/storage";
import type { Flag, Profile } from "@/lib/types";
import OptionIcon from "@/components/Icon";
import { Check } from "lucide-react";

/** The quiz: one simple question per screen, big buttons. */

type Draft = Partial<Profile> & { flags: Flag[] };

const STEPS: { key: keyof Profile; q: UIKey; hint?: UIKey }[] = [
  { key: "age", q: "q_age", hint: "q_age_hint" },
  { key: "gender", q: "q_gender" },
  { key: "area", q: "q_area" },
  { key: "state", q: "q_state" },
  { key: "occupation", q: "q_occupation" },
  { key: "income", q: "q_income", hint: "q_income_hint" },
  { key: "category", q: "q_category" },
  { key: "flags", q: "q_flags", hint: "q_flags_hint" },
];

export default function CheckPage() {
  const { t, tr } = useLang();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({ flags: [] });

  // If the user answered before, start with their old answers.
  useEffect(() => {
    const old = storage.getProfile();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (old) setDraft(old);
  }, []);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const canContinue = (() => {
    const v = draft[current.key];
    if (current.key === "flags") return true;
    if (current.key === "age") return typeof v === "number" && v > 0 && v < 120;
    return v !== undefined && v !== "";
  })();

  const set = <K extends keyof Profile>(key: K, value: Profile[K]) => setDraft((d) => ({ ...d, [key]: value }));

  // Pick an option and move on automatically, so it feels quick.
  const pick = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    set(key, value);
    setTimeout(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 180);
  };

  const toggleFlag = (f: Flag) =>
    setDraft((d) => ({ ...d, flags: d.flags.includes(f) ? d.flags.filter((x) => x !== f) : [...d.flags, f] }));

  const finish = () => {
    storage.setProfile(draft as Profile);
    router.push("/results");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-extrabold">{t("quiz_title")}</h1>

      {/* Progress */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-500">
          <span>
            {t("quiz_step")} {step + 1} {t("quiz_of")} {STEPS.length}
          </span>
          <span>{Math.round(((step + 1) / STEPS.length) * 100)}%</span>
        </div>
        <div className="mt-2 h-2.5 rounded-full bg-gray-200">
          <div
            className="h-2.5 rounded-full bg-brand-600 transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-xl font-bold md:text-2xl">{t(current.q)}</h2>
        {current.hint && <p className="mt-1 text-sm text-gray-500">{t(current.hint)}</p>}

        <div className="mt-6">
          {current.key === "age" && (
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={119}
              autoFocus
              value={draft.age ?? ""}
              onChange={(e) => set("age", e.target.value ? Number(e.target.value) : (undefined as unknown as number))}
              onKeyDown={(e) => e.key === "Enter" && canContinue && setStep(1)}
              className="w-full rounded-2xl border-2 border-gray-200 px-5 py-4 text-3xl font-bold outline-none focus:border-brand-600"
              placeholder="25"
            />
          )}

          {current.key === "gender" && (
            <Options items={GENDERS} value={draft.gender} onPick={(v) => pick("gender", v)} tr={tr} cols={3} />
          )}
          {current.key === "area" && <Options items={AREAS} value={draft.area} onPick={(v) => pick("area", v)} tr={tr} cols={2} />}

          {current.key === "state" && (
            <select
              value={draft.state ?? ""}
              onChange={(e) => set("state", e.target.value)}
              className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-4 text-lg outline-none focus:border-brand-600"
            >
              <option value="" disabled>
                {t("q_state_pick")}
              </option>
              {STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          )}

          {current.key === "occupation" && (
            <Options items={OCCUPATIONS} value={draft.occupation} onPick={(v) => pick("occupation", v)} tr={tr} cols={2} />
          )}
          {current.key === "income" && <Options items={INCOMES} value={draft.income} onPick={(v) => pick("income", v)} tr={tr} cols={1} />}
          {current.key === "category" && (
            <Options items={CATEGORIES} value={draft.category} onPick={(v) => pick("category", v)} tr={tr} cols={1} />
          )}

          {current.key === "flags" && (
            <div className="grid gap-2">
              {FLAGS.map((f) => {
                const on = draft.flags.includes(f.id);
                return (
                  <button
                    key={f.id}
                    onClick={() => toggleFlag(f.id)}
                    aria-pressed={on}
                    className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left font-medium transition ${
                      on ? "border-brand-600 bg-brand-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 text-sm ${
                        on ? "border-brand-600 bg-brand-600 text-white" : "border-gray-300"
                      }`}
                    >
                      {on && <Check className="h-4 w-4" strokeWidth={3} />}
                    </span>
                    <OptionIcon id={f.id} className="h-5 w-5 shrink-0 text-brand-700" />
                    {tr(f.label)}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="rounded-2xl border-2 border-gray-200 px-6 py-3.5 font-semibold text-gray-700 hover:bg-gray-50"
            >
              ← {t("back")}
            </button>
          )}
          <button
            disabled={!canContinue}
            onClick={() => (isLast ? finish() : setStep((s) => s + 1))}
            className="flex-1 rounded-2xl bg-brand-700 px-6 py-3.5 text-lg font-bold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLast ? `${t("see_results")} →` : `${t("next")} →`}
          </button>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-gray-500">{t("privacy_note")}</p>
    </div>
  );
}

/** A grid of big tap-friendly option buttons. */
function Options<T extends string>({
  items,
  value,
  onPick,
  tr,
  cols,
}: {
  items: { id: T; label: { en: string; hi: string }; icon?: string }[];
  value?: T;
  onPick: (v: T) => void;
  tr: (x: { en: string; hi: string }) => string;
  cols: 1 | 2 | 3;
}) {
  const grid = { 1: "grid-cols-1", 2: "grid-cols-1 sm:grid-cols-2", 3: "grid-cols-3" }[cols];
  return (
    <div className={`grid gap-3 ${grid}`}>
      {items.map((it) => {
        const on = value === it.id;
        return (
          <button
            key={it.id}
            onClick={() => onPick(it.id)}
            aria-pressed={on}
            className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-4 text-left text-lg font-semibold transition ${
              cols === 3 ? "flex-col justify-center text-center" : ""
            } ${on ? "border-brand-600 bg-brand-50 text-brand-900" : "border-gray-200 hover:border-brand-200 hover:bg-brand-50/40"}`}
          >
            {it.icon && <OptionIcon id={it.id} className="h-7 w-7 shrink-0 text-brand-700" />}
            {tr(it.label)}
          </button>
        );
      })}
    </div>
  );
}
