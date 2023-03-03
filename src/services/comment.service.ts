import * as commentModel from '../db/comment.model';

// * 댓글 등록
export async function createComment(content: string, userID: number, productID: number) {
    await commentModel.createComment(content, userID, productID);
}

// * 대댓글 등록
export async function createReply(content: string, userID: number, productID: number, parentID: number) {
    await commentModel.createReply(content, userID, productID, parentID);
}

// * 댓글, 대댓글 삭제
export async function deleteComment(deletedMessage: string, commentID: number) {
    await commentModel.updateComment(deletedMessage, commentID);
}

// * 댓글 id로 댓글 조회
export async function getCommentById(commentID: number) {
    const comment = await commentModel.getCommentById(commentID);

    return comment;
}

// * 댓글, 대댓글 수정
export async function updateComment(updatedMessage: string, commentID: number) {
    await commentModel.updateComment(updatedMessage, commentID);
}

// * 댓글 데이터 파싱
export function parseComments(comments: {id: number, content: string}[]) {
    const parsedComment = [];

    comments.forEach(comment => {
        
    });
    
}

// * 댓글 조회
export async function getCommentsByProductID(productID: number) {
    const comments = await commentModel.getCommentsByProductID(productID);

    return comments;
    
}
