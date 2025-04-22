'use client';

import { useState, ChangeEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCourses } from '@/services/Queries/courses/useCourses';
import useAuthStore from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components';
import { AuthRedirectWrapper } from '@/wrappers';
import { Textarea } from '@/components/ui/textarea';

export default function AssignmentPage() {
    const params = useParams();
    const router = useRouter();
    const user = useAuthStore().getUser();
    const courseId = params.courseId as string;

    const { useGetCourseByIdQuery, useGetCourseAssignmentQuery, submitAssignmentMutation } = useCourses(user?.id || '');
    const { data: course, isLoading: courseLoading } = useGetCourseByIdQuery(courseId);
    const { data: assignment, isLoading: assignmentLoading } = useGetCourseAssignmentQuery(courseId);

    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (courseLoading || assignmentLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader className="h-8 w-8" />
            </div>
        );
    }

    if (!course || !assignment) {
        return (
            <div className="container mx-auto px-6 py-12">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-gray-500">Assignment not found</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleAnswerChange = (questionId: string, answer: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
                questionId,
                answer
            }));

            await submitAssignmentMutation.mutateAsync({
                courseId,
                answers: formattedAnswers
            });

            router.push(`/courses`);
        } catch (error) {
            console.error('Error submitting assignment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isComplete = Object.keys(answers).length === assignment.questions.length;

    return (
        <AuthRedirectWrapper>
            <div className="container mx-auto px-6 py-12">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl mb-2">{course.title} - Assignment</CardTitle>
                        <CardDescription>
                            Complete all questions to earn your certificate
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {assignment.questions.map((question, index) => (
                                <div key={question.id} className="space-y-4">
                                    <h3 className="text-lg font-medium">
                                        Question {index + 1}: {question.questionText}
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">Your Answer</div>
                                        <Textarea
                                            id={`answer-${question.id}`}
                                            value={answers[question.id || ''] || ''}
                                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleAnswerChange(question.id || '', e.target.value)}
                                            placeholder="Type your answer here..."
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={handleSubmit}
                            disabled={!isComplete || isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Assignment'
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </AuthRedirectWrapper>
    );
} 