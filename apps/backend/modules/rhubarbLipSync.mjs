import { execCommand } from "../utils/files.mjs";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const RHUBARB_PATH = path.join(process.cwd(), "bin", "rhubarb");

async function getPhonemes({ message }) {
  try {
    const time = new Date().getTime();
    const audioDir = path.join(process.cwd(), "audios");
    const wavPath = path.join(audioDir, `message_${message}.wav`);
    const jsonPath = path.join(audioDir, `message_${message}.json`);
    
    console.log(`Starting conversion for message ${message}`);
    
    await execCommand({
      command: `ffmpeg -y -i audios/message_${message}.mp3 audios/message_${message}.wav`
    });
    console.log(`Conversion done in ${new Date().getTime() - time}ms`);

    const rhubarbExists = fs.existsSync(RHUBARB_PATH);
    
    if (rhubarbExists) {
      await execCommand({
        command: `${RHUBARB_PATH} -f json -o "${jsonPath}" "${wavPath}" -r phonetic`,
      });
      console.log(`Lip sync done in ${new Date().getTime() - time}ms`);
    } else {
      console.log("Rhubarb not found, generating simple lip sync...");
      await generateSimpleLipSync({ message, jsonPath, wavPath });
    }
  } catch (error) {
    console.error(`Error while getting phonemes for message ${message}:`, error);
    const jsonPath = path.join(process.cwd(), "audios", `message_${message}.json`);
    const wavPath = path.join(process.cwd(), "audios", `message_${message}.wav`);
    await generateSimpleLipSync({ message, jsonPath, wavPath });
  }
}

async function generateSimpleLipSync({ message, jsonPath, wavPath }) {
  try {
    const duration = await getAudioDuration(wavPath);
    const mouthCues = generateMouthCues(duration);
    const lipSyncData = {
      metadata: {
        soundFile: `message_${message}.wav`,
        duration: duration,
      },
      mouthCues: mouthCues,
    };
    fs.writeFileSync(jsonPath, JSON.stringify(lipSyncData, null, 2));
    console.log(`Generated simple lip sync for message ${message}, duration: ${duration}s`);
  } catch (error) {
    console.error("Error generating simple lip sync:", error);
  }
}

async function getAudioDuration(wavPath) {
  try {
    const result = await execCommand({
      command: `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${wavPath}"`,
    });
    return parseFloat(result.stdout.trim()) || 3.0;
  } catch {
    return 3.0;
  }
}

function generateMouthCues(duration) {
  const mouthCues = [];
  const visemes = ["A", "E", "O", "U", "F", "L", "M", "B", "PP", "TH"];
  const wordsPerSecond = 2;
  const wordCount = Math.max(5, Math.floor(duration * wordsPerSecond));
  
  for (let i = 0; i < wordCount; i++) {
    const start = i / wordsPerSecond;
    const end = (i + 1) / wordsPerSecond;
    const viseme = visemes[Math.floor(Math.random() * visemes.length)];
    mouthCues.push({ value: viseme, start: parseFloat(start.toFixed(2)), end: parseFloat(end.toFixed(2)) });
  }
  
  return mouthCues;
}

export { getPhonemes };
