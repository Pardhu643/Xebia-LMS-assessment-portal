"use client";

import React, { useState } from "react";
import { useApp } from "../../../lib/context";
import { Assessment, Question, QuestionType } from "../../../types";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Eye,
  Check,
  Edit2,
  X,
  FileCheck,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function CreateAssessmentPage() {
  const router = useRouter();
  const { currentUser, saveAssessment } = useApp();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [batch, setBatch] = useState("Batch A");
  const [instructions, setInstructions] = useState("");
  const [questionType, setQuestionType] = useState<QuestionType>("mcq");
  const [deadline, setDeadline] = useState("");

  // Questions builder state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionText, setCurrentQuestionText] = useState("");
  const [currentQuestionMarks, setCurrentQuestionMarks] = useState<number>(10);
  
  // MCQ options state
  const [mcqOptions, setMcqOptions] = useState<string[]>(["", ""]);
  const [correctMcqAnswer, setCorrectMcqAnswer] = useState("");
  
  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Preview modal state
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const userRole = currentUser?.role || "learner";

  if (userRole !== "teacher") {
    return (
      <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-xs font-bold text-rose-600">
        Access Denied. Only instructors can build assessments.
      </div>
    );
  }

  // Options helpers
  const handleOptionChange = (idx: number, val: string) => {
    const updated = [...mcqOptions];
    updated[idx] = val;
    setMcqOptions(updated);
  };

  const addOptionField = () => {
    setMcqOptions([...mcqOptions, ""]);
  };

  const removeOptionField = (idx: number) => {
    if (mcqOptions.length <= 2) return;
    const updated = mcqOptions.filter((_, i) => i !== idx);
    setMcqOptions(updated);
    if (correctMcqAnswer === mcqOptions[idx]) {
      setCorrectMcqAnswer("");
    }
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestionText) return;

    if (questionType === "mcq") {
      const cleanOptions = mcqOptions.filter(opt => opt.trim() !== "");
      if (cleanOptions.length < 2) {
        alert("Please add at least 2 non-empty MCQ options.");
        return;
      }
      if (!correctMcqAnswer) {
        alert("Please select a correct answer option.");
        return;
      }
    }

    if (editingId) {
      // Edit existing
      setQuestions(prev => prev.map(q => {
        if (q.id === editingId) {
          return {
            ...q,
            text: currentQuestionText,
            marks: currentQuestionMarks,
            options: questionType === "mcq" ? mcqOptions.filter(o => o.trim() !== "") : undefined,
            correctAnswer: questionType === "mcq" ? correctMcqAnswer : undefined
          };
        }
        return q;
      }));
      setEditingId(null);
    } else {
      // Create new
      const newQ: Question = {
        id: "q-" + Date.now(),
        text: currentQuestionText,
        type: questionType,
        marks: currentQuestionMarks,
        options: questionType === "mcq" ? mcqOptions.filter(o => o.trim() !== "") : undefined,
        correctAnswer: questionType === "mcq" ? correctMcqAnswer : undefined
      };
      setQuestions([...questions, newQ]);
    }

    // Reset question form
    setCurrentQuestionText("");
    setCurrentQuestionMarks(10);
    setMcqOptions(["", ""]);
    setCorrectMcqAnswer("");
  };

  const handleEditQuestion = (q: Question) => {
    setEditingId(q.id);
    setCurrentQuestionText(q.text);
    setCurrentQuestionMarks(q.marks);
    if (q.options) {
      setMcqOptions(q.options);
      setCorrectMcqAnswer(q.correctAnswer || "");
    }
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

  const handleSave = async (status: "draft" | "published") => {
    if (!title || !subject) {
      alert("Please fill in assessment title and subject.");
      return;
    }
    if (questions.length === 0) {
      alert("Please add at least 1 question to the assessment.");
      return;
    }

    const newAssessment: Assessment = {
      id: "a-" + Date.now(),
      title,
      subject,
      batch,
      instructions,
      questionType,
      questions,
      totalMarks,
      deadline: deadline || new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      status,
      createdAt: new Date().toISOString()
    };

    await saveAssessment(newAssessment);
    router.push("/assessments");
  };

  return (
    <div className="space-y-6">
      {/* Back navigation header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/assessments")}
            className="p-2 border border-border rounded-xl text-text-muted hover:text-primary hover:bg-white transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-black text-foreground">Interactive Assessment Creator</h1>
            <span className="text-xs text-text-muted font-bold tracking-wide">Design custom MCQ or written quizzes</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleSave("draft")}
            className="bg-white border border-border text-foreground hover:bg-[#F7F8FC] font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave("published")}
            className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs cursor-pointer"
          >
            Publish Assessment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quiz General Parameters */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white border border-border p-6 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-xs font-black text-text-muted uppercase tracking-wider border-b border-border/50 pb-2">
              Parameters
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Assessment Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. React hooks and state"
                className="w-full bg-[#F7F8FC] border border-border rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-primary font-semibold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Subject / Class Name</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Front-end Development"
                className="w-full bg-[#F7F8FC] border border-border rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-primary font-semibold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Instructions</label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Answer all questions..."
                className="w-full bg-[#F7F8FC] border border-border rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-primary h-24 font-semibold resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Assign Batch</label>
                <select
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className="w-full bg-[#F7F8FC] border border-border rounded-xl px-3 py-2.5 text-xs outline-none focus:border-primary font-semibold cursor-pointer"
                >
                  <option value="Batch A">Batch A</option>
                  <option value="Batch B">Batch B</option>
                  <option value="Batch C">Batch C</option>
                  <option value="Batch D">Batch D</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Quiz Type</label>
                <select
                  value={questionType}
                  onChange={(e) => {
                    setQuestionType(e.target.value as QuestionType);
                    setQuestions([]);
                  }}
                  className="w-full bg-[#F7F8FC] border border-border rounded-xl px-3 py-2.5 text-xs outline-none focus:border-primary font-semibold cursor-pointer"
                >
                  <option value="mcq">MCQ Quiz</option>
                  <option value="written">Written Test</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Deadline Time</label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-[#F7F8FC] border border-border rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-primary font-semibold"
                required
              />
            </div>

            <div className="border-t border-border/50 pt-4 flex justify-between items-center text-xs font-bold">
              <span className="text-text-muted">Total Marks:</span>
              <span className="text-primary font-black text-sm">{totalMarks} Marks</span>
            </div>
          </div>
        </div>

        {/* Dynamic Question Creator Block */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Question Builder Form */}
          <div className="bg-white border border-border p-6 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-xs font-black text-text-muted uppercase tracking-wider border-b border-border/50 pb-2">
              {editingId ? "Edit Question Definition" : "Add New Question"}
            </h3>

            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Question Statement</label>
                <textarea
                  value={currentQuestionText}
                  onChange={(e) => setCurrentQuestionText(e.target.value)}
                  placeholder="e.g. What is the complexity of binary search?"
                  className="w-full bg-[#F7F8FC] border border-border rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-primary h-20 font-semibold resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Marks Weight</label>
                  <input
                    type="number"
                    value={currentQuestionMarks}
                    onChange={(e) => setCurrentQuestionMarks(Number(e.target.value))}
                    min={1}
                    className="w-full bg-[#F7F8FC] border border-border rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-primary font-semibold"
                    required
                  />
                </div>
              </div>

              {/* Dynamic Option Fields for MCQ */}
              {questionType === "mcq" && (
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Multiple Choice Options</label>
                    <button
                      type="button"
                      onClick={addOptionField}
                      className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                    >
                      <Plus size={14} /> Add Option
                    </button>
                  </div>

                  <div className="space-y-2">
                    {mcqOptions.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        {/* Selector indicator for correct answer */}
                        <button
                          type="button"
                          onClick={() => setCorrectMcqAnswer(opt)}
                          className={`w-6 h-6 border rounded-lg flex items-center justify-center transition-all ${
                            correctMcqAnswer === opt && opt !== ""
                              ? "bg-emerald-50 border-emerald-500 text-emerald-600"
                              : "border-border text-transparent hover:border-emerald-500"
                          }`}
                        >
                          <Check size={14} />
                        </button>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleOptionChange(idx, e.target.value)}
                          placeholder={`Option ${idx + 1}`}
                          className="flex-1 bg-[#F7F8FC] border border-border rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-primary font-semibold"
                        />
                        <button
                          type="button"
                          onClick={() => removeOptionField(idx)}
                          disabled={mcqOptions.length <= 2}
                          className="p-2 border border-border rounded-xl text-rose-500 hover:bg-rose-50 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#84117C] hover:bg-[#6c0e66] text-white font-bold py-3 rounded-xl text-xs uppercase cursor-pointer"
              >
                {editingId ? "Save Question Changes" : "Save Question and Add to List"}
              </button>
            </form>
          </div>

          {/* List of Added Questions */}
          <div className="bg-white border border-border p-6 rounded-2xl shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-border/50 pb-2">
              <h3 className="text-xs font-black text-text-muted uppercase tracking-wider">
                Question Outline ({questions.length})
              </h3>
              {questions.length > 0 && (
                <button
                  onClick={() => setShowPreviewModal(true)}
                  className="text-xs font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Eye size={14} /> Preview Quiz
                </button>
              )}
            </div>

            {questions.length > 0 ? (
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div
                    key={q.id}
                    className="p-4 border border-border/60 rounded-xl bg-[#F7F8FC]/40 hover:bg-[#F7F8FC] transition-all flex justify-between items-start gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-xs font-bold text-text-muted uppercase tracking-wide">
                          {q.marks} Marks
                        </span>
                      </div>
                      <span className="font-semibold text-sm text-foreground block">{q.text}</span>
                      
                      {/* MCQ Option previews */}
                      {q.options && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {q.options.map((opt, i) => (
                            <span
                              key={i}
                              className={`text-xs px-2.5 py-1.5 rounded-lg border text-left flex items-center gap-1.5 ${
                                q.correctAnswer === opt
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold"
                                  : "bg-white text-foreground border-border"
                              }`}
                            >
                              {opt}
                              {q.correctAnswer === opt && <Check size={12} className="text-emerald-600" />}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditQuestion(q)}
                        className="p-2 border border-border rounded-xl text-primary hover:bg-white cursor-pointer"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-2 border border-border rounded-xl text-rose-500 hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 border border-dashed border-border rounded-xl text-center text-xs font-bold text-text-muted uppercase tracking-widest bg-[#F7F8FC]/50">
                No questions defined. Use the form above to add questions.
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Simulated Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-lg animate-fadeIn flex flex-col h-[85vh]">
            <div className="bg-primary p-6 text-white flex justify-between items-center flex-shrink-0">
              <div className="space-y-1">
                <h3 className="font-black text-sm uppercase tracking-wider">Quiz Preview Simulator</h3>
                <span className="text-xs text-white/70 block">Review layout as seen by student candidates</span>
              </div>
              <button onClick={() => setShowPreviewModal(false)} className="text-white/80 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-6 bg-[#F7F8FC]">
              <div className="bg-white border border-border p-6 rounded-2xl">
                <h2 className="text-lg font-black text-foreground">{title || "Untitled Quiz"}</h2>
                <span className="text-xs text-text-muted block mt-1">Class: {subject || "Subject"} | Total: {totalMarks} Marks</span>
                <p className="text-xs text-foreground bg-[#F7F8FC] p-3 rounded-xl border mt-3 italic">
                  Instructions: {instructions || "Answer all questions inside the player."}
                </p>
              </div>

              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div key={q.id} className="bg-white border border-border p-6 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-primary uppercase">Question {index + 1}</span>
                      <span className="text-xs font-bold text-text-muted">{q.marks} Marks</span>
                    </div>
                    <p className="font-bold text-sm text-foreground">{q.text}</p>

                    {q.options && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        {q.options.map((opt, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                              q.correctAnswer === opt
                                ? "border-emerald-500 bg-emerald-50/50 text-emerald-700 font-bold"
                                : "border-border hover:border-primary"
                            }`}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}

                    {!q.options && (
                      <textarea
                        disabled
                        placeholder="Learner will type answer text here..."
                        className="w-full bg-[#F7F8FC] border border-border rounded-xl p-3 text-xs outline-none h-24 font-semibold resize-none"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-border bg-white flex justify-end flex-shrink-0">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="bg-zinc-800 hover:bg-zinc-900 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase cursor-pointer"
              >
                Close Simulator
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
