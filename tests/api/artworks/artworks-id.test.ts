import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, PATCH, DELETE } from "@/app/api/artworks/[id]/route";

// --- Mock artworkService ---
const mockFindById = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();

vi.mock("@/lib/services/artwork.service", () => ({
  artworkService: {
    findById: (...args: unknown[]) => mockFindById(...args),
    update: (...args: unknown[]) => mockUpdate(...args),
    delete: (...args: unknown[]) => mockDelete(...args),
  },
}));

// --- Mock auth middleware ---
const mockRequireAuth = vi.fn();

vi.mock("@/lib/middleware/auth.middleware", () => ({
  requireAuth: (...args: unknown[]) => mockRequireAuth(...args),
}));

// --- Mock logger ---
vi.mock("@/lib/utils/logger", () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn() },
}));

// --- Helper: build params object ---
function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe("GET /api/artworks/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Test 1: Returns artwork by id ---
  it("should return 200 with the artwork", async () => {
    mockFindById.mockResolvedValueOnce({ id: 1, title: "Mona Lisa" });

    const request = new NextRequest("http://localhost:3000/api/artworks/1");
    const response = await GET(request, makeParams("1"));

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.data.title).toBe("Mona Lisa");
  });

  // --- Test 2: Returns 404 if artwork not found ---
  it("should return 404 if artwork does not exist", async () => {
    mockFindById.mockResolvedValueOnce(null);

    const request = new NextRequest("http://localhost:3000/api/artworks/999");
    const response = await GET(request, makeParams("999"));

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Artwork not found");
  });

  // --- Test 3: Returns 400 for invalid id ---
  it("should return 400 for a non-numeric id", async () => {
    const request = new NextRequest("http://localhost:3000/api/artworks/abc");
    const response = await GET(request, makeParams("abc"));

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Invalid artwork id");
  });
});

describe("PATCH /api/artworks/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Test 4: Returns 401 if not authenticated ---
  it("should return 401 if user is not authenticated", async () => {
    mockRequireAuth.mockRejectedValueOnce(new Error("UNAUTHORIZED"));

    const request = new NextRequest("http://localhost:3000/api/artworks/1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated" }),
    });

    const response = await PATCH(request, makeParams("1"));

    expect(response.status).toBe(401);
  });

  // --- Test 5: Returns 403 if user is VISITOR ---
  it("should return 403 if user role is VISITOR", async () => {
    mockRequireAuth.mockResolvedValueOnce({ userId: "1", role: "VISITOR" });

    const request = new NextRequest("http://localhost:3000/api/artworks/1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated" }),
    });

    const response = await PATCH(request, makeParams("1"));

    expect(response.status).toBe(403);
  });

  // --- Test 6: Returns 400 for invalid body ---
  it("should return 400 if body fails Zod validation", async () => {
    mockRequireAuth.mockResolvedValueOnce({ userId: "1", role: "ADMIN" });

    const request = new NextRequest("http://localhost:3000/api/artworks/1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: "not-a-url" }),
    });

    const response = await PATCH(request, makeParams("1"));

    expect(response.status).toBe(400);
  });

  // --- Test 7: Returns 200 on successful update ---
  it("should return 200 with updated artwork on success", async () => {
    mockRequireAuth.mockResolvedValueOnce({ userId: "1", role: "STAFF" });
    mockUpdate.mockResolvedValueOnce({ id: 1, title: "Updated Title" });

    const request = new NextRequest("http://localhost:3000/api/artworks/1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated Title" }),
    });

    const response = await PATCH(request, makeParams("1"));

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.data.title).toBe("Updated Title");
  });

  // --- Test 8: Returns 404 if artwork not found ---
  it("should return 404 if artwork does not exist", async () => {
    mockRequireAuth.mockResolvedValueOnce({ userId: "1", role: "ADMIN" });
    mockUpdate.mockRejectedValueOnce(new Error("Artwork not found"));

    const request = new NextRequest("http://localhost:3000/api/artworks/999", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated" }),
    });

    const response = await PATCH(request, makeParams("999"));

    expect(response.status).toBe(404);
  });
});

describe("DELETE /api/artworks/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Test 9: Returns 401 if not authenticated ---
  it("should return 401 if user is not authenticated", async () => {
    mockRequireAuth.mockRejectedValueOnce(new Error("UNAUTHORIZED"));

    const request = new NextRequest("http://localhost:3000/api/artworks/1", {
      method: "DELETE",
    });

    const response = await DELETE(request, makeParams("1"));

    expect(response.status).toBe(401);
  });

  // --- Test 10: Returns 200 on successful deletion ---
  it("should return 200 on successful deletion", async () => {
    mockRequireAuth.mockResolvedValueOnce({ userId: "1", role: "ADMIN" });
    mockDelete.mockResolvedValueOnce({ id: 1 });

    const request = new NextRequest("http://localhost:3000/api/artworks/1", {
      method: "DELETE",
    });

    const response = await DELETE(request, makeParams("1"));

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  // --- Test 11: Returns 404 if artwork not found ---
  it("should return 404 if artwork does not exist", async () => {
    mockRequireAuth.mockResolvedValueOnce({ userId: "1", role: "ADMIN" });
    mockDelete.mockRejectedValueOnce(new Error("Artwork not found"));

    const request = new NextRequest("http://localhost:3000/api/artworks/999", {
      method: "DELETE",
    });

    const response = await DELETE(request, makeParams("999"));

    expect(response.status).toBe(404);
  });

  // --- Test 12: Returns 400 for invalid id ---
  it("should return 400 for a non-numeric id", async () => {
    mockRequireAuth.mockResolvedValueOnce({ userId: "1", role: "ADMIN" });

    const request = new NextRequest("http://localhost:3000/api/artworks/abc", {
      method: "DELETE",
    });

    const response = await DELETE(request, makeParams("abc"));

    expect(response.status).toBe(400);
  });
});