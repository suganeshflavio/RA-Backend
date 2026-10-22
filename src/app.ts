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
import notesRoutes from "./modules/notes/notes.routes";
import subjectRoutes from "./modules/subject/subject.routes";
import classRoutes from "./modules/class/class.routes";
import chapterRoutes from "./modules/chapter/chapter.routes";
import topicRoutes from "./modules/topic/topic.routes";
import uploadRoutes from "./modules/upload/upload.routes";
import enquiryRoutes from "./modules/enquiry/enquiry.routes";

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

app.use("/api/notes", notesRoutes);

app.use("/api/subjects", subjectRoutes);

app.use("/api/classes", classRoutes);

app.use("/api/chapters", chapterRoutes);

app.use("/api/topics", topicRoutes);

app.use("/api/uploads", uploadRoutes);

app.use("/api/enquiries", enquiryRoutes);

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
