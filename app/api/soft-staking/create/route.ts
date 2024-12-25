import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { updateNftOwner } from '@/lib/soft-staking-service';
import { fetchStargazeTokens } from '@/lib/utils';
import { OwnedTokensResponse } from '@/types';

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

        let resp: OwnedTokensResponse = await fetchStargazeTokens({
            owner: staker_address,
            collectionAddress: collection_address,
            limit: 1,
            offset: 0
        });

        if(resp.tokens.length == 0){
            return NextResponse.json(
                { message: 'No tokens found for the given owner and collection.' },
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
                    staker_collection_id: collection.collection_id,
                    staker_total_points: 0
                }
            });  
        } 

        updateNftOwner(staker_address, collection_address);

        const stakerTotalPoints = staker.staker_total_points
            ? staker.staker_total_points.toString()
            : null;

        return NextResponse.json(
            {
                message: 'Stake created successfully',
                data: { ...staker, staker_total_points: stakerTotalPoints },
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