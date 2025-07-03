import express from 'express';
import cors from "cors"; 
import bodyParser from 'body-parser';
import type { Request, Response } from 'express';
import colors from 'colors';
import morgan from 'morgan';
import { randomBytes } from 'crypto'; 

const app = express(); 

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Logs
app.use(morgan("dev"));

// CORS setup
app.use(cors()); 

// Data object to simulate a database
const posts = {

}; 

app.get("/posts", (req: Request, res: Response) => {
    res.send(posts); 
}); 

app.post("/posts", (req: Request, res: Response) => {
    const id = randomBytes(4).toString("hex"); 

    const { title, content } = req.body; 

    posts[id] = { 
        id, 
        title, 
        content
    }; 

    res.status(201).send(posts[id]); 
}); 

app.listen(4000, () => {
    console.log( colors.blue.bold(`REST API working in port: 4000`))
})