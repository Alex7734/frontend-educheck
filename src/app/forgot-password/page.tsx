import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ForgotPasswordForm from './components/ForgotPasswordForm';

export default async function ForgotPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Card className="w-[350px] bg-white">
                <CardHeader>
                    <CardTitle>Forgot Password</CardTitle>
                    <CardDescription>
                        Enter your email address and we&apos;ll send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                <ForgotPasswordForm />
            </Card>
        </div>
    );
} 