import { Router } from "express";
import letterRoutes from "./letters.routes.js";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";

const router: Router = Router();

// ai 편지 문구 변환 Router
router.use("/letters", letterRoutes);
router.use("/users", userRouter);
router.use("/auth", authRouter);

export default router;
