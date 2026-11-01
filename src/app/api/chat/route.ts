import { getSchemes } from "@/lib/data";
import { searchSchemes } from "@/lib/search";
import type { Lang, Scheme } from "@/lib/types";

/**
 * POST /api/chat  { message: string, lang: "en" | "hi" }
 *
 * How it works (RAG = Retrieval-Augmented Generation):
 * 1. Find the most relevant schemes from OUR verified data.
 * 2. If an AI key is set, ask the AI to answer ONLY from those schemes.
 * 3. If no key is set, reply with a simple answer built from the data (works offline for development).
 */

type Body = { message?: string; lang?: Lang };

export async function POST(req: Request) {
  const { message = "", lang = "en" } = (await req.json()) as Body;
  const question = message.trim().slice(0, 1000);
  if (!question) return Response.json({ answer: "", sources: [] }, { status: 400 });

  const found = searchSchemes(question, await getSchemes(), 3);
  const sources = found.map((s) => ({ id: s.id, name: s.name[lang] }));

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (apiKey && found.length > 0) {
    try {
      const answer = await askClaude(apiKey, question, found, lang);
      return Response.json({ answer, sources });
    } catch (err) {
      console.error("AI request failed, using simple answer instead:", err);
    }
  }

  return Response.json({ answer: simpleAnswer(found, lang), sources });
}

/** Builds a clear answer from our data, without AI. */
function simpleAnswer(found: Scheme[], lang: Lang): string {
  if (found.length === 0) {
    return lang === "hi"
      ? "माफ़ कीजिए, इस बारे में मेरे पास अभी सत्यापित जानकारी नहीं है। 'लाभ जांचें' से अपनी योजनाएं देखें, या अपना काम, उम्र और राज्य बताकर पूछें।"
      : "Sorry, I don't have verified information on that yet. Try 'Check Benefits' to see your schemes, or tell me your work, age and state.";
  }
  const intro = lang === "hi" ? "ये योजनाएं आपके सवाल से जुड़ी हैं:" : "These schemes match your question:";
  const parts = found.map((s) => `• ${s.name[lang]}: ${s.summary[lang]} ${s.benefit[lang]}`);
  const outro =
    lang === "hi" ? "पूरी जानकारी और आवेदन का तरीका नीचे दिए लिंक पर देखें।" : "Tap a scheme below for documents and steps to apply.";
  return [intro, ...parts, outro].join("\n\n");
}

/** Calls the Claude API with strict rules so it never makes things up. */
async function askClaude(apiKey: string, question: string, found: Scheme[], lang: Lang): Promise<string> {
  const context = found
    .map(
      (s) =>
        `SCHEME: ${s.name.en}\nSummary: ${s.summary.en}\nBenefit: ${s.benefit.en}\nWho can apply: ${s.whoCanApply
          .map((w) => w.en)
          .join("; ")}\nHow to apply: ${s.howToApply.map((h) => h.en).join(" ")}\nOfficial link: ${s.applyLink}`,
    )
    .join("\n\n");

  const system = `You are Saathi, a friendly helper for HaqSaathi, an independent (non-government) website that explains Indian government schemes.
Rules:
- Answer ONLY using the scheme information given below. If the answer is not there, say you don't know and suggest the official helpline or website.
- Use short, simple sentences that someone who studied up to Class 8 can understand.
- Reply in ${lang === "hi" ? "simple Hindi (Devanagari script)" : "simple English"}.
- Never ask for Aadhaar number, OTP, bank PIN or passwords.
- Keep answers under 120 words.

SCHEME INFORMATION:
${context}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
      max_tokens: 500,
      system,
      messages: [{ role: "user", content: question }],
    }),
  });
  if (!res.ok) throw new Error(`Claude API error ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { content: { type: string; text?: string }[] };
  return data.content.map((c) => c.text ?? "").join("").trim();
}
