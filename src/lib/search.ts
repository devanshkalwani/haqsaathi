import type { Scheme } from "./types";

/**
 * Simple keyword search over schemes, in English and Hindi.
 * Used by the search box and by the chat assistant to find relevant schemes.
 * Later this can be replaced by vector search (embeddings + pgvector).
 */
// Common words that don't help find a scheme.
const STOP = new Set([
  "i", "am", "a", "an", "the", "is", "are", "what", "how", "can", "get", "for", "to", "of", "in", "my", "me", "do",
  "and", "or", "about", "scheme", "schemes", "yojana", "tell", "want", "need", "which", "who", "give",
  "मैं", "मुझे", "क्या", "कैसे", "है", "हूं", "हूँ", "का", "की", "के", "को", "में", "से", "और", "योजना", "मिल", "सकता", "मिलेगा", "मिलेगी", "बनेगा",
]);

export function searchSchemes(query: string, schemes: Scheme[], limit = 5): Scheme[] {
  const words = query
    .toLowerCase()
    .split(/[\s,.?!।]+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
  if (words.length === 0) return [];

  const scored = schemes.map((s) => {
    const haystack = [
      s.name.en,
      s.name.hi,
      s.summary.en,
      s.summary.hi,
      s.benefit.en,
      s.category,
      ...s.keywords,
    ]
      .join(" ")
      .toLowerCase();
    const name = (s.name.en + " " + s.name.hi).toLowerCase();
    let score = 0;
    for (const w of words) {
      if (name.includes(w)) score += 3;
      else if (s.keywords.some((k) => k.toLowerCase() === w)) score += 2;
      else if (haystack.includes(w)) score += 1;
    }
    return { s, score };
  });

  return scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.s);
}
