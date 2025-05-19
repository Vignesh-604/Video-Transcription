import { Request, Response } from "express";
import ffmpeg from "fluent-ffmpeg"
import fs from "fs"
import path from "path";
import Video from "../models/video.model"
import { summarizeText, transcribeAudio } from "../utils/utility";

export const handleUpload = async (req: Request, res: Response): Promise<void> => {
    const videoFile = req.file!;

    if (!videoFile) {
        res.status(400).json({ error: 'No video uploaded' });
    }

    const videoPath = videoFile.path;
    const audioPath = videoPath.replace(path.extname(videoPath), ".mp3")

    try {
        await new Promise<void>((resolve, reject) => {
            ffmpeg(videoPath)
                .audioCodec('libmp3lame')
                .audioBitrate('128k')
                .audioFrequency(44100)
                .format('mp3')
                .output(audioPath)
                .on("end", () => {
                    console.log("Audio extraction complete");
                    
                    resolve()
                })
                .on("error", (e: any) => {
                    console.log("FFMPEG error", e);
                    reject(e)
                })
                .run()
        })

        // const audioBuffer = fs.readFileSync(audioPath)

        const transcript = await transcribeAudio(audioPath)

        const summary = await summarizeText(transcript)

        const saved = await Video.create({
            filename: req.file?.filename,
            transcript,
            summary
        })

        res.status(201).json(saved)
    } catch (err) {
        res.status(500).json(`Something went wrong: ${err}`)
    }
}