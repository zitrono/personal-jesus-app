import numpy as np
import wave
import sys

# Default parameters
DEFAULT_BEEPS = 2
DEFAULT_FREQUENCY = 880
DEFAULT_BEEP_DURATION = 0.15
DEFAULT_PAUSE_DURATION = 0.1

# Parse command line arguments
beeps = DEFAULT_BEEPS
frequency = DEFAULT_FREQUENCY
beep_duration = DEFAULT_BEEP_DURATION
pause_duration = DEFAULT_PAUSE_DURATION

# Simple argument parsing
for i, arg in enumerate(sys.argv[1:]):
    if arg == '--beeps' and i+2 < len(sys.argv):
        beeps = int(sys.argv[i+2])
    elif arg == '--frequency' and i+2 < len(sys.argv):
        frequency = int(sys.argv[i+2])
    elif arg == '--beep-duration' and i+2 < len(sys.argv):
        beep_duration = float(sys.argv[i+2])
    elif arg == '--pause-duration' and i+2 < len(sys.argv):
        pause_duration = float(sys.argv[i+2])
    elif arg == '--help':
        print("Custom Beep Generator for Personal Jesus")
        print("\nUsage: python3 generate_custom_beeps.py [options]")
        print("\nOptions:")
        print("  --beeps N            Number of beeps (default: 2)")
        print("  --frequency HZ       Frequency in Hz (default: 880)")
        print("  --beep-duration S    Beep duration in seconds (default: 0.15)")
        print("  --pause-duration S   Pause duration in seconds (default: 0.1)")
        print("\nExamples:")
        print("  python3 generate_custom_beeps.py --beeps 3 --frequency 660")
        print("  python3 generate_custom_beeps.py --beeps 5 --beep-duration 0.2")
        sys.exit(0)

# Audio parameters
sample_rate = 44100

# Generate time arrays
t_beep = np.linspace(0, beep_duration, int(sample_rate * beep_duration))
t_pause = np.zeros(int(sample_rate * pause_duration))

# Create envelope
envelope = np.sin(np.pi * t_beep / beep_duration)
beep = envelope * np.sin(2 * np.pi * frequency * t_beep)

# Build audio with specified number of beeps
audio = np.array([])
for i in range(beeps):
    # Vary volume slightly for each beep
    volume = 1.0 - (i * 0.1)  # Decrease by 10% each beep
    volume = max(volume, 0.5)  # Don't go below 50%
    
    audio = np.concatenate([audio, beep * volume])
    if i < beeps - 1:  # Don't add pause after last beep
        audio = np.concatenate([audio, t_pause])

# Normalize
audio = audio / np.max(np.abs(audio)) * 0.8

# Convert to 16-bit
audio_int16 = (audio * 32767).astype(np.int16)

# Generate filename
filename = f'custom_beeps_{beeps}x_{frequency}Hz.wav'

# Save
with wave.open(filename, 'w') as wav_file:
    wav_file.setnchannels(1)
    wav_file.setsampwidth(2)
    wav_file.setframerate(sample_rate)
    wav_file.writeframes(audio_int16.tobytes())

print(f"✓ Generated {filename}")
print(f"  - Beeps: {beeps}")
print(f"  - Frequency: {frequency} Hz")
print(f"  - Beep duration: {beep_duration}s")
print(f"  - Pause duration: {pause_duration}s")
print(f"  - Total duration: {len(audio)/sample_rate:.2f}s")
