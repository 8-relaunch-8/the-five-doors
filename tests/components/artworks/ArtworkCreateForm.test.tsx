import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ArtworkCreateForm from "@/components/artworks/ArtworkCreateForm";

// --- Mock next/navigation ---
const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

// --- Mock global fetch ---
const mockFetch = vi.fn();
global.fetch = mockFetch;

// --- Helper: fill the form with valid data ---
function fillForm(overrides: Partial<Record<string, string>> = {}) {
  const fields: Record<string, string> = {
    Title: "Mona Lisa",
    "Image URL": "https://example.com/mona.jpg",
    "Creation Year": "1503",
    "Artist ID": "1",
    "Collection ID": "2",
    ...overrides,
  };

  for (const [label, value] of Object.entries(fields)) {
    const input = screen.getByLabelText(label);
    fireEvent.change(input, { target: { value } });
  }
}

describe("ArtworkCreateForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Test 1: Renders the form with all fields and submit button ---
  it("renders all form fields and the submit button", () => {
    render(<ArtworkCreateForm />);

    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Image URL")).toBeInTheDocument();
    expect(screen.getByLabelText("Creation Year")).toBeInTheDocument();
    expect(screen.getByLabelText("Artist ID")).toBeInTheDocument();
    expect(screen.getByLabelText("Collection ID")).toBeInTheDocument();
    expect(screen.getByText("Create artwork")).toBeInTheDocument();
  });

  // --- Test 2: Shows Zod validation errors on empty submit ---
  it("displays validation errors when submitting an empty form", async () => {
    render(<ArtworkCreateForm />);

    fireEvent.click(screen.getByText("Create artwork"));

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
      expect(screen.getByText("Image URL is required")).toBeInTheDocument();
    });

    // fetch should NOT have been called
    expect(mockFetch).not.toHaveBeenCalled();
  });

  // --- Test 3: Shows Zod error for invalid URL ---
  it("displays a validation error for an invalid image URL", async () => {
    render(<ArtworkCreateForm />);

    fillForm({ "Image URL": "not-a-url" });

    fireEvent.click(screen.getByText("Create artwork"));

    await waitFor(() => {
      expect(screen.getByText("Image URL must be a valid URL")).toBeInTheDocument();
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  // --- Test 4: Clears field error when user types ---
  it("clears the field error when the user modifies the field", async () => {
    render(<ArtworkCreateForm />);

    // Submit empty to trigger errors
    fireEvent.click(screen.getByText("Create artwork"));

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
    });

    // Type in the title field
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Something" },
    });

    // Error for title should disappear
    expect(screen.queryByText("Title is required")).not.toBeInTheDocument();
  });

  // --- Test 5: Calls fetch POST with correct payload ---
  it("calls fetch with POST method and correct body on valid submit", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });

    render(<ArtworkCreateForm />);
    fillForm();

    fireEvent.click(screen.getByText("Create artwork"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/artworks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Mona Lisa",
          imageUrl: "https://example.com/mona.jpg",
          creationYear: 1503,
          artistId: 1,
          collectionId: 2,
        }),
      });
    });
  });

  // --- Test 6: Redirects after successful creation ---
  it("redirects to /admin/artworks after successful creation", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });

    render(<ArtworkCreateForm />);
    fillForm();

    fireEvent.click(screen.getByText("Create artwork"));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/admin/artworks?success=created");
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  // --- Test 7: Shows API error message ---
  it("displays an error message when the API returns an error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: "Duplicate title" }),
    });

    render(<ArtworkCreateForm />);
    fillForm();

    fireEvent.click(screen.getByText("Create artwork"));

    await waitFor(() => {
      expect(screen.getByText("Duplicate title")).toBeInTheDocument();
    });
  });

  // --- Test 8: Shows fallback error when API returns no JSON body ---
  it("displays a fallback error when the API response has no JSON body", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.reject(),
    });

    render(<ArtworkCreateForm />);
    fillForm();

    fireEvent.click(screen.getByText("Create artwork"));

    await waitFor(() => {
      expect(
        screen.getByText("Error while creating the artwork.")
      ).toBeInTheDocument();
    });
  });

  // --- Test 9: Shows network error when fetch throws ---
  it("displays a network error when fetch throws", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network failure"));

    render(<ArtworkCreateForm />);
    fillForm();

    fireEvent.click(screen.getByText("Create artwork"));

    await waitFor(() => {
      expect(
        screen.getByText("Network error. Please try again in a few seconds.")
      ).toBeInTheDocument();
    });
  });
});