import { execCommand } from "../utils/files.mjs";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const TTS_SCRIPT = path.join(process.cwd(), "scripts", "tts.py");
const AUDIOS_DIR = path.join(process.cwd(), "audios");

if (!fs.existsSync(AUDIOS_DIR)) {
  fs.mkdirSync(AUDIOS_DIR, { recursive: true });
}

async function convertTextToSpeech({ text, fileName }) {
  const baseName = path.basename(fileName, path.extname(fileName));
  const wavPath = path.join(AUDIOS_DIR, `${baseName}.wav`);
  const mp3Path = path.join(AUDIOS_DIR, `${baseName}.mp3`);
  
  console.log(`TTS: Converting to ${mp3Path}`);
  
  try {
    await execCommand({
      command: `python3 "${TTS_SCRIPT}" "${text.replace(/"/g, '\\"')}" "${wavPath}"`,
    });
    
    await execCommand({
      command: `ffmpeg -y -i "${wavPath}" "${mp3Path}"`,
    });
    
    return mp3Path;
  } catch (error) {
    console.error("TTS Error:", error);
    throw error;
  }
}

export { convertTextToSpeech };
