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

// * 댓글,대댓글 수정, 삭제
export async function updateComment(updatedMessage: string, commentID: number) {
    await pool.query(
        `UPDATE comment
         SET content = ?
         WHERE id = ?`
         ,[updatedMessage, commentID]
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

// * 댓글 조회
export async function getCommentsByProductID(productID: number) {
    const [result] = await pool.query(
        `SELECT c1.id
              , c1.content AS comment
              , c1.user_id
              , c1.created_at
              , c1.last_updated_at AS updated_at
              , c2.id AS child_id
              , c2.content AS child_comment
              , c2.user_id AS child_user_id
              , c2.created_at AS child_created_at
              , c2.last_updated_at AS child_updated_at
        FROM comment c1
        LEFT JOIN comment c2 ON c2.parent_id = c1.id
        WHERE c1.product_id = ?
        AND c1.parent_id IS NULL
        ORDER BY c1.created_at ASC, c2.created_at ASC;`
        ,[productID]
    )

    return result;
}