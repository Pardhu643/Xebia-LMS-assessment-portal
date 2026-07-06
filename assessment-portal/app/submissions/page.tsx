"use client";

import React, { useState } from "react";
import { useApp } from "../../lib/context";
import { Submission } from "../../types";
import Filters from "../../components/filters/Filters";
import { FileText, Download, CheckCircle, Clock, Eye, X, Award, FileSpreadsheet, Search } from "lucide-react";

const handleDownloadFile = async (e: React.MouseEvent, fileUrl: string, originalName: string) => {
  e.preventDefault();
  try {
    const res = await fetch(fileUrl);
    if (!res.ok) throw new Error("Failed to fetch file for download");
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = originalName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading file:", error);
    window.open(fileUrl, "_blank");
  }
};

export default function SubmissionsPage() {
  const { currentUser, submissions, assessments, gradeSubmission } = useApp();
  const [timeFilter, setTimeFilter] = useState("All");
  const [batchFilter, setBatchFilter] = useState("All Batches");
  const [search, setSearch] = useState("");

  // Review modal state
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [marksInput, setMarksInput] = useState<number>(0);
  const [feedbackInput, setFeedbackInput] = useState("");
  const [gradingError, setGradingError] = useState("");

  const userRole = currentUser?.role || "learner";

  if (userRole !== "teacher") {
    return (
      <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-xs font-bold text-rose-600">
        Access Denied. Only instructors can review student submissions.
      </div>
    );
  }

  // Filter submissions
  const filteredSubmissions = submissions.filter((s) => {
    if (batchFilter !== "All Batches" && s.batch !== batchFilter) return false;
    if (search && !s.learnerName.toLowerCase().includes(search.toLowerCase()) && !s.assessmentTitle.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleOpenReview = (sub: Submission) => {
    setSelectedSub(sub);
    setMarksInput(sub.marksObtained || 0);
    setFeedbackInput(sub.feedback || "");
    setGradingError("");
  };

  const handleSubmitGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    if (marksInput < 0 || marksInput > selectedSub.totalMarks) {
      setGradingError(`Marks must be between 0 and ${selectedSub.totalMarks}.`);
      return;
    }

    await gradeSubmission(selectedSub.id, marksInput, feedbackInput);
    setSelectedSub(null);
  };

  const handleExportCSV = () => {
    // Generate clean CSV file on client-side and trigger download
    const headers = "Student Name,Assessment,Batch,Subject,Submitted Date,Status,Marks Obtained,Total Marks,Feedback\n";
    const rows = filteredSubmissions.map(s => 
      `"${s.learnerName}","${s.assessmentTitle}","${s.batch}","${s.subject}","${new Date(s.submittedAt).toLocaleDateString()}","${s.status}",${s.marksObtained || "N/A"},${s.totalMarks},"${s.feedback || ""}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `lms_submissions_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Student Submissions</h1>
          <p className="text-xs text-text-muted font-semibold mt-1">Grade interactive MCQ response sets or review attached essay answer sheets.</p>
        </div>

        <Filters
          selectedTime={timeFilter}
          onTimeChange={setTimeFilter}
          selectedBatch={batchFilter}
          onBatchChange={setBatchFilter}
        />
      </div>

      {/* Action panel & search */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="bg-white border border-border p-4 rounded-2xl shadow-xs flex-1 flex items-center gap-3 w-full">
          <Search size={18} className="text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search submissions by student name or quiz title..."
            className="bg-transparent border-none outline-none text-xs w-full text-foreground placeholder:text-text-muted"
          />
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-accent hover:bg-accent-dark text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-all w-full md:w-auto justify-center"
        >
          <FileSpreadsheet size={16} /> Export to CSV
        </button>
      </div>

      {/* Table list */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-xs animate-fadeIn">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-semibold">
            <thead>
              <tr className="bg-[#F7F8FC] border-b border-border text-[10px] font-black uppercase text-text-muted">
                <th className="p-4 sm:p-5">Student Name</th>
                <th className="p-4 sm:p-5">Assessment</th>
                <th className="p-4 sm:p-5">Batch</th>
                <th className="p-4 sm:p-5">Submitted At</th>
                <th className="p-4 sm:p-5">Status</th>
                <th className="p-4 sm:p-5">Marks</th>
                <th className="p-4 sm:p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-foreground">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#F7F8FC]/50 transition-all">
                    <td className="p-4 sm:p-5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-[10px]">
                          {sub.learnerName.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span>{sub.learnerName}</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5">
                      <div>
                        <span className="font-bold block truncate max-w-xs">{sub.assessmentTitle}</span>
                        <span className="text-[10px] text-text-muted block mt-0.5">{sub.subject}</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5">
                      <span className="text-[10px] font-black uppercase text-primary bg-primary/5 px-2.5 py-0.5 rounded-full border border-primary/10">
                        {sub.batch}
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 text-text-muted">
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 sm:p-5">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        sub.status === "marked" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-primary/5 text-primary border-primary/10"
                      }`}>
                        {sub.status === "marked" ? "Graded" : "Review Pending"}
                      </span>
                    </td>
                    <td className="p-4 sm:p-5">
                      {sub.status === "marked" ? (
                        <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded-lg">
                          {sub.marksObtained} / {sub.totalMarks}
                        </span>
                      ) : (
                        <span className="text-text-muted font-bold">-- / {sub.totalMarks}</span>
                      )}
                    </td>
                    <td className="p-4 sm:p-5 text-right">
                      <button
                        onClick={() => handleOpenReview(sub)}
                        className="bg-primary hover:bg-primary-dark text-white font-bold text-[11px] px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs ml-auto"
                      >
                        <Award size={12} /> Review
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-xs font-bold text-text-muted uppercase tracking-wider">
                    No student submissions found matching filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Submission Grading Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-lg animate-fadeIn flex flex-col h-[85vh]">
            <div className="bg-primary p-6 text-white flex justify-between items-center flex-shrink-0">
              <div className="space-y-1">
                <h3 className="font-black text-sm uppercase tracking-wider">Review Answer Sheet</h3>
                <span className="text-xs text-white/70 block">
                  Student: {selectedSub.learnerName} | Batch: {selectedSub.batch}
                </span>
              </div>
              <button onClick={() => setSelectedSub(null)} className="text-white/80 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-6 bg-[#F7F8FC]">
              
              {/* Submission Information */}
              <div className="bg-white border border-border p-6 rounded-2xl space-y-3">
                <h4 className="font-black text-xs text-text-muted uppercase tracking-wider border-b border-border/50 pb-2">
                  Assessment Details
                </h4>
                <div>
                  <span className="font-black text-base text-foreground block">{selectedSub.assessmentTitle}</span>
                  <span className="text-xs text-text-muted font-semibold block mt-0.5">{selectedSub.subject}</span>
                </div>
              </div>

              {/* Student Answers */}
              <div className="space-y-4">
                <h4 className="font-black text-xs text-text-muted uppercase tracking-wider">Student Responses</h4>
                
                {/* Check if student uploaded a file */}
                {selectedSub.submittedFileName ? (
                  <div className="bg-white border border-border p-6 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <FileText size={24} className="text-primary" />
                      <div>
                        <span className="font-bold text-xs text-foreground block">{selectedSub.submittedFileName}</span>
                        <span className="text-[10px] text-text-muted block mt-0.5">Attached Answer Sheet</span>
                      </div>
                    </div>
                    <a
                      href={selectedSub.submittedFileUrl}
                      download
                      onClick={(e) => handleDownloadFile(e, selectedSub.submittedFileUrl || "", selectedSub.submittedFileName || "submission")}
                      className="bg-primary hover:bg-primary-dark text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-xs"
                    >
                      <Download size={14} /> Download File
                    </a>
                  </div>
                ) : (
                  // Map questions and answers
                  Object.keys(selectedSub.answers).map((qId, idx) => {
                    const originalAssessment = assessments.find(a => a.id === selectedSub.assessmentId);
                    const qObj = originalAssessment?.questions.find(q => q.id === qId);

                    return (
                      <div key={qId} className="bg-white border border-border p-6 rounded-2xl space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-primary uppercase">Question {idx + 1}</span>
                          <span className="text-xs font-semibold text-text-muted">{qObj?.marks} Marks</span>
                        </div>
                        <p className="font-bold text-sm text-foreground">{qObj?.text}</p>
                        
                        <div className="border-t border-border/50 pt-3">
                          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Student Answer:</span>
                          <p className="text-xs text-foreground font-semibold bg-[#F7F8FC] p-3 rounded-xl border border-border/50 mt-1 leading-relaxed">
                            {selectedSub.answers[qId]}
                          </p>
                        </div>

                        {qObj?.correctAnswer && (
                          <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-bold">
                            <span>Reference Key:</span>
                            <span className="font-black underline">{qObj.correctAnswer}</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

            </div>

            {/* Grading Form footer */}
            <form onSubmit={handleSubmitGrade} className="p-6 border-t border-border bg-white space-y-4 flex-shrink-0">
              {gradingError && (
                <div className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-3">
                  {gradingError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">Score Awarded</label>
                  <div className="flex items-center gap-2 bg-[#F7F8FC] border border-border rounded-xl px-3.5 py-2.5 transition-all focus-within:border-primary">
                    <input
                      type="number"
                      value={marksInput}
                      onChange={(e) => setMarksInput(Number(e.target.value))}
                      min={0}
                      max={selectedSub.totalMarks}
                      className="bg-transparent border-none outline-none text-sm w-full font-black text-primary text-center"
                      required
                    />
                    <span className="text-xs text-text-muted font-bold">/ {selectedSub.totalMarks}</span>
                  </div>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">Feedback / Comments</label>
                  <input
                    type="text"
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder="Provide constructive feedback..."
                    className="w-full bg-[#F7F8FC] border border-border rounded-xl px-3.5 py-3 text-xs outline-none focus:border-primary font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl text-xs uppercase cursor-pointer shadow-xs text-center w-full transition-all"
                >
                  Publish Score
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
