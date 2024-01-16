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
exports.LoginModel = void 0;
const database_1 = __importDefault(require("../database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pepper = process.env.BCRYPT_PASSWORD;
class LoginModel {
    authenticate(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = "SELECT * FROM mrsm_users WHERE email = ($1);";
                const result = yield conn.query(sql, [user.email]);
                if (result.rows.length === 0) {
                    return "Please write the correct Email & Password";
                }
                const hashedPassword = result.rows[0].password;
                if (!bcryptjs_1.default.compareSync(user.password + pepper, hashedPassword)) {
                    return "Please write the correct Email & Password";
                }
                const returnUser = {
                    email: user.email,
                    password: user.password
                };
                conn.release();
                return returnUser;
            }
            catch (err) {
                throw new Error(`${err}`);
            }
        });
    }
}
exports.LoginModel = LoginModel;
