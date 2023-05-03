import * as productModel from "../db/product.model";
import * as reservationModel from "../db/reservation.model";

export async function makeReservation(userID: number, productID: number): Promise<void> {
    // * 요청한 유저가 상품을 업로드한 유저인지 확인
    const product = await productModel.getProductDetail(productID);

    if (!product) {
        throw new Error('존재하지 않는 상품입니다.');
    }

    if (product.user_id !== userID) {
        throw new Error('판매자만 상품의 상태를 수정할 수 있습니다.')
    }

    // * 상품 상태가 0 (판매중)이 아닌 경우 예외
    if (product.status !== 0) {
        throw new Error('예약중이거나 판매완료된 상품입니다.');
    }

    // * 상품 상태를 판매중(0) -> 예약중(1)로 변경
    await reservationModel.reservation(productID);
    
}

export async function cancelReservation(userID: number, productID: number): Promise<void> {
    // * 요청한 유저가 상품을 업로드한 유저인지 확인
    const product = await productModel.getProductDetail(productID);
    
    if (!product) {
        throw new Error('존재하지 않는 상품입니다.');
    }
    
    if (product.user_id !== userID) {
        throw new Error('판매자만 상품의 상태를 수정할 수 있습니다.')
    }

    // * 상품 상태가 1 (판매중)이 아닌 경우 예외
    if (product.status !== 1) {
        throw new Error('예약중인 상품이 아닙니다.');
    }

    // * 상품 상태를 판매중(1) -> 예약중(0)으로 변경
    await reservationModel.cancelReservation(productID);
}

export async function markProductAsSold(userID: number, productID: number): Promise<void> {
    // * 요청한 유저가 상품을 업로드한 유저인지 확인
    const product = await productModel.getProductDetail(productID);
    
    if (!product) {
        throw new Error('존재하지 않는 상품입니다.');
    }
    
    if (product.user_id !== userID) {
        throw new Error('판매자만 상품의 상태를 수정할 수 있습니다.')
    }

    // * 상품 상태가 1 (판매중)이 아닌 경우 예외
    if (product.status !== 1) {
        throw new Error('예약중인 상품만 판매완료처리 할 수 있습니다.');
    }

    // * 상품 상태를 판매중(1) -> 판매완료(2)으로 변경
    await reservationModel.markProductAsSold(productID);
}