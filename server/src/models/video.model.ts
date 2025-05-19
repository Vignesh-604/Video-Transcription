import { Schema, model, Document } from "mongoose";

export interface VideoT extends Document {
    filename: string, 
    transcript: string,
    summary: string
}

const videoSchema = new Schema <VideoT>({
  filename: { type: String, required: true },
  transcript: { type: String, required: true },
  summary: { type: String, required: true },
})

export default model<VideoT>("Video", videoSchema)