import * as userService from "../services/user.service";
import express, { Router } from "express";

const userRouter = Router();

userRouter.get(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const user = await userService.getAll();
      console.log(user);
      res.send(user);
    } catch (error) {
      console.log(error);
    }
  }
);

export { userRouter };
