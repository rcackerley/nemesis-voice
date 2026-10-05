## Nemesis Voice Repeater (mobile-first)

A voice-to-voice color/symbol repeater for Warcraft Midnight 12.1 (Nemesis Delve / Asterek) that records Robby's spoken sequence and replays it back with the same timing between items.

Live: https://rcackerley.github.io/nemesis-voice/

- One-screen, touch-first UI
- Web Speech API for mic input (when available)
- Web Speech synthesis for playback
- Preserves gaps between utterances (replay cadence)
- Target counts 5 → 6 → 7 (plus custom), auto-replay and auto-increment
- Tap chips to correct misheard items (type or speak replacement)

Works best on phone browsers:
- Android: Chrome or Edge
- iOS: Safari (17.4+ recommended). See iOS notes below.

---

### How to run locally (for development)

Mic access is blocked on `file://`. Serve over `http://localhost`:

Option A (Python):

```bash
python -m http.server 43219
```

Option B (npm `serve`):

```bash
npx serve -l 43219 .
```

Open `http://localhost:43219` on desktop. (A phone on the LAN needs HTTPS for the mic, so use the live URL on phones.)

---

### How to use (phone)

1) Open the live URL. Tap Start Listening and allow the microphone.
2) Speak colors/symbols one at a time (~5s apart). Heard words appear as chips. Tap Edit on any chip to correct (type or Speak).
3) When the target count is reached, the app auto-replays (if enabled) using the measured gaps between your utterances.
4) During replay, the current word is highlighted. Tap Stop to cancel at any time.
5) After replay, Clear and Start again. Target auto-increments 5→6→7.

Controls:
- Target count: 5, 6, 7, or Custom
- Auto-replay at target (on by default)
- Auto-increment target (on by default)
- Simulate 5×5s (no mic) for quick testing

Normalization:
- Common color/symbol words are normalized case-insensitively: `blue, purple, orange, red, green, yellow, white, black, pink, cyan, star, circle, square, diamond, triangle, moon, cross (x), skull, sun, arrow`
- Multi-word combos like “red triangle” are preserved and normalized token-by-token.

---

### iOS Safari notes and limitations

Web Speech Recognition on iOS Safari often requires:
- A user gesture to start (`Start Listening` button)
- Short-utterance mode (continuous recognition can drop)
- Auto-restart on `end` events

This app:
- Starts recognition only from a user tap
- Prefers single-utterance mode on iOS
- Restarts recognition when it ends while still listening

Known caveats on iOS:
- Recognition can still be intermittent; re-tap Start if it stops
- Confidence values may be unavailable
- Audio focus and TTS latency vary with system settings; the ringer/silent switch can mute speech
- Backgrounded tabs cannot record or speak

---

### Deployment

Static site, no build step. `.github/workflows/pages.yml` deploys the repo root to GitHub Pages on every push to `main`.

Any static host works too (Netlify: no build command, publish directory = repo root).

---

### Testing and simulation

Automated (Node) test:

```bash
npm test
```

This validates the timing planner that preserves inter-word gaps and normalization behavior.

In-app simulation:
- Tap “Simulate 5×5s” to inject 5 color words with 5000ms gaps, then Replay
- Open dev console to view the computed replay schedule (ms)

---

### Edge cases handled

- Empty listen or immediate Stop: no entries; nothing to replay
- Double-start: Start button is disabled while listening/replaying
- Stop mid-replay: cancels TTS and clears pending timers safely
- Misheard correction: tap a chip to type or speak a replacement
  - Replacements keep original timestamps to preserve cadence

---

### Known limitations (especially on phone)

- iOS Safari recognition can drop; the app restarts it, but you may need to tap Start again
- Recognition timestamps are taken when the browser finalizes a word, so each gap includes a little recognizer latency
- Exact speech synthesis timing depends on the browser/OS TTS engine
- Mic access requires HTTPS or `http://localhost`; `file://` will not work
- Backgrounded or locked-screen tabs cannot listen or speak
- Real mic capture and TTS audio latency were not verified on a real phone; tested via simulation and unit tests

---

### Project structure

- `index.html` — mobile-friendly SPA (inline CSS and app script)
- `timingPlanner.js` — pure functions: `computeDelays`, `normalizeWord`
- `tests/timingPlanner.test.js` — Node test for cadence and normalization
- `package.json` — npm test script; optional `npm run serve`

License: MIT
