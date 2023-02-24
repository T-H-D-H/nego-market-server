import pool from "./index";

export async function getTagByProductId(productId: number) {
    const result = await pool.query(`
        SELECT b.name
        FROM product_tag a
            ,tag b
        WHERE a.tag_id = b.id
        AND a.product_id = ?`, [productId]
    )

    return result[0];
}