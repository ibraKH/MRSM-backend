import express, { Request , Response } from "express";
import dotenv from "dotenv";
import authToken from "./auth";
import path from "path";
import { Questions, QuestionChoices, Question } from "../Quiz/questions";

dotenv.config();

const questionMethods = new Questions();

const index = async (_req: Request, res: Response) => {  
    const quizID = parseInt(_req.params.quizID);
    const result = await questionMethods.index(quizID);
    res.json(result);
};

const createQuestionsPage = (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../public', '/new/questions.html'));
};

const create = async (_req: Request, res: Response) => { 
    const quizID = parseInt(_req.params.quizID);  
    let answerSelector = "";
    if(_req.body.type === "short response"){
        answerSelector = _req.body.answer[1];
    }else{
        answerSelector = _req.body.answer[0]
    }
    
    const question : Question = {
        question: _req.body.question,
        type: _req.body.type,
        answer: answerSelector
    }
    const choices : QuestionChoices = {
        choices: _req.body.choice
    }
    
    try{
        const result = await questionMethods.create(quizID, question, choices);
        res.json({status: "Successful!", result: result});
    } catch(err){
        res.status(400).json(err)
    }
};

const questions_routes = (app: express.Application) => {
    app.get("/quiz/:quizID", authToken , index)
    app.get("/quiz/:quizID/new/questions", authToken, createQuestionsPage)
    app.post("/quiz/:quizID/new/questions", authToken, create)
};

export default questions_routes;