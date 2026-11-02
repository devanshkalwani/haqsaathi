"""
Soundtrack for the 12-second HaqSaathi intro, synthesised from scratch (no samples, no licences).

Story in sound (raag Bhupali: Sa Re Ga Pa Dha, Sa = D):
  0.0-3.4  a calm, slightly wistful bansuri (bamboo flute) phrase over a soft tanpura drone
  3.3-5.3  a smooth airy swell as the papers are pulled into the phone
  4.4-6.2  quiet santoor arpeggio while HaqSaathi "checks the rules"
  6.5-7.9  one bright santoor note per scheme found, soft tabla-like pulse underneath
  9.6-12   a warm resolving chord, bell and the flute landing on high Sa as the logo appears

Mixed with a stereo convolution reverb, gentle compression and fades so the loop is seamless.
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


def bansuri(notes, length):
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
    env = smooth_env(n, 0.6, 0.9) * amp * (1 + 0.05 * np.sin(2 * np.pi * 0.7 * tt))
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

# Tanpura: Pa, Sa', Sa', Sa every 0.85 s, fading in over the first 2 s
pattern = [SA * R["Pa"] / 2, SA, SA, SA / 2]
for k, st in enumerate(np.arange(0.0, DUR, 0.85)):
    g = 0.26 * min(1.0, 0.45 + st / 2.0)
    place(dry, tanpura(pattern[k % 4]), st, g, pan=[-0.35, 0.15, 0.3, -0.1][k % 4])

# Opening: open fifth pad (Sa + Pa), calm, no minor colour
place(dry, pad([SA / 2, SA * R["Pa"] / 2, SA], 5.0, attack=1.6, release=1.8), 0.0, 0.22)

# Bansuri phrase 0.3 - 3.6 s: Ga ... Re (glide) ... Sa ... Dha_ (low) ... Sa (rest)
place(
    dry,
    bansuri([(0.0, "Ga", 0), (0.9, "Re", 0.18), (1.5, "Sa", 0.15), (2.25, "Dha_", 0.2), (2.75, "Sa", 0.22)], 3.3),
    0.3,
    0.13,
    pan=0.0,
)

# Swell as papers are pulled into the phone
place(dry, riser(2.1), 3.25, 0.2, pan=0.1)

# Checking the rules: soft santoor arpeggio Sa Re Ga Pa, twice
for i, note in enumerate(["Sa", "Re", "Ga", "Pa", "Sa'", "Re", "Ga", "Pa"]):
    place(dry, santoor(SA * 2 * R[note], 1.2, bright=0.6), 4.45 + i * 0.21, 0.13, pan=-0.45 + i * 0.12)

# Major pad once the phone shows results
place(dry, pad([SA, SA * R["Ga"], SA * R["Pa"], SA * 2], 3.8, attack=0.8, release=1.2), 6.0, 0.16)

# One tick per scheme found: Ga, Pa, Dha, Sa' (rising), with a soft octave sparkle
for i, note in enumerate(["Ga", "Pa", "Dha", "Sa'"]):
    f = SA * 2 * R[note]
    place(dry, santoor(f, 2.0), 6.55 + i * 0.45, 0.42, pan=-0.35 + i * 0.23)
    place(dry, santoor(f * 2, 1.2, bright=0.4), 6.56 + i * 0.45, 0.1, pan=0.35 - i * 0.23)

# Soft pulse under the results (tabla-like, on the beat of the ticks)
for i, st in enumerate(np.arange(6.1, 9.3, 0.45)):
    place(dry, thump(f0=86 if i % 2 == 0 else 110), st, 0.3 if i % 2 == 0 else 0.14)

# Button appears
place(dry, santoor(SA * 4 * R["Re"] / R["Sa"], 0.8, bright=0.5), 8.42, 0.14, pan=0.25)

# Logo: low warm hit, full chord, bells, and the flute landing on high Sa
place(dry, thump(2.0, f0=55, soft=3), 9.6, 0.7)
place(dry, pad([SA / 2, SA, SA * R["Ga"], SA * R["Pa"], SA * 2, SA * 2 * R["Ga"]], 2.4, attack=0.12, release=1.8), 9.6, 0.42)
place(dry, bell(SA * 4), 9.65, 0.3, pan=0.2)
place(dry, bell(SA * 4 * R["Pa"]), 9.9, 0.14, pan=-0.25)
place(dry, bansuri([(0.0, "Pa", 0), (0.45, "Sa'", 0.2)], 2.2), 9.75, 0.12, pan=0.0)

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

# Fades so the looped video doesn't click
fade = np.minimum(1, np.minimum((t / 0.9) ** 1.5, (DUR - t) / 0.8))
mix *= fade
mix /= np.max(np.abs(mix)) / 0.89  # about -1 dB peak

pcm = (mix.T * 32767).astype(np.int16)
with wave.open(sys.argv[1] if len(sys.argv) > 1 else "intro.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("ok")
