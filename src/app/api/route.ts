export async function GET() {
    return Response.json({
        message: 'The Five Doors API - Server started successfully.',
        timestamp: new Date().toISOString(),
        framework: 'Next.js API Routes'
    });
}