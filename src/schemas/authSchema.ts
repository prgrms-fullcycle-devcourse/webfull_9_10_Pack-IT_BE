import { z } from "zod";

export const kakaoCallbackSchema = z.object({
  query: z.object({
    code: z.string({ message: "카카오 인가 코드가 필요합니다." }),
  }),
});
