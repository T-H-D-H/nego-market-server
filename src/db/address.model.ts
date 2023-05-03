import pool from "./index";
import { Address, AddressSi, AddressGu, AddressDong } from "types/address";

export async function getAddresses(): Promise<Address[]> {
  const [rows] = await pool.query(
    `SELECT *
    FROM address`
  );

  return rows;
}

export async function getAddress(si: string, gu: string, dong: string): Promise<Address> {
  const [rows] = await pool.query(
    `SELECT *
     FROM address
     WHERE si = ?
     AND gu = ?
     AND dong = ?`,
    [si, gu, dong]
  );

  return rows[0];
}

export async function getAddressSi(): Promise<AddressSi[]> {
  const [rows] = await pool.query(
    `SELECT DISTINCT si 
     FROM address
     ORDER BY si`
  );

  return rows;
}

export async function getAddressGu(si: string): Promise<AddressGu[]> {
  const [rows] = await pool.query(
    `SELECT DISTINCT gu
     FROM address
     WHERE si = ?
     ORDER BY gu`,
    [si]
  );

  return rows;
}

export async function getAddressDong(si: string, gu: string): Promise<AddressDong[]> {
  const [rows] = await pool.query(
    `SELECT dong
     FROM address
     WHERE si = ?
     AND gu = ?
     ORDER BY dong`,
    [si, gu]
  );

  return rows;
}

export async function getAddressById(id: number): Promise<Address> {
  const [rows] = await pool.query(
    `SELECT *
     FROM address
     WHERE id = ?`,
    [id]
  );

  return rows[0];
}

export async function getAddressNameByUserId(userId: number) {
  const [rows] = await pool.query(
    `SELECT si, gu, dong
     FROM user u
     INNER JOIN address a on u.address_id = a.id
     WHERE u.id = ?;`
     ,[userId]
  );

  return rows[0];
}