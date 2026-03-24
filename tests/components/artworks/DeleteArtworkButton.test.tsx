import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteArtworkButton from "@/components/artworks/DeleteArtworkButton";

// --- Mock next/navigation ---
const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// --- Mock global fetch ---
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("DeleteArtworkButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Test 1: Displays the Delete button ---
  it("renders the delete button", () => {
    render(<DeleteArtworkButton artworkId="42" />);

    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  // --- Test 2: Modal is NOT visible initially ---
  it("does not show the modal initially", () => {
    render(<DeleteArtworkButton artworkId="42" />);

    expect(screen.queryByText("This action is irreversible.")).not.toBeInTheDocument();
  });

  // --- Test 3: Opens the modal on Delete click ---
  it("opens the confirmation modal when clicking Delete", () => {
    render(<DeleteArtworkButton artworkId="42" />);

    fireEvent.click(screen.getByText("Delete"));

    expect(screen.getByText("Delete Artwork")).toBeInTheDocument();
    expect(
      screen.getByText("This action is irreversible. Are you sure you want to delete this artwork?")
    ).toBeInTheDocument();
  });

  // --- Test 4: Calls fetch DELETE on confirm ---
  it("calls fetch with DELETE method when confirming", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });

    render(<DeleteArtworkButton artworkId="42" />);

    // Open modal
    fireEvent.click(screen.getByText("Delete"));

    // Click confirm button inside the modal
    const confirmButtons = screen.getAllByText("Delete");
    fireEvent.click(confirmButtons[confirmButtons.length - 1]!);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/artworks/42", {
        method: "DELETE",
        credentials: "include",
      });
    });
  });

  // --- Test 5: Redirects after successful deletion ---
  it("redirects to artworks list with success param after deletion", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });

    render(<DeleteArtworkButton artworkId="42" />);

    fireEvent.click(screen.getByText("Delete"));
    const confirmButtons = screen.getAllByText("Delete");
    fireEvent.click(confirmButtons[confirmButtons.length - 1]!);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/admin/artworks?success=deleted");
    });
  });

  // --- Test 6: Shows API error message ---
  it("displays an error message when the API returns an error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: "Artwork not found" }),
    });

    render(<DeleteArtworkButton artworkId="99" />);

    fireEvent.click(screen.getByText("Delete"));
    const confirmButtons = screen.getAllByText("Delete");
    fireEvent.click(confirmButtons[confirmButtons.length - 1]!);

    await waitFor(() => {
      expect(screen.getByText("Artwork not found")).toBeInTheDocument();
    });
  });

  // --- Test 7: Shows fallback error when API returns no body ---
  it("displays a fallback error when API response has no JSON body", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.reject(),
    });

    render(<DeleteArtworkButton artworkId="99" />);

    fireEvent.click(screen.getByText("Delete"));
    const confirmButtons = screen.getAllByText("Delete");
    fireEvent.click(confirmButtons[confirmButtons.length - 1]!);

    await waitFor(() => {
      expect(screen.getByText("Failed to delete artwork.")).toBeInTheDocument();
    });
  });

  // --- Test 8: Shows network error ---
  it("displays a network error when fetch throws", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network failure"));

    render(<DeleteArtworkButton artworkId="42" />);

    fireEvent.click(screen.getByText("Delete"));
    const confirmButtons = screen.getAllByText("Delete");
    fireEvent.click(confirmButtons[confirmButtons.length - 1]!);

    await waitFor(() => {
      expect(screen.getByText("Network error. Please try again.")).toBeInTheDocument();
    });
  });
});