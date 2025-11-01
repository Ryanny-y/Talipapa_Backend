// Core Modulse
import path from 'path';

// Package Modules
import express, { type Application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser'

// Imports
import dbConn from './config/dbConn';
import corsOptions from './config/corsOptions';


// Route Imports
import authRoute from './routes/authRoute';

const app: Application = express();
const port = 5050;

dotenv.config();

// load database
dbConn();

// Middle wares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));

// Auth endpoint
app.use("/api/v1/auth", authRoute);

mongoose.connection.once("open", () => {
  console.log("Connected to DB!");

  app.listen(port, () => {
    console.log(`Server is running in port ${port}`);
  })
});