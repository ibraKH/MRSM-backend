import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import user_routes from './models/handlers/user';
import event_routes from './models/handlers/event';
import quiz_routes from "./models/handlers/quizzes";
import questions_routes from "./models/handlers/questions";
import cors from "cors";
import cookies from "cookie-parser";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3005;
const corsOptions = {origin: "*"};
app.use(cors(corsOptions));
app.use(cookies());

// Fake frontend just for testing!
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));



// Home Page
app.get("/", (req: Request, res: Response) => {
  res.sendFile(__dirname + "/public/index.html");
});

user_routes(app);
event_routes(app);
quiz_routes(app);
questions_routes(app);

// Not Found pages
app.get('*', (req: Request, res: Response): void => {
    res
      .status(404)
      .send('Page not found!');
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

export default app;