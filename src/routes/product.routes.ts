import "dotenv/config";
import { Router, Request, Response, NextFunction } from "express";
import { isEmpty } from "../utils/object-empty-check";
import { loginRequired } from "../middlewares/login-required";
import { upload } from "../middlewares/image-upload";
import * as userService from "../services/user.service";
import * as productService from "../services/product.service";

const productRouter = Router();

//* 사진 업로드는 3장으로 제한
productRouter.post("/product", loginRequired, upload.array("many", 3),  async (req, res, next) => {
  //* 저장된 이미지의 메타데이터
  // console.log(req.files);

  //* TODO: 입력값 검증
  
  const title: string = req.body.title;
  const content: string = req.body.content;
  const files = req.files as Express.MulterS3.File[];
  const imgUrls: string[] | null = files.length !== 0 ? files.map((data) => data.location) : null;
  const price: number = Number(req.body.price);
  const userEmail:string = req.userEmail;
  const tags: string[] = req.body.tags.split(',');
  
  //* TODO: 트랜잭션 처리 (Tag -> product -> product-tag)
  //* TODO: 에러 발생시 이미지 삭제

  try {
    console.log(typeof imgUrls, imgUrls);
    productService.createProdcut(title, content, imgUrls, price, userEmail, tags);

  } catch(error) {
    next(error)
  }
  

});

export { productRouter };