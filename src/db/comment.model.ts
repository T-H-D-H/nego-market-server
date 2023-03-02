import pool from "./index";

// * 댓글 등록
export async function createComment(content: string, userID: number, productID: number) {
    await pool.query(
        `INSERT INTO comment (content, user_id, product_id)
         VALUES (?, ?, ?)`
         ,[content, userID, productID]
    )
}

// * 대댓글 등록
export async function createReply(content: string, userID: number, productID: number, parentID: number) {
    await pool.query(
        `INSERT INTO comment (content, user_id, product_id, parent_id)
         VALUES (?, ?, ?, ?)`
         ,[content, userID, productID, parentID]
    )
}

// * 댓글,대댓글 삭제
export async function deleteComment(deletedMessage: string, commentID: number) {
    await pool.query(
        `UPDATE comment
         SET content = ?
         WHERE id = ?`
         ,[deletedMessage, commentID]
    )
}

// * 댓글 id로 댓글 조회
export async function getCommentById(commentID: number) {
    const [result] = await pool.query(
        `SELECT *
         FROM comment
         WHERE id = ?`
         ,[commentID]
    )

    return result[0];
}