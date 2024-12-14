import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { updateNftOwner } from '@/lib/soft-staking-service';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            staker_address,
            collection_address,
        } = body;

        const collection = await prisma.mst_collection.findFirst({
            where: { collection_address: collection_address },
            include: {
                mst_staker: false
            }
        });

        if (!collection) {
            return NextResponse.json(
                { message: 'Collection not found' },
                { status: 400 }
            );
        }
    
        // Check if staker already exists
        let staker = await prisma.mst_staker.findFirst({
            where: {
                staker_address: staker_address,
                staker_collection_id: collection.collection_id
            }
        });

        if (!staker) {
            staker = await prisma.mst_staker.create({
                data: {
                    staker_address,
                    staker_collection_id: collection.collection_id
                }
            });  
        } 

        updateNftOwner(staker_address, collection_address);

        return NextResponse.json(
            {
                message: 'Stake created successfully',
                data: staker
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Stake Creation Error:', error);
        return NextResponse.json(
            {
                message: 'Failed to create Stake',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 400 }
        );
    }
}