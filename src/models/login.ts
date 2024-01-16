import pool from "../database";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();
const pepper = process.env.BCRYPT_PASSWORD;


export type LoginUser = {
  email: string;
  password: string;
};

export class LoginModel {
  async authenticate(user: LoginUser): Promise<LoginUser | string | null> {
    try {
      const conn = await pool.connect();

      const sql = "SELECT * FROM mrsm_users WHERE email = ($1);";

      const result = await conn.query(sql, [user.email]);

      if (result.rows.length === 0) {
        return "Please write the correct Email & Password";
      }

      const hashedPassword = result.rows[0].password;

      if (!bcrypt.compareSync(user.password + pepper, hashedPassword)) {        
        return "Please write the correct Email & Password";
      }

      const returnUser : LoginUser = {
        email: user.email,
        password: user.password
      };

      conn.release();
      return returnUser;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
}
