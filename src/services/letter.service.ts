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

// 편지 상세 조회 데이터
export const getLetterDetail = async (letterId: string) => {
  const letter = await letterRepository.findLetterById(letterId);

  // 데이터가 없을 때 예외 처리
  if (!letter) {
    const error: any = new Error("해당 편지를 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }

  return letter;
};

// 내가 쓴 편지 목록 조회 (무한 스크롤)
export const getLettersByUserId = async (userId: string, cursor?: number | null) => {
  const fetchLimit = 11;

  const queryOptions: any = {
    take: fetchLimit,
    where: { senderId: Number(userId) },
    orderBy: { id: 'desc' },
  };

  if (cursor && cursor > 0) {
    queryOptions.cursor = { id: cursor };
    queryOptions.skip = 1; 
  }
  const rows = await letterRepository.findLettersById(queryOptions);

  const hasNextPage = rows.length > 10;
  const data = hasNextPage ? rows.slice(0, 10) : rows;
  const nextCursor = hasNextPage ? data[data.length - 1]!.id : null;
  return { letters: data, nextCursor };
}

// 받은 편지 보관하기 (수신자가 내 계정에 저장)
export const saveReceivedLetter = async (userId: number, letterId: string) => {
  const savedLetter = await letterRepository.saveReceivedLetter(userId, letterId);
  return savedLetter;
}

  // 받은 편지 목록 조회 (무한 스크롤)
  export const getReceivedLetters = async (userId: number, cursor?: number | null) => {
    const fetchLimit = 11;

    const queryOptions: any = {
      take: fetchLimit,
      where: { receivedId: Number(userId) },
      orderBy: { id: 'desc' },
    };

    if (cursor && cursor > 0) {
      queryOptions.cursor = { id: cursor };
      queryOptions.skip = 1; 
    }
    const rows = await letterRepository.findReceivedLetters(queryOptions);

    const hasNextPage = rows.length > 10;
    const data = hasNextPage ? rows.slice(0, 10) : rows;
    const nextCursor = hasNextPage ? data[data.length - 1]!.id : null;
    return { letters: data, nextCursor };
  }

// 보관한 편지 삭제
export const deleteSavedLetter = async (userId: number, letterId: string) => {
  await letterRepository.deleteSavedLetter(userId, letterId);
}