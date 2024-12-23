import getConfig from '@/config/config';
import { NextRequest, NextResponse } from 'next/server';
import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export async function GET(request: NextRequest, { params }: { params: { wallet: string } }) {

    const config = getConfig();

    try {
        // Gunakan chrome-aws-lambda untuk meluncurkan Chrome
        const browser = await puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
        });

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