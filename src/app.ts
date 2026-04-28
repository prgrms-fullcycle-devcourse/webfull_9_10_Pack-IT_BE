import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import cookieParser from "cookie-parser";
import mainRoutes from "./routes/main.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/", mainRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req: Request, res: Response) => {
  res.send("🚀 Pack-IT 백엔드 서버가 정상적으로 켜져 있습니다!");
});

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT} 에서 성공적으로 실행 중입니다!`);
  console.log(`📚 API 명세서 주소: http://localhost:${PORT}/api-docs`);
});
