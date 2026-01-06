export async function GET() {
    return Response.json({
        status: 'OK',
        service: 'the-five-doors',
        timestamp: new Date().toISOString(),
        framework: 'Next.js API Routes'
    });
}