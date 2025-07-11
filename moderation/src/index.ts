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

// 
app.post("/events", async (req: Request, res: Response) => {
    const { type, data } = req.body as Event; 

    //? Catch "CommentCretead" Event
    if (type === "CommentCreated") {
        // Check whether the comment meets the moderation criteria
        const status = data.content.includes("orange") ? "rejected" : "approved"

        // Send event to the event bus
        await axios.post("http://localhost:4005/events", {
            type: "CommentModerated",
            data: {
                id: data.id, 
                postId: data.postId, 
                status, 
                content: data.content
            }
        })

        // Testing in the Console
        console.log(`${colors.blue("CommentCreated Moderation")} Event successfully processed`)

        // Send back a response
        res.status(200).json({ message: "CommentCreated Moderation Event successfully processed" })
        return
    }

    // Send back a response
    res.send({message: "Event not Used"})
    return
})

app.listen(4003, () => {
    console.log( colors.blue.bold(`Moderation Service running on port: 4003`))
})