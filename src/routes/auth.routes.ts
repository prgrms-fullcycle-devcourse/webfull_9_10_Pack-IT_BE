import { Router, type Request, type Response } from "express";
import { authService } from "../services/auth.service.js";
import { validateRequest } from "../utils/middlewares/validator.js";
import { kakaoCallbackSchema } from "../schemas/authSchema.js";

const authRouter: Router = Router();

/**
 * @swagger
 * /api/auth/kakao/callback:
 * get:
 * summary: 카카오 연동 로그인 처리
 * description: 프론트엔드가 전달한 카카오 인가 코드를 이용해 유저를 MEMBER로 승격시키고 새로운 JWT 쿠키를 발급합니다.
 * tags: [Auth]
 * parameters:
 * - in: query
 * name: code
 * required: true
 * schema:
 * type: string
 * description: 카카오 서버에서 넘겨준 인가 코드
 * responses:
 * 302:
 * description: 로그인 성공 (프론트엔드 메인 페이지로 리다이렉트)
 * 400:
 * description: 필수 데이터(인가 코드) 누락 (Zod 에러)
 * 500:
 * description: 서버 내부 오류 또는 카카오 통신 실패
 */
authRouter.get(
  "/kakao/callback",
  validateRequest(kakaoCallbackSchema),
  async (req: Request, res: Response) => {
    try {
      const code = req.query.code as string;
      const currentNanoId = req.user!.nanoId;

      const newAccessToken = await authService.linkKakaoAccount(
        currentNanoId,
        code,
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 60 * 60 * 1000,
      });

      const redirectUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      res.redirect(redirectUrl);
    } catch (error) {
      console.error("카카오 로그인 실패:", error);
      res.status(500).json({
        success: false,
        message: "카카오 로그인 중 오류가 발생했습니다.",
      });
    }
  },
);

export default authRouter;
