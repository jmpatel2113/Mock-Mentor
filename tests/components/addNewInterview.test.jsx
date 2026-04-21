import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AddNewInterview from "@/app/dashboard/_components/addNewInterview";
import { createFreeStatus } from "../helpers/mockData";

const { pushMock, toastMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  toastMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("sonner", () => ({
  toast: toastMock,
}));

describe("AddNewInterview", () => {
  beforeEach(() => {
    pushMock.mockReset();
    toastMock.mockReset();
    global.fetch = vi.fn();
  });

  it("opens the dialog when creation is allowed", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => createFreeStatus(),
    });

    render(<AddNewInterview />);

    fireEvent.click(await screen.findByText("Create a tailored practice round"));

    expect(await screen.findByText("Tell Mock Mentor what role you are preparing for.")).toBeInTheDocument();
  });

  it("redirects to upgrade when quota is exhausted", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => createFreeStatus({ remainingInterviews: 0, canCreate: false }),
    });

    render(<AddNewInterview />);

    fireEvent.click(await screen.findByText("Create a tailored practice round"));

    expect(toastMock).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith("/upgrade");
  });

  it("submits interview creation and routes to the interview", async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => createFreeStatus(),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ mockId: "mock-id" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => createFreeStatus({ usedInterviews: 1, remainingInterviews: 1 }),
      });

    render(<AddNewInterview />);

    fireEvent.click(await screen.findByText("Create a tailored practice round"));
    fireEvent.change(screen.getByPlaceholderText("Ex. Frontend Engineer"), { target: { value: "Frontend Engineer" } });
    fireEvent.change(screen.getByPlaceholderText("Ex. React, Next.js, design systems, accessibility, API integrations"), { target: { value: "React" } });
    fireEvent.change(screen.getByPlaceholderText("Ex. 3"), { target: { value: "3" } });
    fireEvent.click(screen.getByRole("button", { name: /start interview/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard/interview/mock-id");
    });
  });
});
