import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { getTotalPoints } from '@/lib/soft-staking-service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;

        const raffles = await prisma.trn_raffle.findMany();

        return NextResponse.json(
            {
                message: 'Get Raffles successfully',
                data: raffles
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get Raffles Error:', error);
        return NextResponse.json(
            {
                message: 'Failed to Get Raffles',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 400 }
        );
    }
}