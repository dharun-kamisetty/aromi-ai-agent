#!/usr/bin/env python3
import sys
import json
from TTS.api import TTS

def text_to_speech(text, output_path):
    tts = TTS(model_name="tts_models/en/ljspeech/tacotron2-DDC", gpu=False)
    
    tts.tts_to_file(
        text=text,
        file_path=output_path
    )
    
    return output_path

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Missing arguments"}))
        sys.exit(1)
    
    text = sys.argv[1]
    output_path = sys.argv[2]
    
    try:
        result_path = text_to_speech(text, output_path)
        print(json.dumps({"success": True, "path": result_path}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
