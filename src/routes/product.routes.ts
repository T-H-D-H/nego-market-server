import "dotenv/config";
import { Router, Request, Response, NextFunction } from "express";
import { isEmpty } from "../utils/object-empty-check";
import { loginRequired } from "../middlewares/login-required";
import { upload } from "../middlewares/image-upload";

const productRouter = Router();

//* 사진 업로드는 3장으로 제한
productRouter.post("/product", upload.array("many", 3), (req, res) => {
  // 저장된 이미지의 메타데이터
  console.log(req.files);

});

export { productRouter };
