import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("sanidhya Soni");
});

import  snippetRouter  from "./Routes/snippet.routes.js";
// import { commentRouter } from "./Routes/comment.routes";
import userRouter  from "./Routes/user.routes.js";

app.use("/api/user" , userRouter);
app.use("/api/snippet", snippetRouter);

export { app };
