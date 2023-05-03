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

export const createProdcutValidator = [
  check("title")
    .trim()
    .notEmpty()
    .withMessage("제목은 필수값입니다."),

  check("content")
    .trim()
    .notEmpty()
    .withMessage("본문은 필수값입니다."),

  check("price")
    .trim()
    .notEmpty()
    .withMessage("가격은 필수값입니다."),

  check("tags")
    .trim()
    .custom(val => {
      const tagsArr = val.split(',');
      return val != "" && tagsArr.length > 0 && tagsArr.length < 11;
    })
    .withMessage("태그는 최소 1개 ~ 10개 이하로 입력해 주세요.")
    .customSanitizer(value => {
      // 쉼표로 구분된 문자열을 배열로 분할
      return value.split(',');
    })
    .custom((value: string[])=> {
      const values = value.map(str => str.trim());
      const emptyValues = values.filter(str => !str);
  
      if (emptyValues.length > 0) {
        throw new Error('각 요소는 비어 있을 수 없습니다.');
      }
  
      // 처리된 배열 반환
      return values;
    })
    .customSanitizer((value: string[]) => {
      return value.map(str => str.trim())
    })
]