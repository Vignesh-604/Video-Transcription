# Video Transcription Summary

- Upload video file -> multer handles file processing -> stores in /public/temp/
- Audio path is similar to video path with different ext
- Install (ffmpeg)[https://www.gyan.dev/ffmpeg/builds/] -> release builds .zip file
- FFMPEG is used to extract audio and set it on audioPath
- Send audioPath to transcribe Util
- Use ElevenLabs API to transcribe
    - (ELevenLabs)[https://elevenlabs.io/docs/api-reference/speech-to-text/convert]
- Send transcription to GROQ to create summary from transcription
    - (GROQ)[https://console.groq.com/docs/text-chat]
- Create mongo doc using all the data and return it