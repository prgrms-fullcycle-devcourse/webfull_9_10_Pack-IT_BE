import prisma from "../config/db.js";

// 편지 데이터 저장
export const saveLetter = async (letterData: any) => {
  try {
    return await prisma.letter.create({
      data: {
        id: letterData.nano_id,
        senderId: letterData.sender_id || null,
        senderName: letterData.sender_name,
        receiverName: letterData.receiver_name,
        category: letterData.category,
        content: letterData.content,
        theme: letterData.theme,
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