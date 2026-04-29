import { groq, AI_MODEL } from "../config/ai.js";

export const generateAiContent = async (category: string, tone: string, draftContent: string): Promise<string> => {
  try {
    // Groq API 호출
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "당신은 세심하고 다정한 편지 작성 도우미입니다. 사용자의 초안을 바탕으로 자연스러운 한국어 편지를 작성하세요. 설명 없이 결과물만 출력하세요."
        },
        {
          role: "user",
          content: `
            Task: Rephrase the draft into a letter.
            Category: ${category}
            Tone: ${tone}
            Draft: ${draftContent}
            
            Rules:
            - Output ONLY the result.
            - NO introduction, NO explanations.
            - Length: 500 characters or less.
            - Style: Fluent Korean.
          `
        }
      ],
      model: AI_MODEL,
    }).asResponse(); // ai 할당량 확인을 위한 response

    const headers = response.headers;
    console.log("=== Groq 할당량 체크 ===");
    console.log("오늘 남은 횟수 (RPD):", headers.get('x-ratelimit-remaining-requests'));
    console.log("오늘 남은 토큰 (TPD):", headers.get('x-ratelimit-remaining-tokens'));

    // 실제 데이터(JSON) 추출
    const completion = await response.json();

    return completion.choices[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.error("Groq 에러:", error);
    throw error;
  }
};