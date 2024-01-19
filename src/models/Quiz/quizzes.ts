import pool from "../../database";
import dotenv from "dotenv";

dotenv.config();

export type Quiz = {
    name: string,
    description: string,
}

export class Quizzes {

    // Display all quizzes
    async index(): Promise<string> {
        try{
            const conn = await pool.connect();
            const sql = 'SELECT * FROM quizzes;';
            const result = await conn.query(sql);
            conn.release();

            if(result.rows.length === 0){
                return "There no quizzes! Try again in another time."
            }
            
            return result.rows;
            } catch (err) {
                throw new Error(`${err}`);
            }
    }

    // Create new quiz 
    async create(username: string, quiz: Quiz): Promise<Array<Quiz> | string>{
        try{          
            const currentTime = new Date();
            const conn = await pool.connect(); 

            // Check if the user has reached the limit of creating quizzes
            const userLimitSql = 'SELECT quizzes_count FROM mrsm_users WHERE username = ($1);';
            const userLimitResult = await conn.query(userLimitSql, [username]);
            const userCreatedQuizzesCount = userLimitResult.rows[0].quizzes_count;
            

            if (userCreatedQuizzesCount > 3) {
                conn.release();
                return "You have reached the limit of quizzes you can create.";
            }
            
            const sql = 'INSERT INTO quizzes (name,description,author_username,created_at) VALUES ($1,$2,$3,$4) RETURNING id;';
            const result = await conn.query(sql, [quiz.name,quiz.description,username,currentTime]);     
            const quizID = result.rows[0].id;       

            // Increment the quizzes count of the user
            const updateCountSql = 'UPDATE mrsm_users SET quizzes_count = quizzes_count + 1 WHERE username = ($1);';
            await conn.query(updateCountSql, [username]);


            conn.release();
            return quizID;
        } catch (err) {        
            console.log(err);
                
            throw new Error(`${err}`);
        }
    }
}