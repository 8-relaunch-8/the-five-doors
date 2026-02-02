import { prisma } from '@/lib/prisma';
import { CreateArtworkInput, UpdateArtworkInput } from '@/lib/validators/artwork.validator';
import { Artwork } from '@prisma/client';

/**
 * Service gérant la logique métier des artworks
 */
class ArtworkService {
  /**
   * Récupérer tous les artworks avec pagination
   */
  async findAll(page: number = 1, limit: number = 10): Promise<{ artworks: Artwork[]; total: number }> {
    const skip = (page - 1) * limit;

    const [artworks, total] = await Promise.all([
      prisma.artwork.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          artist: true,
          collection: true
        }
      }),
      prisma.artwork.count()
    ]);

    return { artworks, total };
  }

  /**
   * Récupérer un artwork par son ID
   */
  async findById(id: bigint): Promise<Artwork | null> {
    return await prisma.artwork.findUnique({
      where: { id },
      include: {
        artist: true,
        collection: true
      }
    });
  }

  /**
   * Créer un nouveau artwork
   */
  async create(data: CreateArtworkInput): Promise<Artwork> {
    // Règle métier : Vérifier unicité (titre + artiste)
    const existing = await prisma.artwork.findFirst({
      where: {
        title: data.title,
        artistId: BigInt(data.artistId)
      }
    });

    if (existing) {
      throw new Error('An artwork with this title by this artist already exists');
    }

    return await prisma.artwork.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        imageUrl: data.imageUrl,
        creationYear: data.creationYear,
        artistId: BigInt(data.artistId),
        collectionId: BigInt(data.collectionId)
      },
      include: {
        artist: true,
        collection: true
      }
    });
  }

  /**
   * Modifier un artwork existant
   */
  async update(id: bigint, data: UpdateArtworkInput): Promise<Artwork> {
    // Vérifier que l'artwork existe
    const artwork = await this.findById(id);
    
    if (!artwork) {
      throw new Error('Artwork not found');
    }

    // Si title ou artistId modifiés, vérifier l'unicité
    if (data.title || data.artistId) {
      const existing = await prisma.artwork.findFirst({
        where: {
          title: data.title ?? artwork.title,
          artistId: data.artistId ? BigInt(data.artistId) : artwork.artistId,
          NOT: { id }
        }
      });

      if (existing) {
        throw new Error('An artwork with this title by this artist already exists');
      }
    }

    return await prisma.artwork.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.creationYear !== undefined && { creationYear: data.creationYear }),
        ...(data.artistId !== undefined && { artistId: BigInt(data.artistId) }),
        ...(data.collectionId !== undefined && { collectionId: BigInt(data.collectionId) })
      },
      include: {
        artist: true,
        collection: true
      }
    });
  }

  /**
   * Supprimer un artwork
   */
  async delete(id: bigint): Promise<Artwork> {
    // Vérifier que l'artwork existe
    const artwork = await this.findById(id);
    
    if (!artwork) {
      throw new Error('Artwork not found');
    }

    // Règle métier : Vérifier si lié à une exhibition active
    const activeExhibitions = await prisma.exhibitionArtwork.findMany({
      where: {
        artworkId: id,
        exhibition: {
          endDate: { gte: new Date() }
        }
      }
    });

    if (activeExhibitions.length > 0) {
      throw new Error('Cannot delete artwork linked to active exhibitions');
    }

    return await prisma.artwork.delete({
      where: { id }
    });
  }
}

// Export d'une instance unique (Singleton Pattern)
export const artworkService = new ArtworkService();