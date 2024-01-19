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
exports.Quizzes = void 0;
const database_1 = __importDefault(require("../../database"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Quizzes {
    // Display all quizzes
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = 'SELECT * FROM quizzes;';
                const result = yield conn.query(sql);
                conn.release();
                if (result.rows.length === 0) {
                    return "There no quizzes! Try again in another time.";
                }
                return result.rows;
            }
            catch (err) {
                throw new Error(`${err}`);
            }
        });
    }
    // Create new quiz 
    create(username, quiz) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentTime = new Date();
                const conn = yield database_1.default.connect();
                // Check if the user has reached the limit of creating quizzes
                const userLimitSql = 'SELECT quizzes_count FROM mrsm_users WHERE username = ($1);';
                const userLimitResult = yield conn.query(userLimitSql, [username]);
                const userCreatedQuizzesCount = userLimitResult.rows[0].quizzes_count;
                if (userCreatedQuizzesCount > 3) {
                    conn.release();
                    return "You have reached the limit of quizzes you can create.";
                }
                const sql = 'INSERT INTO quizzes (name,description,author_username,created_at) VALUES ($1,$2,$3,$4) RETURNING id;';
                const result = yield conn.query(sql, [quiz.name, quiz.description, username, currentTime]);
                const quizID = result.rows[0].id;
                // Increment the quizzes count of the user
                const updateCountSql = 'UPDATE mrsm_users SET quizzes_count = quizzes_count + 1 WHERE username = ($1);';
                yield conn.query(updateCountSql, [username]);
                conn.release();
                return quizID;
            }
            catch (err) {
                console.log(err);
                throw new Error(`${err}`);
            }
        });
    }
}
exports.Quizzes = Quizzes;
