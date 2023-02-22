import "dotenv/config";
import { Router, Request, Response, NextFunction } from "express";
import { isEmpty } from "../utils/object-empty-check";
import { loginRequired } from "../middlewares/login-required";
import { upload } from "../middlewares/image-upload";
import * as userService from "../services/user.service";
import * as productService from "../services/product.service";

const productRouter = Router();

/**
 * @openapi
 * '/api/product':
 *  post:
 *    tags:
 *      - Product
 *    summary: Register a new product
 *    security:
 *      - bearerAuth: []
 *    description: 새로운 상품이 등록되면, 이 API는 상품 테이블, 태그 테이블 및 상품-태그 테이블에 레코드를 생성합니다.<br> 기존에 존재하는 태그의 경우 새롭게 레코드를 생성하지 않습니다.<br><br> 상품 테이블에는 상품의 기본정보인 제목, 본문, 가격 및 사진이 저장됩니다.<br> 태그 테이블에는 태그 이름이 저장되며, 태그-상품 테이블에는 상품 ID와 태그 ID가 저장됩니다.
 *    requestBody:
 *     required: true
 *     content:
 *       multipart/form-data:
 *         schema:
 *           $ref: '#/components/schemas/CreateProductInput'
 *    responses:
 *      201:
 *        description: 상품 업로드 성공시 "SUCCESS" 반환
 *      400:
 *        description: Bad Request
 */
productRouter.post("/product", loginRequired, upload.array("imgs", 3), async (req, res, next) => {
  //* TODO: 입력값 검증
  const title: string = req.body.title;
  const content: string = req.body.content;
  const files = req.files as Express.MulterS3.File[];
  const imgUrls: string[] = files.length !== 0 ? files.map((data) => data.location) : [];
  const price: number = Number(req.body.price);
  const userEmail: string = req.userEmail;
  const tags: string[] = req.body.tags.split(",");

  try {
    //* TODO: 에러 발생시 이미지 삭제
    await productService.createProdcut(title, content, imgUrls, price, userEmail, tags);

    res.status(201).send("SUCCESS");
  } catch (error) {
    next(error);
  }
});

productRouter.get("/product/:id", async (req, res, next) => {
  const productId = Number(req.params.id);

  try {
    const productDetail = await productService.getProductDetail(productId);

    res.status(200).send(productDetail);
  } catch (error) {
    next(error);
  }
});

export { productRouter };
