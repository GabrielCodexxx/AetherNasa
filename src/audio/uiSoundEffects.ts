import { playOscillatorGroup } from './audioContext';

/** Plays a crisp sci-fi UI button click pulse. */
export function playUiClick(ctx: AudioContext): void {
  playOscillatorGroup(ctx, [{ type: 'sine', startFreq: 960 }], 0.05, 0.04, 0.05);
}

/** Plays a two-tone statistical significance confirmation chime (p < 0.001). */
export function playSignificanceChime(ctx: AudioContext): void {
  playOscillatorGroup(
    ctx,
    [
      { type: 'sine', startFreq: 587.33 },
      { type: 'triangle', startFreq: 880 },
    ],
    0.07,
    0.4,
    0.45
  );
}
