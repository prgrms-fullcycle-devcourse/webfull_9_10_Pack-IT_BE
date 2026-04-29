import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import fs from "fs";
import path from "path";
import "dotenv/config";

const isProduction = process.env.NODE_ENV === "production" || process.env.DB_HOST?.includes("rds.amazonaws.com");

// SSL 설정 객체를 환경에 따라 다르게 구성
const sslConfig = isProduction ? {
  rejectUnauthorized: true,
  ca: fs.readFileSync(path.join(process.cwd(), "global-bundle.pem")),
} : false; // 로컬 환경일 때는 SSL off

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: sslConfig, 
});

pool.on('connect', (client) => {
  client.query('SET search_path TO public');
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export default prisma;
