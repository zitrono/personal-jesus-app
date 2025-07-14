import numpy as np
import wave

# WhatsApp calling uses two alternating tones
sample_rate = 44100
tone1_freq = 425  # Lower tone
tone2_freq = 475  # Higher tone
tone_duration = 0.4  # Duration of each tone
gap_duration = 0.05  # Very short gap between tones
cycle_pause = 3.0  # Pause after the two-tone sequence

# Generate time arrays
t_tone = np.linspace(0, tone_duration, int(sample_rate * tone_duration))
t_gap = np.zeros(int(sample_rate * gap_duration))
t_pause = np.zeros(int(sample_rate * cycle_pause))

# Create smooth envelope for tones
attack_time = 0.01  # 10ms attack
release_time = 0.02  # 20ms release
envelope = np.ones_like(t_tone)

# Apply attack
attack_samples = int(attack_time * sample_rate)
envelope[:attack_samples] = np.linspace(0, 1, attack_samples)

# Apply release
release_samples = int(release_time * sample_rate)
envelope[-release_samples:] = np.linspace(1, 0, release_samples)

# Generate the two tones
tone1 = envelope * np.sin(2 * np.pi * tone1_freq * t_tone)
tone2 = envelope * np.sin(2 * np.pi * tone2_freq * t_tone)

# Create the two-tone sequence: tone1, gap, tone2
two_tone_sequence = np.concatenate([tone1, t_gap, tone2])

# Version 1: Single cycle (for looping)
audio_v1 = np.concatenate([two_tone_sequence, t_pause])

# Normalize
audio_v1 = audio_v1 / np.max(np.abs(audio_v1)) * 0.7

# Save Version 1
audio_int16 = (audio_v1 * 32767).astype(np.int16)
with wave.open('whatsapp_calling_tones_v1.wav', 'w') as wav_file:
    wav_file.setnchannels(1)
    wav_file.setsampwidth(2)
    wav_file.setframerate(sample_rate)
    wav_file.writeframes(audio_int16.tobytes())

print("✓ Generated whatsapp_calling_tones_v1.wav")
print(f"  - Frequencies: {tone1_freq} Hz and {tone2_freq} Hz")
print(f"  - Pattern: beep-beep... pause...")
print(f"  - Duration: {len(audio_v1)/sample_rate:.1f}s")
