import { clerkClient } from '@/lib/clerk';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, firstName, lastName } = body;

        if (!userId) {
            return Response.json(
                { error: 'userId is required' },
                { status: 400 }
            );
        }

        const data = await clerkClient.users.updateUser(userId, {
            firstName: firstName ?? '',
            lastName: lastName ?? '',
        });

        return Response.json({
            success: true,
            user: data,
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return Response.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
