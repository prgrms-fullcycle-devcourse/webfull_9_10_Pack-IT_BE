import express, { Router, type Request, type Response } from 'express';
import { catchAsync } from "../utils/constants/response.js";
import { checkOrIssueToken } from "../utils/middlewares/auth.js";
import * as letterService from "../services/letter.service.js";
import prisma from "../config/db.js";
const router = Router();

const userRouter: Router = Router();

// 내가 쓴 편지 목록 무한 스크롤
router.get("/me/letters/sent", checkOrIssueToken, catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const cursor = req.query.cursor ? Number(req.query.cursor) : null;

  if (!user) {
    throw new Error("인증되지 않은 사용자입니다."); // 에러 코드 수정
  }

  const letters = await letterService.getLettersByUserId(user.nano_id, cursor);

  return res.status(200).json({
    success: true,
    data: {
      nano_id: user?.nano_id,
    },
    meta: {
      nextCursor: letters.nextCursor,
      hasNextPage: letters.nextCursor !== null,
    },
    error: null,
  }); 
}));

// 받은 편지 보관하기 (수신자가 내 계정에 저장)
router.post("/me/letters/received", checkOrIssueToken, catchAsync(async (req: any, res: Response) => {
  const user = req.user;
  const { letterId } = req.body;

  const letter = await letterService.saveReceivedLetter(user.nano_id, letterId);
  return res.status(200).json({
    success: true,
    data: letter,
    error: null,
  });
}));

// 받은 편지 목록 조회 (무한 스크롤)
router.get("/me/letters/received", checkOrIssueToken, catchAsync(async (req: any, res: Response) => {
  const user = req.user;
  let { cursor } = req.query;

  const letters = await letterService.getReceivedLetters(user.nano_id, cursor);

  return res.status(200).json({
    success: true,
    data: letters.letters,
    meta: {
      nextCursor: letters.nextCursor,
      hasNextPage: letters.nextCursor !== null,
    },
    error: null,
  });
}));
// 보관한 편지 삭제
router.delete("/me/letters/received/:letterId", checkOrIssueToken, catchAsync(async (req: any, res: Response) => {
  const user = req.user;
  const { letterId } = req.params;

  await letterService.deleteSavedLetter(user.nano_id, letterId);

  return res.status(200).json({
    success: true,
    data: null,
    meta: null,
    error: null,
  });
}));




/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: 내 정보 조회
 *     description: 글로벌 미들웨어를 통해 발급/확인된 쿠키(JWT)를 기반으로 현재 접속 중인 유저의 데이터베이스 상세 정보를 조회합니다. (GUEST 및 MEMBER 모두 사용 가능)
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: 내 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nanoId:
 *                       type: string
 *                       example: "a1b2c3d4-e5f6-7890"
 *                     userType:
 *                       type: string
 *                       example: "MEMBER"
 *                     kakaoUid:
 *                       type: string
 *                       nullable: true
 *                       example: "1234567890"
 *                     email:
 *                       type: string
 *                       nullable: true
 *                       example: "user@kakao.com"
 *                     nickname:
 *                       type: string
 *                       example: "즐거운팩잇"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-04T04:15:50.000Z"
 *                 meta:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *       404:
 *         description: 데이터베이스에서 유저를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 meta:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "유저 정보를 찾을 수 없습니다."
 *       500:
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 meta:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "서버 내부 오류가 발생했습니다."
 */
userRouter.get("/me", async (req: Request, res: Response) => {
  try {
    const currentNanoId = req.user!.nano_id;

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

// GET: 보낸 편지 목록 조회
userRouter.get(
  "/me/letters/sent",
  catchAsync(async (req: Request, res: Response) => {
    const user = req.user as any;

    return res.status(200).json({
      success: true,
      data: {
        uuid: user?.uuid,
        email: user?.email,
        name: user?.name,
        profileImage: user?.profileImage,
      },
      error: null,
    });
  }),
);

export default userRouter;
