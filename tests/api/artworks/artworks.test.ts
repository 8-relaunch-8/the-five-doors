import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/artworks/route";

// --- Mock artworkService ---
const mockFindAll = vi.fn();
const mockCreate = vi.fn();

vi.mock("@/lib/services/artwork.service", () => ({
  artworkService: {
    findAll: (...args: unknown[]) => mockFindAll(...args),
    create: (...args: unknown[]) => mockCreate(...args),
  },
}));

// --- Mock auth middleware ---
const mockRequireAuth = vi.fn();

vi.mock("@/lib/middleware/auth.middleware", () => ({
  requireAuth: (...args: unknown[]) => mockRequireAuth(...args),
}));

// --- Mock logger (silence logs in tests) ---
vi.mock("@/lib/utils/logger", () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn() },
}));

describe("GET /api/artworks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Test 1: Returns paginated artworks ---
  it("should return 200 with paginated artworks", async () => {
    mockFindAll.mockResolvedValueOnce({
      artworks: [{ id: 1, title: "Mona Lisa" }],
      total: 1,
    });

    const request = new NextRequest("http://localhost:3000/api/artworks?page=1&limit=10");
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.data).toHaveLength(1);
    expect(data.meta).toEqual({ page: 1, limit: 10, total: 1, totalPages: 1 });
  });

  // --- Test 2: Returns 400 for invalid pagination params ---
  it("should return 400 for invalid pagination parameters", async () => {
    const request = new NextRequest("http://localhost:3000/api/artworks?page=-1&limit=0");
    const response = await GET(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Invalid pagination parameters");
  });

  // --- Test 3: Returns 400 if limit exceeds 100 ---
  it("should return 400 if limit exceeds 100", async () => {
    const request = new NextRequest("http://localhost:3000/api/artworks?page=1&limit=200");
    const response = await GET(request);

    expect(response.status).toBe(400);
  });
});

describe("POST /api/artworks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validBody = {
    title: "Starry Night",
    imageUrl: "https://example.com/starry.jpg",
    creationYear: 1889,
    artistId: 1,
    collectionId: 2,
  };

  // --- Test 4: Returns 401 if not authenticated ---
  it("should return 401 if user is not authenticated", async () => {
    mockRequireAuth.mockRejectedValueOnce(new Error("UNAUTHORIZED"));

    const request = new NextRequest("http://localhost:3000/api/artworks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe("Unauthorized");
  });

  // --- Test 5: Returns 403 if user is VISITOR ---
  it("should return 403 if user role is VISITOR", async () => {
    mockRequireAuth.mockResolvedValueOnce({ userId: "1", role: "VISITOR" });

    const request = new NextRequest("http://localhost:3000/api/artworks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });

    const response = await POST(request);

    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toBe("Forbidden");
  });

  // --- Test 6: Returns 400 for invalid body (Zod validation) ---
  it("should return 400 if body fails Zod validation", async () => {
    mockRequireAuth.mockResolvedValueOnce({ userId: "1", role: "ADMIN" });

    const request = new NextRequest("http://localhost:3000/api/artworks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "" }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Validation failed");
  });

  // --- Test 7: Returns 201 on successful creation ---
  it("should return 201 with created artwork on success", async () => {
    mockRequireAuth.mockResolvedValueOnce({ userId: "1", role: "ADMIN" });
    mockCreate.mockResolvedValueOnce({ id: 1, ...validBody });

    const request = new NextRequest("http://localhost:3000/api/artworks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.data.title).toBe("Starry Night");
    expect(mockCreate).toHaveBeenCalledWith(validBody);
  });

  // --- Test 8: Returns 409 if artwork already exists ---
  it("should return 409 if artwork already exists", async () => {
    mockRequireAuth.mockResolvedValueOnce({ userId: "1", role: "ADMIN" });
    mockCreate.mockRejectedValueOnce(
      new Error("An artwork with this title by this artist already exists")
    );

    const request = new NextRequest("http://localhost:3000/api/artworks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });

    const response = await POST(request);

    expect(response.status).toBe(409);
    const data = await response.json();
    expect(data.error).toContain("already exists");
  });
});