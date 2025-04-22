'use client';

import { useState, useEffect } from 'react';
import { useCourses } from '@/services/Queries/courses/useCourses';
import { useEnrollmentCRUD } from '@/services/Queries/admin/useEnrollmentCRUD';
import useAuthStore from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { AuthRedirectWrapper } from '@/wrappers';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from 'lucide-react';
import { TEnrollment } from '@/schemas/enrollment';
import { useQuery } from '@tanstack/react-query';
import API from '@/services/API';
import { TCourse } from '@/schemas/course';

const CourseCard: React.FC<{
  course: TCourse;
  isEnrolled: boolean;
  isProcessing: boolean;
  onEnroll: (id: string) => void;
  onUnenroll: (id: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  router: any;
  enrollment?: TEnrollment;
}> = ({ course, isEnrolled, isProcessing, onEnroll, onUnenroll, router, enrollment }) => {

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

  const handleCertificateClick = () => {
    router.push(`/certificates`);
  };

  return (
    <Card className="flex flex-col bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
        <CardDescription className="text-gray-600">{course.description}</CardDescription>
        <div className="flex gap-2 mt-4">
          <Badge variant={course.isActive ? "success" : "secondary"}>
            {course.isActive ? "Active" : "Inactive"}
          </Badge>
          <Badge variant="outline">
            {course.numberOfStudents || 0} students
          </Badge>
          {isEnrolled && !enrollment?.completed && (
            <Badge variant="default" className="bg-green-100 text-green-800">
              Enrolled
            </Badge>
          )}
          {enrollment?.completed && (
            <Badge variant="default" className="bg-blue-100 text-blue-800">
              Completed
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {hasAssignment ? (
          enrollment?.completed ? (
            <p className="text-sm text-green-600">
              Congratulations! You&apos;ve successfully completed this course.
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              Complete the course assignment to earn your certificate.
            </p>
          )
        ) : (
          <p className="text-sm text-gray-500">
            No assignment available for this course. Check back later.
          </p>
        )}
      </CardContent>
      <CardFooter className="pt-4 flex flex-col gap-2">
        {isEnrolled && hasAssignment && !enrollment?.completed && (
          <Button
            className="w-full bg-orange-600 hover:bg-orange-700 text-white transition-colors duration-200"
            onClick={() => router.push(`/courses/${course.id}/assignment`)}
          >
            Take Assignment
          </Button>
        )}
        {enrollment?.completed && (
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200"
            onClick={handleCertificateClick}
          >
            Get Certificate
          </Button>
        )}
        {!enrollment?.completed && (
          <Button
            className={`w-full transition-colors duration-200 ${isEnrolled
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            onClick={() => isEnrolled ? onUnenroll(course.id) : onEnroll(course.id)}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader className="mr-2 h-4 w-4" />
                {isEnrolled ? 'Unenrolling...' : 'Enrolling...'}
              </>
            ) : (
              isEnrolled ? 'Unenroll' : 'Enroll Now'
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default function CoursesPage() {
  const user = useAuthStore().getUser();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showActive, setShowActive] = useState(true);
  const [showEnrolled, setShowEnrolled] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [processingCourseId, setProcessingCourseId] = useState<string | null>(null);

  const { useGetCoursesQuery } = useCourses(user?.id || '');
  const { getUserEnrollmentsQuery, enrollMutation, unenrollMutation } = useEnrollmentCRUD();

  const { data: courses, isLoading: coursesLoading } = useGetCoursesQuery(debouncedSearch, showActive);
  const { data: enrollments, isLoading: enrollmentsLoading } = getUserEnrollmentsQuery(user?.id || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleEnroll = async (courseId: string) => {
    try {
      setProcessingCourseId(courseId);
      await enrollMutation.mutateAsync({ courseId, userId: user?.id || '' });
    } catch (error) {
      console.error('Error enrolling in course:', error);
    } finally {
      setProcessingCourseId(null);
    }
  };

  const handleUnenroll = async (courseId: string) => {
    try {
      setProcessingCourseId(courseId);
      await unenrollMutation.mutateAsync({ courseId, userId: user?.id || '' });
    } catch (error) {
      console.error('Error unenrolling from course:', error);
    } finally {
      setProcessingCourseId(null);
    }
  };

  const enrolledCourseIds = enrollments?.map((enrollment: TEnrollment) => enrollment.course?.id).filter(Boolean) || [];
  const enrollmentMap = enrollments?.reduce((acc: Record<string, TEnrollment>, enrollment: TEnrollment) => {
    if (enrollment.course?.id) {
      acc[enrollment.course.id] = enrollment;
    }
    return acc;
  }, {} as Record<string, TEnrollment>) || {};

  const filteredCourses = courses?.filter(course => {
    if (showEnrolled && !enrolledCourseIds.includes(course.id)) {
      return false;
    }
    if (showCompleted && !enrollmentMap[course.id]?.completed) {
      return false;
    }
    return true;
  });

  if (coursesLoading || enrollmentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8" />
      </div>
    );
  }

  return (
    <AuthRedirectWrapper>
      <div className="container mx-auto px-6 py-12">
        <div className="mb-6">
          <Card className="bg-white shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="flex-1 max-w-md relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="w-full pl-10"
                  />
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-md">
                    <Checkbox
                      id="active-courses"
                      checked={showActive}
                      onCheckedChange={(checked) => setShowActive(checked as boolean)}
                      className="border-gray-400"
                    />
                    <label
                      htmlFor="active-courses"
                      className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                    >
                      Active Courses
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-md">
                    <Checkbox
                      id="enrolled-courses"
                      checked={showEnrolled}
                      onCheckedChange={(checked) => setShowEnrolled(checked as boolean)}
                      className="border-gray-400"
                    />
                    <label
                      htmlFor="enrolled-courses"
                      className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                    >
                      Enrolled Courses
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-md">
                    <Checkbox
                      id="completed-courses"
                      checked={showCompleted}
                      onCheckedChange={(checked) => setShowCompleted(checked as boolean)}
                      className="border-gray-400"
                    />
                    <label
                      htmlFor="completed-courses"
                      className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                    >
                      Completed Courses
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses?.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isEnrolled={enrolledCourseIds.includes(course.id)}
              isProcessing={processingCourseId === course.id}
              onEnroll={handleEnroll}
              onUnenroll={handleUnenroll}
              router={router}
              enrollment={enrollmentMap[course.id]}
            />
          ))}
        </div>

        {filteredCourses?.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No courses found matching your search and filter.</p>
          </div>
        )}
      </div>
    </AuthRedirectWrapper>
  );
}
