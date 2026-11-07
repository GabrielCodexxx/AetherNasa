// Procedural Web Audio API sound synthesizer for Earth System Trend Detective & Solar System Scope
class SoundFX {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private humOsc: OscillatorNode | null = null;
  private humGain: GainNode | null = null;
  private isHumming: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.soundEnabled = !this.soundEnabled;
    if (!this.soundEnabled) {
      this.stopAmbientHum();
    }
    return this.soundEnabled;
  }

  public setMuted(muted: boolean) {
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
    } else {
      this.startAmbientHum();
      return true;
    }
  }

  // Deep space solar system planetary resonance hum (55 Hz)
  public startAmbientHum() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx || this.isHumming) return;

      this.humOsc = this.ctx.createOscillator();
      this.humGain = this.ctx.createGain();

      this.humOsc.type = 'sine';
      this.humOsc.frequency.setValueAtTime(55, this.ctx.currentTime);
      this.humGain.gain.setValueAtTime(0.015, this.ctx.currentTime);

      this.humOsc.connect(this.humGain);
      this.humGain.connect(this.ctx.destination);
      this.humOsc.start();
      this.isHumming = true;
    } catch {
      // Ignored
    }
  }

  public stopAmbientHum() {
    try {
      if (this.humOsc) {
        this.humOsc.stop();
        this.humOsc.disconnect();
        this.humOsc = null;
      }
      this.isHumming = false;
    } catch {
      // Ignored
    }
  }

  // Backward compatibility alias for acoustic sonification
  public sonifyMoonquake(magnitude: number, type: string) {
    this.sonifyTrend(magnitude, type);
  }

  // Procedural Earth System Variable Sonification
  public sonifyTrend(value: number, domain: string) {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (domain === 'temperature') {
        // Temperature warming upward pitch sweep with thermal shimmer
        osc.type = 'sawtooth';
        const startFreq = 220 + Math.max(0, value) * 120;
        osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(startFreq + 80, this.ctx.currentTime + 0.6);
      } else if (domain === 'cryosphere') {
        // Brittle crystalline chime for ice melt
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.7);
      } else if (domain === 'hydrosphere') {
        // Deep resonant ocean swell
        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(160, this.ctx.currentTime + 0.5);
      } else if (domain === 'atmosphere') {
        // Atmospheric greenhouse resonance
        osc.type = 'sine';
        osc.frequency.setValueAtTime(330, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(440, this.ctx.currentTime + 0.6);
      } else {
        // Biosphere organic pulse
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.5);
      }

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.85);
    } catch {
      // Ignored
    }
  }

  // Sci-Fi UI Interface Click
  public playClick() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(960, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Ignored
    }
  }

  // Statistical Significance Alert Chime (p < 0.001)
  public playSignificanceAlert() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
      osc2.frequency.setValueAtTime(880, this.ctx.currentTime); // A5

      gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(this.ctx.currentTime + 0.45);
      osc2.stop(this.ctx.currentTime + 0.45);
    } catch {
      // Ignored
    }
  }
}

export const soundManager = new SoundFX();
