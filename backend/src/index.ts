import express from "express";
import { globalErrorHandler } from "./middleware/error.middleware";
import mentorRouter from "./routes/mentor.router";
import authRouter from "./routes/auth.router";
import studentRouter from "./routes/student.router";
import warningRouter from "./routes/warning.router";
import "dotenv/config";
import taskRouter from "./routes/task.router";
import notificationRouter from "./routes/notification.router";
import "dotenv/config"; 
import cors from "cors";

const app = express();
const port = process.env.PORT;

app.use(cors()); 
app.use(express.json());

app.use("/auth", authRouter);
app.use("/mentors", mentorRouter);
app.use("/students", studentRouter);
app.use("/warnings", warningRouter);
app.use('/auth', authRouter);
app.use('/mentors', mentorRouter);
app.use('/tasks', taskRouter);
app.use('/notifications', notificationRouter);


app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;

        