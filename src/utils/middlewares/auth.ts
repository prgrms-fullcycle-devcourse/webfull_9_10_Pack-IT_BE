import { type Request, type Response, type NextFunction } from "express";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import { userRepository } from "../../repositories/user.repository.js";

export const checkOrIssueToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token = req.cookies?.accessToken;

    // 토큰 재발급
    if (!token) {
      const newNanoId = nanoid(10);

      await userRepository.createGuestUser(newNanoId);

      token = jwt.sign(
        { nano_id: newNanoId, user_type: "GUEST" },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" },
      );

      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      req.user = { nano_id: newNanoId, user_type: "GUEST" };
      return next();
    }

    // 토큰 검증
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        nano_id: string;
        user_type: "MEMBER" | "GUEST";
      };
      req.user = { nano_id: decoded.nano_id, user_type: decoded.user_type };
      next();
    } catch (err) {
      res.clearCookie("accessToken");
      return res
        .status(401)
        .json({ message: "인증이 만료되었습니다. 다시 시도해주세요." });
    }
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res
      .status(500)
      .json({ message: "서버 인증 과정에서 에러가 발생했습니다." });
  }
};
