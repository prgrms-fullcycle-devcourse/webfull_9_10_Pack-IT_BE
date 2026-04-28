import jwt from "jsonwebtoken";
import axios from "axios";
import prisma from "../config/db.js";

export const authService = {
  linkKakaoAccount: async (nanoId: string, kakaoCode: string) => {
    try {
      const tokenResponse = await axios.post(
        "https://kauth.kakao.com/oauth/token",
        {
          grant_type: "authorization_code",
          client_id: process.env.KAKAO_REST_API_KEY,
          redirect_uri: process.env.KAKAO_REDIRECT_URI,
          code: kakaoCode,
        },
        {
          headers: {
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        },
      );

      const kakaoAccessToken = tokenResponse.data.access_token;

      const userResponse = await axios.get(
        "https://kapi.kakao.com/v2/user/me",
        {
          headers: {
            Authorization: `Bearer ${kakaoAccessToken}`,
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        },
      );

      const { id: kakaoUid, kakao_account } = userResponse.data;
      const email = kakao_account?.email || null;
      const nickname = kakao_account?.profile?.nickname || "새로운 멤버";

      const updatedUser = await prisma.user.update({
        where: { nanoId: nanoId },
        data: {
          kakaoUid: String(kakaoUid),
          email: email,
          nickname: nickname,
          userType: "MEMBER",
        },
      });

      const accessToken = jwt.sign(
        { nano_id: updatedUser.nanoId, user_type: "MEMBER" },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" },
      );

      return accessToken;
    } catch (error) {
      console.error("카카오 인증 서비스 통신 에러:", error);
      throw new Error("카카오 서버와 통신하는 중 문제가 발생했습니다.");
    }
  },
};
