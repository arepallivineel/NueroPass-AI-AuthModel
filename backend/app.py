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

@app.post("/voice_similarity/")
async def voice_similarity(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    try:
        if not file1 or not file2:
            raise HTTPException(status_code=400, detail="Both audio files are required")

        with tempfile.TemporaryDirectory() as tmpdir:
            original1_path = os.path.join(tmpdir, "original1")
            original2_path = os.path.join(tmpdir, "original2")

            with open(original1_path, "wb") as f1:
                shutil.copyfileobj(file1.file, f1)
            with open(original2_path, "wb") as f2:
                shutil.copyfileobj(file2.file, f2)

            wav1_path = os.path.join(tmpdir, "file1.wav")
            wav2_path = os.path.join(tmpdir, "file2.wav")

            convert_to_wav(original1_path, wav1_path)
            convert_to_wav(original2_path, wav2_path)

            validate_wav_file(wav1_path)
            validate_wav_file(wav2_path)

            wav1 = preprocess_wav(wav1_path)
            wav2 = preprocess_wav(wav2_path)

            embed1 = encoder.embed_utterance(wav1)
            embed2 = encoder.embed_utterance(wav2)

            similarity = np.dot(embed1, embed2) / (np.linalg.norm(embed1) * np.linalg.norm(embed2))
            is_similar = similarity >= SIMILARITY_THRESHOLD

            print(f"Cosine similarity: {similarity} (Threshold: {SIMILARITY_THRESHOLD})")

            return {
                "result": 1 if is_similar else 0,
            }

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
    