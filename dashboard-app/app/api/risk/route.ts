import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const res = await fetch('http://localhost:8000/risk', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch risk data');
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching risk data:', error);
        return NextResponse.json({ error: 'Failed to fetch risk data' }, { status: 500 });
    }
}
