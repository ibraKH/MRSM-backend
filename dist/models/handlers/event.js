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
const event_1 = require("../event");
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./auth"));
dotenv_1.default.config();
const eventMethods = new event_1.Events();
const index = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userEmail = _req.user.user.email;
    const result = yield eventMethods.index(userEmail);
    res.json(result);
});
const show = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userEmail = _req.user.user.email;
    try {
        const eventID = parseInt(_req.params.eventID);
        const result = yield eventMethods.show(userEmail, eventID);
        if (result == undefined) {
            return res.json(`No result for any event by the ID = ${eventID}`);
        }
        res.json(result);
    }
    catch (err) {
        res.status(400).json(err);
    }
});
const create = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userEmail = _req.user.user.email;
    const event = {
        eventID: _req.body.eventID,
        eventType: _req.body.eventType,
        eventName: _req.body.eventName,
        eventDate: _req.body.eventDate,
        eventURL: _req.body.eventURL
    };
    try {
        const result = yield eventMethods.create(userEmail, event);
        res.json(result);
    }
    catch (err) {
        res.status(400).json(err);
    }
});
const event_routes = (app) => {
    app.get("/events", auth_1.default, index);
    app.get("/event/:eventID", auth_1.default, show);
    app.post("/new/event", auth_1.default, create);
};
exports.default = event_routes;
