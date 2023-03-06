import { Router, Request, Response, NextFunction } from "express";
import { loginRequired } from "../middlewares/login-required";
import * as userService from "../services/user.service";
import * as commentService from "../services/comment.service";

const commentRouter = Router();

//* 댓글 등록
commentRouter.post('/comment', loginRequired, async (req: Request, res: Response, next: NextFunction) => {
    const userEmail = req.userEmail;
    const {content, productID}: {content: string, productID: number} = req.body;

    try {
        const user = await userService.getUserByEmail(userEmail);
        
        // * create comment
        await commentService.createComment(content, user.id, productID);
        
        res.status(201).send('OK');

    } catch (error) {
        next(error)
    }
})

// * 대댓글 등록
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

        res.status(201).send('OK');
    } catch (error) {
        next (error)
    }
})

// * 댓글 수정
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

        res.status(201).send('OK');
    } catch (error) {
        next (error)
    }
})

// * 댓글 조회
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