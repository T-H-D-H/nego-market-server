import pool from "./index";

export async function createProdcut(title: string, content: string, imgUrls: string, price: number, userId: number, tags: string[]) {
  let conn: any = null;
  try {
    conn = await pool.getConnection();

    //* Transaction 시작
    await conn.beginTransaction();

    //* 1. tag 추가
    for (let i = 0; i < tags.length; ++i) {
      await conn.query(
        `INSERT IGNORE INTO tag(name)
         VALUES (?)`,
        [tags[i]]
      );
    }

    //* 2. product 추가
    const newProduct = await conn.query(
      `INSERT INTO product (title, content, img, price, user_id)
       VALUES (?,?,?,?,?)`,
      [title, content, imgUrls, price, userId]
    );

    //* 3-1. tag id 가져오기
    const tag_ids = [];
    for (let i = 0; i < tags.length; ++i) {
      let tag = await conn.query(
        ` SELECT id
          FROM tag
          WHERE name = ?`,
        [tags[i]]
      );

      tag_ids.push(tag[0][0].id);
    }

    //* 3-2. product-tag 추가
    for (let i = 0; i < tag_ids.length; ++i) {
      await conn.query(
        `INSERT INTO product_tag (product_id, tag_id)
         VALUES (?, ?)`,
        [newProduct[0].insertId, tag_ids[i]]
      );
    }

    //* 4. 새로 등록한 상품 가져오기
    const result = await conn.query(
      `SELECT *
       FROM product
       WHERE id = ?`,
      [newProduct[0].insertId]
    );

    //* COMMIT
    await conn.commit();
  } catch (error) {
    //* ROLLBACK
    if (conn) {
      await conn.rollback();
    }

    throw error;
  } finally {
    //* RELEASE
    if (conn) {
      await conn.release();
    }
  }
}

//* TODO: 반환형 설정
export async function getProductDetail(productId: number) {
  const product = await pool.query(
    ` SELECT *
      FROM product
      WHERE id = ?`,
    [productId]
  );

  return product[0][0];
}

//* 상품 ID로 좋아요 총 갯수 반환
export async function getLikedCountByProductId(productId: number) {
  const [likedCount] = await pool.query(
    `SELECT COUNT(*) AS count
     FROM liked
     WHERE product_id = ?`,
    [productId]
  );

  return likedCount[0].count;
}

//* 상품 ID, 요청한 유저 ID로 좋아요를 눌렀는지 확인. 눌렀으면 1, 누르지 않았으면 0을 반환
export async function hasLiked(productId: number, reqUserId: number) {
  const [likedCount] = await pool.query(
    `SELECT COUNT(*) AS count
     FROM liked
     WHERE product_id = ?
     AND user_id = ?`,
    [productId, reqUserId]
  );

  return likedCount[0].count;
}

//* 상품 ID, 유저 ID, 사진, 제목, 좋아요 갯수, 댓글 갯수, 지역
export async function getAllProducts() {
  const [products] = await pool.query(
    `SELECT P.id, P.user_id, P.img, P.title, P.price, COUNT(L.product_id) AS like_count, A.si, A.gu, A.dong
    FROM product P
    LEFT JOIN liked L ON P.id = L.product_id
        ,user U
        ,address A
    WHERE P.user_id = U.id
    AND U.address_id = A.id
    GROUP BY P.id
    ORDER BY like_count DESC`
  );

  return products;
}

export async function getAllProductsByUserAddress(si: string, gu: string, dong: string) {
  const [products] = await pool.query(
    `SELECT P.id, P.user_id, P.img, P.title, COUNT(L.product_id) AS like_count, A.si, A.gu, A.dong
    FROM product P
    LEFT JOIN liked L ON P.id = L.product_id
        ,user U
        ,address A
    WHERE P.user_id = U.id
    AND U.address_id = A.id
    GROUP BY P.id
    ORDER BY
     CASE 
      WHEN A.si = ? AND A.gu = ? AND A.dong =? THEN 1
        WHEN A.si = ? AND A.gu = ? AND A.dong != ? THEN 2
        WHEN A.si = ? AND A.gu != ? THEN 3
        WHEN A.si != ? THEN 4
     END
     ,like_count DESC;`,
    [si, gu, dong, si, gu, dong, si, gu, si]
  );

  return products;
}

export async function getAllProductsByUserAddressSi(si: string) {
  const [products] = await pool.query(
    `SELECT P.id, P.user_id, P.img, P.title, COUNT(L.product_id) AS like_count, A.si, A.gu, A.dong
    FROM product P
    LEFT JOIN liked L ON P.id = L.product_id
        ,user U
        ,address A
    WHERE P.user_id = U.id
    AND U.address_id = A.id
    AND A.si = ?
    GROUP BY P.id
    ORDER BY
     like_count DESC;`,
    [si]
  );

  return products;
}

export async function getAllProductsByUserAddressSiGu(si: string, gu: string) {
  const [products] = await pool.query(
    `SELECT P.id, P.user_id, P.img, P.title, COUNT(L.product_id) AS like_count, A.si, A.gu, A.dong
    FROM product P
    LEFT JOIN liked L ON P.id = L.product_id
        ,user U
        ,address A
    WHERE P.user_id = U.id
    AND U.address_id = A.id
    AND A.si = ?
    AND A.gu = ?
    GROUP BY P.id
    ORDER BY
     like_count DESC;`,
    [si, gu]
  );

  return products;
}

export async function getAllProductsByUserAddressSiGuDong(si: string, gu: string, dong: string) {
  const [products] = await pool.query(
    `SELECT P.id, P.user_id, P.img, P.title, COUNT(L.product_id) AS like_count, A.si, A.gu, A.dong
    FROM product P
    LEFT JOIN liked L ON P.id = L.product_id
        ,user U
        ,address A
    WHERE P.user_id = U.id
    AND U.address_id = A.id
    AND A.si = ?
    AND A.gu = ?
    AND A.dong = ?
    GROUP BY P.id
    ORDER BY
     like_count DESC;`,
    [si, gu, dong]
  );

  return products;
}

export async function deleteProduct(productId: number) {
  let conn: any = null;
  try {
    conn = await pool.getConnection();

    //* Transaction 시작
    await conn.beginTransaction();

    //* 1. 좋아요 레코드 삭제
    await conn.query(
      `DELETE FROM liked
       WHERE product_id = ?`,
       [productId]
    );
    
    //* 2. 상품-태그 레코드 삭제
    await conn.query(
      `DELETE FROM product_tag
       WHERE product_id = ?`,
       [productId]
    );

    //* 3. TODO: 댓글이 존재하는 경우, 댓글도 삭제 (댓글 구현 후)
    
    //* 4. 상품 레코드 삭제
    await conn.query(
      `DELETE FROM product
       WHERE id = ?`,
       [productId]
    );

    //* COMMIT
    await conn.commit();
  } catch (error) {
    //* ROLLBACK
    if (conn) {
      await conn.rollback();
    }

    throw error;
  } finally {
    //* RELEASE
    if (conn) {
      await conn.release();
    }
  }
}