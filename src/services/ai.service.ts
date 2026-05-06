import { groq, AI_MODEL } from "../config/ai.js";
import { AppError, ERROR } from "../utils/constants/response.js";

export const generateAiContent = async (
  category: string,
  tone: string,
  draftContent: string,
): Promise<string> => {
  try {
    // Groq API 호출
    const response = await groq.chat.completions
      .create({
        messages: [
          {
            role: "system",
            content: `너는 다정하고 예의 바른 한국어 편지 작성 전문가야. 
            [제약 사항]
            1. 반드시 편지의 '본문' 내용만 출력해.
            2. '받는 사람'과 '보내는 사람'에 대한 인삿말이나 맺음말은 절대 포함하지 마. (예: [이름]에게, [보내는 사람] 드림 등 금지)
            3. [이름], [날짜], [장소], OO 등 어떤 형태의 자리 표시자(Placeholder)도 사용하지 마.
            4. 이름을 써야 할 상황이면 '너', '그대', '당신' 같은 대명사를 쓰거나 문맥상 자연스럽게 생략해.
            5. 설명 없이 오직 다듬어진 본문 결과물만 출력해.`,
          },
          {
            role: "user",
            content: `
            Task: Rephrase the draft into a letter.
            Category: ${category}
            Tone: ${tone}
            Draft: ${draftContent}
            
            Rules:
            - Output ONLY the body text. 
            - STRICTLY FORBIDDEN: Any placeholders like [Name], [Date], or [Sender].
            - DO NOT include Salutations or Sign-offs.
            - Length: 500 characters or less.
            - Style: Fluent Korean.
          `,
          },
        ],
        model: AI_MODEL,
      })
      .asResponse(); // ai 할당량 확인을 위한 response

    const headers = response.headers;
    console.log("=== Groq 할당량 체크 ===");
    console.log(
      "오늘 남은 횟수 (RPD):",
      headers.get("x-ratelimit-remaining-requests"),
    );
    console.log(
      "오늘 남은 토큰 (TPD):",
      headers.get("x-ratelimit-remaining-tokens"),
    );

    // 할당량 부족 시 조기에 에러 처리
    const remainingRequests = headers.get('x-ratelimit-remaining-requests');
    
    if (remainingRequests === '0') {
      throw new AppError(ERROR.INTERNAL_SERVER_ERROR, "AI 서비스 일일 사용량을 초과했습니다. 내일 다시 시도해주세요.");
    }

    // 실제 데이터(JSON) 추출
    const completion = await response.json();
    const content = (completion as any).choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new AppError(ERROR.INTERNAL_SERVER_ERROR, "AI가 문구를 생성하지 못했습니다. 다시 시도해주세요.");
    }

    return content;
  } catch (error) {
    console.error("Groq 서비스 에러:", error);

    // 이미 AppError인 경우는 그대로, 그 외의 예기치 못한 에러는 INTERNAL_SERVER_ERROR 출력
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new AppError(ERROR.INTERNAL_SERVER_ERROR, "AI 문구 생성 도중 서버 에러가 발생했습니다.");
  }
};
