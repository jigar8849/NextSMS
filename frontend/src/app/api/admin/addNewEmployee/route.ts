import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://nextsms.onrender.com';
    const body = await request.json();
    // Extract cookies from the incoming request
    const cookieHeader = request.headers.get('cookie') || '';

    const response = await fetch(`${backendUrl}/admin/addNewEmployee`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cookie': cookieHeader, // Forward the client's cookies
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
    console.error('Error adding employee:', error);
    return NextResponse.json(
      { error: 'Failed to add employee' },
      { status: 500 }
    );
  }
}
