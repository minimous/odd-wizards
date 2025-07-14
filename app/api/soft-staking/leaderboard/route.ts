import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { Prisma } from '@prisma/client';
import { LeaderboardItem } from '@/types/leaderboard';
import { getLeaderboard } from '@/lib/soft-staking-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const project_code = searchParams.get('project_code');
    const staker_address = searchParams.get('wallet_address');
    const size = parseInt(searchParams.get('size') || '10'); // Default size 10
    const page = parseInt(searchParams.get('page') || '0'); // Default page 0

    let project_id;

    if (project_code) {
      const project = await prisma.mst_project.findFirst({
        where: { project_code: project_code }
      });

      if (!project) {
        return NextResponse.json(
          {
            message: 'Project not found',
            data: null
          },
          { status: 400 }
        );
      }

      project_id = project.project_id;
    }

    const leaderboard = await getLeaderboard(
      staker_address,
      page,
      size,
      project_id
    );

    // Handle BigInt serialization
    const leaderboardWithBigIntAsString = leaderboard.map((item: any) => ({
      ...item,
      total_points: item.total_points.toString(),
      staker_nft_staked: item.staker_nft_staked.toString(),
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
