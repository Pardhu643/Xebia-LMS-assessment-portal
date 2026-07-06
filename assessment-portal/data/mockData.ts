import { User, Assessment, Submission, Material, ClassInfo } from "../types";

export const MOCK_TEACHER: User = {
  id: "t-1",
  name: "Shan Ali",
  email: "teacher@lms.com",
  role: "teacher",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
};

export const MOCK_LEARNER: User = {
  id: "l-1",
  name: "Flores Juanita",
  email: "learner@lms.com",
  role: "learner",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
};

export const BATCHES = ["Batch A", "Batch B", "Batch C", "Batch D"];

export const INITIAL_CLASSES: ClassInfo[] = [
  {
    id: "c-1",
    name: "UI/UX Design",
    batch: "Batch A",
    subject: "Design Principles",
    time: "09:30 AM - 11:00 AM",
    teacherName: "Shan Ali"
  },
  {
    id: "c-2",
    name: "Front-end Development",
    batch: "Batch B",
    subject: "React & Next.js",
    time: "10:15 AM - 11:45 AM",
    teacherName: "Shan Ali"
  },
  {
    id: "c-3",
    name: "Back-end Development",
    batch: "Batch C",
    subject: "Node.js & Express",
    time: "11:00 AM - 12:30 PM",
    teacherName: "Shan Ali"
  },
  {
    id: "c-4",
    name: "Project Management",
    batch: "Batch D",
    subject: "Agile & Scrum",
    time: "12:00 PM - 01:30 PM",
    teacherName: "Shan Ali"
  }
];

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: "a-1",
    title: "UI/UX Design Principles Quiz",
    subject: "UI/UX Design",
    batch: "Batch A",
    instructions: "Answer all questions. You have 30 minutes. Once submitted, answers cannot be edited.",
    questionType: "mcq",
    totalMarks: 30,
    deadline: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16), // 2 days from now
    status: "published",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    questions: [
      {
        id: "q-1-1",
        text: "What does UX stand for?",
        type: "mcq",
        options: ["User Experience", "User eXchange", "Unique eXperience", "Universal eXperience"],
        correctAnswer: "User Experience",
        marks: 10
      },
      {
        id: "q-1-2",
        text: "Which of the following is NOT a principle of design?",
        type: "mcq",
        options: ["Contrast", "Balance", "Haphazard", "Alignment"],
        correctAnswer: "Haphazard",
        marks: 10
      },
      {
        id: "q-1-3",
        text: "What is the primary focus of wireframing?",
        type: "mcq",
        options: ["Color and typography", "Layout and structure", "Final animations", "Database connections"],
        correctAnswer: "Layout and structure",
        marks: 10
      }
    ]
  },
  {
    id: "a-2",
    title: "React Components & State Written Assessment",
    subject: "Front-end Development",
    batch: "Batch B",
    instructions: "Write descriptive answers. Max 250 words per question. Marks depend on clarity and correctness.",
    questionType: "written",
    totalMarks: 20,
    deadline: new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 16), // 5 days from now
    status: "published",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    questions: [
      {
        id: "q-2-1",
        text: "Explain the difference between Props and State in React.",
        type: "written",
        marks: 10
      },
      {
        id: "q-2-2",
        text: "Describe the lifecycle of a React functional component using the useEffect hook.",
        type: "written",
        marks: 10
      }
    ]
  },
  {
    id: "a-3",
    title: "SQL Queries and Normalization Quiz (Uploaded File)",
    subject: "Back-end Development",
    batch: "Batch C",
    instructions: "Please download the attached PDF, solve the questions on paper, scan, and upload your answers.",
    questionType: "written",
    totalMarks: 50,
    deadline: new Date(Date.now() - 86400000 * 1).toISOString().slice(0, 16), // Yesterday (Past deadline)
    status: "published",
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    fileName: "sql_queries_assignment_v2.pdf",
    fileSize: "1.2 MB",
    fileUrl: "/files/sql_queries_assignment_v2.pdf",
    questions: []
  },
  {
    id: "a-4",
    title: "Scrum & Sprint Planning Framework Draft",
    subject: "Project Management",
    batch: "Batch D",
    instructions: "Draft assessment on Agile frameworks.",
    questionType: "mcq",
    totalMarks: 10,
    deadline: new Date(Date.now() + 86400000 * 10).toISOString().slice(0, 16),
    status: "draft",
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: "q-4-1",
        text: "How long is a typical Sprint?",
        type: "mcq",
        options: ["1-4 weeks", "6 months", "1 day", "1 year"],
        correctAnswer: "1-4 weeks",
        marks: 10
      }
    ]
  }
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: "s-1",
    assessmentId: "a-1",
    assessmentTitle: "UI/UX Design Principles Quiz",
    subject: "UI/UX Design",
    batch: "Batch A",
    learnerId: "l-1",
    learnerName: "Flores Juanita",
    answers: {
      "q-1-1": "User Experience",
      "q-1-2": "Haphazard",
      "q-1-3": "Layout and structure"
    },
    status: "marked",
    marksObtained: 30,
    totalMarks: 30,
    feedback: "Excellent work! Perfect answers for all questions.",
    submittedAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: "s-2",
    assessmentId: "a-2",
    assessmentTitle: "React Components & State Written Assessment",
    subject: "Front-end Development",
    batch: "Batch B",
    learnerId: "l-1",
    learnerName: "Flores Juanita",
    answers: {
      "q-2-1": "Props are inputs passed into a component from its parent, making them immutable from within the component. State represents local mutable data that is managed within the component itself, which triggers re-renders when updated.",
      "q-2-2": "Functional components use the useEffect hook to perform side effects. If no dependency array is provided, it runs on every render. If an empty array [] is passed, it runs once on mount. Cleanups can be returned to execute on unmount."
    },
    status: "submitted",
    totalMarks: 20,
    submittedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "s-3",
    assessmentId: "a-3",
    assessmentTitle: "SQL Queries and Normalization Quiz (Uploaded File)",
    subject: "Back-end Development",
    batch: "Batch C",
    learnerId: "l-2",
    learnerName: "John Doe",
    answers: {},
    status: "submitted",
    totalMarks: 50,
    submittedAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
    submittedFileUrl: "/files/john_doe_sql_submission.pdf",
    submittedFileName: "john_doe_sql_submission.pdf"
  }
];

export const INITIAL_MATERIALS: Material[] = [
  {
    id: "m-1",
    title: "Typography and Color Theory Guide",
    subject: "UI/UX Design",
    batch: "Batch A",
    fileName: "typography_and_color_theory_v1.pdf",
    fileSize: "4.5 MB",
    fileUrl: "/files/typography_and_color_theory_v1.pdf",
    uploadedBy: "Shan Ali",
    uploadedAt: new Date(Date.now() - 86400000 * 12).toISOString()
  },
  {
    id: "m-2",
    title: "Next.js 15 App Router Reference Cheatsheet",
    subject: "Front-end Development",
    batch: "Batch B",
    fileName: "nextjs15_cheatsheet.pdf",
    fileSize: "850 KB",
    fileUrl: "/files/nextjs15_cheatsheet.pdf",
    uploadedBy: "Shan Ali",
    uploadedAt: new Date(Date.now() - 86400000 * 8).toISOString()
  }
];
