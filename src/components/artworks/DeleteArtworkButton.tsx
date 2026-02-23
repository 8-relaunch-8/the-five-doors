"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  artworkId: string;
};

export default function DeleteArtworkButton({ artworkId }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm("Are you sure you want to delete this artwork?");
    if (!confirmed) return;

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
        return;
      }

      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-600 hover:underline disabled:opacity-50"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}