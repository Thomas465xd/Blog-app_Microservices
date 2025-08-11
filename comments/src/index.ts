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

// Event Type
type Event = {
    type: string; 
    data: {
        id: string
        postId: string
        status: "pending" | "rejected" | "approved"
        content: string
    } 
}

// Simulated in-memory DB: each post ID maps to an array of comments
const commentsByPostId: Record<string, {
    id: string;
    content: string;
    status: "pending" | "approved" | "rejected";
}[]> = {};

app.get("/posts/:id/comments", (req: Request, res: Response) => {
    res.send(commentsByPostId[req.params.id] || []); 
}); 

//? Register new Comment
app.post("/posts/:id/comments", async (req: Request, res: Response) => {
    // Create random ID for the comment
    const commentId = randomBytes(4).toString("hex"); 

    // Get the content of the comment
    const { content } = req.body; 

    // Check if the post exists in the commentsByPostId object
    const comments = commentsByPostId[req.params.id] || []; 

    // Add the new comment to the array
    comments.push({ id: commentId, content, status: "pending" }); 

    // Save the comments back to the object
    commentsByPostId[req.params.id] = comments;

    // Send CommentCreated Event to the event bus
    await axios.post("http://event-bus-cip-srv:4005/events", {
        type: "CommentCreated", 
        data: {
            id: commentId, 
            content, 
            postId: req.params.id, 
            status: "pending"
        }
    }).catch((error) => {
        return res.status(500).json({ message: "Error sending event to event bus", error: error.message})
    })

    res.status(201).send(commentsByPostId[req.params.id]); 
}); 

//? Receiving Events from the event bus
app.post("/events", async (req: Request, res: Response) => {
    console.log("received event", colors.blue(req.body.type)); 

    // Destructure event attributes
    const { type, data } = req.body as Event; 

    if(type === "CommentModerated") {
        // Destructure Event data
        const { id, postId, status, content } = data; 

        // Get all comments associated with that postId
        const comments = commentsByPostId[postId]; 

        // Find the comment 
        const comment = comments.find(comment => {
            return comment.id === id
        })

        // Set comment status default status "pending" to new moderated status
        comment.status = status

        // Send "CommentUpdated" Event to Query service
        await axios.post("http://event-bus-cip-srv:4005/events", {
            type: "CommentUpdated", 
            data: {
                id, 
                postId, 
                content, 
                status
            }
        })

        // Send back a response
        res.status(200).json({ message: "CommentModerated Event successfully processed" })
        return
    }

    // Send back a response
    res.send({message: "Event not Used"})
    return
})

app.listen(4001, () => {
    console.log( colors.magenta.bold(`REST API working in port: 4001`))
})