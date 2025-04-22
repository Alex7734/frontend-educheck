'use client';

import { useCourses } from '@/services/Queries/courses/useCourses';
import { useEnrollmentCRUD } from '@/services/Queries/admin/useEnrollmentCRUD';
import useAuthStore from '@/store/useAuthStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components';
import { TEnrollment } from '@/schemas/enrollment';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import useWeb2AuthService from '@/services/Queries/auth/useWeb2AuthService';
import { Account, PingPongRaw } from './widgets';
import { RouteNamesEnum } from '@/localConstants';
import CourseCard from '@/components/Card/Course';
import { Button } from '@/components/ui/button';
import { generateCertificate } from '@/helpers/certificates';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DashboardPage() {
  const user = useAuthStore().getUser();
  const router = useRouter();

  const { isAdminValid } = useWeb2AuthService();

  const { useGetCoursesQuery } = useCourses(user?.id || '');
  const { getUserEnrollmentsQuery } = useEnrollmentCRUD();

  const { data: courses, isLoading: coursesLoading } = useGetCoursesQuery('', true);
  const { data: enrollments, isLoading: enrollmentsLoading } = getUserEnrollmentsQuery(user?.id || '');

  const enrollmentMap = enrollments?.reduce((acc: Record<string, TEnrollment>, enrollment: TEnrollment) => {
    if (enrollment.course?.id) {
      acc[enrollment.course.id] = enrollment;
    }
    return acc;
  }, {} as Record<string, TEnrollment>) || {};

  const enrolledCourses = courses?.filter(course => {
    const enrollment = enrollmentMap[course.id];
    return enrollment && !enrollment.completed;
  }) || [];

  const completedCourses = courses?.filter(course => {
    const enrollment = enrollmentMap[course.id];
    return enrollment?.completed;
  }) || [];

  if (coursesLoading || enrollmentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Connected account details</CardDescription>
        </CardHeader>
        <CardContent>
          <Account />
        </CardContent>
      </Card>

      {!isAdminValid && (<Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>My Courses</CardTitle>
          <CardDescription>Manage your enrolled and completed courses</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="completed" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="completed">Completed Courses</TabsTrigger>
              <TabsTrigger value="enrolled">Enrolled Courses</TabsTrigger>
            </TabsList>

            <TabsContent value="completed" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {completedCourses.slice(0, 6).map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    enrollment={enrollmentMap[course.id]}
                    onGenerateCertificate={() => {
                      const enrollment = enrollmentMap[course.id];
                      if (enrollment) {
                        generateCertificate(course, enrollment);
                        toast.success('Certificate generated successfully!');
                      }
                    }}
                  />
                ))}
              </div>
              {completedCourses.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">You haven&apos;t completed any courses yet.</p>
                </div>
              )}
              {completedCourses.length > 6 && (
                <div className="flex justify-start">
                  <Button
                    variant="link"
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => router.push('/courses')}
                  >
                    View all completed courses →
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="enrolled" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {enrolledCourses.slice(0, 6).map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    enrollment={enrollmentMap[course.id]}
                    onTakeAssignment={() => router.push(`/courses/${course.id}/assignment`)}
                  />
                ))}
              </div>
              {enrolledCourses.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">You are not enrolled in any active courses.</p>
                </div>
              )}
              {enrolledCourses.length > 6 && (
                <div className="flex justify-start">
                  <Button
                    variant="link"
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => router.push('/courses')}
                  >
                    View all enrolled courses →
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      )}

      {!isAdminValid && (
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Verify CV</CardTitle>
            <CardDescription>Smart Contract used to verify and sign your CV</CardDescription>
          </CardHeader>
          <CardContent>
            <PingPongRaw callbackRoute={RouteNamesEnum.dashboard} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
