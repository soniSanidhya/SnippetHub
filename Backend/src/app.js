import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// Configure CORS options
const corsOptions = {
  origin: 'https://snippethub-one.vercel.app', // Frontend URL
  // origin : '*',
  credentials: true,              // Allow credentials (cookies, headers)
};

app.use(cors(corsOptions)); // Apply CORS middleware
app.use(express.json({ limit: "100mb" })); // Parse JSON payloads
app.use(express.urlencoded({ extended: true, limit: "100mb" })); // Parse URL-encoded payloads
app.use(express.static("public")); // Serve static files
app.use(cookieParser()); // Parse cookies

// Handle preflight requests
app.options('*', cors(corsOptions));

// Define a basic route
app.get("/", (req, res) => {
  res.send("Sanidhya Soni");
});

// Import and use routers
import snippetRouter from "./Routes/snippet.routes.js";
import commentRouter from "./Routes/comment.routes.js";
import userRouter from "./Routes/user.routes.js";
import voteRouter from "./Routes/vote.routes.js";
import collectionRouter from "./Routes/collection.routes.js";
import followRouter from "./Routes/follow.routes.js";
import categoryRouter from "./Routes/category.routes.js";
import dashboardRouter from "./Routes/dashBoard.routes.js";
import searchRouter from "./Routes/search.routes.js";
app.use("/api/user", userRouter);
app.use("/api/snippet", snippetRouter);
app.use("/api/comment", commentRouter);
app.use("/api/vote", voteRouter);
app.use("/api/collection", collectionRouter);
app.use("/api/follow", followRouter);
app.use("/api/category", categoryRouter);
app.use("/api/dashboard" , dashboardRouter); 
app.use("/api/search", searchRouter);
export { app };
