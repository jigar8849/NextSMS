import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const backendUrl = process.env.BACKEND_URL || 'https://nextsms.onrender.com';
    const response = await fetch(`${backendUrl}/resident/api/complaints`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': request.headers.get('cookie') || '',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
    }

    const complaintsData = await response.json();

    return NextResponse.json(complaintsData);
}

export async function POST(request: NextRequest) {
    try {
        const backendUrl = process.env.BACKEND_URL || 'https://nextsms.onrender.com';
        const body = await request.json();

        const response = await fetch(`${backendUrl}/resident/api/complaints`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': request.headers.get('cookie') || '',
            },
            credentials: 'include',
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            return NextResponse.json(errorData, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error creating complaint:', error);
        return NextResponse.json({ error: 'Failed to create complaint' }, { status: 500 });
    }
}
