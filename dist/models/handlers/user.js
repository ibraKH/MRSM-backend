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
const user_1 = require("../user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const store = new user_1.Users();
const secretToken = process.env.TOKEN_SECRET;
const index = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield store.index();
    res.json(result);
});
const show = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(_req.params.id);
        const result = yield store.show(userId);
        if (result == undefined) {
            return res.json(`No result for any user by the ID = ${userId}`);
        }
        res.json(result);
    }
    catch (err) {
        res.status(400).json(err);
    }
});
const create = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = {
        user_id: _req.body.id,
        username: _req.body.username,
        email: _req.body.email,
        password: _req.body.password,
    };
    try {
        const result = yield store.create(user);
        if (result == "Duplicate id")
            return res.status(400).json(`Duplicated id = ${user.user_id}`);
        const token = jsonwebtoken_1.default.sign({ user: result }, secretToken);
        res.json(token);
    }
    catch (err) {
        res.status(400).json(err);
    }
});
const user_routes = (app) => {
    app.get("/users", index);
    app.get("/user/:id", show);
    app.post("/new/user", create);
};
exports.default = user_routes;
