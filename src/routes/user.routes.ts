import * as userService from "../services/user.service";
import * as addressService from "../services/address.service";
import { Router, Request, Response, NextFunction } from "express";
import { isEmpty } from "../utils/object-empty-check";

//* TODO: register 입력값 검증(client와 스펙 정한 후), express-validator 사용
const userRouter = Router();


/**
 * @openapi
 * /api/users:
 *  get:
 *    tags:
 *     - User
 *    description: 모든 유저 리스트 반환
 *    responses:
 *      200:
 *        description: return all user
 *      400:
 *        description: bad request
 */
userRouter.get("/users", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getUsers();

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

// 회원가입
/**
 * @openapi
 * '/api/user/register':
 *  post:
 *    tags:
 *      - User
 *    summary: Register all user
 *    description: 새로운 유저 추가
 *    requestBody:
 *     required: true
 *     content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateUserInput'
 *    responses:
 *      201:
 *        description: SUCCESS
 *      400:
 *        description: Bad request
 *
 */
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

    res.status(201).send("SUCCESS");
  } catch (error) {
    next(error);
  }
});

//* 아이디(email) 중복 체크
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

//* 닉네임 중복 체크
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
/**
 * @openapi
 * '/api/user':
 *  delete:
 *    tags:
 *      - User
 *    summary: Delete a user
 *    description: 유저 삭제
 *    requestBody:
 *     required: true
 *     content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/DeleteUserInput'
 *    responses:
 *      200:
 *        description: SUCCESS
 *      400:
 *        description: Bad request
 *
 */
userRouter.delete("/user", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (isEmpty(req.body)) {
      throw new Error("headers의 Content-Type을 application/json으로 설정해주세요");
    }

    const email = req.body.email;
    const password = req.body.password;

    await userService.deleteUser(email, password);

    res.status(200).send("SUCCESS");
  } catch (error) {
    next(error);
  }
});

export { userRouter };
