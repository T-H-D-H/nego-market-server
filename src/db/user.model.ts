import pool from "./index";

export async function getUsers() {
  const [rows] = await pool.query("SELECT * FROM user");
  return rows;
}

export async function getUserByEmail(email: string) {
  const [rows] = await pool.query(
    `SELECT *
     FROM user
     WHERE email = ?`,
    [email]
  );

  return rows[0];
}

export async function getUserByNickname(nickname: string) {
  const [rows] = await pool.query(
    `SELECT *
     FROM user
     WHERE nickname = ?`,
    [nickname]
  );

  return rows[0];
}

export async function getUserById(id: number) {
  const [rows] = await pool.query(
    `SELECT *
     FROM user
     WHERE id = ?`,
    [id]
  );

  return rows[0];
}

export async function registerUser(name: string, email: string, password: string, nickname: string, address_id: number, tel: string) {
  const [result] = await pool.query(
    `INSERT INTO user (name, email, password, nickname, address_id, tel)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, email, password, nickname, address_id, tel]
  );

  const user = await getUserById(result.insertId);

  return user;
}
