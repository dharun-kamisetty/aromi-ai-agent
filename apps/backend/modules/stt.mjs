import { execCommand } from "../utils/files.mjs";
import { convertAudioToMp3 } from "../utils/audios.mjs";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const STT_SCRIPT = path.join(process.cwd(), "scripts", "stt.py");

async function convertAudioToText({ audioData }) {
  const mp3AudioData = await convertAudioToMp3({ audioData });
  
  const tempDir = "/tmp/aromi-stt";
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  const inputPath = `${tempDir}/input.mp3`;
  const outputPath = `${tempDir}/output.json`;
  
  fs.writeFileSync(inputPath, mp3AudioData);
  
  try {
    const result = await execCommand({
      command: `python3 ${STT_SCRIPT} ${inputPath}`,
    });
    
    if (fs.existsSync(outputPath)) {
      const jsonResult = JSON.parse(fs.readFileSync(outputPath, "utf-8"));
      fs.unlinkSync(inputPath);
      return jsonResult.text;
    }
    
    fs.unlinkSync(inputPath);
    return result.stdout || result.stderr;
  } catch (error) {
    console.error("STT Error:", error);
    fs.unlinkSync(inputPath);
    throw error;
  }
}

export { convertAudioToText };
