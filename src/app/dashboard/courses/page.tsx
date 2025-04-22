'use client';

import React from 'react';
import { TCreateCourseData, TCourse } from '@/schemas/course';
import { useModal } from '@/wrappers/ModalProvider';
import { useCourseCRUD } from '@/services/Queries/admin/useCourseCRUD';
import { Loader } from '@/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faTrashAlt, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import CourseDetails from './modals/CourseDetails';
import CourseForm from './modals/CourseForm';
import { truncate } from '@/helpers/string';
import { useQuery } from '@tanstack/react-query';
import API from '@/services/API';

const CourseRow: React.FC<{
    course: TCourse;
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}> = ({ course, onView, onEdit, onDelete }) => {
    const { data: hasAssignment } = useQuery({
        queryKey: ['assignment-status', course.id],
        queryFn: async () => {
            try {
                await API.get(`/assignments/course/${course.id}`);
                return true;
            } catch (error) {
                return false;
            }
        },
        enabled: !!course.id,
    });

    return (
        <tr className='hover:bg-green-100'>
            <td
                className='border border-black px-4 py-2 gap-2 cursor-pointer'
                onClick={() => onView(course.id)}
            >
                <div className='flex items-center gap-2 group'>
                    <FontAwesomeIcon
                        icon={faEye}
                        size='sm'
                        className='group-hover:text-green-500'
                    />
                    {truncate(course.title)}
                </div>
            </td>
            <td className='border border-black px-4 py-2'>
                {truncate(course.description, 50)}
            </td>
            <td className='border border-black px-4 py-2'>
                <span className={`px-2 py-1 rounded ${course.isActive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                    {course.isActive ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td className='border border-black px-4 py-2 text-center'>
                {hasAssignment ? (
                    <FontAwesomeIcon icon={faCheck} className="text-green-600" size="lg" />
                ) : (
                    <FontAwesomeIcon icon={faTimes} className="text-red-600" size="lg" />
                )}
            </td>
            <td className='border border-black px-4 py-2'>
                <div className='flex items-center justify-around'>
                    <button
                        onClick={() => onEdit(course.id)}
                        className='hover:text-yellow-500'
                        title='Edit'
                    >
                        <FontAwesomeIcon icon={faEdit} size='lg' />
                    </button>
                    <button
                        onClick={() => onDelete(course.id)}
                        className='hover:text-red-500'
                        title='Delete'
                    >
                        <FontAwesomeIcon icon={faTrashAlt} size='lg' />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default function CoursesDashboard() {
    const {
        createCourseMutation,
        getCoursesQuery,
        useCourseById,
        updateCourseMutation,
        deleteCourseMutation
    } = useCourseCRUD();
    const { showModal, hideModal } = useModal();

    if (getCoursesQuery.isLoading) {
        return (
            <div className='flex justify-center items-center h-[100vh]'>
                <Loader />
            </div>
        );
    }

    if (getCoursesQuery.error) {
        return (
            <div className='flex flex-col justify-center items-center h-[100vh]'>
                <p className='text-red-500'>Error loading courses. Please try again.</p>
                <a
                    className='text-blue-500 underline cursor-pointer'
                    onClick={() => getCoursesQuery.refetch()}
                >
                    Refresh
                </a>
            </div>
        );
    }

    const openCreateCourseModal = () => {
        setTimeout(
            () =>
                showModal(
                    <CourseForm
                        title='Create Course'
                        onSubmitMutation={async (data) => {
                            await createCourseMutation.mutateAsync(data as TCreateCourseData);
                            hideModal();
                        }}
                    />,
                    ''
                ),
            300
        );
    };

    const openViewCourseModal = (courseId: string) => {
        showModal(<CourseDetails courseId={courseId} />, 'Course Details');
    };

    const openEditCourseModal = (courseId: string) => {
        const EditCourseForm = () => {
            const { data: course, isLoading, error } = useCourseById(courseId);
            if (isLoading) return <Loader />;
            if (error || !course) return <div>Error loading course details.</div>;

            return (
                <CourseForm
                    initialValues={course}
                    title='Update Course'
                    onSubmitMutation={async (data) => {
                        await updateCourseMutation.mutateAsync({ id: courseId, data });
                        hideModal();
                    }}
                />
            );
        };
        showModal(<EditCourseForm />, '');
    };

    return (
        <div className='p-4'>
            <button
                onClick={openCreateCourseModal}
                className='bg-blue-500 text-white px-4 py-2 rounded mb-4 flex items-center gap-2'
            >
                <FontAwesomeIcon icon={faEdit} className='text-white' />
                <span>Create Course</span>
            </button>
            {getCoursesQuery.data && getCoursesQuery.data?.length > 0 ? (
                <table className='min-w-full border-collapse border border-black bg-green-50'>
                    <thead>
                        <tr>
                            <th className='border border-black px-4 py-2'>Title</th>
                            <th className='border border-black px-4 py-2'>Description</th>
                            <th className='border border-black px-4 py-2'>Status</th>
                            <th className='border border-black px-4 py-2'>Assignment</th>
                            <th className='border border-black px-4 py-2'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getCoursesQuery.data.map((course) => (
                            <CourseRow
                                key={course.id}
                                course={course}
                                onView={openViewCourseModal}
                                onEdit={openEditCourseModal}
                                onDelete={async (id) => {
                                    await deleteCourseMutation.mutateAsync(id);
                                }}
                            />
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className='flex flex-col justify-center items-center h-[50vh] text-gray-500'>
                    <p>No courses found.</p>
                    <p>Click &quot;Create Course&quot; to add a new course.</p>
                </div>
            )}
        </div>
    );
} 