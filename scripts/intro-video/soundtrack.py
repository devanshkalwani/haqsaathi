"""
Soundtrack for the 12-second HaqSaathi intro, synthesised from scratch (no samples, no licences).

One calm, consistent voice from start to end: a bansuri (bamboo flute) melody in raag Bhupali
(Sa Re Ga Pa Dha, Sa = D) over a soft tanpura drone and a warm, low string pad.
No percussion, bells or sound effects, so nothing jumps out.

  0.3-3.4   opening phrase, calm (the people who miss out)
  3.7-6.4   the phrase rises (answering the questions)
  6.7-9.6   brighter, reaching up (seeing the schemes, the documents)
  9.9-12    the flute settles on high Sa as the logo appears, and fades

Usage: python3 soundtrack.py out.wav   (needs numpy)
"""

import sys
import wave

import numpy as np

SR = 44100
DUR = 12.0
N = int(SR * DUR)
t = np.arange(N) / SR
rng = np.random.default_rng(11)

SA = 146.83  # D3
R = {"Dha_": 5 / 6, "Sa": 1.0, "Re": 9 / 8, "Ga": 5 / 4, "Pa": 3 / 2, "Dha": 5 / 3, "Sa'": 2.0, "Re'": 9 / 4}


# ---------------------------------------------------------------- helpers
def place(buf, sig, start, gain=1.0, pan=0.0):
    i = int(start * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    lg, rg = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[0, i : i + len(sig)] += sig * lg
    buf[1, i : i + len(sig)] += sig * rg


def fft_filter(x, lo=None, hi=None):
    """Zero-phase band filter with soft edges (good enough for noise shaping and EQ)."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    g = np.ones_like(f)
    if hi:
        g *= 1 / (1 + (f / hi) ** 4)
    if lo:
        g *= 1 / (1 + (lo / np.maximum(f, 1e-3)) ** 4)
    return np.fft.irfft(X * g, len(x))


def smooth_env(n, attack, release):
    tt = np.arange(n) / SR
    a = np.clip(tt / attack, 0, 1)
    r = np.clip((n / SR - tt) / release, 0, 1)
    return np.sin(a * np.pi / 2) ** 2 * np.sin(r * np.pi / 2) ** 2


# ---------------------------------------------------------------- instruments
def tanpura(freq, length=3.6):
    """Soft tanpura string: rich but rounded harmonics that bloom slowly (no harsh buzz)."""
    n = int(length * SR)
    tt = np.arange(n) / SR
    out = np.zeros(n)
    for h in range(1, 13):
        amp = 1 / h**1.2
        bloom = 1 - np.exp(-tt * (1.5 + h * 0.5))
        decay = np.exp(-tt * (0.55 + h * 0.16))
        out += amp * bloom * decay * np.sin(2 * np.pi * freq * h * (1 + rng.normal(0, 0.0004)) * tt + rng.random() * 6.28)
    return out * np.clip(tt / 0.02, 0, 1) / 3


def santoor(freq, length=1.8, bright=1.0):
    n = int(length * SR)
    tt = np.arange(n) / SR
    out = np.zeros(n)
    for course in (1.0, 1.003):
        for h, amp, dk in ((1, 1.0, 2.2), (2, 0.45 * bright, 3.4), (3, 0.22 * bright, 5.0), (4.07, 0.08 * bright, 8.0)):
            out += amp * np.exp(-tt * dk) * np.sin(2 * np.pi * freq * course * h * tt)
    mallet = fft_filter(rng.normal(0, 1, n), lo=1500, hi=6000) * np.exp(-tt * 250) * 0.12
    return (out + mallet) * np.clip(tt / 0.002, 0, 1) * 0.5


def bell(freq, length=3.5):
    n = int(length * SR)
    tt = np.arange(n) / SR
    out = np.zeros(n)
    for ratio, amp, dk in ((1, 1, 0.9), (2.0, 0.35, 1.6), (2.76, 0.3, 2.2), (5.4, 0.12, 4), (8.93, 0.05, 7)):
        out += amp * np.exp(-tt * dk) * np.sin(2 * np.pi * freq * ratio * tt)
    return out * np.clip(tt / 0.003, 0, 1) * 0.6


def pad(freqs, length, attack=1.0, release=1.5):
    """Warm string-like pad: detuned voices, low-passed, slow movement."""
    n = int(length * SR)
    tt = np.arange(n) / SR
    out = np.zeros(n)
    for f in freqs:
        for det in (-0.003, 0.0, 0.0035):
            ph = 2 * np.pi * f * (1 + det) * tt + 0.15 * np.sin(2 * np.pi * 0.17 * tt + det * 900)
            out += np.sin(ph) + 0.3 * np.sin(2 * ph) + 0.1 * np.sin(3 * ph)
    out = fft_filter(out, hi=1800) / (len(freqs) * 3)
    return out * smooth_env(n, attack, release)


def bansuri(notes, length, attack=0.6, release=0.9):
    """
    Bamboo flute. `notes` = list of (start_s, note_name, glide_s); each note holds until the next.
    Pitch glides (meend) between notes, delayed vibrato, breath noise that follows the tone.
    """
    n = int(length * SR)
    tt = np.arange(n) / SR
    freq = np.zeros(n)
    since = np.zeros(n)  # time since the current note started (for vibrato onset)
    prev = None
    for i, (st, name, glide) in enumerate(notes):
        end = notes[i + 1][0] if i + 1 < len(notes) else length
        a, b = int(st * SR), int(end * SR)
        target = SA * 2 * R[name]
        seg = np.full(b - a, target)
        if prev is not None and glide > 0:
            g = min(b - a, int(glide * SR))
            x = np.linspace(0, 1, g)
            seg[:g] = prev * (target / prev) ** (x * x * (3 - 2 * x))
        freq[a:b] = seg
        since[a:b] = np.arange(b - a) / SR
        prev = target
    vib_depth = 0.006 * np.clip((since - 0.35) / 0.4, 0, 1)
    freq = freq * (1 + vib_depth * np.sin(2 * np.pi * 5.3 * tt))
    ph = 2 * np.pi * np.cumsum(freq) / SR
    tone = np.sin(ph) + 0.18 * np.sin(2 * ph) + 0.06 * np.sin(3 * ph)
    breath = fft_filter(rng.normal(0, 1, n), lo=900, hi=3200)
    breath /= np.max(np.abs(breath))
    amp = np.ones(n)
    for st, _, _ in notes[1:]:  # small dip at each new note, like a tongued articulation
        amp *= 1 - 0.25 * np.exp(-(((tt - st) / 0.05) ** 2))
    env = smooth_env(n, attack, release) * amp * (1 + 0.05 * np.sin(2 * np.pi * 0.7 * tt))
    return (tone * 0.9 + breath * 0.1) * env


def thump(length=0.7, f0=88, soft=1.0):
    """Tabla bayan-like bass: sine with a falling pitch and a soft attack."""
    n = int(length * SR)
    tt = np.arange(n) / SR
    f = f0 * (1 + 0.6 * np.exp(-tt * 25))
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 6) * np.clip(tt / (0.004 * soft), 0, 1)
    return s


def riser(length):
    """Smooth airy swell: noise whose band opens up, plus a rising sine shimmer."""
    n = int(length * SR)
    tt = np.arange(n) / SR
    x = tt / length
    noise = rng.normal(0, 1, n)
    out = np.zeros(n)
    bands = [(200, 900), (500, 1800), (1000, 3200)]  # cross-fade bands = opening filter
    for k, (lo, hi) in enumerate(bands):
        w = np.clip(1 - np.abs(x * (len(bands) - 1) - k), 0, 1)
        out += fft_filter(noise, lo=lo, hi=hi) * w
    out /= np.max(np.abs(out))
    shimmer = np.sin(2 * np.pi * np.cumsum(SA * 4 * (1 + 0.5 * x**2)) / SR) * 0.15
    return (out * 0.8 + shimmer) * np.sin(np.pi * np.clip(x, 0, 1)) ** 2


# ---------------------------------------------------------------- arrangement
dry = np.zeros((2, N))

# Tanpura: Pa, Sa', Sa', Sa every 0.85 s, steady the whole way through
pattern = [SA * R["Pa"] / 2, SA, SA, SA / 2]
for k, st in enumerate(np.arange(0.0, DUR, 0.85)):
    g = 0.24 * min(1.0, 0.55 + st / 1.5)
    place(dry, tanpura(pattern[k % 4]), st, g, pan=[-0.35, 0.15, 0.3, -0.1][k % 4])

# Warm pad under everything: open fifth, then a gentle major colour for the second half
place(dry, pad([SA / 2, SA * R["Pa"] / 2, SA], 7.2, attack=1.6, release=2.0), 0.0, 0.2)
place(dry, pad([SA / 2, SA, SA * R["Ga"], SA * R["Pa"]], 6.4, attack=2.0, release=2.4), 5.6, 0.16)

FL = 0.14  # flute level: the lead, but never loud
# Phrase 1 (calm): Ga . Re~ Sa . Dha_ Sa
place(dry, bansuri([(0.0, "Ga", 0), (0.9, "Re", 0.18), (1.5, "Sa", 0.15), (2.25, "Dha_", 0.2), (2.75, "Sa", 0.22)], 3.3), 0.3, FL)
# Phrase 2 (rising): Sa Re Ga . Pa~ Ga Re Ga
place(
    dry,
    bansuri([(0.0, "Sa", 0), (0.35, "Re", 0.12), (0.7, "Ga", 0.12), (1.3, "Pa", 0.2), (1.9, "Ga", 0.15), (2.2, "Re", 0.12), (2.45, "Ga", 0.15)], 2.9, attack=0.25, release=0.6),
    3.6,
    FL,
)
# Phrase 3 (brighter): Pa Dha Sa' . Dha Pa . Ga Pa Dha
place(
    dry,
    bansuri([(0.0, "Pa", 0), (0.35, "Dha", 0.12), (0.7, "Sa'", 0.18), (1.35, "Dha", 0.15), (1.7, "Pa", 0.15), (2.15, "Ga", 0.15), (2.45, "Pa", 0.12), (2.75, "Dha", 0.15)], 3.2, attack=0.25, release=0.5),
    6.6,
    FL,
)
# Landing on the logo: Dha~ Sa' held, fading out
place(dry, bansuri([(0.0, "Dha", 0), (0.35, "Sa'", 0.25)], 2.15, attack=0.15, release=1.4), 9.8, FL * 1.05)
# a soft lower flute an octave down doubling the landing, for warmth
place(dry, bansuri([(0.0, "Pa", 0), (0.35, "Sa'", 0.25)], 2.1, attack=0.4, release=1.4) , 9.85, FL * 0.35, pan=-0.2)

# ---------------------------------------------------------------- mix: reverb, EQ, glue, fades
def reverb_ir(seconds=2.2, seed=0):
    n = int(seconds * SR)
    tt = np.arange(n) / SR
    r = np.random.default_rng(seed)
    ir = r.normal(0, 1, n) * np.exp(-tt * 6.9 / seconds)  # RT60 = seconds
    ir = fft_filter(ir, lo=180, hi=5500)
    ir[: int(0.012 * SR)] = 0  # pre-delay
    return ir / np.sqrt(np.sum(ir**2))


def convolve(x, ir):
    m = len(x) + len(ir) - 1
    size = 1 << (m - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]


wet = np.stack([convolve(dry[0], reverb_ir(seed=1)), convolve(dry[1], reverb_ir(seed=2))])
mix = dry * 0.82 + wet * 0.32

# EQ: remove rumble below 40 Hz, tame the very top
mix = np.stack([fft_filter(ch, lo=40, hi=12000) for ch in mix])

# Glue: gentle soft-knee saturation after normalising
mix /= np.max(np.abs(mix))
mix = np.tanh(mix * 1.4) / np.tanh(1.4)

# Short fade in, and a gentle fade out as the video stops on the logo
fade = np.minimum(1, np.minimum((t / 0.6) ** 1.5, (DUR - t) / 1.2))
mix *= fade
mix /= np.max(np.abs(mix)) / 0.89  # about -1 dB peak

pcm = (mix.T * 32767).astype(np.int16)
with wave.open(sys.argv[1] if len(sys.argv) > 1 else "intro.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("ok")
