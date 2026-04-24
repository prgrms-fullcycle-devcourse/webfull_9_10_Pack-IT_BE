import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        nano_id: string;
        user_type: "MEMBER" | "GUEST";
      };
    }
  }
}
