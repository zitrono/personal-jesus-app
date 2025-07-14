import numpy as np
import wave

# Audio parameters for WhatsApp calling sound
sample_rate = 44100
beep_duration = 0.6  # 600ms beep
pause_duration = 3.5  # 3.5 seconds pause
frequency = 425  # Hz - WhatsApp tone

# Generate time arrays
t_beep = np.linspace(0, beep_duration, int(sample_rate * beep_duration))
t_pause = np.zeros(int(sample_rate * pause_duration))

# Create smooth envelope
attack_time = 0.02
release_time = 0.05
envelope = np.ones_like(t_beep)

# Apply attack and release
attack_samples = int(attack_time * sample_rate)
release_samples = int(release_time * sample_rate)
envelope[:attack_samples] = np.linspace(0, 1, attack_samples)
envelope[-release_samples:] = np.linspace(1, 0, release_samples)

# Create beep with harmonic
beep = envelope * np.sin(2 * np.pi * frequency * t_beep)
beep += 0.15 * envelope * np.sin(2 * np.pi * (frequency * 2) * t_beep)

# Single cycle (beep + pause) for looping
audio_loop = np.concatenate([beep, t_pause])

# Extended version with 4 cycles
audio_extended = np.array([])
for i in range(4):
    audio_extended = np.concatenate([audio_extended, beep, t_pause])
audio_extended = audio_extended[:-len(t_pause)]  # Remove last pause

# Normalize both versions
audio_loop = audio_loop / np.max(np.abs(audio_loop)) * 0.6
audio_extended = audio_extended / np.max(np.abs(audio_extended)) * 0.6

# Save loop version
audio_int16 = (audio_loop * 32767).astype(np.int16)
with wave.open('whatsapp_calling_loop.wav', 'w') as wav_file:
    wav_file.setnchannels(1)
    wav_file.setsampwidth(2)
    wav_file.setframerate(sample_rate)
    wav_file.writeframes(audio_int16.tobytes())

# Save extended version
audio_int16 = (audio_extended * 32767).astype(np.int16)
with wave.open('whatsapp_calling_tone.wav', 'w') as wav_file:
    wav_file.setnchannels(1)
    wav_file.setsampwidth(2)
    wav_file.setframerate(sample_rate)
    wav_file.writeframes(audio_int16.tobytes())

print("✓ Generated WhatsApp calling sounds:")
print(f"  - whatsapp_calling_loop.wav ({len(audio_loop)/sample_rate:.1f}s) - Single cycle")
print(f"  - whatsapp_calling_tone.wav ({len(audio_extended)/sample_rate:.1f}s) - Extended version")
