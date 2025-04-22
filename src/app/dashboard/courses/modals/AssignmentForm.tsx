import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faSave, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { useModal } from '@/wrappers/ModalProvider';
import { useAssignmentCRUD } from '@/services/Queries/admin/useAssignmentCRUD';
import { Question, createAssignmentSchema, CreateAssignmentData, Assignment } from '../../../../schemas/assignment.schema';
import { toast } from 'react-hot-toast';

type AssignmentFormProps = {
    courseId: string;
    existingAssignment: Assignment | null;
    onSuccess?: () => void;
};

const AssignmentForm: React.FC<AssignmentFormProps> = ({
    courseId,
    existingAssignment = null,
    onSuccess
}) => {
    const isEditing = !!existingAssignment;
    const { hideModal } = useModal();
    const { useCreateAssignment, useUpdateAssignment, useDeleteAssignment } = useAssignmentCRUD();
    const createAssignment = useCreateAssignment();
    const updateAssignment = useUpdateAssignment();
    const deleteAssignment = useDeleteAssignment();

    const prepareQuestions = (questions: Question[] | undefined): Question[] => {
        if (!questions || questions.length === 0) {
            return [{ questionText: '', answer: '' }];
        }

        return questions.map(q => ({
            id: q.id,
            questionText: q.questionText || '',
            answer: q.answer || ''
        }));
    };

    const initialQuestions = prepareQuestions(existingAssignment?.questions);

    const { register, handleSubmit, formState: { errors } } = useForm<CreateAssignmentData>({
        resolver: zodResolver(createAssignmentSchema),
        defaultValues: {
            questions: initialQuestions
        }
    });

    const [questions, setQuestions] = useState<Question[]>(initialQuestions);

    const addQuestion = () => {
        setQuestions([...questions, { questionText: '', answer: '' }]);
    };

    const removeQuestion = (index: number) => {
        if (questions.length > 1) {
            const updatedQuestions = [...questions];
            updatedQuestions.splice(index, 1);
            setQuestions(updatedQuestions);
        } else {
            toast.error("You must have at least one question");
        }
    };

    const updateQuestion = (index: number, field: keyof Question, value: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    const handleDeleteAssignment = async () => {
        if (!window.confirm("Are you sure you want to delete this assignment? This action cannot be undone.")) {
            return;
        }

        try {
            await deleteAssignment.mutateAsync(courseId);
            if (onSuccess) onSuccess();
            hideModal();
        } catch (error) {
            console.error("Failed to delete assignment:", error);
        }
    };

    const onSubmit = async () => {
        try {
            const payload = {
                courseId,
                questions: questions.filter(q => q.questionText && q.answer)
            };

            if (payload.questions.length === 0) {
                toast.error("You must have at least one complete question");
                return;
            }

            if (isEditing) {
                await updateAssignment.mutateAsync({ courseId, data: payload });
            } else {
                await createAssignment.mutateAsync({ courseId, data: payload });
            }

            if (onSuccess) onSuccess();
            hideModal();
        } catch (error) {
            console.error("Assignment form error:", error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full custom-scrollbar"
            style={{ width: '600px', maxHeight: '80vh', overflowY: 'auto' }}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-medium py-2">Assignment Questions</h3>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={handleDeleteAssignment}
                                disabled={deleteAssignment.isPending}
                                className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
                            >
                                <FontAwesomeIcon icon={faTrash} />
                                {deleteAssignment.isPending ? "Deleting..." : "Delete Assignment"}
                            </button>
                        )}
                    </div>

                    {questions.map((question, index) => (
                        <div key={index} className="p-4 border rounded-md bg-gray-50 space-y-3">
                            <div className="flex justify-between items-center">
                                <h4 className="font-medium">Question {index + 1}</h4>
                                <button
                                    type="button"
                                    onClick={() => removeQuestion(index)}
                                    className="text-red-500 hover:text-red-700 flex items-center gap-1"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                    Remove
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Question Text
                                </label>
                                <textarea
                                    {...register(`questions.${index}.questionText` as const)}
                                    value={question.questionText}
                                    onChange={(e) => updateQuestion(index, 'questionText', e.target.value)}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    rows={3}
                                />
                                {errors.questions?.[index]?.questionText && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.questions[index]?.questionText?.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Answer
                                </label>
                                <input
                                    type="text"
                                    {...register(`questions.${index}.answer` as const)}
                                    value={question.answer}
                                    onChange={(e) => updateQuestion(index, 'answer', e.target.value)}
                                    className="mt-1 p-2 w-full border rounded-md"
                                />
                                {errors.questions?.[index]?.answer && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.questions[index]?.answer?.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addQuestion}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center gap-2"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        Add Question
                    </button>
                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        disabled={createAssignment.isPending || updateAssignment.isPending}
                        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white flex items-center justify-center gap-2 ${createAssignment.isPending || updateAssignment.isPending
                            ? 'bg-gray-400'
                            : isEditing
                                ? 'bg-yellow-500 hover:bg-yellow-600'
                                : 'bg-green-500 hover:bg-green-600'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${isEditing ? 'yellow' : 'green'}-500`}
                    >
                        <FontAwesomeIcon icon={isEditing ? faPencilAlt : faSave} />
                        {createAssignment.isPending || updateAssignment.isPending
                            ? 'Saving...'
                            : isEditing
                                ? 'Update Assignment'
                                : 'Create Assignment'
                        }
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default AssignmentForm;