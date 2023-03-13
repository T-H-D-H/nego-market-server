import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import "dotenv/config";

export function checkAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const userToken = req.headers["authorization"]?.split(" ")[1];

      if (!userToken || userToken === "null") {
        req.loginUser = false;

        next();
      } else {
          const secretKey = process.env.JWT_SECRET_KEY as string;
          const jwtDecoded = jwt.verify(userToken as string, secretKey) as jwt.JwtPayload;
  
          // 정상적인 토큰일 경우, userEmail을 request 객체에 저장
          req.userEmail = jwtDecoded.userEmail;
          req.loginUser = true;

          next();
      }
  } catch (err) {
    res.status(403).json({
      result: "forbidden-approach",
      reason: "정상적인 토큰이 아닙니다.",
    });

    return;
  }
}
