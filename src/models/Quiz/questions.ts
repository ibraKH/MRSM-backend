import pool from "../../database";
import dotenv from "dotenv";

dotenv.config();

export type Question = {
  question: string;
  type: string;
  answer: string;
};

export type QuestionChoices = {
  choices: string[];
};

export class Questions {

  // Display all questions
  async index(quizID: number): Promise<string | null> {
    try {
      const conn = await pool.connect();
      const sql = 'SELECT q.question, array_agg(qc.choice) AS choices, q.answer FROM questions q LEFT JOIN question_choices qc ON q.id = qc.question_id WHERE q.quiz_id = ($1) GROUP BY q.id;';
      const result = await conn.query(sql, [quizID]);
      conn.release();
  
      if (result.rows.length === 0) {
        return "There are no questions for this quiz! Add questions to the quiz from /new/quiz.";
      }
  
      return result.rows.map((row: { question: any; answer: any; choices: any; }) => ({
        question: {
          question: row.question,
          answer: row.answer
        },
        choices: row.choices ? row.choices : undefined
      }));
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  
  // Create new question
  async create(quizID: number, questionInput: Question, questionChoicesInput: QuestionChoices): Promise<null | string> {
    try {
      const conn = await pool.connect();

      // Insert question
      const questionInsertSql = 'INSERT INTO questions (quiz_id, question, type, answer) VALUES ($1, $2, $3, $4) RETURNING id;';
      const questionInsertResult = await conn.query(questionInsertSql, [quizID, questionInput.question, questionInput.type, questionInput.answer]);
      const questionID = questionInsertResult.rows[0].id;

      // Insert choices
      const choicesInsertSql = 'INSERT INTO question_choices (question_id, choice) VALUES ($1, $2);';
      for (const choice of questionChoicesInput.choices) {
        await conn.query(choicesInsertSql, [questionID, choice]);
      }

      conn.release();
      return "Question created successfully!";
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
}
