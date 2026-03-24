"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/ui/ConfirmModal";

type Props = {
  artworkId: string;
};

export default function DeleteArtworkButton({ artworkId }: Props) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/artworks/${artworkId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? "Failed to delete artwork.");
        setIsModalOpen(false);  
        return;
      }

      setIsModalOpen(false);
      router.push("/admin/artworks?success=deleted");
    } catch {
      setError("Network error. Please try again.");
      setIsModalOpen(false);  
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="text-red-600 hover:underline"
      >
        Delete
      </button>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

      <ConfirmModal
        isOpen={isModalOpen}
        title="Delete Artwork"
        message="This action is irreversible. Are you sure you want to delete this artwork?"
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
        isLoading={isDeleting}
      />
    </div>
  );
}