import { Express } from "express-serve-static-core";

// Request 인터페이스 확장
declare module "express-serve-static-core" {
  interface Request {
    userEmail: string;
  }
}
