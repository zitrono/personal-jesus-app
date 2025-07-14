# Audio Generation Tools for Personal Jesus

This directory contains Python scripts to generate various audio files for the Personal Jesus hotline.

## Available Scripts:

1. **generate_two_beeps.py** - Creates 2 WhatsApp-style notification beeps
2. **generate_whatsapp_calling.py** - Creates WhatsApp outgoing call sound
3. **generate_custom_beeps.py** - Customizable beep generator

## Generated Audio Files:

- `personal_jesus_two_beeps.wav` - 2 beeps (0.40s)
- `personal_jesus_beeps.wav` - 3 beeps (0.65s)
- `personal_jesus_ringtone.wav` - Classic phone ring (2.20s)
- `whatsapp_calling_tone.wav` - Full calling sequence (12.9s)
- `whatsapp_calling_loop.wav` - Single loop for calling (4.1s)

## Usage:

```bash
python3 generate_two_beeps.py
python3 generate_whatsapp_calling.py
python3 generate_custom_beeps.py --beeps 4 --frequency 660
```

All scripts use only NumPy and the built-in wave module (no external dependencies needed).
