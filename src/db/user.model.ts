import pool from "./index";
import { User } from "types/user";

export async function getUsers(): Promise<User[]> {
  const [rows] = await pool.query("SELECT * FROM user");
  return rows;
}

export async function getUserByEmail(email: string): Promise<User> {
  const [rows] = await pool.query(
    `SELECT *
     FROM user
     WHERE email = ?`,
    [email]
  );

  return rows[0];
}

export async function getUserByNickname(nickname: string): Promise<User> {
  const [rows] = await pool.query(
    `SELECT *
     FROM user
     WHERE nickname = ?`,
    [nickname]
  );

  return rows[0];
}

export async function getUserById(id: number): Promise<User> {
  const [rows] = await pool.query(
    `SELECT *
     FROM user
     WHERE id = ?`,
    [id]
  );

  return rows[0];
}

export async function registerUser(name: string, email: string, password: string, nickname: string, address_id: number, tel: string): Promise<User> {
  const [result] = await pool.query(
    `INSERT INTO user (name, email, password, nickname, address_id, tel)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, email, password, nickname, address_id, tel]
  );

  const user = await getUserById(result.insertId);

  return user;
}

export async function deleteUser(email: string): Promise<void> {
  await pool.query(
    `DELETE FROM user
     WHERE email = ?`,
    [email]
  );
}
