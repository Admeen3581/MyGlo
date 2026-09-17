import { clerkClient } from '@/lib/clerk';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, theme } = body;

        //security checks
        if (!userId || !theme) {
            return Response.json(
                { error: 'userId and theme are required' },
                { status: 400 }
            );
        }

        if (theme !== 'dark' && theme !== 'light') {
            return Response.json(
                { error: 'theme must be either "dark" or "light"' },
                { status: 400 }
            );
        }

        const data = await clerkClient.users.updateUser(userId, {
            unsafeMetadata: { theme },
        });

        return Response.json({
            success: true,
            theme: theme,
            unsafe_metadata: data.unsafe_metadata,
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return Response.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');

        if (!userId) {
            return Response.json(
                { error: 'userId query parameter is required' },
                { status: 400 }
            );
        }

        const data = await clerkClient.users.getUser(userId);
        const theme = data.unsafe_metadata?.theme || 'light';

        return Response.json({
            success: true,
            theme,
            unsafe_metadata: data.unsafe_metadata,
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return Response.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
