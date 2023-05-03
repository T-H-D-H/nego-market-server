import * as commentModel from '../db/comment.model';
import { Comments, ParsedComment, ParsedChildComment } from '../types/comment';

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

// * 댓글 조회
export async function getCommentsByProductID(productID: number) {
    const results: Comments[] = await commentModel.getCommentsByProductID(productID);

    // 결과 파싱
    const comments = results.reduce((acc: ParsedComment[], cur: Comments) => {
        // 부모 댓글이 새로 나타났을 때, 새로운 객체를 생성하여 배열에 추가
        if (!acc[cur.id]) {
            acc[cur.id] = {
                id: cur.id,
                comment: cur.comment,
                nickname: cur.nickname,
                updated_at: cur.updated_at,
                child_comment: []
            };
        }

        // 자식 댓글이 존재하는 경우, 부모 댓글 객체의 child_comment 배열에 추가
        if (cur.child_id) {
            acc[cur.id].child_comment.push({
                id: cur.child_id,
                comment: cur.child_comment,
                nickname: cur.child_nickname,
                updated_at: cur.child_updated_at
            });
        }

        return acc;
    }, []);

    // 배열에서 null 값이 존재하는 경우 제거
    const nonNullComments = comments.filter(comment => !(comment == null))

    return nonNullComments;
}
