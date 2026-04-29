import { nanoid } from 'nanoid';
import * as letterRepository from '../repositories/letter.repository.js';

/**
 * 최종 편지 생성 및 DB 저장 서비스
 */
export const createLetter = async (letterData: {
  sender_name: string;
  receiver_name: string;
  category: string;
  content: string;
  theme: number;
  sender_id?: number; // 회원일 경우 유저 ID
}) => {
  try {
    // 공유 링크용 고유 ID 생성
    const letterLinkId = nanoid();

    // Repository를 통해 Prisma로 DB 저장
    const savedLetter = await letterRepository.saveLetter({
      nano_id: letterLinkId,
      ...letterData
    });

    // 생성된 데이터 반환 (프론트에는 ID와 생성일 등을 돌려줌)
    return {
      letter_id: savedLetter.id,
      published_at: savedLetter.publishedAt
    };
  } catch (error) {
    console.error("Letter Service 저장 에러:", error);
    throw new Error("편지 저장에 실패했습니다.");
  }
};