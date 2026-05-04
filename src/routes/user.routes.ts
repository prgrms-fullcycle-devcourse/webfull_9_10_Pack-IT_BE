import { Router, type Request, type Response } from "express";
import prisma from "../config/db.js";

const userRouter: Router = Router();

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: 내 정보 조회 (GUEST / MEMBER)
 *     description: 현재 접속 중인 유저의 쿠키(토큰)를 기반으로 데이터베이스에서 유저의 상세 정보를 불러옵니다.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: 유저 정보 조회 성공
 *       401:
 *         description: 유효한 토큰이 없음
 *       404:
 *         description: DB에서 유저를 찾을 수 없음
 */
userRouter.get("/me", async (req: Request, res: Response) => {
  try {
    const currentNanoId = req.user!.nanoId;

    const userInfo = await prisma.user.findUnique({
      where: { nanoId: currentNanoId },
    });

    if (!userInfo) {
      return res
        .status(404)
        .json({ success: false, message: "유저 정보를 찾을 수 없습니다." });
    }

    res.status(200).json({
      success: true,
      message: "내 정보 조회 완료",
      data: userInfo,
    });
  } catch (error) {
    console.error("내 정보 조회 에러:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 내부 오류가 발생했습니다." });
  }
});

export default userRouter;
