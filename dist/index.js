"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const user_1 = __importDefault(require("./models/handlers/user"));
const event_1 = __importDefault(require("./models/handlers/event"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3005;
const corsOptions = { origin: "*" };
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
// Home Page
app.get("/", (req, res) => {
    res.send("MRSM app Backend");
});
(0, user_1.default)(app);
(0, event_1.default)(app);
// Not Found pages
app.get('*', (req, res) => {
    res
        .status(404)
        .send('Page not found!');
});
app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});
exports.default = app;
