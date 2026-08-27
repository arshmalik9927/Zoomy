import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";
import meetingRoutes from "./routes/meeting.js";

import connectToSocket from "./controllers/socketmager.js";
import userRoutes from "./routes/user.js";

const app = express();
const server = createServer(app);

// Socket.IO
const io = connectToSocket(server);

// Port
app.set("port", process.env.PORT || 8080);

// Middleware
app.use(cors());
app.use(express.json({ limit: "40kb" }));

app.use(express.urlencoded({
    limit: "40kb",
    extended: true
}));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/meetings", meetingRoutes);

// MongoDB + Server
const start = async () => {
    try {
        const connectionDb = await mongoose.connect(
            "mongodb+srv://Arshmalik:9927756394@cluster0.ppg3lhy.mongodb.net/?appName=Cluster0"
        );

        console.log(
            `Mongo connection DB host: ${connectionDb.connection.host}`
        );

        server.listen(app.get("port"), () => {
            console.log(`Server is working on port ${app.get("port")}`);
        });

    } catch (error) {
        console.log("MongoDB connection failed:", error.message);
    }
};

start();