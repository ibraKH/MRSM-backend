"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secretToken = process.env.TOKEN_SECRET;
const authToken = (req, res, next) => {
    try {
        // const authHeader = req.headers.authorization;
        // const token = authHeader?.split(" ")[1];
        // Changing to cookies
        const token = req.cookies.token;
        if (token == undefined)
            return res.status(401).json(`Invalid token`);
        const user = jsonwebtoken_1.default.verify(token, secretToken);
        req.user = user;
        next();
    }
    catch (err) {
        res.status(401);
        res.json(`Invalid token ${err}`);
    }
};
exports.default = authToken;
