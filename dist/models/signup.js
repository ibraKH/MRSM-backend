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
exports.SignupModel = void 0;
const database_1 = __importDefault(require("../database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS;
class SignupModel {
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                // Check for duplicate email
                const duplicateEmail = yield conn.query("SELECT * FROM mrsm_users WHERE email = ($1);", [user.email]);
                if (duplicateEmail.rows.length > 0) {
                    conn.release();
                    return "Email already exists";
                }
                // Check for duplicate username
                const duplicateUsername = yield conn.query("SELECT * FROM mrsm_users WHERE username = ($1);", [user.username]);
                if (duplicateUsername.rows.length > 0) {
                    conn.release();
                    return "Username already exists";
                }
                // Insert the new user if no duplicates are found
                const sql = "INSERT INTO mrsm_users (username, email, password) VALUES ($1, $2, $3);";
                const hash = bcryptjs_1.default.hashSync(user.password + pepper, parseInt(saltRounds));
                yield conn.query(sql, [user.username, user.email, hash]);
                const userData = {
                    username: user.username,
                    email: user.email,
                    password: hash,
                };
                conn.release();
                return userData;
            }
            catch (err) {
                throw new Error(`${err}`);
            }
        });
    }
}
exports.SignupModel = SignupModel;
