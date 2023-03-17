import "dotenv/config";
import { Router, Request, Response, NextFunction } from "express";
import { loginRequired } from "../middlewares/login-required";
import * as userService from "../services/user.service";
import * as likeService from "../services/like.service";
import { User } from "types/user";

const likeRouter = Router();

/**
 * @openapi
 *  '/api/like':
 *    post:
 *      tags:
 *        - Like
 *      summary: 좋아요 등록
 *      description: 좋아요 등록
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: number
 *                 description: 상품 ID
 *             required:
 *               - productId
 *      responses:
 *        201:
 *          description: 좋아요등록 성공시 "SUCCESS" 반환
 *        400:
 *          description: Bad Request
 */
// * 좋아요 등록
likeRouter.post("/like", loginRequired, async (req: Request, res: Response, next: NextFunction) => {
  const { productId }: { productId: number } = req.body;

  try {
    const user: User = await userService.getUserByEmail(req.userEmail);
    await likeService.addLike(productId, user.id);

    res.status(201).send("SUCCESS");
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 *  '/api/like':
 *    delete:
 *      tags:
 *        - Like
 *      summary: 좋아요 삭제
 *      description: 좋아요 삭제
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: number
 *                 description: 상품 ID
 *             required:
 *               - productId
 *      responses:
 *        204:
 *          description: 삭제 성공
 *        400:
 *          description: Bad Request
 */
// * 좋아요 삭제
likeRouter.delete("/like", loginRequired, async (req: Request, res: Response, next: NextFunction) => {
  const { productId }: { productId: number } = req.body;

  try {
    const user: User = await userService.getUserByEmail(req.userEmail);
    await likeService.deleteLike(productId, user.id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export { likeRouter };
