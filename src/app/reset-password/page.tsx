import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ResetPasswordForm from './components/ResetPasswordForm';
import InvalidTokenCard from './components/InvalidTokenCard';

export default function ResetPasswordPage({
    searchParams,
}: {
    searchParams: { token?: string };
}) {
    const token = searchParams.token;

    if (!token) {
        return <InvalidTokenCard />;
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Card className="w-[350px] bg-white">
                <CardHeader>
                    <CardTitle>Reset Password</CardTitle>
                    <CardDescription>
                        Enter your new password below.
                    </CardDescription>
                </CardHeader>
                <ResetPasswordForm token={token} />
            </Card>
        </div>
    );
}

