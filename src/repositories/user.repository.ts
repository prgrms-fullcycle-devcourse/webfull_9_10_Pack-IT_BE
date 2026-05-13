import prisma from "../config/db.js";

export const userRepository = {
  // nanoId로 유저 찾기
  findUserByNanoId: async (nanoId: string) => {
    return await prisma.user.findUnique({
      where: { nanoId: nanoId },
    });
  },
  // GUEST 생성
  createGuestUser: async (nanoId: string) => {
    await prisma.user.create({
      data: {
        nanoId: nanoId,
        userType: "GUEST",
      },
    });
  },

  // MEMBER 승격
  updateToMember: async (
    nanoId: string,
    kakaoUid: string,
    email: string,
    nickname: string,
  ) => {
    await prisma.user.update({
      where: { nanoId: nanoId },
      data: {
        kakaoUid: kakaoUid,
        email: email,
        nickname: nickname,
        userType: "MEMBER",
      },
    });
  },
};

export const findByNanoId = async (nanoId: string) => {
  return await prisma.user.findFirst({
    where: {
      nanoId: nanoId, 
    },
    select: {
      id: true, 
    }
  });
};