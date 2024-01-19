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
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./auth"));
const path_1 = __importDefault(require("path"));
const questions_1 = require("../Quiz/questions");
dotenv_1.default.config();
const questionMethods = new questions_1.Questions();
const index = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const quizID = parseInt(_req.params.quizID);
    const result = yield questionMethods.index(quizID);
    res.json(result);
});
const createQuestionsPage = (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../public', '/new/questions.html'));
};
const create = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const quizID = parseInt(_req.params.quizID);
    let answerSelector = "";
    if (_req.body.type === "short response") {
        answerSelector = _req.body.answer[1];
    }
    else {
        answerSelector = _req.body.answer[0];
    }
    const question = {
        question: _req.body.question,
        type: _req.body.type,
        answer: answerSelector
    };
    const choices = {
        choices: _req.body.choice
    };
    try {
        const result = yield questionMethods.create(quizID, question, choices);
        res.json({ status: "Successful!", result: result });
    }
    catch (err) {
        res.status(400).json(err);
    }
});
const questions_routes = (app) => {
    app.get("/quiz/:quizID", auth_1.default, index);
    app.get("/quiz/:quizID/new/questions", auth_1.default, createQuestionsPage);
    app.post("/quiz/:quizID/new/questions", auth_1.default, create);
};
exports.default = questions_routes;
