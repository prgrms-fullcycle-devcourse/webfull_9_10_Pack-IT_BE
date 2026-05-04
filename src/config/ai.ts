import Groq from "groq-sdk";
import 'dotenv/config';

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// 모델 정의
export const AI_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";