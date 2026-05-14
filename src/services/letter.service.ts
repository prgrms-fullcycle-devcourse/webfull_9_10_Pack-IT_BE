import { nanoid } from 'nanoid';
import * as letterRepository from '../repositories/letter.repository.js';
import { AppError, ERROR } from '../utils/constants/response.js';
import bcrypt from 'bcrypt';
import { userRepository } from "../repositories/user.repository.js";

/**
 * 최종 편지 생성 및 DB 저장 서비스
 */
export const createLetter = async (letterData: any, verifiedNanoId: string) => {
  try {
    // nano_id를 이용해 User 테이블에서 실제 고유 숫자 id를 조회
    const user = await userRepository.findUserByNanoId(verifiedNanoId);
    
    if (!user) {
      throw new AppError(ERROR.NOT_FOUND, "유저 정보를 찾을 수 없습니다.");
    }
    // 공유 링크용 고유 ID 생성
    const letterLinkId = nanoid();

    // Repository를 통해 Prisma로 DB 저장
    const savedLetter = await letterRepository.saveLetter({
      nano_id: letterLinkId,
      ...letterData,
      sender_id: user.id
    });

    // 생성된 데이터 반환 (프론트에는 ID와 생성일 등을 돌려줌)
    return {
      letter_id: savedLetter.id,
      published_at: savedLetter.publishedAt
    };
  } catch (error) {
    console.error("Letter Service 저장 에러:", error);

    // 이미 정의된 AppError라면 그대로 던지고, 
    // 그 외의 예기치 못한 에러는 INTERNAL_SERVER_ERROR 처리
    if (error instanceof AppError) throw error;

    throw new AppError(ERROR.INTERNAL_SERVER_ERROR, "편지 저장에 실패했습니다.");
  }
};

// 편지 상세 조회 데이터
export const getLetterDetail = async (letterId: string) => {
  const letter = await letterRepository.findLetterById(letterId);

  // 데이터가 없을 때 예외 처리
  if (!letter) {
    throw new AppError(ERROR.NOT_FOUND, "해당 편지를 찾을 수 없습니다.");
  }

  // letter 객체 반환
  const { password, ...letterWithoutPassword } = letter;

  return {
    ...letterWithoutPassword
  };
};

// 비밀번호 유무 확인 응답 및 에러 처리
export const checkLetterPasswordExistence = async (letterId: string) => {
  const letter = await letterRepository.findLetterPasswordById(letterId);

  if (!letter) {
    throw new AppError(ERROR.NOT_FOUND, "해당 편지를 찾을 수 없습니다.");
  }

  return {
    hasPassword: !!letter.password
  };
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

  const mappedData = rows.map((row: any) => {
    const { password, ...letterWithoutPassword } = row.letter || {};
    
    return {
      id: row.id,          
      ...letterWithoutPassword, 
      createdAt: letterWithoutPassword.publishedAt || null 
    };
  });

  const hasNextPage = mappedData.length > 10;
  const finalData = hasNextPage ? mappedData.slice(0, 10) : mappedData;
  const nextCursor = hasNextPage ? finalData[finalData.length - 1].id : null;

  return { letters: finalData, nextCursor };
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
      where: { userId: Number(userId) },
      orderBy: { id: 'desc' },
      include: {
        letter: true,
      },
    };

if (cursor && cursor > 0) {
    queryOptions.cursor = { id: cursor };
    queryOptions.skip = 1; 
  }

  const rows = await letterRepository.findReceivedLetters(queryOptions);

  const mappedData = rows.map((row: any) => {
    const { password, ...letterWithoutPassword } = row.letter || {};
    
    return {
      id: row.id,          
      ...letterWithoutPassword, 
      createdAt: letterWithoutPassword.publishedAt || null 
    };
  });

  const hasNextPage = mappedData.length > 10;
  const finalData = hasNextPage ? mappedData.slice(0, 10) : mappedData;
  const nextCursor = hasNextPage ? finalData[finalData.length - 1].id : null;

  return { letters: finalData, nextCursor };
  }

  
// 보관한 편지 삭제
export const deleteSavedLetter = async (userId: number, letterId: string) => {
  await letterRepository.deleteSavedLetter(userId, letterId);
}

// 편지 열람 비밀번호 확인 api
export const verifyLetterPassword = async (letterId: string, inputPassword: string) => {
  // DB에서 해당 편지 조회
  const letter = await letterRepository.findLetterById(letterId);

  // 편지가 존재하지 않는 경우 (404)
  if (!letter) {
    throw new AppError(ERROR.NOT_FOUND, "해당 편지를 찾을 수 없습니다.");
  }

  // 비밀번호가 설정되지 않은 편지인 경우
  if (!letter.password) {
    // 프론트에서 비밀번호를 입력해서 보냈다면(inputPassword가 존재) -> 잘못된 요청
    if (inputPassword) {
      throw new AppError(ERROR.UNAUTHORIZED, "이 편지는 비밀번호가 설정되지 않았습니다.");
    }
    // 비밀번호가 없고, 입력도 안 했다면 -> 정상 통과
    return { isCorrect: true };
  }

  // bcrypt를 이용해 비밀번호 비교
  const isMatch = await bcrypt.compare(inputPassword.toString(), letter.password); 

  // 비밀번호가 틀린 경우 (401)
  if (!isMatch) {
    throw new AppError(ERROR.UNAUTHORIZED, "비밀번호가 일치하지 않습니다.");
  }

  // 일치하면 성공 반환
  return { isCorrect: true };
};
