// import prisma from "../../config/prisma";

// export const assignUserAccessService = async (
//     userId: string,
//     accesses: {
//         courseId: string;
//         subject: string;
//         chapter: string;
//     }[]
// ) => {

//     // Remove previous access

//     await prisma.userAccess.deleteMany({
//         where: {
//             userId
//         }
//     });

//     // Insert new access

//     await prisma.userAccess.createMany({
//         data: accesses.map((access) => ({
//             userId,
//             courseId: access.courseId,
//             subject: access.subject,
//             chapter: access.chapter
//         })),
//         skipDuplicates: true
//     });

//     return true;
// };



// import prisma from "../../config/prisma";

// export const assignUserAccessService = async (
//   userId: string,
//   courseId: string,
//   subject: string,
//   chapters: string[]
// ) => {
//   // 1. Check User

//   const user = await prisma.user.findUnique({
//     where: {
//       id: userId,
//     },
//   });

//   if (!user) {
//     throw new Error("User not found");
//   }

//   // 2. Check Course

//   const course = await prisma.course.findUnique({
//     where: {
//       id: courseId,
//     },
//   });

//   if (!course) {
//     throw new Error("Course not found");
//   }

//   // 3. Check Subject

//   if (!course.subjects.includes(subject)) {
//     throw new Error("Invalid subject selected");
//   }

//   // 4. Validate Chapters

//   for (const chapter of chapters) {
//     const exists = await prisma.video.count({
//       where: {
//         courseId,
//         subject,
//         chapter,
//       },
//     });

//     if (exists === 0) {
//       throw new Error(`${chapter} does not exist`);
//     }
//   }

//   // 5. Remove previous access for this course + subject

//   await prisma.userAccess.deleteMany({
//     where: {
//       userId,
//       courseId,
//       subject,
//     },
//   });

//   // 6. Create new access

//   await prisma.userAccess.createMany({
//     data: chapters.map((chapter) => ({
//       userId,
//       courseId,
//       subject,
//       chapter,
//     })),
//     skipDuplicates: true,
//   });

//   return true;
// };


import prisma from "../../config/prisma";

export const assignUserAccessService = async (
  userId: string,
  courses: {
    courseId: string;
    subjects: {
      subject: string;
      chapters: string[];
    }[];
  }[]
) => {

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Remove all previous access
  await prisma.userAccess.deleteMany({
    where: {
      userId,
    },
  });

  for (const courseItem of courses) {

    const course = await prisma.course.findUnique({
      where: {
        id: courseItem.courseId,
      },
    });

    if (!course) {
      throw new Error(`Course not found: ${courseItem.courseId}`);
    }

    for (const subjectItem of courseItem.subjects) {

      if (!course.subjects.includes(subjectItem.subject)) {
        throw new Error(
          `Subject '${subjectItem.subject}' not found in course '${course.courseName}'`
        );
      }

      for (const chapter of subjectItem.chapters) {

        // const videoExists = await prisma.video.findFirst({
        //   where: {
        //     courseId: courseItem.courseId,
        //     subject: subjectItem.subject,
        //     chapter,
        //     isActive: true
        //   },
        // });

        // if (!videoExists) {
        //   throw new Error(
        //     `Chapter '${chapter}' not found under '${subjectItem.subject}'`
        //   );
        // }
const video = await prisma.video.findFirst({
  where: {
    courseId: courseItem.courseId,
    subject: subjectItem.subject,
    chapter,
    isActive: true
  }
});

if (!video) {
    throw new Error(`${chapter} not found`);
}
        await prisma.userAccess.create({
          data: {
            userId,
            courseId: courseItem.courseId,
            videoId: video.id,
            subject: subjectItem.subject,
            chapter,
          },
        });
      }
    }
  }

  await prisma.user.update({
  where: {
    id: userId,
  },
  data: {
    isAccess: true,
  },
});

  return true;
};


export const getUserAccessByUserIdService = async (
  userId: string
) => {

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      mobile: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const accesses = await prisma.userAccess.findMany({
    where: {
      userId,
      isActive: true,
    },
    include: {
      course: {
        select: {
          id: true,
          courseName: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const courseMap = new Map();

  for (const access of accesses) {

    if (!courseMap.has(access.courseId)) {

      courseMap.set(access.courseId, {
        courseId: access.course.id,
        courseName: access.course.courseName,
        subjects: [],
      });

    }

    const course = courseMap.get(access.courseId);

    let subject = course.subjects.find(
      (x: any) => x.subject === access.subject
    );

    if (!subject) {

      subject = {
        subject: access.subject,
        chapters: [],
      };

      course.subjects.push(subject);

    }

    subject.chapters.push(access.chapter);
  }

  return {
    user,
    courses: Array.from(courseMap.values()),
  };
};