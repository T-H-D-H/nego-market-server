import "dotenv/config";
import { Router, Request, Response, NextFunction } from "express";
import { User } from "types/user";
import { loginRequired } from "../middlewares/login-required";
import * as userService from "../services/user.service";
import * as reservationService from "../services/reservation.service";

const reservationRouter = Router();

// * 예약 API
/**
 * @openapi
 * '/api/reservation/{id}':
 *  patch:
 *    tags:
 *     - Reservation
 *    summary: 상품 예약
 *    description: |
 *      판매자가 해당 상품을 예약상태로 변경합니다.
 *      로그인이 필요하며, 유효한 토큰을 필요로 합니다.
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        description: 상품 ID
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: 예약 성공시 "SUCCESS" 반환
 *      400:
 *        description: Bad Request
 */
reservationRouter.patch("/reservation/:id", loginRequired, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: User = await userService.getUserByEmail(req.userEmail);
        if (!user) {
            throw new Error('유저가 존재하지 않습니다. 토큰을 다시 한 번 확인해 주세요.');
        }

        await reservationService.makeReservation(user.id, Number(req.params.id));

        res.status(200).send("SUCCESS");
    } catch (error) {
        next(error);
    }
})

// * 예약 취소 API
/**
 * @openapi
 * '/api/reservation/{id}/cancel':
 *  patch:
 *    tags:
 *     - Reservation
 *    summary: 예약 취소
 *    description: |
 *      판매자가 해당 상품의 예약을 취소합니다.
 *      로그인이 필요하며, 유효한 토큰을 필요로 합니다.
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        description: 상품 ID
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: 예약 취소 성공시 "SUCCESS" 반환
 *      400:
 *        description: Bad Request
 */
reservationRouter.patch("/reservation/:id/cancel", loginRequired, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: User = await userService.getUserByEmail(req.userEmail);
        if (!user) {
            throw new Error('유저가 존재하지 않습니다. 토큰을 다시 한 번 확인해 주세요.');
        }

        await reservationService.cancelReservation(user.id, Number(req.params.id));

        res.status(200).send("SUCCESS");
        
    } catch (error) {
        next(error);
    }
})


// * 판매 완료 API
/**
 * @openapi
 * '/api/sold/{id}':
 *  patch:
 *    tags:
 *     - Reservation
 *    summary: 판매 완료
 *    description: |
 *      판매자가 해당 상품을 예약중 -> 판매완료 상태로 변경합니다.
 *      로그인이 필요하며, 유효한 토큰을 필요로 합니다.
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        description: 상품 ID
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: 판매완료 성공시 "SUCCESS" 반환
 *      400:
 *        description: Bad Request
 */
reservationRouter.patch("/sold/:id", loginRequired, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: User = await userService.getUserByEmail(req.userEmail);
        if (!user) {
            throw new Error('유저가 존재하지 않습니다. 토큰을 다시 한 번 확인해 주세요.');
        }

        await reservationService.markProductAsSold(user.id, Number(req.params.id));

        res.status(200).send("SUCCESS");
        
    } catch (error) {
        next(error);
    }
})

export { reservationRouter };