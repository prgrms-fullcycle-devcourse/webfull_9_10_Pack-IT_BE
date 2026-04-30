import type { Request, Response, NextFunction } from "express";

// 에러 핸들러
export const catchAsync = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

// 에러 클래스 
export class AppError extends Error {
  public statusCode: number;

  constructor(errorConfig: { status: number; message: string }, customMessage?: string) {
    super(customMessage || errorConfig.message);
    
    this.statusCode = errorConfig.status;
    
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// 성공 응답
export const SUCCESS = (data: any = null) => ({
  success: true,
  data,
  meta: null,
  error: null,
});


export const ERROR = {
  UNAUTHORIZED: {
    status: 401,
    message: "인증 토큰이 없거나 유효하지 않습니다",
  },
  FORBIDDEN: {
    status: 403,
    message: "해당 작업에 대한 권한이 없습니다",
  },
  NOT_FOUND: {
    status: 404,
    message: "요청한 리소스를 찾을 수 없습니다",
  },
  BAD_REQUEST: {
    status: 400,
    message: "잘못된 요청입니다",
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    message: "서버 오류가 발생했습니다.",
  },
} as const;

