import * as userService from "../services/user.service";
import * as addressService from "../services/address.service";
import express, { NextFunction, Router } from "express";

//* TODO: user 타입 정의
//* TODO: register 입력값 검증(client와 스펙 정한 후), express-validator 사용
const userRouter = Router();

userRouter.get("/users", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const users = await userService.getUsers();
    res.send(users);
    // TODO: error type
  } catch (error: any) {
    res.status(400).json({ result: "error", reason: error.message });
  }
});

userRouter.post("/user/register", async (req: express.Request, res: express.Response, next: NextFunction) => {
  const name: string = req.body.name;
  const email: string = req.body.email;
  const password: string = req.body.password;
  const nickname: string = req.body.nickname;
  const address_name: string = req.body.address;
  const tel: string = req.body.tel;

  try {
    //* address 검색, 없으면 예외
    const address = await addressService.getAddress(address_name);
    if (!address) {
      throw new Error("유효하지 않은 주소입니다.");
    }

    const createdUser = await userService.registerUser(name, email, password, nickname, address.id, tel);
    console.log(createdUser);

    res.status(201).send("OK");

    // TODO: error type
  } catch (error: any) {
    res.status(400).json({ result: "error", reason: error.message });
    // next(error);
  }
});

export { userRouter };
