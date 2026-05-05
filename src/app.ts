import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
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
    origin: ["http://localhost:5173", "webfull-9-10-pack-it-fe.vercel.app"],
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

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.statusCode || 500;

  const message = err.message || "서버 내부 오류가 발생했습니다.";

  console.log("-------------------------------");
  console.log(`[${req.method}] ${req.url}`);
  console.log("상태코드:", status);
  console.log("메시지:", message);
  console.log("-------------------------------");

  res.status(status).json({
    success: false,
    data: null,
    meta: null,
    error: message,
  });
});

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT} 에서 성공적으로 실행 중입니다!`);
  console.log(`📚 API 명세서 주소: http://localhost:${PORT}/api-docs`);
});
