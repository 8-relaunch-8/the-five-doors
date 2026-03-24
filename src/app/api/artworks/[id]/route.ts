import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { artworkService } from '@/lib/services/artwork.service';
import { requireAuth } from '@/lib/middleware/auth.middleware';
import { UpdateArtworkSchema } from '@/lib/validators/artwork.validator';
import { logger } from '@/lib/utils/logger';
import { toJsonSafe } from '@/lib/utils/json';

const STAFF_ROLES = new Set(['ADMIN', 'STAFF']);

// ✅ parseId secured (avoids crash on BigInt())
function parseId(raw: string): bigint | null {
  if (!/^\d+$/.test(raw)) return null;
  try {
    return BigInt(raw);
  } catch {
    return null;
  }
}

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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseId(params.id);
    if (id === null) {
      return NextResponse.json({ error: 'Invalid artwork id' }, { status: 400 });
    }
    const artwork = await artworkService.findById(id);
    if (!artwork) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }
    return NextResponse.json({ data: toJsonSafe(artwork) });
  } catch (error) {
    logger.error('Error fetching artwork:', error);
    return NextResponse.json({ error: 'Failed to fetch artwork' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireStaffOrAdmin(request);
    if (authError) return authError;

    const id = parseId(params.id);
    if (id === null) {
      return NextResponse.json({ error: 'Invalid artwork id' }, { status: 400 });
    }
    const body = await request.json();
    const validatedData = UpdateArtworkSchema.parse(body);
    const artwork = await artworkService.update(id, validatedData);
    logger.info('Artwork updated:', id);
    return NextResponse.json({ data: toJsonSafe(artwork) });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    if (error.message === 'Artwork not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error.message?.includes('already exists')) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    logger.error('Error updating artwork:', error);
    return NextResponse.json({ error: 'Failed to update artwork' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireStaffOrAdmin(request);
    if (authError) return authError;

    const id = parseId(params.id);
    if (id === null) {
      return NextResponse.json({ error: 'Invalid artwork id' }, { status: 400 });
    }
    const body = await request.json();
    const validatedData = UpdateArtworkSchema.parse(body);
    const artwork = await artworkService.update(id, validatedData);
    logger.info('Artwork patched:', id);
    return NextResponse.json({ data: toJsonSafe(artwork) });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    if (error.message === 'Artwork not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error.message?.includes('already exists')) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    logger.error('Error patching artwork:', error);
    return NextResponse.json({ error: 'Failed to update artwork' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireStaffOrAdmin(request);
    if (authError) return authError;

    const id = parseId(params.id);
    if (id === null) {
      return NextResponse.json({ error: 'Invalid artwork id' }, { status: 400 });
    }
    await artworkService.delete(id);
    logger.info('Artwork deleted:', id.toString());
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
      }
      if (error.code === 'P2003') {
        return NextResponse.json({ error: 'Cannot delete artwork because related records exist' }, { status: 409 });
      }
    }
    if (error?.message === 'Artwork not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error?.message?.includes('Cannot delete')) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    logger.error('Error deleting artwork:', error);
    return NextResponse.json({ error: 'Failed to delete artwork' }, { status: 500 });
  }
}