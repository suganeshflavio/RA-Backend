export type OptionChoice = "A" | "B" | "C" | "D";

export type AttemptStatus = "IN_PROGRESS" | "COMPLETED";

export interface CreateTestQuestionItemDto {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: OptionChoice;
  explanation?: string;
}

export interface CreateTestDto {
  testName: string;
  marksPerQuestion: number;
  questions: CreateTestQuestionItemDto[];
}

export interface UpdateTestDto {
  testName?: string;
  marksPerQuestion?: number;
}

export interface AddQuestionDto extends CreateTestQuestionItemDto {}

export interface UpdateQuestionDto {
  question?: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctOption?: OptionChoice;
  explanation?: string;
}

export interface GetTestsQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  topicId?: string;
}

export interface SubmitAttemptAnswerDto {
  questionId: string;
  selected: OptionChoice;
}

export interface SubmitAttemptDto {
  videoId?: string;
  startedAt: Date;
  submittedAt?: Date;
  status?: AttemptStatus;
  answers: SubmitAttemptAnswerDto[];
}

export interface GetAttemptsQueryDto {
  page?: number;
  limit?: number;
  testId?: string;
  videoId?: string;
  studentId?: string;
  status?: AttemptStatus;
}

export type AttemptDetails = {
  id: string;
  studentId: string;
  videoId: string | null;
  testId: string;
  status: AttemptStatus;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  marksPerQuestion: number;
  totalMarks: number;
  obtainedMarks: number;
  startedAt: Date;
  submittedAt: Date | null;
  createdAt: Date;
  student: {
    id: string;
    name: string;
    email: string;
    mobile: string | null;
    class: string | null;
  };
  video: {
    id: string;
    videoName: string;
  } | null;
  test: {
    id: string;
    testName: string;
  };
  answers: {
    questionId: string;
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctOption: OptionChoice;
    selected: OptionChoice;
    correct: boolean;
    explanation: string | null;
  }[];
};
