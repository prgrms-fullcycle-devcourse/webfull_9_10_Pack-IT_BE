import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

const apiKey = process.env.GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);

// 모델 정의
export const geminiModel = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });