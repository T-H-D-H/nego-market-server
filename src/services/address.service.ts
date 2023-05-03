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

export async function getAddressSi() {
  const result = await addressModel.getAddressSi();
  const newResult = result.map((data) => data.si);

  return newResult;
}

export async function getAddressGu(si: string) {
  const result = await addressModel.getAddressGu(si);
  const newResult = result.map((data) => data.gu);

  return newResult;
}

export async function getAddressDong(si: string, gu: string) {
  const result = await addressModel.getAddressDong(si, gu);
  const newResult = result.map((data) => data.dong);

  return newResult;
}
