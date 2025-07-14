import numpy as np
import wave

# Audio parameters
sample_rate = 44100  # Standard audio sample rate
duration_beep = 0.15  # 150ms per beep
duration_pause = 0.1  # 100ms pause between beeps
frequency = 880  # A5 note frequency (Hz) - pleasant phone-like beep

# Generate time array for one beep
t_beep = np.linspace(0, duration_beep, int(sample_rate * duration_beep))
t_pause = np.zeros(int(sample_rate * duration_pause))

# Create a single beep with envelope (fade in/out)
envelope = np.sin(np.pi * t_beep / duration_beep)  # Smooth envelope
beep = envelope * np.sin(2 * np.pi * frequency * t_beep)

# Create 2 beeps with pause (WhatsApp style)
beep1 = beep
beep2 = beep * 0.85  # Slightly quieter for variation

# Combine beeps with pause
audio = np.concatenate([
    beep1,
    t_pause,
    beep2
])

# Normalize to prevent clipping
audio = audio / np.max(np.abs(audio)) * 0.8

# Convert to 16-bit integer format
audio_int16 = (audio * 32767).astype(np.int16)

# Save as WAV file using wave module
with wave.open('personal_jesus_two_beeps.wav', 'w') as wav_file:
    # Set parameters
    wav_file.setnchannels(1)  # Mono
    wav_file.setsampwidth(2)  # 2 bytes = 16 bits
    wav_file.setframerate(sample_rate)
    
    # Write audio data
    wav_file.writeframes(audio_int16.tobytes())

print("✓ Generated personal_jesus_two_beeps.wav with 2 phone-style beeps")
print(f"  - Sample rate: {sample_rate} Hz")
print(f"  - Frequency: {frequency} Hz (A5 note)")
print(f"  - Duration: {len(audio)/sample_rate:.2f} seconds")
print("  - Style: WhatsApp/phone notification beeps")
