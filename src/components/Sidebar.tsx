"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    label: "GENERAL",
    items: [
      { name: "대시보드", href: "/", icon: LayoutDashboard },
      { name: "제안서 생성", href: "/generate", icon: Sparkles },
      { name: "생성 이력", href: "/history", icon: FileText },
    ],
  },
  {
    label: "SUPPORT",
    items: [
      { name: "설정", href: "/settings", icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`glass-sidebar flex flex-col transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[240px]"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white text-sm font-bold shrink-0">
          P
        </div>
        {!collapsed && (
          <span className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
            ProposalAI
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-6">
        {navItems.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                {group.label}
              </p>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? "glass-card text-accent shadow-sm"
                          : "text-[var(--text-secondary)] hover:bg-white/40 hover:text-[var(--text-primary)]"
                      }`}
                    >
                      <item.icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                      {!collapsed && <span>{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 py-4 border-t border-white/30">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-white/40 transition-all w-full"
        >
          {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          {!collapsed && <span>사이드바 접기</span>}
        </button>
      </div>
    </aside>
  );
}
