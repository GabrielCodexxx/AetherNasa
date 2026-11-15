import { playOscillatorGroup, type OscillatorSpec } from './audioContext';

type DomainSynthFactory = (value: number) => OscillatorSpec;

const DOMAIN_SYNTH_PRESETS: Record<string, DomainSynthFactory> = {
  temperature: (value) => {
    const startFreq = 220 + Math.max(0, value) * 120;
    return {
      type: 'sawtooth',
      startFreq,
      endFreq: startFreq + 80,
      ramp: 'exponential',
      rampDuration: 0.6,
    };
  },
  cryosphere: () => ({
    type: 'triangle',
    startFreq: 880,
    endFreq: 320,
    ramp: 'exponential',
    rampDuration: 0.7,
  }),
  hydrosphere: () => ({
    type: 'sine',
    startFreq: 110,
    endFreq: 160,
    ramp: 'linear',
    rampDuration: 0.5,
  }),
  atmosphere: () => ({
    type: 'sine',
    startFreq: 330,
    endFreq: 440,
    ramp: 'linear',
    rampDuration: 0.6,
  }),
};

const DEFAULT_BIOSPHERE_PRESET: DomainSynthFactory = () => ({
  type: 'triangle',
  startFreq: 520,
  endFreq: 440,
  ramp: 'exponential',
  rampDuration: 0.5,
});

/** Plays a procedural acoustic signature mapped to an Earth system variable domain. */
export function playTrendSonification(
  ctx: AudioContext,
  value: number,
  domain: string
): void {
  const preset = DOMAIN_SYNTH_PRESETS[domain] ?? DEFAULT_BIOSPHERE_PRESET;
  playOscillatorGroup(ctx, [preset(value)], 0.08, 0.8, 0.85);
}
