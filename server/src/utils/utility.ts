import fs from "fs"
import { ElevenLabsClient } from "elevenlabs";
import Groq from "groq-sdk";

export const transcribeAudio = async (audioPath: string): Promise<string> => {
    try {
        const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY! });

        const fileStream = fs.createReadStream(audioPath);

        const response = await client.speechToText.convert({
            model_id: "scribe_v1",
            file: fileStream
        });

        console.log("Response:", response);
        if (!response || !response.text) {
            return "No transcript received";
        }

        return response.text;
    } catch (error) {
        console.error("Transcription failed:", error);
        throw new Error("Transcription failed");
    }
}

export const summarizeText = async (transcript: string): Promise<string> => {
    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY!,
    });

    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that summarizes transcripts concisely.",
                },
                {
                    role: "user",
                    content: `Summarize the following transcript:\n\n${transcript}`,
                },
            ],
            temperature: 0.7,
        });

        return completion.choices[0]?.message?.content?.trim() || "";
    } catch (error) {
        console.error("Groq summarization failed:", error);
        throw new Error("Summarization failed");
    }
};