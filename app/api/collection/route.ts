import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

// CREATE Collection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      collection_address, 
      collection_name, 
      collection_description 
    } = body;

    const collection = await prisma.mst_collection.create({
      data: {
        collection_address,
        collection_name,
        collection_description
      }
    });

    return NextResponse.json(
      { 
        message: 'Collection created successfully', 
        data: collection 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Collection Creation Error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to create collection', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 400 }
    );
  }
}

// READ Collections
export async function GET(request: NextRequest) {
  try {
    // Pagination and filtering
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const collections = await prisma.mst_collection.findMany({
      where: {
        OR: [
          { collection_name: { contains: search, mode: 'insensitive' } },
          { collection_address: { contains: search, mode: 'insensitive' } }
        ]
      },
      skip,
      take: limit,
      include: {
        mst_staker: {
          select: {
            staker_id: true,
            staker_address: true
          }
        }
      }
    });

    const total = await prisma.mst_collection.count({
      where: {
        OR: [
          { collection_name: { contains: search, mode: 'insensitive' } },
          { collection_address: { contains: search, mode: 'insensitive' } }
        ]
      }
    });

    return NextResponse.json(
      { 
        message: 'Collections retrieved successfully',
        data: collections,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
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