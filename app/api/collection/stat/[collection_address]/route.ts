import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { getCollection } from '@/lib/utils';

// READ Collections
export async function GET(request: NextRequest, { params }: { params: { collection_address: string } }) {
  try {

    const stat = await getCollection(params.collection_address); 

    return NextResponse.json(
      { 
        message: 'Collections retrieved successfully',
        data: stat,
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Collection Retrieval Error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to retrieve collections', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}