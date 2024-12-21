import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { OwnedTokensResponse, Token } from '@/types';
import { fetchStargazeTokens } from '@/lib/utils';

export async function GET(request: NextRequest, { params }: { params: { wallet: string } }) {
    try {
        const { wallet } = params;
        const { searchParams } = request.nextUrl;
        const collection_address = searchParams.get('collection_address');
        const limit = Number(searchParams.get('limit') || 10);
        const page = Number(searchParams.get('page') || 0);

        // Check if user exists
        let user = await prisma.mst_users.findUnique({
            where: {
                user_address: wallet
            }
        });

        if (!user) throw Error("User not found");

        const collection = await prisma.mst_collection.findFirst({
            where: { collection_address: collection_address },
            include: {
                mst_staker: false
            }
        });

        if (!collection) throw Error("Collection not found");

        const resp: OwnedTokensResponse = await fetchStargazeTokens({
            owner: wallet,
            collectionAddress: collection_address as string,
            limit: limit,
            offset: page * limit
        });

        return NextResponse.json(
            {
                message: 'successfully',
                data: resp
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get User Error:', error);
        return NextResponse.json(
            {
                message: 'Failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 400 }
        );
    }
}