"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CreateArtworkSchema } from "@/lib/validators/artwork.validator";

type FormValues = {
  title: string;
  description: string;
  imageUrl: string;
  creationYear: string;
  artistId: string;
  collectionId: string;
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  title: "",
  description: "",
  imageUrl: "",
  creationYear: "",
  artistId: "",
  collectionId: "",
};

export default function ArtworkCreateForm() {
  const router = useRouter();

  const [values, setValues] = useState<FormValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  function onChange<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setApiError(null);

    const payload = {
      ...values,
      title: values.title.trim(),
      description: values.description.trim() || undefined,
      imageUrl: values.imageUrl.trim(),
      creationYear: values.creationYear,
      artistId: values.artistId,
      collectionId: values.collectionId,
    };

    const parsed = CreateArtworkSchema.safeParse(payload);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;

      setFieldErrors({
        ...(errors.title?.[0] ? { title: errors.title[0] } : {}),
        ...(errors.description?.[0] ? { description: errors.description[0] } : {}),
        ...(errors.imageUrl?.[0] ? { imageUrl: errors.imageUrl[0] } : {}),
        ...(errors.creationYear?.[0] ? { creationYear: errors.creationYear[0] } : {}),
        ...(errors.artistId?.[0] ? { artistId: errors.artistId[0] } : {}),
        ...(errors.collectionId?.[0] ? { collectionId: errors.collectionId[0] } : {}),
      });

      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch("/api/artworks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setApiError(body?.error ?? "Error while creating the artwork.");
        return;
      }

      router.push("/admin/artworks?success=created");
      router.refresh();
    } catch {
      setApiError("Network error. Please try again in a few seconds.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4">
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">Title</label>
        <input
          id="title"
          className="w-full rounded border px-3 py-2"
          value={values.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
        {fieldErrors.title && <p className="mt-1 text-sm text-red-600">{fieldErrors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          id="description"
          className="w-full rounded border px-3 py-2"
          rows={4}
          value={values.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
        {fieldErrors.description && <p className="mt-1 text-sm text-red-600">{fieldErrors.description}</p>}
      </div>

      <div>
        <label htmlFor="imageUrl" className="mb-1 block text-sm font-medium">Image URL</label>
        <input
          id="imageUrl"
          className="w-full rounded border px-3 py-2"
          value={values.imageUrl}
          onChange={(e) => onChange("imageUrl", e.target.value)}
        />
        {fieldErrors.imageUrl && <p className="mt-1 text-sm text-red-600">{fieldErrors.imageUrl}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="creationYear" className="mb-1 block text-sm font-medium">Creation Year</label>
          <input
            id="creationYear"
            className="w-full rounded border px-3 py-2"
            value={values.creationYear}
            onChange={(e) => onChange("creationYear", e.target.value)}
          />
          {fieldErrors.creationYear && <p className="mt-1 text-sm text-red-600">{fieldErrors.creationYear}</p>}
        </div>

        <div>
          <label htmlFor="artistId" className="mb-1 block text-sm font-medium">Artist ID</label>
          <input
            id="artistId"
            className="w-full rounded border px-3 py-2"
            value={values.artistId}
            onChange={(e) => onChange("artistId", e.target.value)}
          />
          {fieldErrors.artistId && <p className="mt-1 text-sm text-red-600">{fieldErrors.artistId}</p>}
        </div>

        <div>
          <label htmlFor="collectionId" className="mb-1 block text-sm font-medium">Collection ID</label>
          <input
            id="collectionId"
            className="w-full rounded border px-3 py-2"
            value={values.collectionId}
            onChange={(e) => onChange("collectionId", e.target.value)}
          />
          {fieldErrors.collectionId && <p className="mt-1 text-sm text-red-600">{fieldErrors.collectionId}</p>}
        </div>
      </div>

      {apiError && <p className="text-sm text-red-600">{apiError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {isSubmitting ? "Creating..." : "Create artwork"}
      </button>
    </form>
  );
}