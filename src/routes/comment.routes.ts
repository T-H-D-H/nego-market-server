import { Router, Request, Response, NextFunction } from "express";
import { loginRequired } from "../middlewares/login-required";
import * as userService from "../services/user.service";
import * as commentService from "../services/comment.service";

const commentRouter = Router();

//* 댓글 등록
/**
 * @openapi
 *  '/api/comment':
 *   post:
 *     summary: 새로운 댓글 추가
 *     tags:
 *       - Comment
 *     security:
 *       - bearerAuth: []
 *     description: 새로운 댓글을 추가합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: 댓글 내용
 *               productID:
 *                 type: integer
 *                 description: 상품 ID
 *             example:
 *               content: This is a great product!
 *               productID: 1234
 *     responses:
 *       201:
 *         description: 댓글 추가 성공시 "SUCCESS" 반환
 */
commentRouter.post('/comment', loginRequired, async (req: Request, res: Response, next: NextFunction) => {
    const userEmail = req.userEmail;
    const {content, productID}: {content: string, productID: number} = req.body;

    try {
        const user = await userService.getUserByEmail(userEmail);
        
        // * create comment
        await commentService.createComment(content, user.id, productID);
        
        res.status(201).send('SUCCESS');

    } catch (error) {
        next(error)
    }
})

// * 대댓글 등록
/**
 * @openapi
 *  '/api/reply':
 *   post:
 *     summary: 새로운 대댓글 추가
 *     tags:
 *       - Comment
 *     security:
 *       - bearerAuth: []
 *     description: 새로운 대댓글을 추가합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: 댓글 내용
 *               productID:
 *                 type: integer
 *                 description: 상품 ID
 *               parentID:
 *                 type: integer
 *                 description: 부모댓글 ID
 *             example:
 *               content: This is a great product!
 *               productID: 1234
 *               parentID: 12
 *     responses:
 *       201:
 *         description: 대댓글 추가 성공시 "SUCCESS" 반환
 */
commentRouter.post('/reply', loginRequired, async (req: Request, res: Response, next: NextFunction) => {
    const userEmail = req.userEmail;
    const {content, productID, parentID}: {content: string, productID: number, parentID: number} = req.body;

    try {
        const user = await userService.getUserByEmail(userEmail);

        // * create reply
        await commentService.createReply(content, user.id, productID, parentID);
        
        res.status(201).send('OK');

    } catch (error) {
        next(error)
    }
})

// * 댓글 삭제
/**
 * @openapi
 *  '/api/comment/delete/{comment_id}':
 *   patch:
 *     summary: 댓글, 대댓글 삭제
 *     description: 댓글, 대댓글을 삭제합니다. 이 때, 실제로 해당 댓글의 레코드를 물리적으로 삭제하지는 않고, <br><br>삭제된 댓글의 내용(content)이 <b>'작성자에 의해 삭제된 댓글입니다.'</b>로 바뀌게 됩니다.
 *     tags:
 *       - Comment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 삭제할 댓글의 ID를 입력해 주세요.
 *     responses:
 *       201:
 *         description: 삭제 성공시 SUCCESS 반환
 */
commentRouter.patch('/comment/delete/:comment_id', loginRequired, async (req: Request, res: Response, next: NextFunction) => {
    const deletedMessage = '작성자에 의해 삭제된 댓글입니다.';
    const userEmail = req.userEmail;
    
    try {
        const commentID = Number(req.params.comment_id);

        // * 요청한 유저가 댓글 작성자가 아닌 경우 예외처리
        const comment = await commentService.getCommentById(commentID);
        const user = await userService.getUserByEmail(userEmail);

        if (comment.user_id !== user.id) {
            throw new Error('작성자만 댓글을 삭제할 수 있습니다.')
        }

        // * 댓글 삭제
        await commentService.deleteComment(deletedMessage, commentID);

        res.status(201).send('SUCCESS');
    } catch (error) {
        next (error)
    }
})

// * 댓글 수정
/**
 * @openapi
 *  '/api/comment':
 *   patch:
 *     summary: 댓글, 대댓글 수정
 *     tags:
 *       - Comment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment_id:
 *                 type: integer
 *                 description: 댓글 ID
 *               updated_comment:
 *                 type: string
 *                 description: 수정할 댓글 내용
 *             required:
 *               - comment_id
 *               - updated_comment
 *     responses:
 *       201:
 *         description: 수정 성공시 "SUCCESS" 반환
 *       400:
 *          description: Bad Request
 */
commentRouter.patch('/comment', loginRequired, async (req: Request, res: Response, next: NextFunction) => {
    const userEmail = req.userEmail;
    
    try {
        const commentID: number = req.body.comment_id;
        const updatedComment:string = req.body.updated_comment;

        // * 요청한 유저가 댓글 작성자가 아닌 경우 예외처리
        const comment = await commentService.getCommentById(commentID);
        const user = await userService.getUserByEmail(userEmail);

        if (comment.user_id !== user.id) {
            throw new Error('작성자만 댓글을 수정할 수 있습니다.')
        }

        // * 댓글 수정
        await commentService.deleteComment(updatedComment, commentID);

        res.status(201).send('SUCCESS');
    } catch (error) {
        next (error)
    }
})

// * 댓글 조회
/**
 * @openapi
 *  '/api/comments/{product_id}':
 *   get:
 *     summary: 상품의 댓글 목록 조회
 *     description: 특정 상품의 댓글 목록을 조회합니다.
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: path
 *         name: product_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 댓글을 조회할 상품의 ID
 *     responses:
 *       200:
 *         description: 댓글 목록 조회 성공
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ParsedComment'   
 *       400:
 *          description: Bad Request
 */
commentRouter.get('/comments/:product_id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productID = Number(req.params.product_id);
        const comments = await commentService.getCommentsByProductID(productID);

        res.status(200).send(comments);
    } catch (error) {
        next (error)
    }
})

export { commentRouter };
