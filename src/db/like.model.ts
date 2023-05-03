import pool from "./index";

export async function addLike(productId: number, userId: number): Promise<void> {
  await pool.query(
    `INSERT INTO liked (user_id, product_id)
     VALUES (?, ?);`,
    [userId, productId]
  );
}

export async function deleteLike(productId: number, userId: number): Promise<void> {
  await pool.query(
    `DELETE FROM liked
     WHERE user_id = ?
     AND product_id = ?;`,
    [userId, productId]
  );
}
