import { NextRequest, NextResponse } from 'next/server';
import { UTApi } from 'uploadthing/server';
import prisma from '@/prisma/prisma';

export async function POST(request: NextRequest, { params }: { params: { wallet: string } }) {
    try {
        // Handle file upload
        const files = await request.formData();
        const file = files.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { message: 'File is required' },
                { status: 400 }
            );
        }

        const user = await prisma.mst_users.findUnique({
            where: {
              user_address: params.wallet
            }
          });

        if(!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 400 }
            );
        }  

        // Call UploadThing API to handle the file upload
        const utapi = new UTApi({
            token: process.env.UPLOADTHING_TOKEN // Gunakan environment variable
        });

        // uploadFiles mengembalikan Promise, jadi perlu await
        const uploadResult = await utapi.uploadFiles(file);

        await prisma.mst_users.update({
            where: {
                user_address: params.wallet
            },
            data: {
                user_image_preview: uploadResult.data?.url
            }
        })

        // If upload is successful, return the response with URL file
        return NextResponse.json(
            {
                message: 'File shared successfully',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Share Error:', error);
        return NextResponse.json(
            {
                message: 'Failed to share file',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
