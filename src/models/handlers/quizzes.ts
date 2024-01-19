import express, { Request , Response } from "express";
import { Quiz, Quizzes } from "../Quiz/quizzes";
import dotenv from "dotenv";
import authToken from "./auth";
import path from "path";

dotenv.config();

const quizMethods = new Quizzes();

const index = async (_req: Request, res: Response) => {  
    const result = await quizMethods.index();
    res.json(result);
};

const createQuizPage = (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../public', '/new/quiz.html'));
};


const create = async (_req: Request, res: Response) => { 
    const username = _req.user.user;     
    const quiz : Quiz = {
        name: _req.body.name,
        description: _req.body.description,
    }
    
    try{
        const result = await quizMethods.create(username, quiz);
        if(result === "You have reached the limit of quizzes you can create."){
            return res.json({ status: "failed", text: "You have reached the limit of quizzes you can create."})
        }

        res.redirect(`/quiz/${result}/new/questions`)
    } catch(err){
        res.status(400).json(err)
    }
};

const quiz_routes = (app: express.Application) => {
    app.get("/quizzes", authToken , index)
    app.get("/new/quiz", authToken, createQuizPage)
    app.post("/new/quiz", authToken, create)
};

export default quiz_routes;