import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { updateNftOwner } from '@/lib/soft-staking-service';
import { fetchStargazeTokens } from '@/lib/utils';
import { OwnedTokensResponse } from '@/types';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            staker_address,
            project_code,
        } = body;

        if (!staker_address) {
            return NextResponse.json(
                { message: 'wallet_address is required' },
                { status: 400 }
            );
        }

        if (!project_code) {
            return NextResponse.json(
                { message: 'project_code is required' },
                { status: 400 }
            );
        }

        const project = await prisma.mst_project.findFirst({
            where: {
                project_code: project_code
            },
            include: {
                collections: true
            }
        });

        if (!project) {
            return NextResponse.json(
                { message: 'Project not found' },
                { status: 400 }
            );
        }

        let countToken = 0;
        console.log("collections", project.collections);
        for (let collection of project.collections) {

            if (!collection.collection_address) continue;

            let resp: OwnedTokensResponse = await fetchStargazeTokens({
                owner: staker_address,
                collectionAddresses: [collection.collection_address],
                limit: 1,
                offset: 0
            });

            // Check if staker already exists
            let staker = await prisma.mst_staker.findFirst({
                where: {
                    staker_address: staker_address,
                    staker_collection_id: collection.collection_id
                }
            });

            if (!staker) {
                staker = await prisma.mst_staker.create({
                    data: {
                        staker_address,
                        staker_collection_id: collection.collection_id,
                        staker_total_points: 0,
                        staker_project_id: project.project_id
                    }
                });
            }

            updateNftOwner(staker_address, collection.collection_address);

            countToken += resp.tokens.length;
        }

        if (countToken == 0) {
            return NextResponse.json(
                { message: 'No tokens found for the given owner and collection.' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                message: 'Stake created successfully'
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Stake Creation Error:', error);
        return NextResponse.json(
            {
                message: 'Failed to create Stake',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 400 }
        );
    }
}