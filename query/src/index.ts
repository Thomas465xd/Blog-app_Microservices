import express from 'express';
import cors from "cors"; 
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
    comments: { id: string; content: string; status: "pending" | "approved" | "rejected" }[];
}> = {};

type Event = {
    type: "PostCreated" | "CommentCreated" | "CommentUpdated";
    data: Object
}

const handleEvent = (type, data) => {
    //? Handle a "PostCreated" event
    if(type === "PostCreated") {
        const { id, title, content } = data; 

        // Create a new post entry in the `posts` object with an empty comments array
        posts[id] = { id, title, content, comments: [] }; 

        // Send back a response
        //return res.status(200).json({ message: "PostCreated Event successfully processed" })
    }

    //? Handle a "CommentCreated" Event
    if(type === "CommentCreated") {
        const { id, content, postId, status } = data; 

        // Get the post this comment belongs to
        const post = posts[postId]; 

        // Add the new comment to the post's comments array
        post.comments.push({ id, content, status })

        // Send back a response
        //return res.status(200).json({ message: "CommentCreated Event successfully processed" })
    }

    //? Handle a "CommentUpdated" Event
    if(type === "CommentUpdated") {
        // Destructure Event data
        const { id, content, postId, status } = data; 

        // Get the comment related post
        const post = posts[postId]; 
        const comment = post.comments.find(comment => {
            return comment.id === id
        })

        comment.status = status; 
        comment.content = content; 

        // Send back a response
        //return res.status(200).json({ message: "CommentCreated Event successfully processed" })
    }
}

app.get("/posts", (req: Request, res: Response) => {
    res.send(posts) // just return the in-memory posts object
})

app.post("/events", (req: Request, res: Response) => {
    const { type, data } = req.body as Event; 

    // Call helper function
    handleEvent(type, data)

    // Send back a response
    return res.send({message: "Event Not Used"})
})


// Set up 
app.listen(4002, async () => {
    console.log( colors.blue.bold(`Query Service Running on port: 4002`))

    try {
        const res = await axios.get("http://event-bus-cip-srv:4005/events");
    
        for (let event of res.data) {
            console.log("Processing event:", colors.rainbow(`${event.type}`));
    
            //! Handle all unprocessed events, this will save the info
            handleEvent(event.type, event.data);
        }
    } catch (error) {
        console.log(error.message);
    }
})