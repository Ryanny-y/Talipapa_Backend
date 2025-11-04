"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Core Modulse
const path_1 = __importDefault(require("path"));
// Package Modules
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// Imports
const dbConn_1 = __importDefault(require("./config/dbConn"));
const corsOptions_1 = __importDefault(require("./config/corsOptions"));
// Route Imports
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const newRoute_1 = __importDefault(require("./routes/api/newRoute"));
const pageContentRoute_1 = __importDefault(require("./routes/api/pageContentRoute"));
const achievementRoute_1 = __importDefault(require("./routes/api/achievementRoute"));
const productRoute_1 = __importDefault(require("./routes/api/productRoute"));
const materialRoute_1 = __importDefault(require("./routes/api/materialRoute"));
const app = (0, express_1.default)();
const port = 5050;
// load database
(0, dbConn_1.default)();
// Middle wares
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use((0, cors_1.default)(corsOptions_1.default));
// Auth endpoint
app.use("/api/v1/auth", authRoute_1.default);
// Endpoints
// app.use('/users', require('./routes/api/userRoute'));
app.use("/api/v1/news", newRoute_1.default);
app.use("/api/v1/pagecontent", pageContentRoute_1.default);
app.use("/api/v1/achievements", achievementRoute_1.default);
app.use("/api/v1/products", productRoute_1.default);
app.use("/api/v1/materials", materialRoute_1.default);
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
app.use((request, response) => {
    response.status(404).json({
        status: `Error`,
        message: `Cannot find ${request.originalUrl} on this server!`
    });
});
mongoose_1.default.connection.once("open", () => {
    console.log("Connected to DB!");
    app.listen(port, () => {
        console.log(`Server is running in port ${port}`);
    });
});
