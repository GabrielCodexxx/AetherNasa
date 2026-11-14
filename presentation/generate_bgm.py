import wave
import math
import struct

def generate_ambient_space_bgm(filename="c:/Users/porti/Aether/presentation/assets/aether_space_ambient_bgm.wav"):
    sample_rate = 44100
    duration = 30.0  # seconds (exactly 30 seconds for NASA limit)
    total_samples = int(sample_rate * duration)

    # Chord frequencies (D minor 9th space ambient chord)
    # D2, A2, F3, A3, C4, E4
    freqs = [
        (73.42, 0.28),   # D2 (Deep root drone)
        (110.00, 0.22),  # A2 (Perfect 5th warmth)
        (174.61, 0.18),  # F3 (Minor 3rd emotion)
        (220.00, 0.16),  # A3 (Octave shimmer)
        (261.63, 0.12),  # C4 (Minor 7th space ether)
        (329.63, 0.10),  # E4 (9th celestial sparkle)
    ]

    # Shimmer frequencies (high harmonic subtle bells)
    shimmers = [
        (440.00, 0.05),
        (523.25, 0.04),
        (659.25, 0.03)
    ]

    print(f"Generating 30s copyright-free ambient space soundtrack: {filename}...")

    frames = bytearray()

    for n in range(total_samples):
        t = n / sample_rate

        # Master envelope (1.5s smooth fade in, 2.5s smooth fade out)
        if t < 1.5:
            env = t / 1.5
        elif t > 27.5:
            env = max(0.0, (30.0 - t) / 2.5)
        else:
            env = 1.0

        # Slow LFO modulation (0.2 Hz = 5s breathing cycle)
        lfo = 0.85 + 0.15 * math.sin(2 * math.pi * 0.2 * t)
        lfo2 = 0.90 + 0.10 * math.cos(2 * math.pi * 0.13 * t)

        left_sample = 0.0
        right_sample = 0.0

        # Layer primary pad drones with stereo spread
        for idx, (f, amp) in enumerate(freqs):
            detune_l = f * 0.998
            detune_r = f * 1.002
            # Add subtle vibrato
            phase_l = 2 * math.pi * detune_l * t + 0.2 * math.sin(2 * math.pi * 0.3 * t)
            phase_r = 2 * math.pi * detune_r * t + 0.2 * math.cos(2 * math.pi * 0.27 * t)

            # Warm soft sine + subtle 2nd harmonic
            wave_l = math.sin(phase_l) + 0.25 * math.sin(2 * phase_l)
            wave_r = math.sin(phase_r) + 0.25 * math.sin(2 * phase_r)

            left_sample += wave_l * amp * lfo
            right_sample += wave_r * amp * lfo2

        # Layer high celestial shimmers
        for idx, (f, amp) in enumerate(shimmers):
            phase = 2 * math.pi * f * t
            shimmer_wave = math.sin(phase) * amp * (0.5 + 0.5 * math.sin(2 * math.pi * 0.5 * t + idx))
            left_sample += shimmer_wave * 0.7
            right_sample += shimmer_wave * 0.8

        # Subtle sub-bass cosmic pulse (60 BPM = 1 beat per second)
        beat_t = t % 1.0
        if beat_t < 0.25:
            pulse_env = math.exp(-beat_t * 12.0)
            pulse_wave = math.sin(2 * math.pi * 55.0 * t) * 0.18 * pulse_env
            left_sample += pulse_wave
            right_sample += pulse_wave

        # Apply master envelope & scaling
        left_val = left_sample * env * 0.45
        right_val = right_sample * env * 0.45

        # Soft limiter (tanh saturation)
        left_val = math.tanh(left_val)
        right_val = math.tanh(right_val)

        # Convert to 16-bit PCM integer (-32768 to 32767)
        left_int = int(left_val * 32767)
        right_int = int(right_val * 32767)

        frames.extend(struct.pack('<hh', left_int, right_int))

    with wave.open(filename, 'wb') as wav_file:
        wav_file.setnchannels(2)      # Stereo
        wav_file.setsampwidth(2)     # 16-bit
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(frames)

    print(f"Audio generation complete! Size: {len(frames)} bytes")

if __name__ == "__main__":
    generate_ambient_space_bgm()
