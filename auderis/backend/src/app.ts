import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.js";
import authRouter from "./routes/auth.js";
import clientsRouter from "./routes/clients.js";
import auditsRouter from "./routes/audits.js";
import evidenceRouter from "./routes/evidence.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173"],
  credentials: false
}));

app.use(express.json());

app.use(healthRouter);
app.use(authRouter);
app.use(clientsRouter);
app.use(auditsRouter);
app.use(evidenceRouter);

app.use(errorHandler);

export default app;