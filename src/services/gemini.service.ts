import { geminiModel } from "../config/gemini.js";

export const generateLetterContent = async (category: string, tone: string, draftContent: string): Promise<string> => {
  try {
    // 프롬프트 설계
  const prompt = `
    Task: Rephrase the draft into a letter.
    Category: ${category}
    Tone: ${tone}
    Draft: ${draftContent}
    
    Rules:
    - Output ONLY the result.
    - NO introduction, NO explanations.
    - Length: 500 characters or less.
    - Style: Fluent Korean.
  `;

  // 모델 실행
  const result = await geminiModel.generateContent(prompt);
  const response = await result.response; 
    const text = response.text();
    
    if (!text) throw new Error("AI가 빈 응답을 보냈습니다.");
    return text.trim();
  } catch (error) {
    console.error("Gemini Service 내부 에러:", error);
    throw error; 
  }
};