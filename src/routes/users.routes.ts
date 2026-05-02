import express, { Router, type Request, type Response } from 'express';
import { catchAsync } from "../utils/constants/response.js";
import { checkOrIssueToken } from "../utils/middlewares/auth.js";
import * as letterService from "../services/letter.service.js";
const router: Router = express.Router();
// 내가 쓴 편지 목록
router.get("/me/letters/sent", checkOrIssueToken, catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    let { cursor } = req.query;

    const letters = await letterService.getLettersByUserId(user.nano_id, cursor);

    return res.status(200).json({
      success: true,
      data: {
        uuid: user?.uuid,
        email: user?.email,
        name: user?.name,
        profileImage: user?.profileImage,
      },
      meta: {
        nextCursor: letters.nextCursor,
        hasNextPage: letters.nextCursor !== null,
      },
      error: null,
    }); 
  })
);

// 받은 편지 보관하기 (수신자가 내 계정에 저장)
router.post("/me/letters/received", catchAsync(async (req: any, res: Response) => {
}));

// 받은 편지 목록
router.get("/me/letters/received", catchAsync(async (req: any, res: Response) => {
}));
// 보관한 편지 삭제
router.delete("/me/letters/received/:letterId", catchAsync(async (req: any, res: Response) => {
}));


export default router;