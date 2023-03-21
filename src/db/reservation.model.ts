import pool from "./index";

// * 예약 기능, 상품 상태를 판매중 (0) -> 예약중 (1) 으로 변경
export async function reservation(productID: number): Promise<void> {
    await pool.query(
        `UPDATE product
         SET status = 1
         WHERE id = ?;`,
        [productID]
    );
}

// * 예약 취소 기능, 상품 상태를 판매중 (1) -> 예약중 (0) 으로 변경
export async function cancelReservation(productID: number): Promise<void> {
    await pool.query(
        `UPDATE product
         SET status = 0
         WHERE id = ?;`,
        [productID]
    );
}

// * 판매완료, 상품 상태를 예약중 (1) -> 판매완료 (2) 으로 변경
export async function markProductAsSold(productID: number): Promise<void> {
    await pool.query(
        `UPDATE product
         SET status = 2
         WHERE id = ?;`,
        [productID]
    );
}