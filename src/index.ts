import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import user_routes from './models/handlers/user';
import cors from "cors";


dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3005;
const corsOptions = {origin: "*"};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Home Page
app.get("/", (req: Request, res: Response) => {
  res.send("MRSM app Backend");
});

user_routes(app);

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