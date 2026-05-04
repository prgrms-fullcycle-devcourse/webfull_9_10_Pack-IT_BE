export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        nanoId: string;
        userType: string;
      };
    }
  }
}
