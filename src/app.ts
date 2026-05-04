import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import mainRoutes from "./routes/main.routes.js";
import { checkOrIssueToken } from "./utils/middlewares/auth.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json(swaggerSpec);
});

app.use("/api", checkOrIssueToken);
app.use("/api", mainRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("🚀 Pack-IT 백엔드 서버가 정상적으로 켜져 있습니다!");
});

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT} 에서 성공적으로 실행 중입니다!`);
  console.log(`📚 API 명세서 주소: http://localhost:${PORT}/api-docs`);
});
