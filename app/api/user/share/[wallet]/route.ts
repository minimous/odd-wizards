import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { wallet: string } }) {
    try {
        // Mengirim request untuk mendapatkan gambar
        const resp = await axios.get(`http://157.173.202.22:3000/screenshot/${params.wallet}`, {
            responseType: 'arraybuffer', // Mengatur respons untuk menerima buffer data gambar
            headers: {
                'Accept': 'image/png', // Mengatur header untuk menerima gambar PNG
            }
        });

        // Memeriksa jika status HTTP adalah 200 (OK)
        if (resp.status !== 200) {
            throw new Error('Failed to fetch image from external server');
        }

        // Mengembalikan respons gambar dengan header yang sesuai
        return new NextResponse(resp.data, {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
                'Content-Length': resp.data.length.toString(),
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to generate image' },
            { status: 500 }
        );
    }
}
