import prisma from "../config/db.js";
import bcrypt from "bcrypt";

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