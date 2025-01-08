import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import getConfig from '@/config/config';
const config = getConfig();
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
      },
    });

    if (!raffle) {
      return NextResponse.json(
        {
          message: 'Raffle not found',
        },
        { status: 400 }
      );
    }

    const collection_address = config?.price_type[raffle.raffle_price_type as keyof typeof config.price_type];

    console.log("raffle.raffle_price_type", raffle.raffle_price_type);
    console.log("collection_address", collection_address);

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
      where: { staker_address: wallet_address, staker_collection_id: collection.collection_id }
    })

    if (!staker) {
      return NextResponse.json(
        { message: 'Staker not found' },
        { status: 400 }
      );
    }

    const totalPrice = (raffle.raffle_price ?? 0) * amount;
    const balance = staker.staker_total_points ?? 0;

    if(balance < totalPrice){
      return NextResponse.json(
        { message: 'Insufficient balance to buy ticket' },
        { status: 400 }
      );
    }

    await prisma.mst_staker.update({
      where: {
        staker_id: staker.staker_id
      },
      data: {
        staker_total_points: balance - totalPrice
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