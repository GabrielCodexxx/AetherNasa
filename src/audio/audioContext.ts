interface WebkitAudioWindow {
  webkitAudioContext?: typeof AudioContext;
}

export interface OscillatorSpec {
  type: OscillatorType;
  startFreq: number;
  endFreq?: number;
  ramp?: 'exponential' | 'linear';
  rampDuration?: number;
}

/** Lazily constructs or resumes a browser Web Audio API context. */
export function resolveAudioContext(current: AudioContext | null): AudioContext | null {
  let ctx = current;
  if (!ctx && typeof window !== 'undefined') {
    const AudioCtx =
      window.AudioContext || (window as unknown as WebkitAudioWindow).webkitAudioContext;
    if (AudioCtx) {
      ctx = new AudioCtx();
    }
  }
  if (ctx && ctx.state === 'suspended') {
    void ctx.resume();
  }
  return ctx;
}

/** Plays one or more synchronized oscillators through a shared exponential gain envelope. */
export function playOscillatorGroup(
  ctx: AudioContext,
  specs: readonly OscillatorSpec[],
  startGain: number,
  fadeDuration: number,
  stopAfter: number
): void {
  const now = ctx.currentTime;
  const oscillators = specs.map(() => ctx.createOscillator());
  const gain = ctx.createGain();

  specs.forEach((spec, idx) => {
    const osc = oscillators[idx];
    osc.type = spec.type;
    osc.frequency.setValueAtTime(spec.startFreq, now);
    if (spec.endFreq !== undefined && spec.rampDuration !== undefined) {
      const targetTime = now + spec.rampDuration;
      if (spec.ramp === 'linear') {
        osc.frequency.linearRampToValueAtTime(spec.endFreq, targetTime);
      } else {
        osc.frequency.exponentialRampToValueAtTime(spec.endFreq, targetTime);
      }
    }
  });

  gain.gain.setValueAtTime(startGain, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + fadeDuration);

  for (const osc of oscillators) {
    osc.connect(gain);
  }
  gain.connect(ctx.destination);

  for (const osc of oscillators) {
    osc.start();
  }
  for (const osc of oscillators) {
    osc.stop(now + stopAfter);
  }
}
