import * as userModel from "../db/user.model";

export async function getAll() {
  return await userModel.getAll();
}
