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
const quizzes_1 = require("../Quiz/quizzes");
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./auth"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const quizMethods = new quizzes_1.Quizzes();
const index = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield quizMethods.index();
    res.json(result);
});
const createQuizPage = (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../public', '/new/quiz.html'));
};
const create = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = _req.user.user;
    const quiz = {
        name: _req.body.name,
        description: _req.body.description,
    };
    try {
        const result = yield quizMethods.create(username, quiz);
        if (result === "You have reached the limit of quizzes you can create.") {
            return res.json({ status: "failed", text: "You have reached the limit of quizzes you can create." });
        }
        res.redirect(`/quiz/${result}/new/questions`);
    }
    catch (err) {
        res.status(400).json(err);
    }
});
const quiz_routes = (app) => {
    app.get("/quizzes", auth_1.default, index);
    app.get("/new/quiz", auth_1.default, createQuizPage);
    app.post("/new/quiz", auth_1.default, create);
};
exports.default = quiz_routes;
