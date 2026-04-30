import { Router } from "express";
import letterRoutes from "./letters.routes.js";
import userRoutes from "./users.routes.js";
import authRoutes from "./auth.routes.js";

const router: Router = Router();

router.use("/letters", letterRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);

export default router;