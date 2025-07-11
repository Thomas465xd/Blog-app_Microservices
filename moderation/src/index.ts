import express from 'express';
import bodyParser from 'body-parser';
import type { Request, Response } from 'express';
import colors from 'colors';
import morgan from 'morgan';
import axios from 'axios';

const app = express(); 

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Logs
app.use(morgan("dev"));

// 
app.post("/events", (req: Request, res: Response) => {
    
})

app.listen(4003, () => {
    console.log( colors.blue.bold(`Moderation Service running on port: 4003`))
})