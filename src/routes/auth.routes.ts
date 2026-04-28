import { Router, type Request, type Response } from "express";
import { authService } from "../services/auth.service.js";
import { checkOrIssueToken } from "../utils/middlewares/auth.js";

const router: Router = Router();

router.get(
  "/kakao/callback",
  checkOrIssueToken,
  async (req: Request, res: Response) => {
    try {
      const code = req.query.code as string;
      if (!code) {
        return res.status(400).json({ message: "인가 코드가 누락되었습니다." });
      }

      const currentNanoId = req.user!.nano_id;

      const newAccessToken = await authService.linkKakaoAccount(
        currentNanoId,
        code,
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
      });

      const isVercel = req.headers.host?.includes("54.180.159.211");
      const redirectUrl = isVercel
        ? "https://webfull-9-10-pack-it-fe.vercel.app"
        : "http://localhost:3000";

      res.redirect(redirectUrl);
    } catch (error) {
      console.error("카카오 로그인 라우터 에러 :", error);
      res.status(500).send("로그인 처리 중 오류가 발생했습니다.");
    }
  },
);

export default router;
