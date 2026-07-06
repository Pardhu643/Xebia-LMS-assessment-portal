"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../lib/context";
import { UserRole } from "../types";
import { Lock, Mail, User, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { login, currentUser, loading } = useApp();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("teacher");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && currentUser) {
      router.push("/dashboard");
    }
  }, [currentUser, loading, router]);

  const handleQuickLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === "teacher") {
      setEmail("teacher@lms.com");
      setPassword("teacher123");
    } else {
      setEmail("learner@lms.com");
      setPassword("learner123");
    }
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const success = await login(email, password, role);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Invalid email, password, or role combination.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3F7] flex items-center justify-center p-4 relative overflow-hidden select-none">
      <style>{`
        @keyframes float-slow-1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes float-slow-2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes float-slow-3 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
        .animate-float-1 {
          animation: float-slow-1 6s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float-slow-2 8s ease-in-out infinite;
        }
        .animate-float-3 {
          animation: float-slow-3 7s ease-in-out infinite;
        }
      `}</style>

      {/* Decorative Educational Illustrations */}
      {/* Top Left Dotted Grid (Secondary) */}
      <div className="absolute top-10 left-10 pointer-events-none select-none hidden md:block">
        <svg width="76" height="110" viewBox="0 0 64 96" fill="none" className="opacity-[0.22] text-[#6C1D5F]">
          <pattern id="dotGridTL" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.75" fill="currentColor" />
          </pattern>
          <rect width="64" height="96" fill="url(#dotGridTL)" />
        </svg>
      </div>

      {/* Floating Open Book TL (Foreground) */}
      <div className="absolute top-24 left-[20%] pointer-events-none select-none hidden md:block opacity-[0.32] text-[#6C1D5F] animate-float-1">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      </div>

      {/* Outlined Triangle TL (Secondary) */}
      <div className="absolute top-44 left-[11%] pointer-events-none select-none hidden md:block opacity-[0.22] text-[#6C1D5F] animate-float-3">
        <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
          <polygon points="8,2 14,13 2,13" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Left-Middle: Paper airplane with dotted loop path (Foreground) */}
      <div className="absolute left-[8%] top-[35%] pointer-events-none select-none hidden md:block opacity-[0.32]">
        <svg width="250" height="180" viewBox="0 0 220 160" fill="none">
          <path d="M10,140 C60,130 100,150 110,100 C120,50 70,30 90,55 C110,80 150,75 200,35" stroke="#6C1D5F" strokeWidth="1.3" strokeDasharray="4 4" fill="none" />
          <g transform="translate(195, 23) rotate(-15)">
            <path d="M0,0 L20,7 L12,10 L10,16 L7,12 Z" stroke="#6C1D5F" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>

      {/* Certificate / Shield on Left (Foreground) */}
      <div className="absolute top-[58%] left-[9%] pointer-events-none select-none hidden md:block opacity-[0.32] text-[#6C1D5F] animate-float-3">
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 8v8" />
          <path d="M9 11h6" />
        </svg>
      </div>

      {/* Bottom Left: Huge soft circular overlay (Background) */}
      <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-[#6C1D5F]/[0.06] pointer-events-none select-none hidden md:block" />

      {/* Bottom Left Composition: Plant, Books, Stationery Cup (Foreground) */}
      <div className="absolute left-6 bottom-6 pointer-events-none select-none hidden md:block opacity-[0.35] animate-float-2">
        <svg width="300" height="240" viewBox="0 0 220 180" fill="none">
          {/* Plant Pot */}
          <path d="M165,115 L155,145 L185,145 L175,115 Z" stroke="#6C1D5F" strokeWidth="1.25" fill="none" />
          {/* Plant leaves */}
          <path d="M170,115 C170,90 160,80 150,75 C162,85 168,100 170,115 Z" stroke="#6C1D5F" strokeWidth="1.25" fill="none" />
          <path d="M170,115 C170,85 180,75 190,70 C178,80 172,95 170,115 Z" stroke="#6C1D5F" strokeWidth="1.25" fill="none" />
          <path d="M170,115 C160,105 140,105 135,110 C148,110 160,112 170,115 Z" stroke="#6C1D5F" strokeWidth="1.25" fill="none" />
          <path d="M170,115 C180,105 200,105 205,110 C192,110 180,112 170,115 Z" stroke="#6C1D5F" strokeWidth="1.25" fill="none" />
          <path d="M170,115 C170,95 170,80 170,70 C165,85 167,100 170,115 Z" stroke="#6C1D5F" strokeWidth="1.25" fill="none" />
          
          {/* Stack of Books */}
          {/* Bottom book */}
          <path d="M50,145 L140,145 L135,160 L45,160 Z" stroke="#6C1D5F" strokeWidth="1.25" fill="none" />
          <path d="M140,145 C138,150 137,155 135,160" stroke="#6C1D5F" strokeWidth="1.25" fill="none" />
          <path d="M45,160 L50,157 L132,157" stroke="#6C1D5F" strokeWidth="0.8" />
          {/* Middle book */}
          <path d="M55,130 L135,130 L130,145 L50,145 Z" stroke="#6C1D5F" strokeWidth="1.25" fill="none" />
          <path d="M135,130 C133,135 132,140 130,145" stroke="#6C1D5F" strokeWidth="1.25" fill="none" />
          <path d="M50,145 L55,142 L127,142" stroke="#6C1D5F" strokeWidth="0.8" />
          {/* Top book */}
          <path d="M60,115 L125,115 L120,130 L55,130 Z" stroke="#6C1D5F" strokeWidth="1.25" fill="none" />
          <path d="M125,115 C123,120 122,125 120,130" stroke="#6C1D5F" strokeWidth="1.25" fill="none" />
          <path d="M55,130 L60,127 L117,127" stroke="#6C1D5F" strokeWidth="0.8" />
          
          {/* Stationery Cup */}
          <path d="M10,120 L15,160 L35,160 L40,120 Z" stroke="#6C1D5F" strokeWidth="1.25" fill="none" />
          {/* Cup mesh pattern */}
          <path d="M10,120 L35,160 M40,120 L15,160 M10,130 L35,160 M40,130 L15,160" stroke="#6C1D5F" strokeWidth="0.6" opacity="0.6" />
          {/* Pencils */}
          <line x1="18" y1="120" x2="10" y2="100" stroke="#6C1D5F" strokeWidth="1.25" />
          <polygon points="10,100 8,103 12,104" stroke="#6C1D5F" strokeWidth="0.8" fill="none" />
          <line x1="25" y1="120" x2="22" y2="95" stroke="#6C1D5F" strokeWidth="1.25" />
          <polygon points="22,95 19,98 24,99" stroke="#6C1D5F" strokeWidth="0.8" fill="none" />
          <line x1="32" y1="120" x2="38" y2="102" stroke="#6C1D5F" strokeWidth="1.25" />
          <polygon points="38,102 35,105 39,106" stroke="#6C1D5F" strokeWidth="0.8" fill="none" />
        </svg>
      </div>

      {/* Little circle bottom-left-middle (Secondary) */}
      <div className="absolute bottom-40 left-[26%] pointer-events-none select-none hidden md:block opacity-[0.22] text-[#6C1D5F] animate-float-3">
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      </div>

      {/* Top Right: Huge soft circular overlay (Background) */}
      <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-[#6C1D5F]/[0.06] pointer-events-none select-none hidden md:block" />

      {/* Middle Right: Soft circular overlay (Background) */}
      <div className="absolute right-[-100px] top-[45%] w-72 h-72 rounded-full bg-[#6C1D5F]/[0.04] pointer-events-none select-none hidden lg:block" />

      {/* Top Right: Dotted Grid (Secondary) */}
      <div className="absolute top-10 right-[15%] pointer-events-none select-none hidden md:block opacity-[0.22] text-[#6C1D5F]">
        <svg width="90" height="90" viewBox="0 0 80 80" fill="none">
          <pattern id="dotGridTR" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.75" fill="currentColor" />
          </pattern>
          <rect width="80" height="80" fill="url(#dotGridTR)" />
        </svg>
      </div>

      {/* Notebook Outline on Right (Foreground) */}
      <div className="absolute top-[28%] right-[12%] pointer-events-none select-none hidden md:block opacity-[0.32] text-[#6C1D5F] animate-float-2">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="15" height="20" rx="1.5" />
          <line x1="2" y1="5" x2="5" y2="5" />
          <line x1="2" y1="9" x2="5" y2="9" />
          <line x1="2" y1="13" x2="5" y2="13" />
          <line x1="2" y1="17" x2="5" y2="17" />
        </svg>
      </div>

      {/* Outlined cross TR (Secondary) */}
      <div className="absolute top-36 right-[24%] pointer-events-none select-none hidden md:block opacity-[0.22] text-[#6C1D5F] animate-float-2">
        <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
          <path d="M2,2 L10,10 M10,2 L2,10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
      </div>

      {/* Outlined Circle TR (Secondary) */}
      <div className="absolute top-48 right-[10%] pointer-events-none select-none hidden md:block opacity-[0.22] text-[#6C1D5F] animate-float-3">
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      </div>

      {/* Ruler and Pencil composition (Foreground) */}
      <div className="absolute top-[55%] right-[11%] pointer-events-none select-none hidden md:block opacity-[0.32] text-[#6C1D5F] animate-float-1">
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2l4 4-15 15-4 1 1-4Z" />
          <line x1="6" y1="18" x2="10" y2="14" strokeWidth="1" />
          <line x1="8" y1="16" x2="12" y2="12" strokeWidth="1" />
          <line x1="10" y1="14" x2="14" y2="10" strokeWidth="1" />
        </svg>
      </div>

      {/* Bottom Right: Dotted Grid (Secondary) */}
      <div className="absolute bottom-10 right-10 pointer-events-none select-none hidden md:block opacity-[0.22] text-[#6C1D5F]">
        <svg width="76" height="76" viewBox="0 0 64 64" fill="none">
          <pattern id="dotGridBR" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="currentColor" />
          </pattern>
          <rect width="64" height="64" fill="url(#dotGridBR)" />
        </svg>
      </div>

      {/* Bottom Right: Graduation Cap (Foreground) */}
      <div className="absolute bottom-[24%] right-[10%] pointer-events-none select-none hidden md:block opacity-[0.35] text-[#6C1D5F] animate-float-1">
        <svg width="76" height="76" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12,4 22,9 12,14 2,9" />
          <path d="M6,11 v4 c0,1.5 2,2.5 6,2.5 s6,-1 6,-2.5 v-4" />
          <path d="M20,9.5 v6" />
        </svg>
      </div>

      {/* Bottom Right: Open book illustration (Foreground) */}
      <div className="absolute bottom-12 right-[22%] pointer-events-none select-none hidden md:block opacity-[0.32] text-[#6C1D5F] animate-float-3">
        <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      </div>

      {/* Horizontal dotted learning path behind cap (Secondary) */}
      <div className="absolute right-[12%] bottom-[30%] pointer-events-none select-none hidden lg:block opacity-[0.08]">
        <svg width="240" height="80" viewBox="0 0 240 80" fill="none">
          <path d="M10,40 Q90,75 160,25 T230,50" stroke="#6C1D5F" strokeWidth="1.25" strokeDasharray="5 5" fill="none" />
        </svg>
      </div>

      {/* The Centralized Login Card */}
      <div className="w-full max-w-[480px] bg-white border border-border/80 rounded-2xl shadow-[0_16px_50px_-6px_rgba(108,29,95,0.14),0_10px_25px_-8px_rgba(108,29,95,0.06)] p-10 animate-fadeIn z-10">
        
        {/* Centered Logo */}
        <div className="flex justify-center mb-5">
          <Image
            src="/images/xebia-logo.png"
            alt="Xebia Logo"
            width={56}
            height={56}
            className="object-contain rounded-full"
            style={{ width: "auto", height: "auto" }}
            priority
          />
        </div>

        {/* Headings */}
        <h1 className="text-xl font-bold text-gray-900 text-center tracking-tight">Welcome to Xebia LMS</h1>
        <p className="text-[10px] text-[#6C1D5F] font-black uppercase tracking-wider text-center mt-1">Teacher & Learner Space</p>

        {/* Login Form body */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-start gap-2 text-xs font-bold text-rose-600 animate-fadeIn">
              <span>{error}</span>
            </div>
          )}

          {/* Role selector tabs */}
          <div className="grid grid-cols-2 bg-[#F7F8FC] border border-border/80 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => handleQuickLogin("teacher")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                role === "teacher"
                  ? "bg-[#F5EEF7] text-[#6C1D5F] border border-[#6C1D5F]/20 shadow-3xs"
                  : "text-text-muted hover:text-foreground"
              }`}
            >
              <User size={14} className={role === "teacher" ? "text-[#6C1D5F]" : "text-text-muted"} /> Teacher Portal
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("learner")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                role === "learner"
                  ? "bg-[#F5EEF7] text-[#6C1D5F] border border-[#6C1D5F]/20 shadow-3xs"
                  : "text-text-muted hover:text-foreground"
              }`}
            >
              <User size={14} className={role === "learner" ? "text-[#6C1D5F]" : "text-text-muted"} /> Learner Portal
            </button>
          </div>

          <div className="space-y-4">
            {/* Email input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-wider block">Email Address</label>
              <div className="flex items-center gap-3 bg-[#F7F8FC] border border-border rounded-xl px-3.5 py-3 transition-all focus-within:border-primary focus-within:bg-white focus-within:ring-1 focus-within:ring-primary">
                <Mail size={16} className="text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. teacher@lms.com"
                  className="bg-transparent border-none outline-none text-xs w-full text-foreground placeholder:text-text-muted font-semibold"
                  required
                />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-wider block">Password</label>
              <div className="flex items-center gap-3 bg-[#F7F8FC] border border-border rounded-xl px-3.5 py-3 transition-all focus-within:border-[#6C1D5F] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#6C1D5F]">
                <Lock size={16} className="text-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-transparent border-none outline-none text-xs w-full text-foreground placeholder:text-text-muted font-semibold"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#6C1D5F] hover:bg-[#5C1550] text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wide cursor-pointer transition-all shadow-xs flex items-center justify-center relative mt-6"
          >
            <span>Sign In to LMS</span>
            <span className="absolute right-4">
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowRight size={14} />
              )}
            </span>
          </button>

          {/* Presets Divider */}
          <div className="relative flex py-3 items-center justify-center my-4">
            <div className="flex-grow border-t border-border/50"></div>
            <span className="flex-shrink mx-4 text-[9px] font-black text-text-muted uppercase tracking-widest">or</span>
            <div className="flex-grow border-t border-border/50"></div>
          </div>

          {/* Presets presets */}
          <div className="text-center">
            <span className="text-[9px] font-black text-text-muted uppercase tracking-widest block mb-2">Quick Login Presets</span>
            <div className="flex justify-center items-center gap-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleQuickLogin("teacher")}
                className="text-[#6C1D5F] hover:text-[#5C1550] cursor-pointer hover:underline"
              >
                Teacher Preset
              </button>
              <span className="text-border">|</span>
              <button
                type="button"
                onClick={() => handleQuickLogin("learner")}
                className="text-[#6C1D5F] hover:text-[#5C1550] cursor-pointer hover:underline"
              >
                Learner Preset
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
