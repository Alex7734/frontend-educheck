'use client';

import React from 'react';
import { useEnrollmentCRUD } from '@/services/Queries/admin/useEnrollmentCRUD';
import { useCourseCRUD } from '@/services/Queries/admin/useCourseCRUD';
import { useUserCRUD } from '@/services/Queries/admin/useUserCRUD';
import { Loader } from '@/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { TCourse } from '@/schemas/course';
import { TUser } from '@/schemas/user';

interface EnrollmentManagerProps {
    courseId?: string;
    userId?: string;
    mode: 'course' | 'user';
}

export const EnrollmentManager: React.FC<EnrollmentManagerProps> = ({ courseId, userId, mode }) => {
    const { getUserEnrollmentsQuery, getCourseEnrollmentsQuery, enrollMutation, unenrollMutation } = useEnrollmentCRUD();
    const { getCoursesQuery } = useCourseCRUD();
    const { getUsersQuery } = useUserCRUD();

    const enrollmentsQuery = mode === 'course'
        ? getCourseEnrollmentsQuery(courseId!)
        : getUserEnrollmentsQuery(userId!);

    const allItemsQuery = mode === 'course' ? getUsersQuery : getCoursesQuery;

    if (enrollmentsQuery.isLoading || allItemsQuery.isLoading) {
        return <Loader />;
    }
    const enrolledItems = (mode === 'course' ? enrollmentsQuery.data?.map(e => e.user) : enrollmentsQuery.data?.map(e => e.course)) || [];
    const allItems = allItemsQuery.data || [];

    const enrolledIds = mode === 'course'
        ? enrolledItems?.map(e => e?.id)
        : enrolledItems?.map(e => e?.id) || [];

    const availableItems = allItems.filter(item => !enrolledIds?.includes(item.id))

    const handleEnroll = async (itemId: string) => {
        try {
            await enrollMutation.mutateAsync({
                courseId: mode === 'user' ? itemId : courseId!,
                userId: mode === 'course' ? itemId : userId!
            });
        } catch (error) {
            console.error('Enroll error:', error);
        }
    };

    const handleUnenroll = async (itemId: string) => {
        try {
            await unenrollMutation.mutateAsync({
                courseId: mode === 'user' ? itemId : courseId!,
                userId: mode === 'course' ? itemId : userId!
            });
        } catch (error) {
            console.error('Unenroll error:', error);
        }
    };

    return (
        <div className="flex gap-4 min-h-[400px] min-w-[700px] p-4">
            <div className="flex-1 border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">
                    {mode === 'course' ? 'Enrolled Users' : 'Enrolled Courses'}
                </h3>
                <div className="space-y-2">
                    {enrolledItems.length > 0 ? (
                        enrolledItems.map((item) => (
                            item && (
                                <div
                                    key={mode === 'course' ? (item as TUser).id : (item as TCourse).id}
                                    className="flex justify-between items-center p-3 bg-green-50 rounded"
                                >
                                    <span>
                                        {mode === 'course'
                                            ? (item as TUser).email
                                            : (item as TCourse).title}
                                    </span>
                                    <button
                                        onClick={() => handleUnenroll(item.id)}
                                        className="text-red-600 hover:text-red-800"
                                        disabled={unenrollMutation.isPending}
                                    >
                                        <FontAwesomeIcon icon={faUserMinus} />
                                    </button>
                                </div>
                            )
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No enrollments yet</p>
                    )}
                </div>
            </div>

            <div className="flex-1 border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">
                    {mode === 'course' ? 'Available Users' : 'Available Courses'}
                </h3>
                <div className="space-y-2">
                    {availableItems.length > 0 ? (
                        availableItems.map((item) => (
                            item && (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center p-3 bg-gray-50 rounded"
                                >
                                    <span>
                                        {mode === 'course'
                                            ? (item as TUser).email
                                            : (item as TCourse).title}
                                    </span>
                                    <button
                                        onClick={() => handleEnroll(item.id)}
                                        className="text-green-600 hover:text-green-800"
                                        disabled={enrollMutation.isPending}
                                    >
                                        <FontAwesomeIcon icon={faUserPlus} />
                                    </button>
                                </div>
                            )
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No available {mode === 'course' ? 'users' : 'courses'}</p>
                    )}
                </div>
            </div>
        </div>
    );
}; 