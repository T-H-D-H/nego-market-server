import pool from "./index";

//* TODO: 반환형 설정
export async function createProdcut(
    title: string , content: string, imgUrls: string, price: number, userId: number, tags: string[]
) {
    let conn: any = null;
    try {
        conn = await pool.getConnection();

        //* Transaction 시작
        await conn.beginTransaction();

        //* 1. tag 추가
        for (let i = 0; i < tags.length; ++i) {
            await conn.query(`
                INSERT IGNORE INTO tag(name)
                VALUES (?)`, [tags[i]]
            )
        }

        //* 2. product 추가
        const newProduct = await conn.query(`
            INSERT INTO product (title, content, img, price, user_id)
            VALUES (?,?,?,?,?)`, [title, content, imgUrls, price, userId]
        )

        //* 3-1. tag id 가져오기
        const tag_ids = [];
        for (let i = 0; i < tags.length; ++i) {
            let tag = await conn.query(`
                SELECT id
                FROM tag
                WHERE name = ?`, [tags[i]]
            )

            tag_ids.push((tag[0][0]).id);
        }
    
        //* 3-2. product-tag 추가
        for (let i = 0; i < tag_ids.length; ++i) {
            await conn.query(`
                INSERT INTO product_tag (product_id, tag_id)
                VALUES (?, ?)`, [newProduct[0].insertId, tag_ids[i]]
            )
        }        

        //* 4. 새로 등록한 상품 가져오기
        const result = await conn.query(`
            SELECT *
            FROM product
            WHERE id = ?`, [newProduct[0].insertId]
        )

        //* COMMIT
        await conn.commit();
        
        return result[0][0];
    } catch (error) {
        // ROLLBACK
        if (conn) {
            await conn.rollback();
        }
        throw error;
    } finally {
        // RELEASE
        if (conn) {
            await conn.release();
        }
    }
}

//* TODO: 반환형 설정
export async function getProductDetail(productId: number) {
    const product = await pool.query(`
        SELECT *
        FROM product
        WHERE id = ?`, [productId]
    );

    return product[0][0];
}