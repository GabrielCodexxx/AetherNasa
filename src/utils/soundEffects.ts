// Procedural Web Audio API sound generator for Lunar Resource Manager
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
      this.humOsc.frequency.setValueAtTime(55, this.ctx.currentTime);
      this.humGain.gain.setValueAtTime(0.02, this.ctx.currentTime);

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

  public playBeep(freq = 660, duration = 0.08, type: OscillatorType = 'triangle') {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Ignored
    }
  }

  public playPlusBeep() {
    this.playBeep(880, 0.09, 'triangle');
  }

  public playMinusBeep() {
    this.playBeep(440, 0.09, 'sine');
  }

  public playErrorBuzz() {
    this.playBeep(140, 0.15, 'sawtooth');
  }

  public playSuccessChime() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.06, this.ctx!.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.08 + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(this.ctx!.currentTime + idx * 0.08);
        osc.stop(this.ctx!.currentTime + idx * 0.08 + 0.22);
      });
    } catch {
      // Ignored
    }
  }

  public playEndDayChime() {
    this.playSuccessChime();
  }

  public playAlertSiren() {
    this.playBeep(320, 0.25, 'sawtooth');
  }

  public playFailureTone() {
    this.playBeep(180, 0.4, 'sawtooth');
  }

  public playVictoryFanfare() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.09, this.ctx!.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.12 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(this.ctx!.currentTime + idx * 0.12);
        osc.stop(this.ctx!.currentTime + idx * 0.12 + 0.45);
      });
    } catch {
      // Ignored
    }
  }
}

export const soundManager = new SoundFX();
