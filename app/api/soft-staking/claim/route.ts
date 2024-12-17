import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { getTotalPoints } from '@/lib/soft-staking-service';

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

        const staker = await prisma.mst_staker.findFirst({
            where: { staker_address: staker_address, staker_collection_id: collection.collection_id }
        })

        if (!staker) {
            return NextResponse.json(
                { message: 'Staker not found' },
                { status: 400 }
            );
        }

        const resp = await getTotalPoints(staker_address, collection_address);

        if(resp.point == 0){
            return NextResponse.json(
                { message: 'No points available to claim' },
                { status: 400 }
            );
        }

        await prisma.trn_point.create({
            data: {
                point_amount: resp.point,
                point_nft_staked: resp.totalNft,
                point_staker_id: staker.staker_id,
                point_claim_date: new Date()
            }
        });

        if(resp.point >= 1){
            await prisma.mst_staker.update({
                where: { staker_id: staker.staker_id },
                data: {
                    staker_lastclaim_date: new Date(),
                    staker_nft_staked: resp.totalNft
                }
            });    
        }

        return NextResponse.json(
            {
                message: 'Claim successfully',
                data: {
                    staker: staker,
                    point: resp.point
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Claim points Error:', error);
        return NextResponse.json(
            {
                message: 'Failed to Claim',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 400 }
        );
    }
}