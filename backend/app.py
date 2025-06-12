from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from resemblyzer import VoiceEncoder, preprocess_wav
import numpy as np
import tempfile
import shutil
import traceback
import soundfile as sf
from pydub import AudioSegment
import os
from typing import List

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

encoder = VoiceEncoder()
SIMILARITY_THRESHOLD = 0.55  # You can change this to 0.60 if you prefer

def validate_wav_file(path: str, min_duration_sec: float = 1.0):
    """Ensure the WAV file is valid and long enough."""
    try:
        data, samplerate = sf.read(path)
        duration = len(data) / samplerate
        if duration < min_duration_sec:
            raise ValueError(f"Audio duration must be at least {min_duration_sec} seconds.")
    except Exception as e:
        raise ValueError(f"Invalid WAV file: {str(e)}")

def convert_to_wav(input_path: str, output_path: str):
    """Convert any audio file to WAV format."""
    try:
        audio = AudioSegment.from_file(input_path)
        audio.export(output_path, format="wav")
    except Exception as e:
        raise Exception(f"Audio conversion failed: {str(e)}")

@app.get("/")
def read_root():
    return {"message": "Voice Verification API"}

@app.post("/voice_similarity/")
async def check_voice_similarity(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    try:
        # For demo purposes, we'll return 1 (match)
        # In a real application, you would:
        # 1. Save the uploaded files
        # 2. Process them with your voice similarity model
        # 3. Return the result
        return 1
    except Exception as e:
        return {"error": str(e)}
    
    