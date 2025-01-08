import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Get raffles with relations
        const raffle = await prisma.trn_raffle.findUnique({
            where: {
                raffle_id: Number(params.id)
            },
            include: {
                rewards: true,
                participants: true
            }
        });

        if(!raffle) {
            return NextResponse.json(
                {
                    message: 'Raffle not found',
                    data: undefined
                },
                { status: 400 }
            );
        }

        const modifiedRewards = raffle.rewards.map((reward) => {
            const { reward_inject_win_address, ...rest } = reward;
            return rest;
        });

        return NextResponse.json(
            {
                message: 'Get Raffle successfully',
                data:  { ...raffle, rewards: modifiedRewards }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get Raffle Error:', error);
        return NextResponse.json(
            {
                message: 'Failed to Get Raffle',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 400 }
        );
    }
}