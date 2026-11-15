import { resolveAudioContext } from './audioContext';
import { playTrendSonification } from './trendSonification';
import { playSignificanceChime, playUiClick } from './uiSoundEffects';

/** Procedural Web Audio synthesizer for Earth System Trend Detective and Solar System Scope. */
export class SoundFX {
  private ctx: AudioContext | null = null;
  private soundEnabled = true;
  private humOsc: OscillatorNode | null = null;
  private humGain: GainNode | null = null;
  private isHumming = false;

  private runWithAudio(action: (ctx: AudioContext) => void): void {
    if (!this.soundEnabled) return;
    try {
      this.ctx = resolveAudioContext(this.ctx);
      if (!this.ctx) return;
      action(this.ctx);
    } catch {
      // Ignored
    }
  }

  public toggleMute(): boolean {
    this.soundEnabled = !this.soundEnabled;
    if (!this.soundEnabled) {
      this.stopAmbientHum();
    }
    return this.soundEnabled;
  }

  public setMuted(muted: boolean): void {
    this.soundEnabled = !muted;
    if (!this.soundEnabled) {
      this.stopAmbientHum();
    }
  }

  public getMuted(): boolean {
    return !this.soundEnabled;
  }

  public isMuted(): boolean {
    return !this.soundEnabled;
  }

  public toggleAmbientHum(): boolean {
    if (this.isHumming) {
      this.stopAmbientHum();
      return false;
    }
    this.startAmbientHum();
    return true;
  }

  /** Starts a deep-space 55 Hz planetary resonance drone. */
  public startAmbientHum(): void {
    this.runWithAudio((ctx) => {
      if (this.isHumming) return;

      this.humOsc = ctx.createOscillator();
      this.humGain = ctx.createGain();

      this.humOsc.type = 'sine';
      this.humOsc.frequency.setValueAtTime(55, ctx.currentTime);
      this.humGain.gain.setValueAtTime(0.015, ctx.currentTime);

      this.humOsc.connect(this.humGain);
      this.humGain.connect(ctx.destination);
      this.humOsc.start();
      this.isHumming = true;
    });
  }

  public stopAmbientHum(): void {
    try {
      if (this.humOsc) {
        this.humOsc.stop();
        this.humOsc.disconnect();
        this.humOsc = null;
      }
      if (this.humGain) {
        this.humGain.disconnect();
        this.humGain = null;
      }
      this.isHumming = false;
    } catch {
      // Ignored
    }
  }

  /** Backward-compatibility alias for acoustic sonification. */
  public sonifyMoonquake(magnitude: number, type: string): void {
    this.sonifyTrend(magnitude, type);
  }

  /** Synthesizes an acoustic signature for an Earth system variable trend. */
  public sonifyTrend(value: number, domain: string): void {
    this.runWithAudio((ctx) => playTrendSonification(ctx, value, domain));
  }

  /** Plays a short sci-fi UI interaction click. */
  public playClick(): void {
    this.runWithAudio((ctx) => playUiClick(ctx));
  }

  /** Plays a dual-tone statistical significance alert chime (p < 0.001). */
  public playSignificanceAlert(): void {
    this.runWithAudio((ctx) => playSignificanceChime(ctx));
  }
}

export const soundManager = new SoundFX();
