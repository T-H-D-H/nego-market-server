import * as userModel from "../db/user.model";
import * as addresModel from "../db/address.model";
import * as bcrypt from "bcrypt";
import { User, UserMyPage, UserEditGet } from "types/user";
import { Address } from "types/address";
import * as jwt from "jsonwebtoken";
import "dotenv/config";

export function myPageUserInfo(user: User, address: Address): UserMyPage {
  const edited_user: UserMyPage = {
    email: user.email,
    name: user.name,
    nickname: user.nickname,
    tel: user.tel,
    si: address.si,
    gu: address.gu,
    dong: address.dong,
  };

  return edited_user;
}
export async function getUsers(): Promise<User[]> {
  return await userModel.getUsers();
}

export async function getUserByEmail(email: string): Promise<User> {
  return await userModel.getUserByEmail(email);
}

export async function getUserByNickname(nickname: string): Promise<User> {
  return await userModel.getUserByNickname(nickname);
}

export async function getUserByTel(tel: string): Promise<User> {
  return await userModel.getUserByTel(tel);
}

export async function registerUser(name: string, email: string, password: string, nickname: string, address_id: number, tel: string): Promise<User> {
  const salt = 13;
  const hashedPassword = await bcrypt.hash(password, salt);

  return await userModel.registerUser(name, email, hashedPassword, nickname, address_id, tel);
}

export async function getUserToken(email: string, password: string): Promise<{ token: string }> {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.");
  }

  const correctHashedPassword = user.password;
  const isPasswordCorrect = await bcrypt.compare(password, correctHashedPassword);

  if (!isPasswordCorrect) {
    throw new Error("비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.");
  }

  const secretKey = process.env.JWT_SECRET_KEY as string;
  const token = jwt.sign({ userEmail: email }, secretKey);

  return { token };
}

export async function deleteUser(email: string, password: string): Promise<void> {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error("해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.");
  }

  const correctHashedPassword = user.password;
  const isPasswordCorrect = await bcrypt.compare(password, correctHashedPassword);

  if (!isPasswordCorrect) {
    throw new Error("비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.");
  }

  await userModel.deleteUser(email);
}

export async function getMyPageInfo(email: string): Promise<UserMyPage> {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error("해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.");
  }

  const address = await addresModel.getAddressById(user.address_id);

  if (!address) {
    throw new Error("주소가 올바르지 않습니다. 다시 한 번 확인해 주세요.");
  }

  // 회원정보 수정 페이지에 표시되는 데이터 파싱
  const userInfo: UserMyPage = myPageUserInfo(user, address);

  return userInfo;
}

export async function editUserInfo(userInfo: UserEditGet): Promise<UserMyPage> {
  const email: string = userInfo.email;
  const new_nickname: string = userInfo.new_nickname;
  const new_tel: string = userInfo.new_tel;
  const new_address_name: string = userInfo.new_address_name;

  if (new_nickname != null) {
    // nickname 수정
    const user = await userModel.editNickname(email, new_nickname);
    const address = await addresModel.getAddressById(user.address_id);

    const edited_user: UserMyPage = myPageUserInfo(user, address);

    return edited_user;
  } else if (new_tel != null) {
    // tel 수정
    const user = await userModel.editTel(email, new_tel);
    const address = await addresModel.getAddressById(user.address_id);

    const edited_user: UserMyPage = myPageUserInfo(user, address);

    return edited_user;
  } else {
    //주소 수정
    const [si, gu, dong] = new_address_name.split(" ");
    const address = await addresModel.getAddress(si, gu, dong);

    if (!address) {
      throw new Error("올바르지 않은 주소입니다. 다시 한 번 확인해 주세요.");
    }

    const user = await userModel.editAddress(email, address.id);
    const edited_user: UserMyPage = myPageUserInfo(user, address);

    return edited_user;
  }
}
