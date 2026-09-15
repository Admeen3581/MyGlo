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

        //find key
        const secretKey = process.env.CLERK_SECRET_KEY!;
        if (!secretKey) {
            return Response.json(
                { error: 'CLERK_SECRET_KEY environment variable is not defined' },
                { status: 500 }
            );
        }

        //Call Clerk Backend REST API to update user's unsafe_metadata
        const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                unsafe_metadata: {
                    theme: theme,
                },
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return Response.json(
                { error: data.errors || 'Failed to update user theme in Clerk backend' },
                { status: response.status }
            );
        }

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

        //find key
        const secretKey = process.env.CLERK_SECRET_KEY!;
        if (!secretKey) {
            return Response.json(
                { error: 'CLERK_SECRET_KEY environment variable is not defined' },
                { status: 500 }
            );
        }

        const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return Response.json(
                { error: data.errors || 'Failed to fetch user from Clerk backend' },
                { status: response.status }
            );
        }

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
