import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import courseRoutes from "./modules/course/course.routes";
import videoRoutes from "./modules/video/video.routes";
import userAccessRoutes from "./modules/user-access/userAccess.route";
import commentRoutes from "./modules/comment/comment.routes";
import testimonialRoutes from "./modules/testimonial/testimonial.routes";
import testRoutes from "./modules/test/test.routes";
import studentAttemptRoutes from "./modules/student-attempt/studentAttempt.routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/videos", videoRoutes);

app.use("/api/courses", courseRoutes);

app.use("/api/user-access", userAccessRoutes);

app.use("/api/comments", commentRoutes);

app.use("/api/testimonials", testimonialRoutes);

app.use("/api/tests", testRoutes);

app.use("/api/student-attempts", studentAttemptRoutes);

app.use(
  "/api/users",

  userRoutes,
);

app.get("/", (_, res) => {
  res.json({
    message: "Tks Academy Backend Running",
  });
});

app.get("/api/health", (_req, res) => {
    res.json({
        success: true,
        message: "API is healthy",
    });
});

app.use(errorMiddleware);

export default app;
