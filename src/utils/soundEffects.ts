// Procedural Web Audio API sound designer and seismic sonifier for Moonquake Map 2.0
class SoundFX {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private humOsc: OscillatorNode | null = null;
  private humGain: GainNode | null = null;
  private isHumming: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

  public startAmbientHum() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx || this.isHumming) return;

      this.humOsc = this.ctx.createOscillator();
      this.humGain = this.ctx.createGain();

      this.humOsc.type = 'sine';
      this.humOsc.frequency.setValueAtTime(45, this.ctx.currentTime); // 45Hz sub-bass planetary hum
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

  // Sonification of Lunar Seismic Waves (Audible translation of moonquake vibration)
  public sonifyMoonquake(magnitude: number, type: string) {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Deep rumble for shallow tectonic quakes, higher metallic resonance for impacts
      if (type === 'shallow') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80 + magnitude * 15, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 1.2);
      } else if (type === 'artificial_impact') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 1.8);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(60, this.ctx.currentTime + 0.8);
      }

      const volume = Math.min(0.2, 0.05 + (magnitude / 6) * 0.15);
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 1.6);
    } catch {
      // Ignored
    }
  }

  // Interface Click / Station Focus Beep
  public playClick() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // Ignored
    }
  }

  // High-Energy Moonquake Warning Beep
  public playCriticalAlarm() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(540, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(780, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.26);
    } catch {
      // Ignored
    }
  }
}

export const soundManager = new SoundFX();
