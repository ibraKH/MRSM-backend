"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Questions = void 0;
const database_1 = __importDefault(require("../../database"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Questions {
    // Display all questions
    index(quizID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = 'SELECT q.question, array_agg(qc.choice) AS choices, q.answer FROM questions q LEFT JOIN question_choices qc ON q.id = qc.question_id WHERE q.quiz_id = ($1) GROUP BY q.id;';
                const result = yield conn.query(sql, [quizID]);
                conn.release();
                if (result.rows.length === 0) {
                    return "There are no questions for this quiz! Add questions to the quiz from /new/quiz.";
                }
                return result.rows.map((row) => ({
                    question: {
                        question: row.question,
                        answer: row.answer
                    },
                    choices: row.choices ? row.choices : undefined
                }));
            }
            catch (err) {
                throw new Error(`${err}`);
            }
        });
    }
    // Create new question
    create(quizID, questionInput, questionChoicesInput) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                // Insert question
                const questionInsertSql = 'INSERT INTO questions (quiz_id, question, type, answer) VALUES ($1, $2, $3, $4) RETURNING id;';
                const questionInsertResult = yield conn.query(questionInsertSql, [quizID, questionInput.question, questionInput.type, questionInput.answer]);
                const questionID = questionInsertResult.rows[0].id;
                // Insert choices
                const choicesInsertSql = 'INSERT INTO question_choices (question_id, choice) VALUES ($1, $2);';
                for (const choice of questionChoicesInput.choices) {
                    yield conn.query(choicesInsertSql, [questionID, choice]);
                }
                conn.release();
                return "Question created successfully!";
            }
            catch (err) {
                throw new Error(`${err}`);
            }
        });
    }
}
exports.Questions = Questions;
