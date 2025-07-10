import express from 'express';
import cors from "cors"; 
import bodyParser from 'body-parser';
import type { Request, Response } from 'express';
import colors from 'colors';
import morgan from 'morgan';
import { randomBytes } from 'crypto'; 
import axios from 'axios';

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

app.post("/posts/:id/comments", async (req: Request, res: Response) => {
    // Create random ID for the comment
    const commentId = randomBytes(4).toString("hex"); 

    const { content } = req.body; 

    // Check if the post exists in the commentsByPostId object
    const comments = commentsByPostId[req.params.id] || []; 

    // Add the new comment to the array
    comments.push({ id: commentId, content }); 

    // Save the comments back to the object
    commentsByPostId[req.params.id] = comments;

    await axios.post("http://localhost:4005/events", {
        type: "CommentCreated", 
        data: {
            id: commentId, 
            content, 
            postId: req.params.id
        }
    }).catch((error) => {
        return res.status(500).json({ message: "Error sending event to event bus", error: error.message})
    })

    res.status(201).send(commentsByPostId[req.params.id]); 
}); 

// Receiving Events from the event bus
app.post("/events", async (req: Request, res: Response) => {
    console.log("received event", colors.blue(req.body.type)); 

    res.send({}); // Acknowledge the event
})

app.listen(4001, () => {
    console.log( colors.magenta.bold(`REST API working in port: 4001`))
})