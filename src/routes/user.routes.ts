import * as userService from "../services/user.service";
import * as addressService from "../services/address.service";
import { Router, Request, Response, NextFunction } from "express";
import { isEmpty } from "../utils/object-empty-check";
import { signupValidator } from "../middlewares/validation-check";
import { validationResult } from "express-validator";
import { loginRequired } from "../middlewares/login-required";

//* TODO: register 입력값 검증(client와 스펙 정한 후), express-validator 사용
const userRouter = Router();

// 모든 유저 리스트 반환 - 필요 없으면 삭제
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
 *    summary: Register a user
 *    description: 새로운 유저 추가
 *    requestBody:
 *     description: address는 시, 구, 동을 공백으로 구분
 *     required: true
 *     content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateUserInput'
 *    responses:
 *      201:
 *        description: 회원가입 성공시 'SUCCESS' 반환
 *      400:
 *        description: Bad request
 *
 */
userRouter.post("/user/register", signupValidator, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

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

    await userService.registerUser(name, email, password, nickname, address.id, tel);

    res.status(201).send("SUCCESS");
  } catch (error) {
    next(error);
  }
});

//* 아이디(email) 중복 체크
/**
 * @openapi
 * '/api/user/id-duplication-check':
 *  post:
 *    tags:
 *      - User
 *    summary: ID duplication check
 *    description: 아이디 중복 체크
 *    requestBody:
 *     required: true
 *     content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/IdDuplicationCheckInput'
 *    responses:
 *      200:
 *        description: 중복인 경우 { "result" &#58; true }, 중복이 아닌 경우 { "result" &#58; false }  를 반환
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/IdDuplicationCheckResponse'
 *      400:
 *        description: Bad request
 *
 */
userRouter.post("/user/id-duplication-check", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (isEmpty(req.body)) {
      throw new Error("headers의 Content-Type을 application/json으로 설정해주세요");
    }

    const email: string = req.body.email;

    // 공백 문자열만 들어온 경우 예외처리
    if (!email.trim()) {
      throw new Error("email을 입력해 주세요");
    }

    const user = await userService.getUserByEmail(email);

    let result: boolean = false;
    if (user) {
      result = true;
    }

    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
});

//* 닉네임 중복 체크
/**
 * @openapi
 * '/api/user/nickname-duplication-check':
 *  post:
 *    tags:
 *      - User
 *    summary: Nickname duplication check
 *    description: 닉네임 중복 체크
 *    requestBody:
 *     required: true
 *     content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/NicknameDuplicationCheckInput'
 *    responses:
 *      200:
 *        description: 중복인 경우 { "result" &#58; true }, 중복이 아닌 경우 { "result" &#58; false }  를 반환
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/NicknameDuplicationCheckResponse'
 *      400:
 *        description: Bad request
 *
 */
userRouter.post("/user/nickname-duplication-check", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (isEmpty(req.body)) {
      throw new Error("headers의 Content-Type을 application/json으로 설정해주세요");
    }

    const nickname: string = req.body.nickname;

    // 공백 문자열만 들어온 경우 예외처리
    if (!nickname.trim()) {
      throw new Error("nickname을 입력해 주세요");
    }

    const user = await userService.getUserByNickname(nickname);

    let result: boolean = false;
    if (user) {
      result = true;
    }

    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
});

//* 핸드폰번호 중복 체크
/**
 * @openapi
 * '/api/user/tel-duplication-check':
 *  post:
 *    tags:
 *      - User
 *    summary: Tel duplication check
 *    description: 핸드폰번호 중복 체크
 *    requestBody:
 *     required: true
 *     content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/TelDuplicationCheckInput'
 *    responses:
 *      200:
 *        description: 중복인 경우 { "result" &#58; true }, 중복이 아닌 경우 { "result" &#58; false }  를 반환
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TelDuplicationCheckResponse'
 *      400:
 *        description: Bad request
 *
 */
userRouter.post("/user/tel-duplication-check", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (isEmpty(req.body)) {
      throw new Error("headers의 Content-Type을 application/json으로 설정해주세요");
    }

    const tel: string = req.body.tel;

    // 공백 문자열만 들어온 경우 예외처리
    if (!tel.trim()) {
      throw new Error("tel을 입력해 주세요");
    }

    const user = await userService.getUserByTel(tel);

    let result: boolean = false;
    if (user) {
      result = true;
    }

    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
});

//* 로그인
/**
 * @openapi
 * '/api/user/login':
 *  post:
 *    tags:
 *      - User
 *    summary: login
 *    description: 로그인
 *    requestBody:
 *     required: true
 *     content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/LoginInput'
 *    responses:
 *      200:
 *        description: 로그인 성공시 토큰을 반환
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LoginResponse'
 *      400:
 *        description: Bad request
 *
 */
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
 *        description: 회원탈퇴 성공시 "SUCCESS" 반환
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

//* 회원정보 수정 페이지
/**
 * @openapi
 * '/api/user/mypage':
 *  get:
 *    tags:
 *      - User
 *    summary: Mypage user info
 *    security:
 *      - bearerAuth: []
 *    description: 회원정보 수정 페이지에 표시될 정보 제공
 *    responses:
 *      200:
 *        description: 성공시 회원정보 페이지에 표시 될 유저 정보 반환
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/MyPageResponse'
 *      400:
 *        description: Bad request
 *
 */
userRouter.get("/user/mypage", loginRequired, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email: string = req.userEmail;
    const myPageInfo = await userService.getMyPageInfo(email);

    res.status(200).json(myPageInfo);
  } catch (error) {
    next(error);
  }
});

// 회원정보 수정
/**
 * @openapi
 * '/api/user':
 *  patch:
 *    tags:
 *      - User
 *    summary: Edit User Info
 *    description: 회원정보 수정 API (닉네임, 전화번호, 주소) <br><br> 이메일은 유저를 특정하기 위한 필수 항목<br> 이메일을 제외한 항목은 수정할 항목 하나에만 값을 넣고, 나머지는 null값을 넣어야 함<br><br> 예) 주소를 수정하는 요청을 보내고 싶은 경우 아래 Example Value와 같이 Body값을 설정해 주어야 함
 *    requestBody:
 *     required: true
 *     content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/MyPageEditInput'
 *    responses:
 *      200:
 *        description: 성공시 수정된 유저 정보 변환
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/MyPageResponse'
 *      400:
 *        description: Bad request
 *
 */
userRouter.patch("/user", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (isEmpty(req.body)) {
      throw new Error("headers의 Content-Type을 application/json으로 설정해주세요");
    }

    const email: string = req.body.email;
    const new_nickname: string = req.body.new_nickname;
    const new_tel: string = req.body.new_tel;
    const new_address_name: string = req.body.new_address_name;

    //* email이 null인 경우 예외
    if (email === null) {
      throw new Error("id(email)은 필수 항목입니다.");
    }

    //* new_nickname, new_tel, new_address_name 중 2개 이상의 항목에 null값이 아닌 값을 할당하여 요청을 보낸 경우 예외 처리
    if (
      !(
        (new_nickname && new_tel === null && new_address_name === null) ||
        (new_tel && new_nickname === null && new_address_name === null) ||
        (new_address_name && new_nickname === null && new_tel === null)
      )
    ) {
      throw new Error("수정하고 싶은 항목이 모두 null이거나 2개 이상입니다. 수정하고 싶은 항목 하나만 선택해 주세요.");
    }
    const new_user = await userService.editUserInfo({ email, new_nickname, new_tel, new_address_name });

    res.status(200).json(new_user);
  } catch (error) {
    next(error);
  }
});
export { userRouter };
