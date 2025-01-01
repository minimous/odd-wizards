import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
        raffle_id,
        wallet_address,
        amount
    } = body;

    const raffle = await prisma.trn_raffle.findUnique({
        where: {
            raffle_id: raffle_id
        }
    });
    
    const participant = await prisma.trn_participant.create({
        data: {
            participant_address: wallet_address,
            participant_created_date: new Date(),
            participant_amount: amount,
            participant_raffle_id: raffle_id
        }
    })

    return NextResponse.json(
      { 
        message: 'Buy Ticket successfully', 
        data: participant
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Buy Ticket Error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to Buy Ticket', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 400 }
    );
  }
}