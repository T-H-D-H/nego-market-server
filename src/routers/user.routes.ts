import * as userService from "../services/user.service";
import * as addressService from "../services/address.service";
import { Router, Request, Response, NextFunction } from "express";
import { isEmpty } from "../utils/object-empty-check";

//* TODO: register 입력값 검증(client와 스펙 정한 후), express-validator 사용
const userRouter = Router();

userRouter.get("/users", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getUsers();

    res.send(users);
  } catch (error) {
    next(error);
  }
});

//* 회원가입
userRouter.post("/user/register", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (isEmpty(req.body)) {
      throw new Error("headers의 Content-Type을 application/json으로 설정해주세요");
    }

    const name: string = req.body.name;
    const email: string = req.body.email;
    const password: string = req.body.password;
    const nickname: string = req.body.nickname;
    const address_name: string = req.body.address;
    const tel: string = req.body.tel;

    //* address 유효성 검증
    const address = await addressService.getAddress(address_name);
    if (!address) {
      throw new Error("유효하지 않은 주소입니다.");
    }

    const createdUser = await userService.registerUser(name, email, password, nickname, address.id, tel);

    res.status(201).send("OK");
  } catch (error) {
    next(error);
  }
});

//* 아이디(email) 중복 체크 API
userRouter.post("/user/id-duplication", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (isEmpty(req.body)) {
      throw new Error("headers의 Content-Type을 application/json으로 설정해주세요");
    }

    const email: string = req.body.email;
    const user = await userService.getUserByEmail(email);

    if (user) {
      res.status(200).json({ result: true });
    } else {
      res.status(200).json({ result: false });
    }
  } catch (error) {
    next(error);
  }
});

//* 닉네임 중복 체크 API
userRouter.post("/user/nickname-duplication", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (isEmpty(req.body)) {
      throw new Error("headers의 Content-Type을 application/json으로 설정해주세요");
    }

    const nickname: string = req.body.nickname;
    const user = await userService.getUserByNickname(nickname);

    if (user) {
      res.status(200).json({ result: true });
    } else {
      res.status(200).json({ result: false });
    }
  } catch (error) {
    next(error);
  }
});

//* 로그인
userRouter.post("/user/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (isEmpty(req.body)) {
      throw new Error("headers의 Content-Type을 application/json으로 설정해주세요");
    }

    const email = req.body.email;
    const password = req.body.password;
    const token = await userService.getUserToken(email, password);

    res.status(200).json(token);
    
  } catch (error) {
    next(error);
  }
});

//* 회원탈퇴
userRouter.delete("/user", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (isEmpty(req.body)) {
      throw new Error("headers의 Content-Type을 application/json으로 설정해주세요");
    }

    const email = req.body.email;
    const password = req.body.password;

    await userService.deleteUser(email, password);

    res.status(204).send();

  } catch (error) {
    next(error);
  }
});

export { userRouter };
