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
commentRouter.delete('/comment/:comment_id', loginRequired, async (req: Request, res: Response, next: NextFunction) => {
    try {

        res.status(204).send('OK');
    } catch (error) {
        next (error)
    }
}) 

export { commentRouter };