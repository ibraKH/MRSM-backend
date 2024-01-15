import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();


let pool : any;

pool = new Pool({
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
});


export default pool;