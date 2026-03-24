import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { artworkService } from '@/lib/services/artwork.service';
import { requireAuth } from '@/lib/middleware/auth.middleware';
import { CreateArtworkSchema } from '@/lib/validators/artwork.validator';
import { logger } from '@/lib/utils/logger';
import { toJsonSafe } from '@/lib/utils/json';

const STAFF_ROLES = new Set(['ADMIN', 'STAFF']);

async function requireStaffOrAdmin(request: NextRequest) {
  try {
    const payload = await requireAuth(request);
    if (!STAFF_ROLES.has(payload.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return null;
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get('page') ?? '1');
    const limit = Number(searchParams.get('limit') ?? '10');

    if (!Number.isInteger(page) || !Number.isInteger(limit) || page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json({ error: 'Invalid pagination parameters' }, { status: 400 });
    }

    const { artworks, total } = await artworkService.findAll(page, limit);
    const totalPages = Math.max(1, Math.ceil(Number(total) / limit));

    return NextResponse.json(
      toJsonSafe({
        data: artworks,
        meta: {
          page,
          limit,
          total,
          totalPages,
        },
      })
    );
  } catch (error) {
    logger.error('Error fetching artworks:', error);
    return NextResponse.json({ error: 'Failed to fetch artworks' }, { status: 500 });
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

    return NextResponse.json({ data: toJsonSafe(artwork) }, { status: 201 });
  } catch (error) {
    logger.error('Error creating artwork:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.flatten() },
        { status: 400 }
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          error: 'Database constraint error',
          code: error.code,
          meta: error.meta,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('already exists')) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json({ error: 'Failed to create artwork' }, { status: 500 });
  }
}