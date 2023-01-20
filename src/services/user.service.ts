import * as userModel from "../db/user.model";
import * as bcrypt from "bcrypt";

export async function getUsers() {
  return await userModel.getUsers();
}

export async function getUserByEmail(email: string) {
  return await userModel.getUserByEmail(email);
}

export async function getUserByNickname(nickname: string) {
  return await userModel.getUserByNickname(nickname);
}

export async function registerUser(name: string, email: string, password: string, nickname: string, address_id: number, tel: string) {
  const salt = 13;
  const hashedPassword = await bcrypt.hash(password, salt);

  return await userModel.registerUser(name, email, hashedPassword, nickname, address_id, tel);
}
