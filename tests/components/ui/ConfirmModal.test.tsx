import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmModal from "@/components/ui/ConfirmModal";

describe("ConfirmModal", () => {
  const defaultProps = {
    isOpen: true,
    title: "Delete Artwork",
    message: "Are you sure?",
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = "";
  });

  // --- Test 1: Renders nothing when isOpen is false ---
  it("renders nothing when isOpen is false", () => {
    render(<ConfirmModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText("Delete Artwork")).not.toBeInTheDocument();
  });

  // --- Test 2: Displays the title and message ---
  it("displays the title and message when open", () => {
    render(<ConfirmModal {...defaultProps} />);

    expect(screen.getByText("Delete Artwork")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  // --- Test 3: Calls onConfirm on Delete click ---
  it("calls onConfirm when clicking the confirm button", () => {
    render(<ConfirmModal {...defaultProps} />);

    fireEvent.click(screen.getByText("Delete"));

    expect(defaultProps.onConfirm).toHaveBeenCalledOnce();
  });

  // --- Test 4: Calls onCancel on Cancel click ---
  it("calls onCancel when clicking the cancel button", () => {
    render(<ConfirmModal {...defaultProps} />);

    fireEvent.click(screen.getByText("Cancel"));

    expect(defaultProps.onCancel).toHaveBeenCalledOnce();
  });

  // --- Test 5: Calls onCancel on overlay click ---
  it("calls onCancel when clicking the overlay", () => {
    render(<ConfirmModal {...defaultProps} />);

    // The overlay is the parent div with the fixed class
    const overlay = screen.getByText("Delete Artwork").closest(".fixed");
    fireEvent.click(overlay!);

    expect(defaultProps.onCancel).toHaveBeenCalledOnce();
  });

  // --- Test 6: Does NOT close when clicking inside the modal ---
  it("does not call onCancel when clicking inside the modal box", () => {
    render(<ConfirmModal {...defaultProps} />);

    // Click on the message text (inside the modal)
    fireEvent.click(screen.getByText("Are you sure?"));

    expect(defaultProps.onCancel).not.toHaveBeenCalled();
  });

  // --- Test 7: Shows "Deleting..." when isLoading ---
  it("shows loading state and disables buttons when isLoading", () => {
    render(<ConfirmModal {...defaultProps} isLoading={true} />);

    expect(screen.getByText("Deleting...")).toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();

    // Both buttons should be disabled
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  // --- Test 8: Blocks body scroll when open ---
  it("blocks body scroll when open", () => {
    render(<ConfirmModal {...defaultProps} />);

    expect(document.body.style.overflow).toBe("hidden");
  });

  // --- Test 9: Restores body scroll when closed ---
  it("restores body scroll when closed", () => {
    const { rerender } = render(<ConfirmModal {...defaultProps} />);
    expect(document.body.style.overflow).toBe("hidden");

    rerender(<ConfirmModal {...defaultProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe("");
  });

    // --- Test 10: Closes on Escape key ---
  it("calls onCancel when pressing Escape", () => {
    render(<ConfirmModal {...defaultProps} />);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(defaultProps.onCancel).toHaveBeenCalledOnce();
  });

  // --- Test 11: Has correct dialog accessibility attributes ---
  it("has correct dialog accessibility attributes", () => {
    render(<ConfirmModal {...defaultProps} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby");
    expect(dialog).toHaveAttribute("aria-describedby");

    // Verify the linked elements contain the right text
    const labelId = dialog.getAttribute("aria-labelledby")!;
    const descId = dialog.getAttribute("aria-describedby")!;
    expect(document.getElementById(labelId)?.textContent).toBe("Delete Artwork");
    expect(document.getElementById(descId)?.textContent).toBe("Are you sure?");
  });
});