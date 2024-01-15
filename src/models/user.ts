import pool from "../database";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds : any = process.env.SALT_ROUNDS;

export type User = {
    user_id: Number,
    username: string,
    email: string,
    password: string
}

export class Users {

    // Display all users
    async index(): Promise<User[]> {
        try{
            const conn = await pool.connect();
            const sql = 'SELECT * FROM mrsm_users;';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
            } catch (err) {
                throw new Error(`${err}`);
            }
    }

    // Display specific user
    async show(user_id: number): Promise<User[]>{
        try{
            const conn = await pool.connect();
            const sql = 'SELECT * FROM mrsm_users WHERE user_id = ($1);';
            const result = await conn.query(sql, [user_id]);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`${err}`);
        }
    }

    // Create new user 
    async create(user: User): Promise<Array<User> | string>{
        try{            
            const conn = await pool.connect();
            // Test for duplicate id
            const duplicateID = await conn.query("SELECT * FROM mrsm_users WHERE user_id = ($1);", [user.user_id]); 
            if(duplicateID.rows[0] !== undefined) return 'Duplicate id';
            const sql = 'INSERT INTO mrsm_users (user_id,username,email,password) VALUES ($1,$2,$3,$4);';
            const hash = bcrypt.hashSync(
                user.password + pepper,
                parseInt(saltRounds)
            )
            const result = await conn.query(sql, [user.user_id, user.username, user.email, hash]);
            const userData = [{
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                password: hash
            }]
            conn.release();
            return userData;
        } catch (err) {
            throw new Error(`${err}`);
        }
    }
}