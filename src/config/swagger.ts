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
        url: process.env.DEPLOY_SERVER_URL,
        description: "배포 서버",
      },
      {
        url: process.env.LOCAL_SERVER_URL,
        description: "로컬 테스트 서버",
      },
    ],
  },
  //주석을 읽어올 경로
  apis: [
    "./src/routes/*.ts", // 로컬 개발 환경용 라우터
    "./src/controllers/*.ts", // 로컬 개발 환경용 컨트롤러
    "./dist/routes/*.js", // EC2 배포 환경용 라우터 (빌드 폴더가 dist인 경우)
    "./dist/controllers/*.js", // EC2 배포 환경용 컨트롤러
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
