import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UsageOverview from "@/app/dashboard/_components/usageOverview";
import { createFreeStatus, createPaidStatus } from "../helpers/mockData";

describe("UsageOverview", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("renders the free plan state", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => createFreeStatus({ usedInterviews: 1, remainingInterviews: 1 }),
    });

    render(<UsageOverview />);

    expect(await screen.findByText("Free plan")).toBeInTheDocument();
    expect(screen.getByText("Used")).toBeInTheDocument();
    expect(screen.getByText("Remaining")).toBeInTheDocument();
  });

  it("renders the paid plan state", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => createPaidStatus(),
    });

    render(<UsageOverview />);

    expect(await screen.findByText("monthly subscription")).toBeInTheDocument();
    expect(screen.getByText("16")).toBeInTheDocument();
  });
});
