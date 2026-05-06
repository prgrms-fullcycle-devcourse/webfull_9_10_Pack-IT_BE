import express, { Router, type Request, type Response } from 'express';
import { catchAsync } from "../utils/constants/response.js";
import { checkOrIssueToken } from "../utils/middlewares/auth.js";
import * as letterService from "../services/letter.service.js";
const router: Router = express.Router();

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


export default router;