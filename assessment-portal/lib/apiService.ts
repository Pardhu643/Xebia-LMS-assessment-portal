import { Assessment, Submission, Material, ClassInfo, User, Certificate, Batch } from "../types";

const API_BASE = "/api";

/**
 * API Service for Teacher & Learner LMS Portal.
 * All methods make real HTTP requests to the Spring Boot backend via Next.js proxy rewrites.
 */
export const apiService = {
  // --- USER AUTHENTICATION ---
  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null;
    const userJson = localStorage.getItem("current_user");
    return userJson ? JSON.parse(userJson) : null;
  },

  setCurrentUser: (user: User | null): void => {
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("current_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("current_user");
      }
    }
  },

  login: async (email: string, password: string, role: string): Promise<User> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Login failed");
    }
    return res.json();
  },

  // --- CLASSES ---
  getClasses: async (): Promise<ClassInfo[]> => {
    const res = await fetch(`${API_BASE}/classes`);
    if (!res.ok) throw new Error("Failed to fetch classes");
    return res.json();
  },

  // --- ASSESSMENTS ---
  getAssessments: async (batch?: string, timeFilter?: string, status?: string, role?: string): Promise<Assessment[]> => {
    const params = new URLSearchParams();
    if (batch && batch !== "All Batches" && batch !== "") {
      params.set("batch", batch);
    }
    if (timeFilter && timeFilter !== "All") {
      params.set("timeFilter", timeFilter);
    }
    if (status) {
      params.set("status", status);
    }
    if (role) {
      params.set("role", role);
    }
    const query = params.toString();
    const res = await fetch(`${API_BASE}/assessments${query ? `?${query}` : ""}`);
    if (!res.ok) throw new Error("Failed to fetch assessments");
    return res.json();
  },

  saveAssessment: async (assessment: Assessment): Promise<Assessment> => {
    const res = await fetch(`${API_BASE}/assessments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assessment),
    });
    if (!res.ok) throw new Error("Failed to save assessment");
    return res.json();
  },

  saveDraftAssessment: async (assessment: Assessment): Promise<Assessment> => {
    const res = await fetch(`${API_BASE}/assessments/draft`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assessment),
    });
    if (!res.ok) throw new Error("Failed to save draft assessment");
    return res.json();
  },

  savePublishAssessment: async (assessment: Assessment): Promise<Assessment> => {
    const res = await fetch(`${API_BASE}/assessments/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assessment),
    });
    if (!res.ok) throw new Error("Failed to save and publish assessment");
    return res.json();
  },

  publishAssessmentById: async (id: string): Promise<Assessment> => {
    const res = await fetch(`${API_BASE}/assessments/${id}/publish`, {
      method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to publish assessment");
    return res.json();
  },

  deleteAssessment: async (id: string): Promise<boolean> => {
    const res = await fetch(`${API_BASE}/assessments/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete assessment");
    return true;
  },

  // --- SUBMISSIONS ---
  getSubmissions: async (filters?: {
    assessmentId?: string;
    batches?: string[];
    status?: string;
    search?: string;
    timeFilter?: string;
    sortBy?: string;
    page?: number;
    size?: number;
  }): Promise<Submission[]> => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.assessmentId) params.set("assessmentId", filters.assessmentId);
      if (filters.batches && filters.batches.length > 0) {
        filters.batches.forEach(b => params.append("batches", b));
      }
      if (filters.status) params.set("status", filters.status);
      if (filters.search) params.set("search", filters.search);
      if (filters.timeFilter) params.set("timeFilter", filters.timeFilter);
      if (filters.sortBy) params.set("sortBy", filters.sortBy);
      if (filters.page !== undefined) params.set("page", String(filters.page));
      if (filters.size !== undefined) params.set("size", String(filters.size));
    }
    const query = params.toString();
    const res = await fetch(`${API_BASE}/submissions${query ? `?${query}` : ""}`);
    if (!res.ok) throw new Error("Failed to fetch submissions");
    return res.json();
  },

  submitAssessment: async (submission: Submission): Promise<Submission> => {
    const res = await fetch(`${API_BASE}/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    });
    if (!res.ok) throw new Error("Failed to submit assessment");
    return res.json();
  },

  gradeSubmission: async (submissionId: string, marks: number, feedback?: string): Promise<Submission> => {
    const res = await fetch(`${API_BASE}/submissions/${submissionId}/grade`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ marks, feedback }),
    });
    if (!res.ok) throw new Error("Failed to grade submission");
    return res.json();
  },

  bulkGradeSubmissions: async (items: { id: string; marks: number; feedback: string }[]): Promise<Submission[]> => {
    const res = await fetch(`${API_BASE}/submissions/bulk-grade`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
    });
    if (!res.ok) throw new Error("Failed bulk grading");
    return res.json();
  },

  bulkReviewedSubmissions: async (ids: string[]): Promise<Submission[]> => {
    const res = await fetch(`${API_BASE}/submissions/bulk-reviewed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ids),
    });
    if (!res.ok) throw new Error("Failed bulk reviewed");
    return res.json();
  },

  // --- MATERIALS ---
  getMaterials: async (batch?: string): Promise<Material[]> => {
    const params = new URLSearchParams();
    if (batch && batch !== "All Batches" && batch !== "") {
      params.set("batch", batch);
    }
    const query = params.toString();
    const res = await fetch(`${API_BASE}/materials${query ? `?${query}` : ""}`);
    if (!res.ok) throw new Error("Failed to fetch materials");
    return res.json();
  },

  uploadMaterial: async (material: Material): Promise<Material> => {
    const res = await fetch(`${API_BASE}/materials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(material),
    });
    if (!res.ok) throw new Error("Failed to upload material");
    return res.json();
  },

  deleteMaterial: async (id: string): Promise<boolean> => {
    const res = await fetch(`${API_BASE}/materials/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete material");
    return true;
  },

  // --- DASHBOARD STATS ---
  getDashboardStats: async (role: "teacher" | "learner", userId: string, timeFilter: string, batchFilter: string) => {
    const params = new URLSearchParams({
      role,
      userId,
      timeFilter,
      batchFilter,
    });
    const res = await fetch(`${API_BASE}/dashboard?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch dashboard stats");
    return res.json();
  },

  // --- FILE UPLOADS ---
  uploadFile: async (file: File): Promise<{
    originalName: string;
    filename: string;
    fileUrl: string;
    mimeType: string;
    size: number;
    uploadedAt: string;
  }> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_BASE}/uploads`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to upload file");
    return res.json();
  },

  // --- CERTIFICATES ---
  generateCertificate: async (studentId: string, assessmentId: string): Promise<Certificate> => {
    const res = await fetch(`${API_BASE}/certificates/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, assessmentId }),
    });
    if (!res.ok) throw new Error("Certificate cannot be generated. Check rules.");
    return res.json();
  },

  getStudentCertificates: async (studentId: string): Promise<Certificate[]> => {
    const res = await fetch(`${API_BASE}/certificates/student/${studentId}`);
    if (!res.ok) throw new Error("Failed to fetch certificates");
    return res.json();
  },

  getCertificateById: async (certificateId: string): Promise<Certificate> => {
    const res = await fetch(`${API_BASE}/certificates/${certificateId}`);
    if (!res.ok) throw new Error("Failed to fetch certificate");
    return res.json();
  },

  getCertificatePreviewUrl: (certificateId: string): string => {
    return `${API_BASE}/certificates/preview/${certificateId}`;
  },

  getCertificateDownloadUrl: (certificateId: string): string => {
    return `${API_BASE}/certificates/download/${certificateId}`;
  },

  // --- BATCHES ---
  getBatches: async (): Promise<Batch[]> => {
    const res = await fetch(`${API_BASE}/batches`);
    if (!res.ok) throw new Error("Failed to fetch batches");
    return res.json();
  },

  createBatch: async (batch: Batch): Promise<Batch> => {
    const res = await fetch(`${API_BASE}/batches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(batch),
    });
    if (!res.ok) {
      if (res.status === 409) {
        throw new Error(`A batch with name '${batch.batchName}' already exists.`);
      }
      throw new Error("Failed to create batch");
    }
    return res.json();
  },

  getBatchById: async (id: string): Promise<Batch> => {
    const res = await fetch(`${API_BASE}/batches/${id}`);
    if (!res.ok) throw new Error("Failed to fetch batch");
    return res.json();
  },

  updateBatch: async (id: string, updates: Partial<Batch>): Promise<Batch> => {
    const res = await fetch(`${API_BASE}/batches/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      if (res.status === 409) {
        throw new Error(`A batch with name '${updates.batchName}' already exists.`);
      }
      throw new Error("Failed to update batch");
    }
    return res.json();
  },

  deleteBatch: async (id: string): Promise<boolean> => {
    const res = await fetch(`${API_BASE}/batches/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete batch");
    return true;
  },
};
