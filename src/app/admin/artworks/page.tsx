import Link from 'next/link';
import Image from 'next/image';
import { cookies } from 'next/headers';

interface Artwork {
  id: string;
  title: string;
  imageUrl: string | null;
  year: number | null;
  artist: { name: string } | null;
}

interface ApiResponse {
  data: Artwork[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

async function getArtworks(page: number = 1): Promise<ApiResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/artworks?page=${page}&limit=10`,
    {
      headers: token ? { Cookie: `accessToken=${token}` } : {},
      cache: 'no-store',
    }
  );

  if (!res.ok) throw new Error('Failed to fetch artworks');
  return res.json();
}

export default async function ArtworksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { data: artworks, pagination } = await getArtworks(page);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Artworks</h1>
        <Link
          href="/admin/artworks/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Créer
        </Link>
      </div>

      {artworks.length === 0 ? (
        <p className="text-gray-500">Aucun artwork trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="border rounded-lg p-4 shadow">
              {artwork.imageUrl && (
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}
              <h2 className="text-xl font-semibold mb-2">{artwork.title}</h2>
              <p className="text-gray-600 mb-1">
                {artwork.artist?.name || 'Artiste inconnu'}
              </p>
              <p className="text-gray-500 text-sm mb-4">
                {artwork.year || 'Année inconnue'}
              </p>
              <div className="flex gap-2">
                <Link
                  href={`/admin/artworks/${artwork.id}/edit`}
                  className="text-blue-600 hover:underline"
                >
                  Éditer
                </Link>
                <button className="text-red-600 hover:underline">
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-2 mt-8">
        {page > 1 && (
          <Link
            href={`/admin/artworks?page=${page - 1}`}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Précédent
          </Link>
        )}
        <span className="px-4 py-2">
          Page {pagination.page} / {pagination.totalPages}
        </span>
        {page < pagination.totalPages && (
          <Link
            href={`/admin/artworks?page=${page + 1}`}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Suivant
          </Link>
        )}
      </div>
    </div>
  );
}