import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ArtworkEditForm from "@/components/artworks/ArtworkEditForm";

// --- Mock next/navigation ---
const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

// --- Mock global fetch ---
const mockFetch = vi.fn();
global.fetch = mockFetch;

// --- Fake artwork data ---
const fakeArtwork = {
  id: "abc-123",
  title: "Starry Night",
  description: "A famous painting",
  imageUrl: "https://example.com/starry.jpg",
  creationYear: 1889,
  artistId: "5",
  collectionId: "3",
};

describe("ArtworkEditForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Test 1: Pre-fills the form with artwork data ---
  it("renders the form pre-filled with the artwork values", () => {
    render(<ArtworkEditForm artwork={fakeArtwork} />);

    expect(screen.getByLabelText("Title")).toHaveValue("Starry Night");
    expect(screen.getByLabelText("Description")).toHaveValue("A famous painting");
    expect(screen.getByLabelText("Image URL")).toHaveValue("https://example.com/starry.jpg");
    expect(screen.getByLabelText("Creation Year")).toHaveValue("1889");
    expect(screen.getByLabelText("Artist ID")).toHaveValue("5");
    expect(screen.getByLabelText("Collection ID")).toHaveValue("3");
  });

  // --- Test 2: Renders Save and Cancel buttons ---
  it("renders the save and cancel buttons", () => {
    render(<ArtworkEditForm artwork={fakeArtwork} />);

    expect(screen.getByText("Enregistrer")).toBeInTheDocument();
    expect(screen.getByText("Annuler")).toBeInTheDocument();
  });

  // --- Test 3: Cancel button redirects to artworks list ---
  it("redirects to /admin/artworks when clicking Cancel", () => {
    render(<ArtworkEditForm artwork={fakeArtwork} />);

    fireEvent.click(screen.getByText("Annuler"));

    expect(mockPush).toHaveBeenCalledWith("/admin/artworks");
  });

  // --- Test 4: Shows Zod error for invalid URL ---
  it("displays a validation error for an invalid image URL", async () => {
    render(<ArtworkEditForm artwork={fakeArtwork} />);

    fireEvent.change(screen.getByLabelText("Image URL"), {
      target: { value: "not-a-url" },
    });

    fireEvent.click(screen.getByText("Enregistrer"));

    await waitFor(() => {
      expect(screen.getByText("Image URL must be a valid URL")).toBeInTheDocument();
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  // --- Test 5: Clears field error when user types ---
  it("clears the field error when the user modifies the field", async () => {
    render(<ArtworkEditForm artwork={fakeArtwork} />);

    fireEvent.change(screen.getByLabelText("Image URL"), {
      target: { value: "not-a-url" },
    });
    fireEvent.click(screen.getByText("Enregistrer"));

    await waitFor(() => {
      expect(screen.getByText("Image URL must be a valid URL")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Image URL"), {
      target: { value: "https://example.com/fixed.jpg" },
    });

    expect(screen.queryByText("Image URL must be a valid URL")).not.toBeInTheDocument();
  });

  // --- Test 6: Calls fetch PATCH with correct payload ---
  it("calls fetch with PATCH method and correct body on valid submit", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });

    render(<ArtworkEditForm artwork={fakeArtwork} />);

    // Modify the title
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Starry Night Updated" },
    });

    fireEvent.click(screen.getByText("Enregistrer"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/artworks/abc-123", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: "Starry Night Updated",
          description: "A famous painting",
          imageUrl: "https://example.com/starry.jpg",
          creationYear: 1889,
          artistId: 5,
          collectionId: 3,
        }),
      });
    });
  });

  // --- Test 7: Redirects after successful update ---
  it("redirects to /admin/artworks after successful update", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });

    render(<ArtworkEditForm artwork={fakeArtwork} />);

    fireEvent.click(screen.getByText("Enregistrer"));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/admin/artworks?success=updated");
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  // --- Test 8: Shows API error message ---
  it("displays an error message when the API returns an error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: "Artwork not found" }),
    });

    render(<ArtworkEditForm artwork={fakeArtwork} />);

    fireEvent.click(screen.getByText("Enregistrer"));

    await waitFor(() => {
      expect(screen.getByText("Artwork not found")).toBeInTheDocument();
    });
  });

  // --- Test 9: Shows network error when fetch throws ---
  it("displays a network error when fetch throws", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network failure"));

    render(<ArtworkEditForm artwork={fakeArtwork} />);

    fireEvent.click(screen.getByText("Enregistrer"));

    await waitFor(() => {
      expect(
        screen.getByText("Erreur réseau. Réessaie dans quelques secondes.")
      ).toBeInTheDocument();
    });
  });
});