import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { fetchStargazeTokens, getToken, getUserStakedNFTs } from '@/lib/utils';
import { OwnedTokensResponse } from '@/types';
import { updateNftOwner } from '@/lib/soft-staking-service';

export async function GET(request: NextRequest) {
    try {

        // const collectionAddress = "the777s";
        // const daoAddress = "stars1euzpv4n74ytfpqhhs4wajmt38e39pj2nxn5ykv2nh0wyz6avxwnqqh97dv";
        const address = "stars1d2vus0vznq0qymz4pf28uqh6lrv47jwvnfwqdt";

        // const staked_nfts = await getUserStakedNFTs(address, daoAddress);
        // const data = await Promise.all(staked_nfts.map(async (tokenId: string) => {
        //     const token = await getToken(collectionAddress, tokenId);
        //     return token;
        // }));

        let resp: OwnedTokensResponse = await fetchStargazeTokens({
            owner: address,
            collectionAddress: "stars1vcpp2wl5tsgueyrqxyz0haqpymxfur0y4qaqqh92hp5y06cs227qg0s5xu",
            limit: 1,
            offset: 0
        });

        // updateNftOwner(address, "stars1vcpp2wl5tsgueyrqxyz0haqpymxfur0y4qaqqh92hp5y06cs227qg0s5xu");
        
        return NextResponse.json(
            {
                message: 'Get points successfully',
                data: resp.tokens.length
            },
            { status: 200 }
        );
        
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            {
                message: 'Failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 400 }
        );
    }
}