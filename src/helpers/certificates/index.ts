import { TCourse } from "@/schemas/course";
import CertificateBuilder from "./CertificateBuilder";
import { TEnrollment } from "@/schemas/enrollment";

export const generateCertificate = (course: TCourse, enrollment: TEnrollment): void => {
    console.log('Generating certificate for course:', course.title);
    CertificateBuilder.fromCourseAndEnrollment(course, enrollment).generate();
};

export const generateSignedCertificate = (fileContent: string, signature?: string, encodedMessage?: string): void => {
    if (!signature || !encodedMessage) {
        return;
    }

    CertificateBuilder.fromFileContent(fileContent)
        .addSignature(signature, encodedMessage)
        .generate();
}; 