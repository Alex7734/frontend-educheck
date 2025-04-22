import { TCourse } from "@/schemas/course";
import { TEnrollment } from "@/schemas/enrollment";
import { CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CourseCardProps {
    course: TCourse;
    enrollment?: TEnrollment;
    onTakeAssignment?: () => void;
    onGenerateCertificate?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
    course,
    enrollment,
    onTakeAssignment,
    onGenerateCertificate
}) => {
    return (
        <Card className="flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg mb-1">{course.title}</CardTitle>
                <CardDescription className="text-sm text-gray-600 line-clamp-2">{course.description}</CardDescription>
                <div className="flex gap-1 mt-2">
                    <Badge variant={course.isActive ? "success" : "secondary"} className="text-xs">
                        {course.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {enrollment?.completed && (
                        <Badge variant="default" className="bg-blue-100 text-blue-800 text-xs">
                            Completed
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardFooter className="pt-2">
                {enrollment?.completed ? (
                    <Button
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm transition-colors duration-200"
                        onClick={onGenerateCertificate}
                    >
                        Generate Certificate
                    </Button>
                ) : (
                    <Button
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm transition-colors duration-200"
                        onClick={onTakeAssignment}
                    >
                        Take Assignment
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};

export default CourseCard;