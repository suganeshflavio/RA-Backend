// import prisma from "../../config/prisma";

// export const replaceUserAccess = async (
//     userId: string,
//     accesses: {
//         courseId: string;
//         subject: string;
//         chapter: string;
//     }[]
// ) => {

//     await prisma.UserAccess.deleteMany({
//         where: {
//             userId
//         }
//     });

//     await prisma.UserAccess.createMany({
//         data: accesses.map(item => ({
//             userId,
//             courseId: item.courseId,
//             subject: item.subject,
//             chapter: item.chapter
//         })),
//         skipDuplicates: true
//     });

// };