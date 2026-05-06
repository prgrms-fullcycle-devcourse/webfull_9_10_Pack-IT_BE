import prisma from "../config/db.js";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/constants/response.js";

// 편지 데이터 저장
export const saveLetter = async (letterData: any) => {
  try {
    let hashedPassword = null;

    // 비밀번호가 있으면 암호화 진행
    if (letterData.password) {
      // 숫자로 들어올 경우, 문자열로 변환 후 해싱
      hashedPassword = await bcrypt.hash(letterData.password.toString(), 10);
    }

    return await prisma.letter.create({
      data: {
        id: letterData.nano_id,
        senderId: letterData.sender_id || null,
        senderName: letterData.sender_name,
        receiverName: letterData.receiver_name,
        category: letterData.category,
        content: letterData.content,
        theme: letterData.theme,
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error("Prisma 저장 에러:", error);
    throw error;
  }
};

// letter_id로 해당 편지 조회
export const findLetterById = async (id: string) => {
  return await prisma.letter.findUnique({
    where: { id }
  });
};

  // user_id로 편지 조회 무한 스크롤
export const findLettersById = async (queryOptions: any) => {
  return await prisma.letter.findMany(queryOptions);
}

// 받은 편지 보관하기 (수신자가 내 계정에 저장)
export const saveReceivedLetter = async (userId: number, letterId: string) => {
  try {
    return await prisma.savedLetter.create({
      data: {
        userId: userId,
        letterId: letterId,   
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new AppError({status: 404, message: '이미 저장했거나 존재하지 않는 편지입니다.' });
    }
  }
};

// 보관한 편지 불러오기 무한 스크롤
export const findReceivedLetters = async (queryOptions: any) => {
  return await prisma.savedLetter.findMany(queryOptions);
}

// 보관한 편지 삭제
export const deleteSavedLetter = async (userId: number, letterId: string) => {
  await prisma.savedLetter.deleteMany({
    where: {
      userId: userId,
      letterId: letterId,
    },
  });
}