#!/usr/bin/env python3
import sys
import json
from faster_whisper import WhisperModel

def transcribe_audio(audio_path):
    model_size = "base"
    model = WhisperModel(model_size, device="cpu", compute_type="int8")
    
    segments, info = model.transcribe(audio_path, beam_size=5)
    
    text = ""
    for segment in segments:
        text += segment.text
    
    return text.strip()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No audio file provided"}))
        sys.exit(1)
    
    audio_path = sys.argv[1]
    
    try:
        result = transcribe_audio(audio_path)
        print(json.dumps({"text": result}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
