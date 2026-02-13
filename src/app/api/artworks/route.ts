import { NextRequest, NextResponse } from 'next/server';
import { artworkService } from '@/lib/services/artwork.service';
import { requireAuth } from '@/lib/middleware/auth.middleware';
import { CreateArtworkSchema } from '@/lib/validators/artwork.validator';
import { logger } from '@/lib/utils/logger';

const STAFF_ROLES = new Set(['ADMIN', 'STAFF']);

async function requireStaffOrAdmin(request: NextRequest) {
  try {
    const payload = await requireAuth(request);
    if (!STAFF_ROLES.has(payload.role)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    return null;
  } catch {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    const { artworks, total } = await artworkService.findAll(page, limit);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: artworks,
      meta: {
        page,
        limit,
        total,
        totalPages
      }
    });

  } catch (error) {

    logger.error('Error fetching artworks:', error);

    return NextResponse.json(
      { error: 'Failed to fetch artworks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireStaffOrAdmin(request);
    if (authError) return authError;

    const body = await request.json();
    const validatedData = CreateArtworkSchema.parse(body);
    const artwork = await artworkService.create(validatedData);

    logger.info('Artwork created:', artwork.id);

    return NextResponse.json(
      { data: artwork },
      { status: 201 }
    );

  } catch (error) {
    // Type guard
    if (error instanceof Error) {
        // ZodError
        if (error.name === 'ZodError') {
        return NextResponse.json(
            { error: 'Validation failed', details: (error as any).errors },
            { status: 400 }
        );
        }

        if (error.message.includes('already exists')) {
        return NextResponse.json(
            { error: error.message },
            { status: 409 }
        );
        }
    }

    logger.error('Error creating artwork:', error);
    return NextResponse.json(
        { error: 'Failed to create artwork' },
        { status: 500 }
    );
  }
}