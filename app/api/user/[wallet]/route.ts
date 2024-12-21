import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { DEFAULT_IMAGE_PROFILE } from '@/constants';
import { OwnedTokensResponse, Token } from '@/types';
import { fetchStargazeTokens } from '@/lib/utils';
import { updateNftOwner } from '@/lib/soft-staking-service';

export async function GET(request: NextRequest, { params }: { params: { wallet: string } }) {
    try {
        const { wallet } = params;
        const { searchParams } = request.nextUrl;
        const collection_address = searchParams.get('collection_address');

        // Check if user exists
        let user = await prisma.mst_users.findUnique({
            where: {
                user_address: wallet
            }
        });

        const collection = await prisma.mst_collection.findFirst({
            where: { collection_address: collection_address },
            include: {
              mst_staker: false
            }
        });
    
        if(!collection) throw Error("Collection not found");

        // If user doesn't exist, create new user
        if (!user) {
            const resp: OwnedTokensResponse = await fetchStargazeTokens({
                owner: wallet,
                collectionAddress: collection_address as string,
                limit: 1,
                offset: 0
            });

            const tokens: Token[] = resp.tokens;

            user = await prisma.mst_users.create({
                data: {
                    user_address: wallet,
                    user_created_date: new Date(),
                    user_image_url: tokens.length > 0 ? tokens[0].media?.url : DEFAULT_IMAGE_PROFILE
                }
            });
        }
    
        const staker = await prisma.mst_staker.findFirst({
            where: { staker_address: wallet, staker_collection_id: collection.collection_id }
        });

        if(staker && collection_address){
            updateNftOwner(wallet, collection_address);
        }

        return NextResponse.json(
            {
                message: 'successfully',
                data: { 
                    user: user,
                    staker: staker,
                    // point:
                }
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