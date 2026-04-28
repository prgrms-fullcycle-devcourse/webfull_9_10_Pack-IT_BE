import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pack-IT API 명세서",
      version: "1.0.0",
      description: "Pack-IT 백엔드 API 문서입니다.",
    },
    servers: [
      {
        url: "http://54.180.159.211:8080",
        description: "배포 서버",
      },
      {
        url: "http://localhost:8080",
        description: "로컬 테스트 서버",
      },
    ],
  },
  //주석을 읽어올 경로
  apis: ["./src/routes/*", "./src/controllers/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
