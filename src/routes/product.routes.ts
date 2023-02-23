import "dotenv/config";
import { Router, Request, Response, NextFunction } from "express";
import { loginRequired } from "../middlewares/login-required";
import { upload } from "../middlewares/image-upload";
import * as userService from "../services/user.service";
import * as productService from "../services/product.service";
import { validationResult } from "express-validator";
import { createProdcutValidator } from "../middlewares/validation-check";
import { User } from "types/user";


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
 *    description: ※로그인 한 유저만 사용할 수 있습니다. 토큰을 입력해 주세요.<br><br>새로운 상품이 등록되면, 이 API는 상품 테이블, 태그 테이블 및 상품-태그 테이블에 레코드를 생성합니다.<br> 기존에 존재하는 태그의 경우 새롭게 레코드를 생성하지 않습니다.<br><br> 상품 테이블에는 상품의 기본정보인 제목, 본문, 가격 및 사진이 저장됩니다.<br> 태그 테이블에는 태그 이름이 저장되며, 태그-상품 테이블에는 상품 ID와 태그 ID가 저장됩니다.
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
productRouter.post("/product", loginRequired, upload.array("imgs", 3), createProdcutValidator, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() }); 
    }

    const title: string = req.body.title;
    const content: string = req.body.content;
    const files = req.files as Express.MulterS3.File[];
    const imgUrls: string[] = files.length !== 0 ? files.map((data) => data.location) : [];
    const price: number = Number(req.body.price);
    const userEmail: string = req.userEmail;
    const tags: string[] = req.body.tags;
    
    //* TODO: 에러 발생시 이미지 삭제
    await productService.createProdcut(title, content, imgUrls, price, userEmail, tags);

    res.status(201).send("SUCCESS");
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * '/api/product/{id}':
 *  get:
 *   tags:
 *     - Product
 *   summary: Get product detail page
 *   security:
 *     - bearerAuth: []
 *   description: ※로그인 한 유저만 사용할 수 있습니다. 토큰을 입력해 주세요.<br><br> 해당 상품 ID에 대한 상품 상세 정보를 조회합니다.
 *   parameters:
 *     - name: id
 *       in: path
 *       description: 조회하고자 하는 상품의 ID
 *       required: true
 *       default: 62
 *       schema:
 *         type: integer
 *   responses:
 *     '200':
 *       description: 상품 정보 조회 성공
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductDetail'
 *     '400':
 *       description: Bad Request
 */
productRouter.get("/product/:id", loginRequired, async (req, res, next) => {
  try {
    const productId = Number(req.params.id);

    // 로그인 한 유저의 ID 취득, 요청 주체가 좋아요를 눌렀는지 확인하기 위함
    const email: string = req.userEmail;
    const user: User = await userService.getUserByEmail(email);
    const productDetail = await productService.getProductDetail(productId, user.id);

    res.status(200).send(productDetail);
  } catch (error) {
    next(error);
  }
});

export { productRouter };
