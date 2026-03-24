import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import SuccessToast from "@/components/ui/SuccessToast";

// --- Mock next/navigation ---
const mockReplace = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => mockSearchParams,
}));

describe("SuccessToast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // --- Test 1: Renders nothing without ?success= param ---
  it("renders nothing when there is no success param", () => {
    render(<SuccessToast />);

    expect(screen.queryByText(/succès/)).not.toBeInTheDocument();
  });

  // --- Test 2: Displays the correct message for ?success=created ---
  it("displays the created message", () => {
    mockSearchParams = new URLSearchParams("success=created");

    render(<SuccessToast />);

    expect(screen.getByText("Artwork créé avec succès.")).toBeInTheDocument();
  });

  // --- Test 3: Displays the correct message for ?success=updated ---
  it("displays the updated message", () => {
    mockSearchParams = new URLSearchParams("success=updated");

    render(<SuccessToast />);

    expect(screen.getByText("Artwork mis à jour avec succès.")).toBeInTheDocument();
  });

  // --- Test 4: Displays the correct message for ?success=deleted ---
  it("displays the deleted message", () => {
    mockSearchParams = new URLSearchParams("success=deleted");

    render(<SuccessToast />);

    expect(screen.getByText("Artwork supprimé avec succès.")).toBeInTheDocument();
  });

  // --- Test 5: Renders nothing for an unknown success value ---
  it("renders nothing for an unknown success key", () => {
    mockSearchParams = new URLSearchParams("success=unknown");

    render(<SuccessToast />);

    expect(screen.queryByText(/succès/)).not.toBeInTheDocument();
  });

  // --- Test 6: Cleans the URL by calling router.replace ---
  it("cleans the success param from the URL", () => {
    mockSearchParams = new URLSearchParams("success=created");

    render(<SuccessToast />);

    expect(mockReplace).toHaveBeenCalledOnce();
    expect(mockReplace).toHaveBeenCalledWith(
      expect.not.stringContaining("success="),
      { scroll: false }
    );
  });

  // --- Test 7: Auto-dismisses after 3 seconds ---
  it("disappears after 3 seconds", () => {
    mockSearchParams = new URLSearchParams("success=deleted");

    render(<SuccessToast />);
    expect(screen.getByText("Artwork supprimé avec succès.")).toBeInTheDocument();

    // Fast-forward 3 seconds
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByText("Artwork supprimé avec succès.")).not.toBeInTheDocument();
  });

  // --- Test 8: Still visible before 3 seconds ---
  it("is still visible before 3 seconds", () => {
    mockSearchParams = new URLSearchParams("success=created");

    render(<SuccessToast />);

    // Fast-forward only 2 seconds
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText("Artwork créé avec succès.")).toBeInTheDocument();
  });
});