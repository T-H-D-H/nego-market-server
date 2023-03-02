import * as commentModel from '../db/comment.model';

// * 댓글 등록
export async function createComment(content: string, userID: number, productID: number) {
    await commentModel.createComment(content, userID, productID);
}

// * 대댓글 등록
export async function createReply(content: string, userID: number, productID: number, parentID: number) {
    await commentModel.createReply(content, userID, productID, parentID);
}