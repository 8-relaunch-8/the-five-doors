import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import ArtworkEditForm from "@/components/artworks/ArtworkEditForm";

interface Artwork {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  creationYear: number | null;
  artistId: string | null;
  collectionId: string | null;
}

async function getArtwork(id: string): Promise<Artwork | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const protocol = h.get("x-forwarded-proto") ?? "http";
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      (host ? `${protocol}://${host}` : "http://localhost:3000");

    const res = await fetch(`${baseUrl}/api/artworks/${id}`, {
      headers: token ? { Cookie: `accessToken=${token}` } : {},
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export default async function EditArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artwork = await getArtwork(id);

  if (!artwork) notFound();

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Edit artwork</h1>
      <ArtworkEditForm artwork={artwork} />
    </div>
  );
}