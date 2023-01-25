import * as addressService from "../services/address.service";
import { Router, Request, Response, NextFunction } from "express";

const addressRouter = Router();

addressRouter.get("/addresses", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const addresses = await addressService.getAddresses();
    res.status(200).json(addresses);
  } catch (error: any) {
    next(error);
  }
});

export { addressRouter };
