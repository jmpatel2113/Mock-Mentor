"use client"

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/faq", label: "FAQ" },
  { href: "/upgrade", label: "Upgrade" },
  { href: "/howItWorks", label: "How It Works" },
];

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="page-content pb-0">
      <div className="surface-panel flex flex-col gap-4 rounded-[32px] px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold uppercase tracking-[0.3em] text-white">
            MM
          </div>
          <div>
            <div className="font-semibold tracking-tight text-slate-900">Mock Mentor</div>
            <div className="text-sm text-slate-500">Practice with structure, not guesswork.</div>
          </div>
        </Link>

        <nav className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all",
                isActive(pathname, item.href)
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-[#efe8da] hover:text-slate-900"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="rounded-full bg-[#14636e] px-5 text-white hover:bg-[#0f4d56]">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="rounded-full border border-[#d7cfbf] bg-white px-2 py-2 shadow-sm">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
