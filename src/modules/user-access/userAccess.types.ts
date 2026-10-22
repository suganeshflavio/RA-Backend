export interface AssignUserAccessDto {
  userId: string;

  courses: {
    courseId: string;
    videoIds?: string[];
    notesIds?: string[];
    testIds?: string[];
  }[];
}
