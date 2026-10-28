"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const messages: Record<string, string> = {
  deleted: "Artwork deleted successfully.",
  created: "Artwork created successfully.",
  updated: "Artwork updated successfully.",
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

    // Clean up the URL
    const url = new URL(window.location.href);
    url.searchParams.delete("success");
    router.replace(url.pathname + url.search, { scroll: false });

    // Auto-dismiss after 3 seconds
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