import { type Request, type Response, type NextFunction } from "express";
import type { ZodSchema } from "zod";
import { ZodError } from "zod";

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ success: false, errors: error.issues });
      } else {
        res
          .status(400)
          .json({ success: false, message: "잘못된 데이터 형식입니다." });
      }
    }
  };
};
