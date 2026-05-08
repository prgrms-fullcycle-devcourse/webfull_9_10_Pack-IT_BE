import { type Request, type Response } from "express";
import { authService } from "../services/auth.service.js";

export const authController = {
  kakaoLoginCallback: async (req: Request, res: Response) => {
    try {
      const kakaoCode = req.query.code as string;
      const nanoId = req.query.state as string;

      if (!kakaoCode || !nanoId) {
        return res.status(400).json({ error: "필수 인증 정보가 부족합니다." });
      }

      const tokens = await authService.linkKakaoAccount(nanoId, kakaoCode);

      res.cookie("accessToken", tokens.accessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60,
        sameSite: "lax", // 크로스 도메인 리다이렉트 대응
      });

      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: "lax",
      });

      const redirectUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(redirectUrl);
    } catch (error) {
      console.error("카카오 로그인 컨트롤러 에러 :", error);
      const errorUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(`${errorUrl}/login?error=auth_failed`);
    }
  },
};
