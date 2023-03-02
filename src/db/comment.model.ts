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