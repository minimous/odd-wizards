import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import calculatePoint from '@/lib/utils';

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
                { status: 404 }
            );
        }

        const staker = await prisma.mst_staker.findFirst({
            where: { staker_address: staker_address, staker_collection_id: collection.collection_id }
        })

        if (!staker) {
            return NextResponse.json(
                { message: 'Staker not found' },
                { status: 404 }
            );
        }

        const attributes_rewards = await prisma.mst_attributes_reward.findMany({
            where: { attr_collection_id: collection.collection_id }
        });

        const totalPoints = attributes_rewards?.reduce((sum, reward) => 
            sum + calculatePoint(reward, staker.staker_lastclaim_date), 0
        );

        return NextResponse.json(
            {
                message: 'Get points successfully',
                data: {
                    staker: staker,
                    points: totalPoints 
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