import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import "dotenv/config";

export function loginRequired(req: Request, res: Response, next: NextFunction) {
  const userToken = req.headers["authorization"]?.split(" ")[1];

  if (!userToken || userToken === "null") {
    res.status(403).json({
      result: "forbidden-approach",
      reason: "로그인한 유저만 사용할 수 있는 서비스입니다.",
    });

    return;
  }

  try {
    const secretKey = process.env.JWT_SECRET_KEY as string;
    const jwtDecoded = jwt.verify(userToken, secretKey) as jwt.JwtPayload;

    // 정상적인 토큰일 경우, userEmail을 request 객체에 저장
    req.userEmail = jwtDecoded.userEmail;

    next();
  } catch (err) {
    res.status(403).json({
      result: "forbidden-approach",
      reason: "정상적인 토큰이 아닙니다.",
    });

    return;
  }
}
