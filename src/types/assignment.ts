export interface AssignmentQuestion {
    id?: string;
    questionText: string;
    answer?: string;
}

export interface Assignment {
    id: string;
    questions: AssignmentQuestion[];
}

export interface SubmitAssignmentAnswers {
    questionId: string;
    answer: string;
}

export interface SubmitAssignmentResult {
    success: boolean;
    message: string;
} 