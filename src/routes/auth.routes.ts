import { Router, type Request, type Response } from "express";
import { authService } from "../services/auth.service.js";
import { validateRequest } from "../utils/middlewares/validator.js";
import { kakaoCallbackSchema } from "../schemas/authSchema.js";

const authRouter: Router = Router();

/**
 * @swagger
 * /api/auth/kakao/callback:
 *   get:
 *     summary: 카카오 연동 로그인 콜백
 *     description: 카카오 서버로부터 발급받은 인가 코드(code)를 전달받아 유저를 MEMBER로 승격시키고, 새로운 JWT 쿠키를 구운 뒤 프론트엔드 메인 페이지로 리다이렉트합니다.
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: "카카오 서버에서 넘겨준 인가 코드"
 *         example: "kauth_code_12345abcdefg..."
 *     responses:
 *       302:
 *         description: 로그인 성공 및 쿠키 발급 완료 (프론트엔드 URL로 리다이렉트)
 *       400:
 *         description: 필수 데이터 누락 (인가 코드가 없는 경우)
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
 *                   type: array
 *                   description: "Zod 유효성 검사 에러 목록"
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         example: "카카오 인가 코드가 필요합니다."
 *       500:
 *         description: 서버 내부 오류 (카카오 통신 실패 등)
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
 *                   example: "카카오 로그인 중 오류가 발생했습니다."
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
