'use client';

import React from 'react';
import { useEnrollmentCRUD } from '@/services/Queries/admin/useEnrollmentCRUD';
import { Loader } from '@/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';

interface EnrollmentListProps {
    courseId?: string;
    userId?: string;
    showUserInfo?: boolean;
    showCourseInfo?: boolean;
}

export const EnrollmentList: React.FC<EnrollmentListProps> = ({
    courseId,
    userId,
    showUserInfo = false,
    showCourseInfo = false
}) => {
    const { getUserEnrollmentsQuery, getCourseEnrollmentsQuery, unenrollMutation } = useEnrollmentCRUD();

    const query = courseId
        ? getCourseEnrollmentsQuery(courseId)
        : userId
            ? getUserEnrollmentsQuery(userId)
            : null;

    if (!query) {
        return <div>Please provide either courseId or userId</div>;
    }

    if (query.isLoading) {
        return <Loader />;
    }

    if (query.error) {
        return (
            <div className="text-red-500">
                Error loading enrollments: {query.error.message}
            </div>
        );
    }

    if (!query.data?.length) {
        return <div className="text-gray-500">No enrollments found.</div>;
    }

    const handleUnenroll = async (courseId: string, userId: string) => {
        try {
            await unenrollMutation.mutateAsync({ courseId, userId });
        } catch (error) {
            console.error('Unenroll error:', error);
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {showCourseInfo && (
                            <>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Course
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                            </>
                        )}
                        {showUserInfo && (
                            <>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                            </>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Enrollment Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {query.data.map((enrollment) => (
                        <tr key={`${enrollment.courseId}-${enrollment.userId}`}>
                            {showCourseInfo && enrollment.course && (
                                <>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {enrollment.course.title}
                                    </td>
                                    <td className="px-6 py-4">
                                        {enrollment.course.description}
                                    </td>
                                </>
                            )}
                            {showUserInfo && enrollment.user && (
                                <>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {enrollment.user.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {enrollment.user.email}
                                    </td>
                                </>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap">
                                {format(new Date(enrollment.enrollmentDate), 'PPP')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                    onClick={() => handleUnenroll(enrollment.courseId, enrollment.userId)}
                                    className="text-red-600 hover:text-red-900"
                                    disabled={unenrollMutation.isPending}
                                >
                                    <FontAwesomeIcon icon={faUserMinus} className="mr-2" />
                                    Unenroll
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}; 