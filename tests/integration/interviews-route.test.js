/** @vitest-environment node */
import { beforeEach, describe, expect, it, vi } from "vitest";

const authMock = vi.fn();
const currentUserMock = vi.fn();
const selectMock = vi.fn();
const insertMock = vi.fn();
const requestGeminiTextMock = vi.fn();

vi.mock("@clerk/nextjs/server", () => ({
  auth: authMock,
  currentUser: currentUserMock,
}));

vi.mock("@/utils/db", () => ({
  default: {
    select: selectMock,
    insert: insertMock,
  },
}));

vi.mock("@/utils/gemini", () => ({
  requestGeminiText: requestGeminiTextMock,
}));

vi.mock("uuid", () => ({
  v4: () => "mock-uuid",
}));

function createSelectChain(result) {
  return {
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockResolvedValue(result),
      }),
    }),
  };
}

function createInsertChain(result = [{ mockId: "mock-uuid" }]) {
  return {
    values: vi.fn().mockReturnValue({
      returning: vi.fn().mockResolvedValue(result),
    }),
  };
}

describe("POST /api/interviews", () => {
  beforeEach(() => {
    vi.resetModules();
    authMock.mockReset();
    currentUserMock.mockReset();
    selectMock.mockReset();
    insertMock.mockReset();
    requestGeminiTextMock.mockReset();
  });

  it("rejects unauthorized requests", async () => {
    authMock.mockReturnValue({ userId: null });
    const { POST } = await import("@/app/api/interviews/route");
    const response = await POST(new Request("http://localhost/api/interviews", { method: "POST", body: JSON.stringify({}) }));

    expect(response.status).toBe(401);
  });

  it("rejects missing required fields", async () => {
    authMock.mockReturnValue({ userId: "user_123" });
    currentUserMock.mockResolvedValue({ primaryEmailAddress: { emailAddress: "tester@example.com" } });

    const { POST } = await import("@/app/api/interviews/route");
    const response = await POST(new Request("http://localhost/api/interviews", {
      method: "POST",
      body: JSON.stringify({ jobPosition: "Engineer" }),
      headers: { "Content-Type": "application/json" },
    }));

    expect(response.status).toBe(400);
  });

  it("blocks interview creation when quota is exhausted", async () => {
    authMock.mockReturnValue({ userId: "user_123" });
    currentUserMock.mockResolvedValue({ primaryEmailAddress: { emailAddress: "tester@example.com" } });
    selectMock
      .mockReturnValueOnce(createSelectChain([]))
      .mockReturnValueOnce(createSelectChain([
        { createdBy: "tester@example.com", createdOn: "2026-04-10T00:00:00.000Z" },
        { createdBy: "tester@example.com", createdOn: "2026-04-11T00:00:00.000Z" },
      ]));

    const { POST } = await import("@/app/api/interviews/route");
    const response = await POST(new Request("http://localhost/api/interviews", {
      method: "POST",
      body: JSON.stringify({
        jobPosition: "Engineer",
        jobDescription: "React",
        jobExperience: "3",
      }),
      headers: { "Content-Type": "application/json" },
    }));

    expect(response.status).toBe(403);
  });

  it("creates an interview when entitlement and Gemini response are valid", async () => {
    authMock.mockReturnValue({ userId: "user_123" });
    currentUserMock.mockResolvedValue({ primaryEmailAddress: { emailAddress: "tester@example.com" } });
    selectMock
      .mockReturnValueOnce(createSelectChain([]))
      .mockReturnValueOnce(createSelectChain([]));
    insertMock.mockReturnValue(createInsertChain());
    requestGeminiTextMock.mockResolvedValue('[{"Question":"Q1","Answer":"A1"}]');

    const { POST } = await import("@/app/api/interviews/route");
    const response = await POST(new Request("http://localhost/api/interviews", {
      method: "POST",
      body: JSON.stringify({
        jobPosition: "Engineer",
        jobDescription: "React",
        jobExperience: "3",
      }),
      headers: { "Content-Type": "application/json" },
    }));

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ mockId: "mock-uuid" });
  });
});
