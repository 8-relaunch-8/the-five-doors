export async function GET() {
    return Response.json({
        status: 'OK',
        service: 'thefivedoors-api',
        timestamp: new Date().toISOString(),
        framework: 'Next.js API Routes'
    });
}