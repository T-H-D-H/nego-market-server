import { check } from "express-validator";

export const signupValidator = [
  // Check Name
  check("name")
    .trim()
    .notEmpty()
    .withMessage("이름은 필수값입니다.")
    .isLength({ min: 2, max: 10 })
    .withMessage("이름은 2~10자 사이로 입력해 주세요.")
    .custom((val) => {
      const reg = /^[가-힣]+$/g;
      return reg.test(val);
    })
    .withMessage("이름은 한글만 입력해 주세요."),
];
