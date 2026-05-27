require("dotenv").config();
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const User = require("./model/userModel");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");


const allowedOrigins = [process.env.FRONTEND_URL, process.env.DASHBOARD_URL].filter(Boolean);
app.use(cors({
    origin: (origin, callback) => {
        // Allow non-browser clients / health checks (no Origin header).
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

// Avoid requests hanging for a long time when Mongo is unreachable.
mongoose.set("bufferCommands", false);

app.get("/health", (_req, res) => {
    res.status(200).json({
        ok: true,
        mongoReadyState: mongoose.connection.readyState,
    });
});

app.use("/", authRoute);

async function start() {
    if (!uri) {
        console.error("MONGO_URL is missing");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10_000,
            connectTimeoutMS: 10_000,
            socketTimeoutMS: 20_000,
        });
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`App started at port ${PORT}`);
        });
    } catch (err) {
        console.error("MongoDB connection failed", err);
        process.exit(1);
    }
}

start();
