// import { z } from "zod";

// export const assignUserAccessSchema = z.object({
//     userId: z.string().min(1, "User ID is required"),

//     accesses: z.array(
//         z.object({
//             courseId: z.string().min(1),
//             subject: z.string().min(1),
//             chapter: z.string().min(1)
//         })
//     ).min(1, "At least one chapter must be assigned")
// });



// import { z } from "zod";

// export const assignUserAccessSchema = z.object({
//   userId: z.string().min(1, "User is required"),

//   courseId: z.string().min(1, "Course is required"),

//   subject: z.string().min(1, "Subject is required"),

//   chapters: z
//     .array(z.string().min(1))
//     .min(1, "Select at least one chapter"),
// });


import { z } from "zod";

export const assignUserAccessSchema = z.object({
  userId: z.string().min(1, "User is required"),

  courses: z.array(
    z.object({
      courseId: z.string().min(1, "Course is required"),

      subjects: z.array(
        z.object({
          subject: z.string().min(1, "Subject is required"),

          chapters: z
            .array(z.string().min(1))
            .min(1, "Select at least one chapter"),
        })
      ).min(1, "At least one subject is required"),
    })
  ).min(1, "At least one course is required"),
});