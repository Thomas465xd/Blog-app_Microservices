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
const commentsByPostId = {}; 

app.get("/posts/:id/comments", (req: Request, res: Response) => {
    res.send(commentsByPostId[req.params.id] || []); 
}); 

app.post("/posts/:id/comments", (req: Request, res: Response) => {
    // Create random ID for the comment
    const commentId = randomBytes(4).toString("hex"); 

    const { content } = req.body; 

    // Check if the post exists in the commentsByPostId object
    const comments = commentsByPostId[req.params.id] || []; 

    // Add the new comment to the array
    comments.push({ id: commentId, content }); 

    // Save the comments back to the object
    commentsByPostId[req.params.id] = comments;

    res.status(201).send(commentsByPostId[req.params.id]); 
}); 

app.listen(4001, () => {
    console.log( colors.magenta.bold(`REST API working in port: 4001`))
})