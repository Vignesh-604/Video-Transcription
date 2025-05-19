import axios from "axios"
import FormData from "form-data"
import fs from "fs"


export const transcribeAudio = async (audioPath: string): Promise<string> => {
    console.log(audioPath);
    
    const form = new FormData()
    form.append("file", fs.createReadStream(audioPath));
console.log(form);

    try {
        const response = await axios.post(
            'https://api.elevenlabs.io/v1/speech-to-text', form, {
            headers: {
                ...form.getHeaders(), 'xi-api-key': process.env.ELEVENLABS_API_KEY!
            }
        }
        )

         if (!response.data || !response.data.text) {
            console.log("Response data:", JSON.stringify(response.data));
            return "No transcript received";
        }

        return response.data.text || "No transcript recieved"
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("ElevenLabs error response:", error.response?.data);
        } else {
            console.error("Unknown error:", error);
        }
        throw new Error("Transcription failed");
    }

}

export const summarizeText = async (transcript: string): Promise<string> => {
    try {
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'mixtral-8x7b-32768',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant that summarizes transcripts concisely.'
                    },
                    {
                        role: 'user',
                        content: `Summarize the following transcript:\n\n${transcript}`
                    }
                ],
                temperature: 0.7
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GROQ_API_KEY!}`,
                    'Content-Type': 'application/json'
                }
            }
        )

        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Groq summarization failed:', error);
        throw new Error('Summarization failed');
    }
}