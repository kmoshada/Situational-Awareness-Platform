import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const res = await fetch('http://localhost:8000/market', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch market data');
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching market data:', error);
        return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
    }
}
