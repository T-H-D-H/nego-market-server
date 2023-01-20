import pool from "./index";

export async function getAddress(si: string, gu: string, dong: string) {
  const [rows] = await pool.query(
    `SELECT *
     FROM address
     WHERE si = ?
     and gu = ?
     and dong = ?`
    ,[si, gu, dong]
  );

  return rows[0];
}