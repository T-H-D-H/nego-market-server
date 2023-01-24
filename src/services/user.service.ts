import * as userModel from "../db/user.model";
import * as bcrypt from "bcrypt";
import { User } from "types/user";
import * as jwt from "jsonwebtoken";
import "dotenv/config";

export async function getUsers(): Promise<User[]> {
  return await userModel.getUsers();
}

export async function getUserByEmail(email: string): Promise<User> {
  return await userModel.getUserByEmail(email);
}

export async function getUserByNickname(nickname: string): Promise<User> {
  return await userModel.getUserByNickname(nickname);
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
