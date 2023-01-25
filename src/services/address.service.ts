import * as addressModel from "../db/address.model";

export async function getAddresses() {
  const result = await addressModel.getAddresses();

  return result;
}

export async function getAddress(address: string) {
  const [si, gu, dong] = address.split(" ");
  const result = await addressModel.getAddress(si, gu, dong);

  return result;
}
