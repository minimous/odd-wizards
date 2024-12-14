import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { getTotalPoints } from '@/lib/soft-staking-service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const collection_address = searchParams.get('collection_address');
        const staker_address = searchParams.get('wallet_address');

        if(!staker_address){
            return NextResponse.json(
                { message: 'wallet_address is required' },
                { status: 400 }
            );
        }

        if(!collection_address){
            return NextResponse.json(
                { message: 'collection_address is required' },
                { status: 400 }
            );
        }

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

        const staker = await prisma.mst_staker.findFirst({
            where: { staker_address: staker_address, staker_collection_id: collection.collection_id }
        })

        if (!staker) {
            return NextResponse.json(
                { message: 'Staker not found' },
                { status: 400 }
            );
        }

        // const totalPoints = await getTotalPoints(staker_address, collection_address);

        return NextResponse.json(
            {
                message: 'Get points successfully',
                data: {
                    staker: staker,
                    // points: totalPoints 
                }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Get points Error:', error);
        return NextResponse.json(
            {
                message: 'Failed to Get points',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 400 }
        );
    }
}