import express from 'express';
import cors from "cors"; 
import bodyParser from 'body-parser';
import type { Request, Response } from 'express';
import colors from 'colors';
import morgan from 'morgan';
import { randomBytes } from 'crypto'; 
import axios from 'axios';

// Initialize the Express app
const app = express(); 

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Logs
app.use(morgan("dev"));

// CORS setup
app.use(cors()); 

// Data object of services 
const services = [
    { name: "posts", url: "http://localhost:4000/events" },
    { name: "comments", url: "http://localhost:4001/events" },
    { name: "query", url: "http://localhost:4002/events" },
];

// Event bus endpoint to receive events
app.post("/events", async (req: Request, res: Response) => {
    const event = req.body;
    const errors: { service: string, error: string }[] = [];
    const successes: string[] = [];

    // Iterate over each service and send the event
    await Promise.allSettled(
        services.map((service) =>
            axios.post(service.url, event)
                .then(() => {
                    // Log Success messages
                    const msg = `✅ Event sent successfully to "${service.name}" at ${service.url}`;
                    console.log(colors.green.bold(msg));
                    successes.push(msg);
                })
                .catch((err) => {
                    const errorMsg = `❌ Failed to send event to "${service.name}" at ${service.url}`;
                    console.log(colors.red.bold(errorMsg));
                    errors.push({ service: service.name, error: err.message || "Error sending request" });
                })
        )
    );

    if (errors.length > 0) {
        res.status(207).json({
            message: "Event processed with some failures",
            successes,
            errors
        });
    } else {
        res.status(200).json({
            message: "Event successfully sent to all services!",
            successes
        });
    }
});

app.listen(4005, () => {
    console.log( colors.blue.bold(`Event bus running on port: 4005`))
})