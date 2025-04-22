import { z } from 'zod';

export const questionSchema = z.object({
    questionText: z.string().min(1, "Question text is required"),
    answer: z.string().min(1, "Answer is required"),
    id: z.string().optional(),
});

export const createAssignmentSchema = z.object({
    questions: z.array(questionSchema).min(1, "At least one question is required"),
});

export type Question = z.infer<typeof questionSchema>;
export type CreateAssignmentData = z.infer<typeof createAssignmentSchema>;

export interface Assignment {
    id: string;
    questions: Question[];
    courseId: string;
} 