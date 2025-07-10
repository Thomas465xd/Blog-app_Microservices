import express from 'express';
import cors from "cors"; 
import bodyParser from 'body-parser';
import type { Request, Response } from 'express';
import colors from 'colors';
import morgan from 'morgan';

const app = express(); 

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Logs
app.use(morgan("dev"));

// CORS setup
app.use(cors()); 

// In-memory object to store all posts and their associated comments
/**
 * ? Post Example
 * posts === {
 *  "sdfa234": {
 *     id: "243oid", 
 *     title: "post title", 
 *     comments: [
 *        { id: "asdfjl223", content: "Comment 1" }, 
 *        { ... }, 
 *        { ... }
 *     ]
 *   }
 * }
 */

const posts: Record<string, {
    id: string;
    title: string;
    content: string;
    comments: { id: string; content: string }[];
}> = {};

app.get("/posts", (req: Request, res: Response) => {
    res.send(posts) // just return the in-memory posts object
})

app.post("/events", (req: Request, res: Response) => {
    const { type, data } = req.body; 

    // Handle a "PostCreated" event
    if(type === "PostCreated") {
        const { id, title, content } = data; 

        // Create a new post entry in the `posts` object with an empty comments array
        posts[id] = { id, title, content, comments: [] }; 
    }

    // Handle a "CommentCreated" Event
    if(type === "CommentCreated") {
        const { id, content, postId } = data; 

        // Get the post this comment belongs to
        const post = posts[postId]; 

        // Add the new comment to the post's comments array
        post.comments.push({ id, content })
    }

    console.log(posts)

    // Send back a response
    res.send({})
})


// Set up 
app.listen(4002, () => {
    console.log( colors.blue.bold(`Query Service Running on port: 4002`))
})