"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const messages: Record<string, string> = {
  deleted: "Artwork supprimé avec succès.",
  created: "Artwork créé avec succès.",
  updated: "Artwork mis à jour avec succès.",
};

export default function SuccessToast() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const key = searchParams.get("success");
  const text = key ? messages[key] ?? "" : "";

  const [initialText] = useState(text);
  const [visible, setVisible] = useState(!!initialText);

  useEffect(() => {
    if (!initialText) return;

    // Nettoyer l'URL
    const url = new URL(window.location.href);
    url.searchParams.delete("success");
    router.replace(url.pathname + url.search, { scroll: false });

    // Auto-dismiss après 3 secondes
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, [initialText, router]);

  if (!visible) return null;

  return (
    <div className="mb-4 rounded bg-green-100 px-4 py-3 text-green-800">
      {initialText}
    </div>
  );
}