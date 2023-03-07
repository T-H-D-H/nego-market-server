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
productRouter.post(
  "/product",
  loginRequired,
  upload.array("imgs", 3),
  createProdcutValidator,
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

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
productRouter.get("/product/:id", loginRequired, async (req: Request, res: Response, next: NextFunction) => {
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

//* 좋아요가 많은 순서대로 전체 상품 정보(id, user_id, img, title, price, like_count, address, comment)를 반환
/**
 * @openapi
 * '/api/products':
 *  get:
 *    tags:
 *      - Product
 *    summary: 모든 상품을 좋아요 순으로 가져오기
 *    description: 모든 상품을 좋아요 순으로 정렬하여 반환합니다.
 *    responses:
 *      '200':
 *        description: 상품 정보 조회 성공
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GetProductsByLikes'
 *      '400':
 *        description: Bad Request
 */
productRouter.get("/products", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.getAllProducts();

    res.status(200).send(products);
  } catch (error) {
    next(error);
  }
});

// 전체 상품 리스트 조회 - 로그인한 유저의 주소 (동 > 구 > 시)의 우선순위
/**
 * @openapi
 * '/api/products/my-address':
 *  get:
 *    tags:
 *      - Product
 *    summary: 로그인한 유저의 주소 (동 > 구 > 시)의 우선순위로 가져오기
 *    security:
 *     - bearerAuth: []
 *    description: 모든 상품을 로그인한 유저의 주소 (동 > 구 > 시)의 우선순위로 정렬하여 조회
 *    responses:
 *      '200':
 *        description: 상품 정보 조회 성공
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GetProductsByLikes'
 *      '400':
 *        description: Bad Request
 */
productRouter.get("/products/my-address", loginRequired, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: User = await userService.getUserByEmail(req.userEmail);
    const products = await productService.getAllProductsByUserAddress(user.address_id);

    res.status(200).send(products);
  } catch (error) {
    next(error);
  }
});

// 전체 상품 리스트 조회 - path 파라미터로 전달받은 시에 해당하는 전체 상품
/**
 * @openapi
 * '/api/products/{si}':
 *  get:
 *    tags:
 *      - Product
 *    summary: 시로 전체 상품 가져오기
 *    description: 파라미터로 전달받은 시로 전체 상품 리스트 조회
 *    parameters:
 *     - name: si
 *       in: path
 *       description: 조회하고자 하는 상품의 시
 *       required: true
 *       default: 부산광역시
 *       schema:
 *         type: string
 *    responses:
 *      '200':
 *        description: 상품 정보 조회 성공
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GetProductsByLikes'
 *      '400':
 *        description: Bad Request
 */
productRouter.get("/products/:si", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const si = req.params.si;
    const products = await productService.getAllProductsByUserAddressSi(si);

    res.status(200).send(products);
  } catch (error) {
    next(error);
  }
});

// 전체 상품 리스트 조회 - path 파라미터로 전달받은 시/구에 해당하는 전체 상품
/**
 * @openapi
 * '/api/products/{si}/{gu}':
 *  get:
 *    tags:
 *      - Product
 *    summary: 시/구로 전체 상품 가져오기
 *    description: 파라미터로 전달받은 시/구로 전체 상품 리스트 조회
 *    parameters:
 *     - name: si
 *       in: path
 *       description: 조회하고자 하는 상품의 시
 *       required: true
 *       default: 부산광역시
 *       schema:
 *         type: string
 *     - name: gu
 *       in: path
 *       description: 조회하고자 하는 상품의 구
 *       required: true
 *       default: 수영구
 *       schema:
 *         type: string
 *    responses:
 *      '200':
 *        description: 상품 정보 조회 성공
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GetProductsByLikes'
 *      '400':
 *        description: Bad Request
 */
productRouter.get("/products/:si/:gu", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const si = req.params.si;
    const gu = req.params.gu;
    const products = await productService.getAllProductsByUserAddressSiGu(si, gu);

    res.status(200).send(products);
  } catch (error) {
    next(error);
  }
});

// 전체 상품 리스트 조회 - path 파라미터로 전달받은 시/구/동에 해당하는 전체 상품
/**
 * @openapi
 * '/api/products/{si}/{gu}/{dong}':
 *  get:
 *    tags:
 *      - Product
 *    summary: 시/구/동에 해당하는 전체 상품 가져오기
 *    description: 파라미터로 전달받은 시/구로 전체 상품 리스트 조회
 *    parameters:
 *     - name: si
 *       in: path
 *       description: 조회하고자 하는 상품의 시
 *       required: true
 *       default: 부산광역시
 *       schema:
 *         type: string
 *     - name: gu
 *       in: path
 *       description: 조회하고자 하는 상품의 구
 *       required: true
 *       default: 수영구
 *       schema:
 *         type: string
 *     - name: dong
 *       in: path
 *       description: 조회하고자 하는 상품의 동
 *       required: true
 *       default: 남천동
 *       schema:
 *         type: string
 *    responses:
 *      '200':
 *        description: 상품 정보 조회 성공
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GetProductsByLikes'
 *      '400':
 *        description: Bad Request
 */
productRouter.get("/products/:si/:gu/:dong", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const si = req.params.si;
    const gu = req.params.gu;
    const dong = req.params.dong;
    const products = await productService.getAllProductsByUserAddressSiGuDong(si, gu, dong);

    res.status(200).send(products);
  } catch (error) {
    next(error);
  }
});

// 상품 삭제
/**
 * @swagger
 * /api/product/{id}:
 *   delete:
 *     tags:
 *      - Product
 *     summary: 상품 ID로 상품 삭제
 *     description: 상품 ID로 상품 삭제
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 삭제할 상품의 ID를 입력해 주세요.
 *     responses:
 *       200:
 *         description: 삭제 성공
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: SUCCESS
 *       400:
 *         description: Bad Request
 */

productRouter.delete("/product/:id", loginRequired, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = Number(req.params.id);
    await productService.deleteProduct(productId);

    res.status(200).send('SUCCESS');
  } catch (error) {
    next(error);
  }
})

// 상품 (제목, 본문, 가격) 수정
/**
 * @openapi
 *  '/api/product/{id}':
 *   patch:
 *     summary: 상품 수정
 *     description: 상품 제목, 본문, 가격 수정
 *     tags:
 *       - Product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: 상품 ID
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                content:
 *                  type: string
 *                price:
 *                  type: number
 *     responses:
 *       '200':
 *         description: Updated product information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductDetail'
 *       '400':
 *         description: Bad Request
 */
productRouter.patch("/product/:id", loginRequired, async (req: Request, res: Response, next: NextFunction) => {
  const {title, content, price} = req.body as { title: string, content: string, price: number };
  const productId = Number(req.params.id);

  try {
    // * 상품 update
    await productService.updateProduct(productId, title, content, price);

    //* 업데이트 한 상품 정보 조회
    const user: User = await userService.getUserByEmail(req.userEmail);
    const updatedProductDetail = await productService.getProductDetail(productId, user.id);
    
    res.status(200).send(updatedProductDetail);
  } catch (error) {
    next(error)
  }
})

export { productRouter };
