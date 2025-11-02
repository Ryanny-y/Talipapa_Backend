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
import newsRoute from './routes/api/newRoute';

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


// Endpoints
// app.use('/users', require('./routes/api/userRoute'));

app.use("/api/v1/news", newsRoute);

// app.use("/pagecontent", require("./routes/api/pageContentRoute"));

// app.use("/achievements", require("./routes/api/achievementsRoute"));

// app.use("/products", require("./routes/api/productsRoute"));

// app.use("/materials", require("./routes/api/materialsRoute"));

// app.use("/records", require("./routes/api/recordRoute"));

// app.use("/guidelines", require("./routes/api/guidelinesRoute"));

// app.use("/officials", require("./routes/api/officialsRoute"));

// app.use("/farms", require("./routes/api/farmRoute"));

// app.use("/logs", require("./routes/api/logsRoute"));

// app.use("/skills", require("./routes/api/skillsRoute"));

// app.use("/staff", require("./routes/api/staffRoute"));

// app.use("/talipapanatin", require("./routes/api/talipapanatinRoute"));

// app.use("/farm-inventory", require("./routes/api/farmInventoryRoute"));

// app.use('/establishment', require('./routes/api/establishmentRoute'));

mongoose.connection.once("open", () => {
  console.log("Connected to DB!");

  app.listen(port, () => {
    console.log(`Server is running in port ${port}`);
  })
});