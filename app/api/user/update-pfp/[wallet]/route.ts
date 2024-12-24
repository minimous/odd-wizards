import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { Token } from '@/types';
import { getToken } from 'next-auth/jwt';

export async function POST(request: NextRequest, { params }: { params: { wallet: string } }) {
    try {
        // Get the authentication token with the required secret
        // const token = await getToken({ 
        //     req: request, 
        //     secret: process.env.NEXTAUTH_SECRET || ''
        // });

        // // Check if user is authenticated
        // if (!token) {
        //     return NextResponse.json(
        //         { message: 'Unauthorized - Please login first' },
        //         { status: 401 }
        //     );
        // }

        // // Verify if the authenticated wallet matches the request params
        // if (token.sub !== params.wallet) {
        //     return NextResponse.json(
        //         { message: 'Forbidden - You can only update your own profile' },
        //         { status: 403 }
        //     );
        // }

        const body = await request.json();
        const {
            token: nftToken
        }: { token: Token } = body;

        if(!nftToken){
            return NextResponse.json(
                { message: 'body required' },
                { status: 400 }
            );
        }

        const user = await prisma.mst_users.findUnique({
            where: { user_address: params.wallet }
        });

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        await prisma.mst_users.update({
            where: { user_address: params.wallet },
            data: {
                user_image_url: nftToken.media.url
            }
        });

        const userTotalPoints = user?.user_total_points
            ? user.user_total_points.toString()
            : null;

        return NextResponse.json(
            {
                message: 'Update Pfp successfully',
                data: { ...user, user_total_points: userTotalPoints}
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Update Pfp Error:', error);
        return NextResponse.json(
            {
                message: 'Failed to Update Pfp',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}