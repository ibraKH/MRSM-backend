import pool from "../../database";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds : any = process.env.SALT_ROUNDS;

export type SignupUser = {
  username: string;
  email: string;
  password: string;
};

export class SignupModel {
  async create(user: SignupUser): Promise<SignupUser | string | null> {
    try {
      const conn = await pool.connect();

      // Check for duplicate email
      const duplicateEmail = await conn.query(
        "SELECT * FROM mrsm_users WHERE email = ($1);",
        [user.email]
      );

      if (duplicateEmail.rows.length > 0) {
        conn.release();
        return "Email already exists";
      }

      // Check for duplicate username
      const duplicateUsername = await conn.query(
        "SELECT * FROM mrsm_users WHERE username = ($1);",
        [user.username]
      );

      if (duplicateUsername.rows.length > 0) {
        conn.release();
        return "Username already exists";
      }

      // Insert the new user if no duplicates are found
      const sql =
        "INSERT INTO mrsm_users (username, email, password) VALUES ($1, $2, $3);";

      const hash = bcrypt.hashSync(user.password + pepper, parseInt(saltRounds));

      await conn.query(sql, [user.username, user.email, hash]);

      conn.release();
      return user.username;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
}