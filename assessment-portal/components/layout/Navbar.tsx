"use client";

import React from "react";
import { useApp } from "../../lib/context";
import { Menu, Bell, Search, Settings } from "lucide-react";

interface NavbarProps {
  onMenuToggle: () => void;
  collapsed: boolean;
}

export default function Navbar({ onMenuToggle, collapsed }: NavbarProps) {
  const { currentUser } = useApp();

  const userRole = currentUser?.role || "learner";
  const userName = currentUser?.name || "User";
  const userAvatar = currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop";

  return (
    <header className="bg-white border-b border-border h-20 px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Mobile Menu Trigger & Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-foreground hover:bg-[#F7F8FC]"
        >
          <Menu size={20} />
        </button>

        {/* Global search widget */}
        <div className="hidden md:flex items-center gap-2 bg-[#F7F8FC] border border-border rounded-xl px-3.5 py-2 w-72 transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
          <Search size={18} className="text-text-muted" />
          <input
            type="text"
            placeholder="Search classes, assessments, materials..."
            className="bg-transparent border-none outline-none text-xs w-full text-foreground placeholder:text-text-muted"
          />
        </div>
      </div>

      {/* Right side Profile controls */}
      <div className="flex items-center gap-4">
        {/* Mock Notification bell */}
        <button className="relative p-2 rounded-xl text-text-muted hover:bg-[#F7F8FC] hover:text-primary transition-all">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cta" />
        </button>

        <button className="p-2 rounded-xl text-text-muted hover:bg-[#F7F8FC] hover:text-primary transition-all">
          <Settings size={20} />
        </button>

        <div className="h-8 w-px bg-border mx-1" />

        {/* Profile Card */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="font-bold text-sm text-foreground leading-none">{userName}</span>
            <span className="text-[10px] text-text-muted font-bold mt-1 capitalize tracking-wide">
              {userRole === "teacher" ? "Instructor" : "Student"}
            </span>
          </div>
          <img
            src={userAvatar}
            alt={userName}
            className="w-10 h-10 rounded-xl border border-border object-cover"
          />
        </div>
      </div>
    </header>
  );
}
