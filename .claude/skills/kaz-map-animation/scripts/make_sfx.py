#!/usr/bin/env python3
"""Synthesise the Kaz Map sound-effect kit into assets/sfx/*.wav (48 kHz mono, deterministic).
Usage: python3 make_sfx.py [out_dir]
Needs: numpy.
"""
import sys, os, wave
import numpy as np

SR = 48000
rng = np.random.default_rng(7)

def t(d): return np.arange(int(SR * d)) / SR
def env(n, a, r, shape=2.0):
    x = np.ones(n); na = max(1, int(SR * a)); nr = max(1, int(SR * r))
    x[:na] = np.linspace(0, 1, na) ** 1.5
    x[-nr:] *= np.linspace(1, 0, nr) ** shape
    return x
def bandnoise(n, f_lo, f_hi):
    """noise whose band-pass centre sweeps from f_lo to f_hi (simple FFT-domain sweep in chunks)"""
    out = np.zeros(n); chunk = 1024
    white = rng.standard_normal(n + chunk)
    for i in range(0, n, chunk // 2):
        seg = white[i:i + chunk] * np.hanning(chunk)
        p = i / max(1, n - 1); fc = f_lo * (f_hi / f_lo) ** p
        S = np.fft.rfft(seg); f = np.fft.rfftfreq(chunk, 1 / SR)
        S *= np.exp(-0.5 * ((np.log(f + 1) - np.log(fc)) / 0.55) ** 2)
        y = np.fft.irfft(S)[: min(chunk, n - i)]
        out[i:i + len(y)] += y
    return out / (np.abs(out).max() + 1e-9)
def norm(x, peak=0.89): return x / (np.abs(x).max() + 1e-9) * peak

def whoosh():   # big transition / flash cut
    n = int(SR * 0.75); x = bandnoise(n, 250, 3500) * env(n, 0.35, 0.38, 1.6)
    return norm(x)
def swish():    # light movement: paths, wipes, zooms
    n = int(SR * 0.38); x = bandnoise(n, 900, 6000) * env(n, 0.12, 0.25, 2)
    return norm(x, 0.8)
def pop():      # icons, pins, labels popping in
    d = t(0.13); f = 900 * np.exp(-d * 22) + 380
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-d * 34)
    return norm(x)
def click():    # small UI tick
    d = t(0.05); x = (rng.standard_normal(len(d)) * 0.4 + np.sin(2 * np.pi * 2400 * d)) * np.exp(-d * 120)
    return norm(x, 0.7)
def ding():     # check marks, positive reveals
    d = t(1.1); x = sum(a * np.sin(2 * np.pi * f * d) * np.exp(-d * k) for f, a, k in [(1318.5, 1, 4.5), (2637, .35, 7), (1975.5, .25, 6), (3951, .1, 10)])
    return norm(x * env(len(d), 0.003, 0.2), 0.75)
def impact():   # title cards, big statements
    d = t(1.2); f = 95 * np.exp(-d * 2.2) + 38
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-d * 3.2)
    hit = bandnoise(len(d), 1800, 300) * np.exp(-d * 18) * 0.5
    return norm(body + hit)
def riser():    # counters, build-ups
    n = int(SR * 0.9); d = t(0.9); f = 200 * (8 ** (d / 0.9))
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.35
    x = (bandnoise(n, 400, 7000) * 0.8 + tone) * env(n, 0.75, 0.08, 1)
    return norm(x, 0.7)
def flip():     # a flip / swap moment (two quick pops, rising)
    a, b = pop(), pop()
    b = np.interp(np.arange(0, len(b), 1.35), np.arange(len(b)), b)
    x = np.zeros(int(SR * 0.25)); x[:len(a)] += a * 0.8; o = int(SR * 0.09); x[o:o + len(b)] += b
    return norm(x)

KIT = dict(whoosh=whoosh, swish=swish, pop=pop, click=click, ding=ding, impact=impact, riser=riser, flip=flip)

def write(path, x):
    y = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes())

if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'sfx')
    os.makedirs(out, exist_ok=True)
    for k, fn in KIT.items(): write(os.path.join(out, k + '.wav'), fn())
    print('wrote', len(KIT), 'sounds to', out)
