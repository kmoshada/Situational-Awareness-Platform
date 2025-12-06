import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const res = await fetch('http://localhost:8000/opportunities', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch opportunities');
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching opportunities:', error);
        return NextResponse.json({ error: 'Failed to fetch opportunities' }, { status: 500 });
    }
}
