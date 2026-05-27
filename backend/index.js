require("dotenv").config();
const dns = require("dns");

// Prefer IPv4 to avoid SMTP failures on hosts without IPv6 egress.
// This commonly fixes `connect ENETUNREACH ... Local (::0)` seen with nodemailer.
try {
    dns.setDefaultResultOrder("ipv4first");
} catch (_e) {
    // Older Node versions may not support this; ignore.
}
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const User = require("./model/userModel");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");


const allowedOrigins = [process.env.FRONTEND_URL,process.env.DASHBOARD_URL];
app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin)){
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

mongoose.connect(uri).then(() => console.log("MongoDB is  connected successfully"))
.catch((err) => console.error(err));
app.use("/", authRoute);

app.listen(PORT,()=>{
    console.log(`App started at port ${PORT}`);
})
