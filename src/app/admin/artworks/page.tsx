import Link from "next/link";
import Image from "next/image";
import { cookies, headers } from "next/headers";
import DeleteArtworkButton from "@/components/artworks/DeleteArtworkButton";
import SuccessToast from "@/components/ui/SuccessToast";

interface Artwork {
  id: string;
  title: string;
  imageUrl: string | null;
  creationYear: number | null;
  artist: { name: string } | null;
}

interface ApiResponse {
  data: Artwork[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

function getFallback(page: number): ApiResponse {
  return {
    data: [],
    meta: { total: 0, page, limit: 10, totalPages: 1 },
  };
}

async function getArtworks(page: number = 1): Promise<ApiResponse> {
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  const fallback = getFallback(safePage);

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const protocol = h.get("x-forwarded-proto") ?? "http";

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      (host ? `${protocol}://${host}` : "http://localhost:3000");

    const params = new URLSearchParams({
      page: String(safePage),
      limit: "10",
    });

    const url = `${baseUrl}/api/artworks?${params.toString()}`;

    const res = await fetch(url, {
      headers: token ? { Cookie: `accessToken=${token}` } : {},
      cache: "no-store",
    });

    if (!res.ok) return fallback;

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) return fallback;

    const json = (await res.json()) as Partial<ApiResponse>;

    return {
      data: Array.isArray(json.data) ? json.data : [],
      meta: {
        total: json.meta?.total ?? 0,
        page: json.meta?.page ?? safePage,
        limit: json.meta?.limit ?? 10,
        totalPages: Math.max(1, json.meta?.totalPages ?? 1),
      },
    };
  } catch {
    return fallback;
  }
}

export default async function ArtworksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const parsedPage = Number(params.page);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const { data: artworks, meta } = await getArtworks(page);

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">Artworks</h1>
        <Link
          href="/admin/artworks/new"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Create
        </Link>
      </div>

      <SuccessToast />

      {artworks.length === 0 ? (
        <p className="text-gray-500">No artworks found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {artworks.map((artwork, index) => (
            <div key={artwork.id} className="rounded-lg border p-4 shadow">
              {artwork.imageUrl && (
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  width={400}
                  height={300}
                  className="mb-4 h-48 w-full rounded object-cover"
                  priority={index < 2}
                />
              )}
              <h2 className="mb-2 text-xl font-semibold">{artwork.title}</h2>
              <p className="mb-1 text-gray-600">
                {artwork.artist?.name || "Unknown artist"}
              </p>
              <p className="mb-4 text-sm text-gray-500">
                {artwork.creationYear ?? "Unknown year"}
              </p>
              <div className="flex gap-2">
                <Link
                  href={`/admin/artworks/${artwork.id}/edit`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                <DeleteArtworkButton artworkId={artwork.id} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center gap-2">
        {page > 1 && (
          <Link
            href={`/admin/artworks?page=${page - 1}`}
            className="rounded border px-4 py-2 hover:bg-gray-100"
          >
            Previous
          </Link>
        )}
        <span className="px-4 py-2">
          Page {meta.page} / {meta.totalPages}
        </span>
        {page < meta.totalPages && (
          <Link
            href={`/admin/artworks?page=${page + 1}`}
            className="rounded border px-4 py-2 hover:bg-gray-100"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}