import { z } from "zod";

export const kakaoCallbackSchema = z.object({
  query: z.object({
    code: z.string({ message: "카카오 인가 코드가 필요합니다." }),
    state: z.string({ message: "유저 식별용 state(nanoId) 값이 필요합니다." }),
  }),
});
