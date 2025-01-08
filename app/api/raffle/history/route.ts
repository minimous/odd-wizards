import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function GET(request: NextRequest) {
  try {

    // Get history raffles with relations user  

    const history = await prisma.trn_participant.findMany({
        where: {
        },
        include: {
            raffle: {
              include: {
                rewards: true
              }
            },
            user: true
        },
        orderBy: {
            participant_created_date: 'desc'
        },
        take: 50
    })

    return NextResponse.json(
      {
        message: 'Get History Raffles successfully',
        data: history
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get History Raffles Error:', error);
    return NextResponse.json(
      {
        message: 'Failed to Get History Raffles',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    );
  }
}
