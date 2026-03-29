import "dotenv/config";
import express from 'express';
import authMiddleware from './middleware/auth.js';
import authRouter from './routes/auth.routes.js'
import snippetRouter from './routes/snippet.routes.js'
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRouter);
app.use("/api/snippet", authMiddleware, snippetRouter)
app.listen(process.env.PORT, () => {
    console.log("Server started in PORT: "+process.env.PORT);
})
