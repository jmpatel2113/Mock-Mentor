import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Upgrade from "@/app/upgrade/page";
import { createPaidStatus } from "../helpers/mockData";

vi.mock("@/app/dashboard/_components/header", () => ({
  default: () => <div>Header</div>,
}));

describe("Upgrade page", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("renders billing portal controls for subscribed users", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => createPaidStatus(),
    });

    render(<Upgrade />);

    expect(await screen.findByText("Manage your existing subscription")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open billing portal/i })).toBeInTheDocument();
  });

  it("starts checkout when a plan is selected", async () => {
    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { href: "" },
    });

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => createPaidStatus({ canManageBilling: false }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ url: "https://stripe.test/checkout" }),
      });

    render(<Upgrade />);
    fireEvent.click(await screen.findAllByRole("button", { name: /subscribe/i }).then((buttons) => buttons[0]));

    await waitFor(() => {
      expect(window.location.href).toBe("https://stripe.test/checkout");
    });

    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });
});
