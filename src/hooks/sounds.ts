/**
 * sounds.ts — plays the app's sound effects.
 *
 * IMPORTANT CONTEXT: you asked for free placeholder sounds. The
 * environment I'm building in can only reach code-package
 * websites, not general sound-effect sites — so instead of
 * leaving this blocked, these sounds are generated in code using
 * the Web Audio API (basically: telling the browser to play a
 * specific musical tone for a specific length of time). They're
 * not files, so there's zero licensing concern, but they also
 * won't sound as polished as a real recorded sound effect.
 *
 * SWAPPING THESE FOR REAL SOUND FILES LATER:
 * If you find/buy proper sound effects later, drop the files into
 * src/assets/sounds/ and replace the body of playSound() with
 * code that plays those files instead (I'm happy to do this swap
 * for you whenever you're ready — it's a small, contained change
 * because every part of the app just calls playSound('win') etc.
 * without knowing HOW the sound is produced).
 */
import { useUIStore } from "../store/uiStore";

export type SoundName = "select" | "gameStart" | "win" | "lose";

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

/** Schedules one short musical note at a given time offset (in seconds from now). */
function playNote(
  ctx: AudioContext,
  frequency: number,
  startOffset: number,
  duration: number,
  volume: number,
  waveType: OscillatorType
) {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = waveType;
  oscillator.frequency.value = frequency;

  const startTime = ctx.currentTime + startOffset;
  const endTime = startTime + duration;

  // Fade in/out quickly to avoid harsh clicks at the start/end of the note.
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
  gainNode.gain.linearRampToValueAtTime(0, endTime);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(startTime);
  oscillator.stop(endTime);
}

export function playSound(name: SoundName): void {
  if (!useUIStore.getState().isSoundOn) return;

  // Web Audio can't start until a user has interacted with the
  // page at least once — every call site for playSound() is
  // already inside a click handler, so this is safe.
  const ctx = getAudioContext();

  switch (name) {
    case "select":
      // A short, quiet tick — just enough feedback that a piece was picked up.
      playNote(ctx, 440, 0, 0.08, 0.15, "triangle");
      break;

    case "gameStart":
      // Three quick rising notes (C, E, G) — a little "let's go" fanfare.
      playNote(ctx, 261.6, 0, 0.12, 0.2, "sine");
      playNote(ctx, 329.6, 0.1, 0.12, 0.2, "sine");
      playNote(ctx, 392.0, 0.2, 0.18, 0.2, "sine");
      break;

    case "win":
      // A cheerful ascending arpeggio.
      playNote(ctx, 392.0, 0, 0.12, 0.2, "sine");
      playNote(ctx, 494.0, 0.1, 0.12, 0.2, "sine");
      playNote(ctx, 587.3, 0.2, 0.12, 0.2, "sine");
      playNote(ctx, 784.0, 0.3, 0.25, 0.22, "sine");
      break;

    case "lose":
      // A slower, descending, minor-feeling phrase.
      playNote(ctx, 392.0, 0, 0.18, 0.2, "sawtooth");
      playNote(ctx, 330.0, 0.16, 0.18, 0.18, "sawtooth");
      playNote(ctx, 262.0, 0.32, 0.3, 0.16, "sawtooth");
      break;
  }
}
