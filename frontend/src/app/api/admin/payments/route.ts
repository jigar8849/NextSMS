import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Fetch data from backend API
    const backendUrl = process.env.BACKEND_URL || 'https://next-sms-ten.vercel.app';
    const response = await fetch(`${backendUrl}/admin/payments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
      credentials: 'include', // Include cookies for session authentication
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const paymentsData = await response.json();

    return NextResponse.json(paymentsData);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, type, amount, penalty, dueDate } = body;

    // Validate required fields
    if (!title || !type || !amount || !dueDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Call backend API to create bill
    const backendUrl = process.env.BACKEND_URL || 'https://next-sms-ten.vercel.app';
    const response = await fetch(`${backendUrl}/admin/createBill`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for session authentication
      body: JSON.stringify({
        title,
        type,
        amount: parseFloat(amount),
        penalty: parseFloat(penalty) || 0,
        dueDate
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Backend API error: ${response.status} - ${errorData}`);
    }

    const result = await response.json();
    return NextResponse.json({ message: 'Bill created successfully', data: result });
  } catch (error) {
    console.error('Error creating bill:', error);
    return NextResponse.json({ error: 'Failed to create bill' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop(); // Get the id from the URL

    if (!id) {
      return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
    }

    // Call backend API to mark as paid
    const backendUrl = process.env.BACKEND_URL || 'https://next-sms-ten.vercel.app';
    const response = await fetch(`${backendUrl}/admin/payments/mark/${id}`, {
      method: 'GET', // Backend uses GET for marking paid
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for session authentication
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    return NextResponse.json({ message: 'Payment marked as paid successfully' });
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
  }
}
