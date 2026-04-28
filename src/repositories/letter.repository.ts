import { prisma } from '../config/db.js';

export const saveLetter = async (letterData: any) => {
  try {
    return await prisma.letter.create({
      data: {
        id: letterData.nano_id,  // Prisma 스키마의 id(PK)에 nanoid 대입
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