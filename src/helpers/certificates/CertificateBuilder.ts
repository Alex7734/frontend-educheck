import { TCourse } from "@/schemas/course";
import { TEnrollment } from "@/schemas/enrollment";
import { BASE_CERTIFICATE_TEMPLATE, SIGNED_CERTIFICATE_TEMPLATE } from './templates';
import toast from "react-hot-toast";

class CertificateBuilder {
    private content: string = '';
    private certificateId?: string;
    private courseTitle?: string;
    private isWithSignature: boolean = false;

    public setContent(content: string): CertificateBuilder {
        this.content = content;
        return this;
    }

    public setCertificateId(id: string): CertificateBuilder {
        this.certificateId = id;
        return this;
    }

    public setCourseTitle(title: string): CertificateBuilder {
        this.courseTitle = title;
        return this;
    }

    public static fromCourseAndEnrollment(course: TCourse, enrollment: TEnrollment): CertificateBuilder {
        const builder = new CertificateBuilder();
        builder.content = BASE_CERTIFICATE_TEMPLATE
            .replace('{email}', enrollment.user?.email || '')
            .replace('{courseTitle}', course.title)
            .replace('{description}', course.description)
            .replace('{completionDate}', new Date(enrollment.enrollmentDate).toLocaleDateString())
            .replace('{certificateId}', enrollment.id);

        builder.certificateId = enrollment.id;
        builder.courseTitle = course.title;
        return builder;
    }

    public static fromFileContent(fileContent: string): CertificateBuilder {
        const builder = new CertificateBuilder();
        builder.content = fileContent
            .replace(/Note: This certificate is pending verification through the certification process\./g, '')
            .replace(/This certificate is digitally signed and verified\./g, '')
            .trim();

        const idMatch = fileContent.match(/Certificate ID: (.*?)$/m);
        if (idMatch) {
            builder.certificateId = idMatch[1];
        }

        const titleMatch = fileContent.match(/has successfully completed the course\n"(.*?)"/);
        if (titleMatch) {
            builder.courseTitle = titleMatch[1];
        }

        return builder;
    }

    public addSignature(signature: string, encodedMessage: string): CertificateBuilder {
        this.content = SIGNED_CERTIFICATE_TEMPLATE
            .replace('{content}', this.content)
            .replace('{encodedMessage}', encodedMessage)
            .replace('{signature}', signature);

        this.isWithSignature = true;

        return this;
    }

    private generateFileName(): string {
        const prefix = this.isWithSignature ? 'SIGNED - ' : '';
        const title = this.courseTitle || 'certificate';
        return `${prefix}${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`;
    }

    private generateAnchor(url: string): HTMLAnchorElement {
        const a = document.createElement('a');
        a.href = url;
        a.download = this.generateFileName();
        return a;
    }

    private generateBlob(): Blob {
        return new Blob([this.content], { type: 'text/plain' });
    }

    private generateUrl(blob: Blob): string {
        return window.URL.createObjectURL(blob);
    }

    public generate(): void {
        try {
            const blob = this.generateBlob();
            const url = this.generateUrl(blob);
            const a = this.generateAnchor(url);

            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            toast.error('Error generating certificate');
            console.error('Error generating certificate:', error);
        }
    }
}

export default CertificateBuilder;