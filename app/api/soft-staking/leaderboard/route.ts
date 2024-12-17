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
            WITH leaderboard_points AS (
                SELECT
                    mc.collection_address,
                    ms.staker_address,
                    ms.staker_nft_staked,
                    mu.user_image_url,
                    SUM(tp.point_amount) as total_points
                FROM trn_point tp
                LEFT JOIN mst_staker ms ON ms.staker_id = tp.point_staker_id 
                LEFT JOIN mst_users mu ON mu.user_address = ms.staker_address
                LEFT JOIN mst_collection mc ON mc.collection_id = ms.staker_collection_id
                WHERE mc.collection_address = ${collection_address}
                AND ms.staker_nft_staked > 0
                GROUP BY mc.collection_address, ms.staker_address, ms.staker_nft_staked, mu.user_image_url
            ),
            ranked_leaderboard AS (
                SELECT 
                    *,
                    ROW_NUMBER() OVER (
                        PARTITION BY collection_address 
                        ORDER BY total_points DESC
                    ) as ranking
                FROM leaderboard_points
            )
            SELECT 
                collection_address,
                staker_address,
                staker_nft_staked,
                user_image_url,
                total_points,
                ranking
            FROM ranked_leaderboard
            WHERE 1=1
            ${staker_address ? Prisma.sql`AND staker_address = ${staker_address}` : Prisma.empty}
            ORDER BY total_points DESC, ranking
            LIMIT ${size} OFFSET ${page * size};
        `;

        // Handle BigInt serialization
        const leaderboardWithBigIntAsString = leaderboard.map((item: any) => ({
            ...item,
            total_points: item.total_points.toString(),
            ranking: item.ranking.toString()
        }));

        return NextResponse.json(
            {
                message: 'Get leaderboard successfully',
                data: leaderboardWithBigIntAsString
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get leaderboard Error:', error);
        return NextResponse.json(
            {
                message: 'Failed to Get leaderboard',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 400 }
        );
    }
}