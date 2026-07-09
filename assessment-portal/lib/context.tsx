"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Assessment, Submission, Material, ClassInfo } from "../types";
import { apiService } from "./apiService";

interface AppContextType {
  currentUser: User | null;
  classes: ClassInfo[];
  assessments: Assessment[];
  submissions: Submission[];
  materials: Material[];
  login: (email: string, password: string, role: "teacher" | "learner") => Promise<boolean>;
  logout: () => void;
  saveAssessment: (assessment: Assessment) => Promise<void>;
  publishAssessment: (id: string) => Promise<void>;
  deleteAssessment: (id: string) => Promise<void>;
  submitAssessment: (submission: Submission) => Promise<void>;
  gradeSubmission: (submissionId: string, marks: number, feedback?: string) => Promise<void>;
  uploadMaterial: (material: Material) => Promise<void>;
  deleteMaterial: (id: string) => Promise<void>;
  bulkGradeSubmissions: (items: { id: string; marks: number; feedback: string }[]) => Promise<void>;
  bulkReviewedSubmissions: (ids: string[]) => Promise<void>;
  refreshSubmissions: (filters?: any) => Promise<void>;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const user = apiService.getCurrentUser();
        setCurrentUser(user);

        const [loadedClasses, loadedAssessments, loadedSubmissions, loadedMaterials] =
          await Promise.all([
            apiService.getClasses(),
            apiService.getAssessments(undefined, undefined, undefined, user?.role || "learner"),
            apiService.getSubmissions(),
            apiService.getMaterials(),
          ]);

        setClasses(loadedClasses);
        setAssessments(loadedAssessments);
        setSubmissions(loadedSubmissions);
        setMaterials(loadedMaterials);
      } catch (error) {
        console.error("Error loading data from backend:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const login = async (email: string, password: string, role: "teacher" | "learner"): Promise<boolean> => {
    try {
      const user = await apiService.login(email, password, role);
      apiService.setCurrentUser(user);
      setCurrentUser(user);
      const loaded = await apiService.getAssessments(undefined, undefined, undefined, user.role);
      setAssessments(loaded);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    apiService.setCurrentUser(null);
    setCurrentUser(null);
  };

  const handleSaveAssessment = async (assessment: Assessment) => {
    if (assessment.status === "draft") {
      await apiService.saveDraftAssessment(assessment);
    } else {
      await apiService.savePublishAssessment(assessment);
    }
    const updated = await apiService.getAssessments(undefined, undefined, undefined, currentUser?.role || "learner");
    setAssessments(updated);
  };

  const handlePublishAssessment = async (id: string) => {
    await apiService.publishAssessmentById(id);
    const updated = await apiService.getAssessments(undefined, undefined, undefined, currentUser?.role || "learner");
    setAssessments(updated);
  };

  const handleDeleteAssessment = async (id: string) => {
    await apiService.deleteAssessment(id);
    const updated = await apiService.getAssessments(undefined, undefined, undefined, currentUser?.role || "learner");
    setAssessments(updated);
  };

  const handleSubmitAssessment = async (submission: Submission) => {
    await apiService.submitAssessment(submission);
    const updated = await apiService.getSubmissions();
    setSubmissions(updated);
  };

  const handleGradeSubmission = async (submissionId: string, marks: number, feedback?: string) => {
    await apiService.gradeSubmission(submissionId, marks, feedback);
    const updated = await apiService.getSubmissions();
    setSubmissions(updated);
  };

  const handleBulkGradeSubmissions = async (items: { id: string; marks: number; feedback: string }[]) => {
    await apiService.bulkGradeSubmissions(items);
    const updated = await apiService.getSubmissions();
    setSubmissions(updated);
  };

  const handleBulkReviewedSubmissions = async (ids: string[]) => {
    await apiService.bulkReviewedSubmissions(ids);
    const updated = await apiService.getSubmissions();
    setSubmissions(updated);
  };

  const handleRefreshSubmissions = async (filters?: any) => {
    const updated = await apiService.getSubmissions(filters);
    setSubmissions(updated);
  };

  const handleUploadMaterial = async (material: Material) => {
    await apiService.uploadMaterial(material);
    const updated = await apiService.getMaterials();
    setMaterials(updated);
  };

  const handleDeleteMaterial = async (id: string) => {
    await apiService.deleteMaterial(id);
    const updated = await apiService.getMaterials();
    setMaterials(updated);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        classes,
        assessments,
        submissions,
        materials,
        login,
        logout,
        saveAssessment: handleSaveAssessment,
        publishAssessment: handlePublishAssessment,
        deleteAssessment: handleDeleteAssessment,
        submitAssessment: handleSubmitAssessment,
        gradeSubmission: handleGradeSubmission,
        bulkGradeSubmissions: handleBulkGradeSubmissions,
        bulkReviewedSubmissions: handleBulkReviewedSubmissions,
        refreshSubmissions: handleRefreshSubmissions,
        uploadMaterial: handleUploadMaterial,
        deleteMaterial: handleDeleteMaterial,
        loading
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
