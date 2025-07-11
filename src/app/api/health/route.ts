import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json(
      { 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        service: 'amt-crm-frontend'
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        timestamp: new Date().toISOString(),
        service: 'amt-crm-frontend',
        error: 'Health check failed'
      },
      { status: 500 }
    );
  }
} 