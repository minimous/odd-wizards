import getConfig from '@/config/config';
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(request: NextRequest, { params }: { params: { wallet: string } }) {

    const config = getConfig();

    try {
        // Launch browser
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Go to the provided URL
        await page.goto(`${config?.base_url}/p/${params.wallet}/share`, { waitUntil: 'networkidle0' });

        // Take a screenshot
        const screenshot = await page.screenshot({ fullPage: true });

        // Close the browser
        await browser.close();

        // Return image response
        return new NextResponse(screenshot, {
            headers: {
                'Content-Type': 'image/png',
                'Content-Length': screenshot.length.toString(),
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