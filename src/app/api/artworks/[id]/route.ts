import { NextRequest, NextResponse } from 'next/server';
import { artworkService } from '@/lib/services/artwork.service';
import { requireAuth } from '@/lib/middleware/auth.middleware';
import { UpdateArtworkSchema } from '@/lib/validators/artwork.validator';
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = BigInt(params.id);
    const artwork = await artworkService.findById(id);

    if (!artwork) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: artwork });

  } catch (error) {
    logger.error('Error fetching artwork:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artwork' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireStaffOrAdmin(request);
    if (authError) return authError;

    const id = BigInt(params.id);
    const body = await request.json();
    const validatedData = UpdateArtworkSchema.parse(body);
    const artwork = await artworkService.update(id, validatedData);

    logger.info('Artwork updated:', id);

    return NextResponse.json({ data: artwork });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    if (error.message === 'Artwork not found') {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    if (error.message?.includes('already exists')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    logger.error('Error updating artwork:', error);

    return NextResponse.json(
      { error: 'Failed to update artwork' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireStaffOrAdmin(request);
    if (authError) return authError;

    const id = BigInt(params.id);
    const body = await request.json();
    const validatedData = UpdateArtworkSchema.parse(body);
    const artwork = await artworkService.update(id, validatedData);

    logger.info('Artwork patched:', id);

    return NextResponse.json({ data: artwork });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    if (error.message === 'Artwork not found') {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    if (error.message?.includes('already exists')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    logger.error('Error patching artwork:', error);

    return NextResponse.json(
      { error: 'Failed to update artwork' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireStaffOrAdmin(request);
    if (authError) return authError;

    const id = BigInt(params.id);
    const artwork = await artworkService.delete(id);

    logger.info('Artwork deleted:', id);

    return NextResponse.json({ data: artwork });

  } catch (error: any) {
    if (error.message === 'Artwork not found') {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    if (error.message?.includes('Cannot delete')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    logger.error('Error deleting artwork:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete artwork' },
      { status: 500 }
    );
  }
}