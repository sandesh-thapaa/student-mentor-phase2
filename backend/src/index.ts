import express, { Request, Response } from "express";
import { globalErrorHandler } from "./middleware/error.middleware";
import mentorRouter from "./routes/mentor.router";
import authRouter from "./routes/auth.router";
import "dotenv/config"; 

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use('/auth', authRouter);
app.use('/mentors', mentorRouter);


app.use(globalErrorHandler);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;

        