import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { billIds } = await request.json();

    // Fetch data from backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const response = await fetch(`${backendUrl}/resident/payment/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
      body: JSON.stringify({ billIds }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const orderData = await response.json();

    return NextResponse.json(orderData);
  } catch (error) {
    console.error('Error creating payment order:', error);
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
