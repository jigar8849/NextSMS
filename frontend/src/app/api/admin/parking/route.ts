import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Fetch data from backend API
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const response = await fetch(`${backendUrl}/admin/parking`, {
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

    const parkingData = await response.json();

    return NextResponse.json(parkingData);
  } catch (error) {
    console.error('Error fetching parking data:', error);
    return NextResponse.json({ error: 'Failed to fetch parking data' }, { status: 500 });
  }
}
