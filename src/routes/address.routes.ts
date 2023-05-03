import * as addressService from "../services/address.service";
import { Router, Request, Response, NextFunction } from "express";

const addressRouter = Router();

addressRouter.get("/addresses", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const addresses = await addressService.getAddresses();
    res.status(200).json(addresses);
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/address/si:
 *  get:
 *    tags:
 *     - Address
 *    description: 모든 시 리스트 반환
 *    responses:
 *      200:
 *        description: 모든 시 리스트 반환
 *      400:
 *        description: bad request
 */
addressRouter.get("/address/si", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const addresses = await addressService.getAddressSi();
    res.status(200).json(addresses);
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/address/gu:
 *  get:
 *    tags:
 *     - Address
 *    description: 입력한 시에 해당하는 구 리스트 반환
 *    parameters:
 *      - in: query
 *        name: si
 *        schema:
 *          type: string
 *          default: 부산광역시
 *        description: <시>를 입력해주세요
 *    responses:
 *      200:
 *        description: return gu list
 *      400:
 *        description: bad request
 */
addressRouter.get("/address/gu", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const si = req.query.si as string;

    if (!si) {
      throw new Error("시 이름을 다시 확인해 주세요.");
    }

    const addresses = await addressService.getAddressGu(si);
    res.status(200).json(addresses);
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/address/dong:
 *  get:
 *    tags:
 *     - Address
 *    description: 입력한 시,구에 해당하는 동 리스트 반환
 *    parameters:
 *      - in: query
 *        name: si
 *        schema:
 *          type: string
 *          default: 부산광역시
 *        description: <시>를 입력해주세요
 *      - in: query
 *        name: gu
 *        schema:
 *          type: string
 *          default: 해운대구
 *        description: <구>를 입력해주세요
 *    responses:
 *      200:
 *        description: return dong list
 *      400:
 *        description: bad request
 */
addressRouter.get("/address/dong", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const si = req.query.si as string;
    const gu = req.query.gu as string;

    if (!si || !gu) {
      throw new Error("시/구 이름을 다시 확인해 주세요.");
    }

    const addresses = await addressService.getAddressDong(si, gu);
    res.status(200).json(addresses);
  } catch (error) {
    next(error);
  }
});

export { addressRouter };
