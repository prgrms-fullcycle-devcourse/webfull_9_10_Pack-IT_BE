import { Router } from "express";
import letterRoutes from "./letters.routes.js";

const router: Router = Router();

// ai 편지 문구 변환 Router
router.use("/letters", letterRoutes);

export default router;