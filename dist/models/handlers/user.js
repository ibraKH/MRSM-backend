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
const login_1 = require("../login");
const signup_1 = require("../signup");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const userLogin = new login_1.LoginModel();
const userSignUp = new signup_1.SignupModel();
const secretToken = process.env.TOKEN_SECRET;
const login = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = {
        email: _req.body.email,
        password: _req.body.password,
    };
    try {
        const result = yield userLogin.authenticate(user);
        const token = jsonwebtoken_1.default.sign({ user: result }, secretToken);
        res.cookie("token", token, {
            httpOnly: true
        });
        res.redirect("/events");
    }
    catch (err) {
        res.status(400).json(err);
    }
});
const signup = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = {
        username: _req.body.username,
        email: _req.body.email,
        password: _req.body.password,
    };
    try {
        const result = yield userSignUp.create(user);
        // Duplicates
        if (result == "Email already exists")
            return res.status(400).json(`Email already exists`);
        if (result == "Username already exists")
            return res.status(400).json(`Username already exists`);
        const token = jsonwebtoken_1.default.sign({ user: result }, secretToken);
        res.cookie("token", token, {
            httpOnly: true
        });
        res.redirect("/events");
    }
    catch (err) {
        res.status(400).json(err);
    }
});
const user_routes = (app) => {
    app.post("/login", login);
    app.post("/signup", signup);
};
exports.default = user_routes;
