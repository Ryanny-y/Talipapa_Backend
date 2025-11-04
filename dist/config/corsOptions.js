"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allowedOrigins = ["http://localhost:5050", "http://localhost:3000"];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not Allowed By Cors!"));
        }
    },
    optionsSuccessStatus: 200,
    credentials: true
};
exports.default = corsOptions;
