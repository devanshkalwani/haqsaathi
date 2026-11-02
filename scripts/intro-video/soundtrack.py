"""
Soundtrack for the 12-second HaqSaathi intro, synthesised from scratch (no samples, no licences).

Indian feel without being "government": a tanpura-style drone (Sa + Pa) under everything,
paper-flutter noise while documents fly, a whoosh as they are pulled into the phone,
santoor-like plucks on raag Bhupali notes (Sa Re Ga Pa) as each scheme gets a tick,
and a warm resolving chord + bell when the logo appears.

Usage: python3 soundtrack.py out.wav
"""

import sys
import wave

import numpy as np

SR = 44100
DUR = 12.0
N = int(SR * DUR)
t = np.arange(N) / SR
rng = np.random.default_rng(7)

SA = 146.83  # D3 as "Sa"
RATIO = {"Sa": 1.0, "Re": 9 / 8, "Ga": 5 / 4, "Pa": 3 / 2, "Dha": 5 / 3}


def env_adsr(n, a, d, s, r, sustain_len):
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    sl = max(0, int(sustain_len * SR))
    e = np.concatenate([np.linspace(0, 1, a, endpoint=False), np.linspace(1, s, d, endpoint=False), np.full(sl, s), np.linspace(s, 0, r)])
    return np.pad(e, (0, max(0, n - len(e))))[:n]


def place(buf, sig, start, gain=1.0, pan=0.0):
    """Mix a mono signal into the stereo buffer at `start` seconds with equal-power pan (-1..1)."""
    i = int(start * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    lg, rg = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[0, i : i + len(sig)] += sig * lg
    buf[1, i : i + len(sig)] += sig * rg


def lowpass(x, cutoff):
    """One-pole low-pass; cutoff may be a scalar or per-sample array (Hz)."""
    c = np.broadcast_to(np.asarray(cutoff, dtype=float), x.shape)
    a = 1 - np.exp(-2 * np.pi * c / SR)
    y = np.empty_like(x)
    acc = 0.0
    for k in range(len(x)):
        acc += a[k] * (x[k] - acc)
        y[k] = acc
    return y


def tanpura_pluck(freq, length=3.2):
    """Bright buzzy string (jawari): many harmonics, slow decay, the upper ones bloom then fade."""
    n = int(length * SR)
    tt = np.arange(n) / SR
    out = np.zeros(n)
    for h in range(1, 18):
        amp = (1 / h**0.9) * (1 + 0.6 * np.sin(np.pi * min(1, h / 12)))
        bloom = 1 - np.exp(-tt * (2 + h * 0.6))
        decay = np.exp(-tt * (0.7 + h * 0.12))
        det = 1 + rng.normal(0, 0.0006)
        out += amp * bloom * decay * np.sin(2 * np.pi * freq * h * det * tt + rng.random() * 6.28)
    return out / 6


def santoor(freq, length=1.8):
    """Hammered double string: sharp attack, two slightly detuned courses, quick bright decay."""
    n = int(length * SR)
    tt = np.arange(n) / SR
    out = np.zeros(n)
    for course in (1.0, 1.0035):
        for h, amp, dk in ((1, 1.0, 2.4), (2, 0.55, 3.5), (3, 0.3, 5.0), (4.2, 0.12, 8.0), (5.4, 0.06, 11.0)):
            out += amp * np.exp(-tt * dk) * np.sin(2 * np.pi * freq * course * h * tt)
    click = rng.normal(0, 1, n) * np.exp(-tt * 180) * 0.25
    return (out + click) * np.minimum(1, tt * 2000)


def bell(freq, length=3.0):
    n = int(length * SR)
    tt = np.arange(n) / SR
    out = np.zeros(n)
    for ratio, amp, dk in ((1, 1, 1.1), (2.76, 0.45, 2.0), (5.4, 0.25, 3.5), (8.93, 0.1, 6)):
        out += amp * np.exp(-tt * dk) * np.sin(2 * np.pi * freq * ratio * tt)
    return out * np.minimum(1, tt * 800)


def pad(freqs, length, a=0.8, r=1.5):
    n = int(length * SR)
    tt = np.arange(n) / SR
    out = np.zeros(n)
    for f in freqs:
        for det in (-0.004, 0, 0.004):
            out += np.sin(2 * np.pi * f * (1 + det) * tt + 0.3 * np.sin(2 * np.pi * 0.2 * tt))
            out += 0.25 * np.sin(2 * np.pi * 2 * f * (1 + det) * tt)
    out /= len(freqs) * 3
    return out * env_adsr(n, a, 0.4, 0.8, r, length - a - 0.4 - r)


def thump(length=0.6, f0=95):
    """Soft tabla-like 'dha' bass: sine with a falling pitch."""
    n = int(length * SR)
    tt = np.arange(n) / SR
    f = f0 * (1 + 0.8 * np.exp(-tt * 30))
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-tt * 7)


mix = np.zeros((2, N))

# 1) Tanpura drone across the whole clip: Pa, Sa', Sa', Sa (low) every 0.8 s
pattern = [SA * RATIO["Pa"] / 2, SA, SA, SA / 2]
k = 0
for start in np.arange(0, DUR, 0.8):
    place(mix, tanpura_pluck(pattern[k % 4]), start, 0.3, pan=[-0.3, 0.2, 0.3, -0.1][k % 4])
    k += 1

# 2) Paper flutter while documents fly (0–5 s): band-limited noise in random bursts
n_flut = int(5.2 * SR)
noise = rng.normal(0, 1, n_flut)
flutter_env = np.zeros(n_flut)
for _ in range(70):
    c = rng.uniform(0, 5.0)
    w = rng.uniform(0.03, 0.12)
    flutter_env += np.exp(-(((np.arange(n_flut) / SR) - c) / w) ** 2) * rng.uniform(0.3, 1)
flutter = lowpass(noise, 3500) - lowpass(noise, 900)
flutter *= flutter_env * np.minimum(1, np.arange(n_flut) / SR / 0.6) * np.clip((5.2 - np.arange(n_flut) / SR) / 1.2, 0, 1)
place(mix, flutter, 0.0, 0.18, pan=0.3)

# A low, slightly tense pad under the "problem" (minor third colour), fading as the phone arrives
place(mix, pad([SA / 2, SA * 6 / 5 / 2, SA * RATIO["Pa"] / 2], 4.4, a=1.2, r=1.6), 0.0, 0.16)

# 3) Whoosh as the papers are pulled into the phone (3.4 → 5.2 s): rising filtered noise
n_w = int(2.2 * SR)
tw = np.arange(n_w) / SR
whoosh = lowpass(rng.normal(0, 1, n_w), 300 + 4200 * (tw / 2.2) ** 2)
whoosh *= np.sin(np.pi * np.clip(tw / 2.2, 0, 1)) ** 1.5
place(mix, whoosh, 3.3, 0.55, pan=-0.2)

# 4) "Scanning" (4.3–6.2 s): soft rising plucks Sa Re Ga Pa, quiet
for i, note in enumerate(["Sa", "Re", "Ga", "Pa", "Sa", "Re", "Ga", "Pa"]):
    place(mix, santoor(SA * 2 * RATIO[note], 0.9), 4.35 + i * 0.22, 0.08, pan=-0.4 + i * 0.1)

# 5) One tick sound per scheme found (6.5, 6.95, 7.4, 7.85 s): santoor on Bhupali notes, rising
for i, note in enumerate(["Ga", "Pa", "Dha", "Sa"]):
    f = SA * 2 * RATIO[note] * (2 if note == "Sa" else 1)
    place(mix, santoor(f), 6.55 + i * 0.45, 0.27, pan=-0.3 + i * 0.2)
    place(mix, santoor(f * 2, 1.0), 6.55 + i * 0.45, 0.08, pan=0.3 - i * 0.2)

# Light pulse under the results (6.2–9.4 s)
for i, s in enumerate(np.arange(6.2, 9.4, 0.4)):
    place(mix, thump(f0=90 if i % 2 == 0 else 120), s, 0.22 if i % 2 == 0 else 0.12)

# Warm major pad while results show
place(mix, pad([SA, SA * RATIO["Ga"], SA * RATIO["Pa"]], 3.6, a=0.6, r=1.0), 6.2, 0.12)

# 6) Button appears (8.4 s): small soft pop
place(mix, santoor(SA * 4, 0.5), 8.42, 0.15)

# 7) Logo (9.7 s): low boom + resolving chord + bell, fading to the end
place(mix, thump(1.6, f0=60), 9.65, 0.85)
place(mix, pad([SA / 2, SA, SA * RATIO["Ga"], SA * RATIO["Pa"], SA * 2], 2.35, a=0.15, r=1.6), 9.65, 0.45)
place(mix, bell(SA * 4), 9.7, 0.32, pan=0.15)
place(mix, bell(SA * 4 * RATIO["Pa"]), 9.95, 0.12, pan=-0.2)

# Simple stereo room: two short delays, then gentle fades so the loop is seamless
for d, g in ((0.031, 0.25), (0.047, 0.2), (0.21, 0.12)):
    i = int(d * SR)
    mix[0, i:] += mix[1, :-i] * g
    mix[1, i:] += mix[0, :-i] * g
fade = np.minimum(1, np.minimum(t / 0.25, (DUR - t) / 0.6))
mix *= fade
mix /= np.max(np.abs(mix)) / 0.85  # normalise with headroom

pcm = (mix.T * 32767).astype(np.int16)
with wave.open(sys.argv[1] if len(sys.argv) > 1 else "intro.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("ok")
