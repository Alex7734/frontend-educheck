import React, { useState, useEffect } from 'react';
import { useCourseCRUD } from '@/services/Queries/admin/useCourseCRUD';
import { Loader } from '@/components';
import { EnrollmentManager } from '@/components/EnrollmentManager/EnrollmentManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { useModal } from '@/wrappers/ModalProvider';
import { Assignment, getCourseAssignment } from '@/services/API/methods/courses';
import AssignmentForm from './AssignmentForm';


interface CourseDetailsProps {
    courseId: string;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ courseId }) => {
    const { data: course, isLoading, error } = useCourseCRUD().useCourseById(courseId);
    const { showModal } = useModal();
    const [hasAssignment, setHasAssignment] = useState<boolean>(false);
    const [checkingAssignment, setCheckingAssignment] = useState<boolean>(true);
    const [assignmentData, setAssignmentData] = useState<Assignment | null>(null);

    useEffect(() => {
        const checkAssignment = async () => {
            if (!courseId) return;

            try {
                const assignmentResponse = await getCourseAssignment(courseId);
                setHasAssignment(true);
                setAssignmentData(assignmentResponse);

                try {
                    const detailedAssignment = await getCourseAssignment(courseId);
                    setAssignmentData(detailedAssignment);
                } catch (innerError) {
                    console.log("Could not fetch assignment with answers, using basic version");
                }
            } catch (error) {
                console.log("No assignment found for this course");
                setHasAssignment(false);
                setAssignmentData(null);
            } finally {
                setCheckingAssignment(false);
            }
        };

        checkAssignment();
    }, [courseId]);

    if (isLoading || checkingAssignment) return <Loader />;
    if (error || !course) return <div>Error loading course details.</div>;

    const handleManageEnrollments = () => {
        showModal(
            <EnrollmentManager courseId={courseId} mode="course" />,
            'Manage Course Enrollments'
        );
    };

    const refreshAssignmentData = async () => {
        try {
            const assignmentResponse = await getCourseAssignment(courseId);
            setHasAssignment(true);
            setAssignmentData(assignmentResponse);

            try {
                const detailedAssignment = await getCourseAssignment(courseId);
                setAssignmentData(detailedAssignment);
            } catch (innerError) {
                console.log("Could not fetch assignment with answers, using basic version");
            }
        } catch (error) {
            console.log("No assignment found for this course");
            setHasAssignment(false);
            setAssignmentData(null);
        }
    };

    const handleManageAssignment = () => {
        showModal(
            <AssignmentForm
                courseId={courseId}
                existingAssignment={assignmentData ? {
                    ...assignmentData,
                    courseId: courseId,
                    questions: assignmentData.questions.map(q => ({
                        ...q,
                        answer: q.answer || ''
                    }))
                } : null}
                onSuccess={refreshAssignmentData}
            />,
            hasAssignment ? 'Edit Assignment' : 'Create Assignment'
        );
    };

    return (
        <div className='p-4 max-w-[500px]'>
            <div className='space-y-4'>
                <p>
                    <strong>ID:</strong> {course.id}
                </p>
                <p>
                    <strong>Title:</strong> {course.title}
                </p>
                <p>
                    <strong>Description:</strong> {course.description}
                </p>
                <p>
                    <strong>Status:</strong>{' '}
                    <span className={course.isActive ? 'text-green-600' : 'text-red-600'}>
                        {course.isActive ? 'Active' : 'Inactive'}
                    </span>
                </p>
                <p>
                    <strong>Assignment:</strong>{' '}
                    <span className={hasAssignment ? 'text-green-600' : 'text-yellow-600'}>
                        {hasAssignment ? 'Available' : 'Not Available'}
                    </span>
                </p>
            </div>
            <div className='mt-6 space-y-3'>
                <button
                    onClick={handleManageEnrollments}
                    className='bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600 transition-colors w-full'
                >
                    <FontAwesomeIcon icon={faUserGroup} />
                    Manage Course Enrollments
                </button>
                <button
                    onClick={handleManageAssignment}
                    className={`${hasAssignment ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white px-4 py-2 rounded flex items-center gap-2 transition-colors w-full`}
                >
                    <FontAwesomeIcon icon={faFileAlt} />
                    {hasAssignment ? 'Edit Assignment' : 'Create Assignment'}
                </button>
            </div>
        </div>
    );
};

export default CourseDetails; 