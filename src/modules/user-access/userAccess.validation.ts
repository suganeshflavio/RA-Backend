import { z } from "zod";

export const assignUserAccessSchema = z.object({
  userId: z.string().min(1, "User is required"),

  courses: z.array(
    z.object({
      courseId: z.string().min(1, "Course is required"),

      videoIds: z.array(z.string().min(1)).default([]),

      notesIds: z.array(z.string().min(1)).default([]),

      testIds: z.array(z.string().min(1)).default([]),
    }).refine(
      (course) => course.videoIds.length + course.notesIds.length + course.testIds.length > 0,
      { message: "Select at least one video, notes, or test" }
    )
  ).min(1, "At least one course is required"),
});
