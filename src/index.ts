import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3005;

app.get("/", (req: Request, res: Response) => {
  res.send("MRSM app Backend");
});

app.get("*", (req: Request, res: Response) => {
    res.send("Page Not Found!");
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

export default app;