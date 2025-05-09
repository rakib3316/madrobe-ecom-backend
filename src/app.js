import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "../src/app/routes/index.js";
import globalErrorHandler from "../src/app/middlewares/globalErrorHandler.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// Cookie parser
app.use(cookieParser());

// Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Application routes
app.use("/api/v1", routes);

// Global error handler
app.use(globalErrorHandler);

export default app;
