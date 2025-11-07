import dotenv from 'dotenv';
dotenv.config();

// Core Modulse
import path from 'path';

// Package Modules
import express, { Request, Response, type Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser'

// Imports
import dbConn from './config/dbConn';
import corsOptions from './config/corsOptions';


// Route Imports
import authRoute from './routes/authRoute';
import newsRoute from './routes/api/newRoute';
import pageContentRoute from './routes/api/pageContentRoute';
import achievementRoute from './routes/api/achievementRoute';
import productRoute from './routes/api/productRoute';
import materialRoute from './routes/api/materialRoute';
import recordRoute from './routes/api/recordRoute';
import guidelinesRoute from './routes/api/guidelinesRoute';
import officialRoute from './routes/api/officialRoute';
import farmRoute from './routes/api/farmRoute';
import skillRoute from './routes/api/skillRoute';
import staffRoute from './routes/api/staffRoute';

const app: Application = express();
const port = 5050;

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

// Endpoints
// app.use('/users', require('./routes/api/userRoute'));

app.use("/api/v1/news", newsRoute);

app.use("/api/v1/page-content", pageContentRoute);

app.use("/api/v1/achievements", achievementRoute);

app.use("/api/v1/products", productRoute);

app.use("/api/v1/materials", materialRoute);

app.use("/api/v1/records", recordRoute);

app.use("/api/v1/guidelines", guidelinesRoute);

app.use("/api/v1/officials", officialRoute);

app.use("/api/v1/farms", farmRoute);

app.use("/api/v1/skills", skillRoute);

// app.use("/logs", require("./routes/api/logsRoute"));

app.use("/api/v1/staff", staffRoute);

// app.use("/talipapanatin", require("./routes/api/talipapanatinRoute"));

// app.use("/farm-inventory", require("./routes/api/farmInventoryRoute"));

// app.use('/establishment', require('./routes/api/establishmentRoute'));

app.use((request: Request, response: Response) => {
  response.status(404).json({
    status: `Error`,
    message: `Cannot find ${request.originalUrl} on this server!`
  })
});

mongoose.connection.once("open", () => {
  console.log("Connected to DB!");

  app.listen(port, () => {
    console.log(`Server is running in port ${port}`);
  })
});