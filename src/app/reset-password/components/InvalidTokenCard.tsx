'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function InvalidTokenCard() {
    const router = useRouter();

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Invalid Reset Link</CardTitle>
                    <CardDescription>
                        The password reset link is invalid or has expired.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => router.push('/unlock')} className="w-full">
                        Return to Unlock
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
} 