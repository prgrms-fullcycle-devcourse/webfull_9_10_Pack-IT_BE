import { Router, type Request, type Response } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validateRequest } from "../utils/middlewares/validator.js";
import { kakaoCallbackSchema } from "../schemas/authSchema.js";

const authRouter: Router = Router();

/**
 * @openapi
 * /api/auth/kakao/callback:
 *   get:
 *     summary: "카카오 연동 로그인 콜백"
 *     description: "카카오 서버로부터 발급받은 인가 코드를 전달받아 유저를 MEMBER로 승격시키고 리다이렉트합니다."
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: "카카오 인가 코드"
 *       - in: query
 *         name: state
 *         required: true
 *         schema:
 *           type: string
 *         description: "임시 유저의 nanoId"
 *     responses:
 *       302:
 *         description: "로그인 성공 및 리다이렉트"
 *       400:
 *         description: "필수 데이터 누락"
 *       500:
 *         description: "서버 내부 오류"
 */
authRouter.get(
  "/kakao/callback",
  validateRequest(kakaoCallbackSchema),
  authController.kakaoLoginCallback,
);

export default authRouter;
