import pool from "./index";

export async function createProdcut(
    title: string , content: string, imgUrls: string[] | null, price: number, userId: number, tags: string[]
) {
    let conn: any = null;
    try {
        conn = await pool.getConnection();

        //* Transaction 시작
        await conn.beginTransaction();

        //* 1. tag insert
        tags.forEach(tag =>  conn.query(`
            INSERT IGNORE INTO tag (name)
            VALUES (?)`, [tag]
        ))

        //* 2. product insert
        conn.query(`
            INSERT INTO product (title, content, img, price, user_id)
            VALUES (?,?,?,?,?)`, [title, content, [imgUrls], price, userId]
        )
        





        //* 3. product-tag insert

        //* COMMIT
        await conn.commit();
    } catch (error) {
        //* ROLLBACK
        if (conn) await conn.rollback();
        throw error;
    } finally {
        if (conn) await conn.release();
    }
}