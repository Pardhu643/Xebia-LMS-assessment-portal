"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "../../lib/context";
import { apiService } from "../../lib/apiService";
import StatCards from "../../components/dashboard/StatCards";
import Filters from "../../components/filters/Filters";
import { useRouter } from "next/navigation";
import { FilePlus, Upload, FolderKanban, CheckSquare, FileText, ArrowRight, Calendar, FileCheck } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser, classes } = useApp();

  const [timeFilter, setTimeFilter] = useState("All");
  const [batchFilter, setBatchFilter] = useState("All Batches");
  const [stats, setStats] = useState<{
    cards: any[];
    recentActivity: any[];
  } | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const userRole = currentUser?.role || "learner";
  const userId = currentUser?.id || "";

  useEffect(() => {
    if (currentUser && currentUser.role === "learner" && currentUser.batch) {
      setBatchFilter(currentUser.batch);
    }
  }, [currentUser]);

  useEffect(() => {
    async function loadStats() {
      setLoadingStats(true);
      try {
        const data = await apiService.getDashboardStats(userRole, userId, timeFilter, batchFilter);
        setStats(data);
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
      } finally {
        setLoadingStats(false);
      }
    }
    if (userId) {
      loadStats();
    }
  }, [userRole, userId, timeFilter, batchFilter]);

  const getStatusBg = (status: string) => {
    if (status === "Graded" || status.startsWith("Score")) return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (status === "Submitted") return "bg-primary/5 text-primary border-primary/10";
    return "bg-amber-50 text-amber-700 border-amber-100";
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Welcome Back, {currentUser?.name}</h1>
          <p className="text-xs text-text-muted font-semibold mt-1">Here&apos;s what is happening with your classes today.</p>
        </div>

        {/* Global timeframe and batch filters */}
        <Filters
          selectedTime={timeFilter}
          onTimeChange={setTimeFilter}
          selectedBatch={batchFilter}
          onBatchChange={setBatchFilter}
          hideBatch={userRole === "learner"}
        />
      </div>

      {/* Stats Cards Section */}
      {loadingStats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-border rounded-2xl p-6 h-28 animate-pulse" />
          ))}
        </div>
      ) : (
        stats && <StatCards cards={stats.cards} />
      )}

      {/* Quick Action Panels */}
      <div className="bg-white border border-border p-6 rounded-2xl shadow-xs">
        <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userRole === "teacher" ? (
            <>
              <button
                onClick={() => router.push("/assessments/create")}
                className="flex items-center gap-4 p-4 border border-border rounded-xl text-left hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <FilePlus size={20} />
                </div>
                <div>
                  <span className="font-bold text-sm text-foreground block">Create Custom Quiz</span>
                  <span className="text-[11px] text-text-muted font-medium mt-0.5 block">Use the build-in creator tool</span>
                </div>
              </button>

              <button
                onClick={() => router.push("/materials")}
                className="flex items-center gap-4 p-4 border border-border rounded-xl text-left hover:border-accent hover:bg-accent/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                  <Upload size={20} />
                </div>
                <div>
                  <span className="font-bold text-sm text-foreground block">Upload Materials</span>
                  <span className="text-[11px] text-text-muted font-medium mt-0.5 block">Upload files for study guide referencing</span>
                </div>
              </button>

              <button
                onClick={() => router.push("/submissions")}
                className="flex items-center gap-4 p-4 border border-border rounded-xl text-left hover:border-cta hover:bg-cta/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-cta/10 flex items-center justify-center text-cta group-hover:bg-cta group-hover:text-white transition-all">
                  <FolderKanban size={20} />
                </div>
                <div>
                  <span className="font-bold text-sm text-foreground block">Review Submissions</span>
                  <span className="text-[11px] text-text-muted font-medium mt-0.5 block">Mark student answers and submit grades</span>
                </div>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push("/assessments")}
                className="flex items-center gap-4 p-4 border border-border rounded-xl text-left hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <CheckSquare size={20} />
                </div>
                <div>
                  <span className="font-bold text-sm text-foreground block">Solve Assessments</span>
                  <span className="text-[11px] text-text-muted font-medium mt-0.5 block">Open active MCQ/written tests</span>
                </div>
              </button>

              <button
                onClick={() => router.push("/materials")}
                className="flex items-center gap-4 p-4 border border-border rounded-xl text-left hover:border-accent hover:bg-accent/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                  <FileText size={20} />
                </div>
                <div>
                  <span className="font-bold text-sm text-foreground block">Reference Files</span>
                  <span className="text-[11px] text-text-muted font-medium mt-0.5 block">View study guides and cheat sheets</span>
                </div>
              </button>

              <button
                onClick={() => router.push("/marks")}
                className="flex items-center gap-4 p-4 border border-border rounded-xl text-left hover:border-[#84117C] hover:bg-[#84117C]/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#84117C]/10 flex items-center justify-center text-[#84117C] group-hover:bg-[#84117C] group-hover:text-white transition-all">
                  <FileCheck size={20} />
                </div>
                <div>
                  <span className="font-bold text-sm text-foreground block">Check Scorecards</span>
                  <span className="text-[11px] text-text-muted font-medium mt-0.5 block">Review marks and teacher feedback</span>
                </div>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Recent Activity & Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity Panel */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-4">
            <h3 className="font-black text-sm text-foreground uppercase tracking-wider">Recent Activity</h3>
            <button
              onClick={() => router.push(userRole === "teacher" ? "/submissions" : "/assessments")}
              className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
            >
              View All <ArrowRight size={14} />
            </button>
          </div>

          {loadingStats ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-14 bg-[#F7F8FC] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : stats && stats.recentActivity.length > 0 ? (
            <div className="divide-y divide-border/30">
              {stats.recentActivity.slice(0, 4).map((activity) => (
                <div key={activity.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="space-y-1">
                    <span className="text-sm font-semibold text-foreground block">{activity.title}</span>
                    <span className="text-xs text-text-muted block">{activity.detail}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${getStatusBg(activity.status)}`}>
                      {activity.status}
                    </span>
                    <span className="text-[11px] text-text-muted font-medium">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs font-bold text-text-muted uppercase tracking-wider">
              No recent activity log found
            </div>
          )}
        </div>

        {/* Classes panel */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-4">
            <h3 className="font-black text-sm text-foreground uppercase tracking-wider">Classes Schedule</h3>
            <button
              onClick={() => router.push("/classes")}
              className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
            >
              View Schedule <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-4">
            {classes.slice(0, 4).map((cls) => (
              <div key={cls.id} className="flex items-start gap-4 p-3 border border-border/50 rounded-xl bg-[#F7F8FC]/50 hover:bg-[#F7F8FC] transition-all">
                <div className="p-2.5 bg-primary/5 border border-primary/10 rounded-lg text-primary">
                  <Calendar size={18} />
                </div>
                <div>
                  <span className="font-bold text-sm text-foreground block">{cls.name}</span>
                  <span className="text-xs text-text-muted block mt-0.5">{cls.subject}</span>
                  <span className="text-[10px] text-text-muted font-bold block mt-1 uppercase tracking-wider">{cls.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
