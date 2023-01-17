import pool from "./index";


export async function getAll() {
  const [rows] = await pool.query("SELECT * FROM user");
  return rows;
}