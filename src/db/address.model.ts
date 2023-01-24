import pool from "./index";
import { Address } from "types/address";

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
