import ArtworkCreateForm from "@/components/artworks/ArtworkCreateForm";

export default function NewArtworkPage() {
  return (
    <div className="container mx-auto space-y-6 p-6">
      <h1 className="text-3xl font-bold">Create Artwork</h1>
      <ArtworkCreateForm />
    </div>
  );
}