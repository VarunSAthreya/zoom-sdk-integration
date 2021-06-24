require("dotenv").config();

import express, { Application } from "express";
const helmet = require("helmet");
const morgan = require("morgan");
var cors = require("cors");

const zoomRoute = require("./routes/zoom");

const app: Application = express();
const port: number = parseInt(process.env.PORT!) || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(helmet());
app.use(morgan("tiny"));

app.use("/", zoomRoute);

app.listen(port, () => {
    return console.log(`server is listening on ${port}`);
});
