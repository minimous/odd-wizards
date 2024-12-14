import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { Prisma } from '@prisma/client';
import { LeaderboardItem } from '@/types/leaderboard';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const collection_address = searchParams.get('collection_address');
        const staker_address = searchParams.get('wallet_address');
        const size = parseInt(searchParams.get('size') || '10'); // Default size 10
        const page = parseInt(searchParams.get('page') || '0'); // Default page 0

        if (!collection_address) {
            return NextResponse.json(
                { message: 'collection_address is required' },
                { status: 400 }
            );
        }

        const leaderboard: any = await prisma.$queryRaw`
            select
                mc.collection_address,
                ms.staker_address,
                ms.staker_nft_staked,
                mu.user_image_url,
                sum(tp.point_amount) as total_points,
                rank() over (partition by mc.collection_address order by sum(tp.point_amount) desc) as ranking
            from trn_point tp
            left join mst_staker ms on ms.staker_id = tp.point_staker_id 
            left join mst_users mu on mu.user_address = ms.staker_address
            left join mst_collection mc on mc.collection_id = ms.staker_collection_id
            where 1=1
            ${collection_address ? Prisma.sql`and mc.collection_address = ${collection_address}` : Prisma.empty}
            ${staker_address ? Prisma.sql`and ms.staker_address = ${staker_address}` : Prisma.empty}
            group by mc.collection_address, ms.staker_address, ms.staker_nft_staked, mu.user_image_url
            order by mc.collection_address, ranking
            limit ${size} offset ${page * size};
        `;

        // Handle BigInt serialization
        const leaderboardWithBigIntAsString = leaderboard.map((item: any) => {
            return {
                ...item,
                total_points: item.total_points.toString(), // Convert BigInt to string
                ranking: item.ranking.toString(), // Convert BigInt to string
            };
        });

        return NextResponse.json(
            {
                message: 'Get learboard successfully',
                data: leaderboardWithBigIntAsString
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get learboard Error:', error);
        return NextResponse.json(
            {
                message: 'Failed to Get learboard',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 400 }
        );
    }
}
