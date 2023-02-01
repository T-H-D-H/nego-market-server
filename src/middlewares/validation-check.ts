import { check } from "express-validator";

export const signupValidator = [
  // Check Name
  check("name")
    .trim()
    .notEmpty()
    .withMessage("이름은 필수값입니다.")
    .isLength({ min: 2, max: 16 })
    .withMessage("이름은 2~16자 사이로 입력해 주세요.")
    .custom((val) => {
      const reg = /^[가-힣]+$/g;
      return reg.test(val);
    })
    .withMessage("이름은 한글만 입력해 주세요."),

  // check Nickname
  check("nickname")
    .trim()
    .notEmpty()
    .withMessage("닉네임은 필수값입니다.")
    .isLength({ min: 2, max: 10 })
    .withMessage("닉네임은 2~10자 사이로 입력해 주세요."),

  // check Email
  check("email")
    .trim()
    .notEmpty()
    .withMessage("이메일은 필수값입니다.")
    .isEmail()
    .withMessage("이메일의 형식이 올바르지 않습니다.")
    .isLength({ min: 5, max: 64 })
    .withMessage("이메일은 5~64자 사이로 입력해 주세요."),

  // check Password
  check("password")
    .trim()
    .notEmpty()
    .custom((val) => {
      const reg = /^(?=.*[a-zA-Z0-9])((?=.*\W)).{8,16}$/;
      return reg.test(val);
    })
    .withMessage("비밀번호는 8~16자 이내, 특수문자를 한 개 이상 입력해 주세요."),

  // check tell
  check("tel")
    .trim()
    .notEmpty()
    .withMessage("전화번호는 필수값입니다.")
    .custom((val) => {
      const reg = /^\d{2,3}-?\d{3,4}-?\d{4}$/;
      return reg.test(val);
    })
    .withMessage("전화번호 형식이 올바르지 않습니다."),

  // check address
  check("address").notEmpty().withMessage("주소는 필수값입니다."),
];
