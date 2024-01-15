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
exports.Users = void 0;
const database_1 = __importDefault(require("../database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS;
class Users {
    // Display all users
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = 'SELECT * FROM mrsm_users;';
                const result = yield conn.query(sql);
                conn.release();
                return result.rows;
            }
            catch (err) {
                throw new Error(`${err}`);
            }
        });
    }
    // Display specific user
    show(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = 'SELECT * FROM mrsm_users WHERE user_id = ($1);';
                const result = yield conn.query(sql, [user_id]);
                conn.release();
                return result.rows;
            }
            catch (err) {
                throw new Error(`${err}`);
            }
        });
    }
    // Create new user 
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                // Test for duplicate id
                const duplicateID = yield conn.query("SELECT * FROM mrsm_users WHERE user_id = ($1);", [user.user_id]);
                if (duplicateID.rows[0] !== undefined)
                    return 'Duplicate id';
                const sql = 'INSERT INTO mrsm_users (user_id,username,email,password) VALUES ($1,$2,$3,$4);';
                const hash = bcryptjs_1.default.hashSync(user.password + pepper, parseInt(saltRounds));
                const result = yield conn.query(sql, [user.user_id, user.username, user.email, hash]);
                const userData = [{
                        user_id: user.user_id,
                        username: user.username,
                        email: user.email,
                        password: hash
                    }];
                conn.release();
                return userData;
            }
            catch (err) {
                throw new Error(`${err}`);
            }
        });
    }
}
exports.Users = Users;
