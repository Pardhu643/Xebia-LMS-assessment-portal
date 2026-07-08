# 🎓 Xebia LMS Assessment Portal

<p align="center">
  <img src="assessment-portal/public/images/xebia-logo.png" alt="Xebia Logo" width="180" />
</p>

<p align="center">
  <strong>An Enterprise-Grade Learning Management System Assessment & Resource Hub</strong>
</p>

<p align="center">
  A secure, modern, and high-performance assessment portal enabling instructors to author custom quizzes, manage batches, track submissions, and grade student submissions, while providing learners a workspace with inline binary-safe document previews, downloads, and interactive test players.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-17%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java JDK 17" />
  <img src="https://img.shields.io/badge/Spring_Boot-2.7.18-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/MongoDB_Atlas-Cloud-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB Atlas" />
  <img src="https://img.shields.io/badge/Next.js-16.2.10-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Maven-3.x-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white" alt="Maven" />
</p>

---

## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Login Credentials](#-login-credentials)
- [Assessment Module](#-assessment-module)
- [File Management](#-file-management)
- [REST API Overview](#-rest-api-overview)
- [Database Specifications](#-database-specifications)
- [Screenshots](#-screenshots)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)
- [Acknowledgements](#-acknowledgements)

---

## 📖 Project Overview
The **Xebia LMS Assessment Portal** is a web-based Learning Management System module designed to streamline academic testing and grading workflows. 

### Purpose & Objective
Traditional LMS platforms often treat assessment uploads as raw binary download links, forcing students to download files locally and install external software (like MS Word or Adobe PDF) to edit or view them. This project solves this friction by implementing **in-portal binary-safe rendering** for various document formats, keeping the learning and evaluation experience consolidated, secure, and fast.

### Target Users
1.  **Teacher (Instructor)**: Responsible for authoring assessments (via manual inputs or Excel imports), configuring deadline dates, targeting batches, uploading shared materials, and reviewing/grading student submissions.
2.  **Learner (Student)**: Filters assigned assessments by batch, reviews materials inline, downloads task sheets, uploads solved response files, and tracks grades/feedback.
3.  **Admin (Not implemented in current project)**: User management and administrative configurations are handled by default seeding.

---

## ✨ Features

### 👨‍🏫 Teacher Features
*   **Assessment Creator**: Choose between Manual Question Entry or Excel template file importing.
*   **Multiple Batch Selection**: Target single assessments to multiple student groups (Batch A, B, C, D) simultaneously.
*   **Submissions Review Desk**: Monitor student status (Pending, Submitted, Graded, Late, Missing) dynamically.
*   **Bulk Actions**: Select multiple candidate rows to bulk-grade, bulk-mark reviewed, or bulk-download files.
*   **Grading & Comments**: Score written tests and leave constructive feedback.
*   **Materials Panel**: Upload shared class documents directly to local storage linked to MongoDB references.

### 🧑‍🎓 Learner Features
*   **Batch Locking**: System automatically retrieves user batch profile on login and locks the queries to hide selectors.
*   **MCQ Test Player**: Responsive answer options picker with direct submission capabilities.
*   **File Previewer**: View attachments inline (PDF, DOCX, XLSX, CSV, images, text) directly in the browser.
*   **Solution Upload**: Multipart file uploader for solved response files (max 5MB).
*   **Marks Panel**: Monitor test grades and read instructor remarks.

### 🛠️ Feature Modules Summary
*   **Assessment Module**: Manual creation, Excel sheet parsing, multi-batch assignment, draft/publishing, student player attempts.
*   **File Management**: Attachment uploads, inline previews, forced file downloads.
*   **Quiz Management**: MCQ option bindings, correct answer toggle indicators, question outlines.
*   **Excel Import**: Client-side SheetJS template validation (columns, marks, types checks).
*   **Submission Management**: Table lists, sort options (Newest, Oldest, Marks), and candidate search filters.
*   **Grading & Feedback**: Evaluation modal interface for marks entry and written remarks.
*   **Authentication**: Plain-text password matching against seeded accounts. Role-based view redirections.
*   **Dashboard**: Dynamic metrics cards panel.
*   **Search & Filters**: Multi-batch checkboxes, search inputs, time filters, and sorting selectors.
*   **Materials**: Course documents downloads and inline previews.
*   **Notifications (Not implemented in current project)**: System alerts are not present.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | React 19, Next.js (App Router), TypeScript | Client-side application optimized with Webpack |
| **Styling** | Vanilla CSS, Tailwind CSS | Curated professional dark/light flat enterprise theme |
| **Backend** | Java, Spring Boot 2.7.18 | REST API controllers, file streaming endpoints |
| **Database** | MongoDB Atlas | Cloud-hosted document database for metadata persistence |
| **Authentication** | Local Auth Context | Custom plain-text password mapping stored in `localStorage` |
| **State Management** | React Context API | AppContext sharing profile details and apiService calls |
| **File Storage** | Local Disk Storage | Physical directory `./uploads` on backend server |
| **Libraries** | Mammoth.js, SheetJS (`xlsx`) | Client-side converters for docx-to-html and sheet-to-grid layouts |
| **Development Tools** | Maven, NPM | Build automation tools and dependency managers |

---

## 🏗️ System Architecture

*   **Frontend**: Next.js App Router serves views. Communicates with backend using a clean `apiService` gateway module wrapper executing `fetch` API commands.
*   **Backend**: Spring Boot controllers expose endpoints mapping requests, verifying parameters, and saving model data.
*   **MongoDB**: Serves as the primary metadata store containing collections for users, assessments, submissions, and materials.
*   **File Storage**: Raw binary files are physically written to the backend `./uploads` directory with a unique timestamp prefix.
*   **API Communication**: Client-to-server exchanges are standard JSON format payloads, except for multipart file upload data.

---

## 📂 Project Structure

```text
assessment-portal1/
├── README.md
└── assessment-portal/
    ├── app/                     # Next.js App Router (pages & navigation)
    │   ├── assessments/         # Solve player, creator builder, and details views
    │   ├── dashboard/           # Core metrics dashboard
    │   ├── materials/           # Shared student guides
    │   ├── marks/               # Student grades tracker
    │   └── page.tsx             # Login interface & role selector
    ├── components/
    │   └── files/
    │       └── FilePreviewModal.tsx  # Document parser (Mammoth/SheetJS/Iframe)
    ├── lib/
    │   ├── apiService.ts        # Axios/Fetch API client gateway
    │   └── context.tsx          # Global context state provider
    ├── backend/
    │   ├── pom.xml              # Maven configuration
    │   ├── src/main/java/com/assessmentportal/
    │   │   ├── controller/      # API Rest Controllers (Upload, Auth, Submissions)
    │   │   ├── model/           # MongoDB document entities
    │   │   ├── repository/      # MongoRepository interfaces
    │   │   └── seed/            # Seed data helper (DataSeeder.java)
    │   └── src/main/resources/
    │       └── application.properties  # Database connection configurations
    ├── public/                  # Static assets & brand logos
    └── package.json             # Frontend NPM configuration
```

---

## ⚙️ Installation & Setup

### Prerequisites
*   Java JDK 17+ Installed
*   Node.js v18+ Installed
*   MongoDB Atlas Cluster or Local MongoDB running

### 1. Clone the Repository
```bash
git clone https://github.com/Pardhu643/Xebia-LMS-assessment-portal.git
cd Xebia-LMS-assessment-portal
```

### 2. Configure Environment Variables
Create a local configurations profile or `.env` file containing:
```bash
SPRING_DATA_MONGODB_URI="your_mongodb_connection_uri"
```

### 3. Build & Run Backend
```bash
cd assessment-portal/backend
# On Windows PowerShell
$env:SPRING_DATA_MONGODB_URI="your_mongodb_atlas_connection_string"
.\mvnw.cmd spring-boot:run
```
The backend starts on `http://localhost:8080`.

### 4. Build & Run Frontend
```bash
cd ../ # Move back to assessment-portal root
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🔑 Environment Variables

| Variable Name | Description | Default Fallback |
| :--- | :--- | :--- |
| `SPRING_DATA_MONGODB_URI` | Cloud MongoDB Connection URI string | `mongodb://localhost:27017/employeeDB` |
| `PORT` | Spring Boot web server port | `8080` |

---

## 🔐 Login Credentials

The portal is seeded with the following credentials for local evaluation:

| Role | Email / Username | Password | Description |
| :--- | :--- | :--- | :--- |
| **Teacher** | `teacher@lms.com` | `teacher123` | Can create assessments, upload resources, configure deadlines, review submissions, and enter grades. |
| **Learner** | `learner@lms.com` | `learner123` | Can view active assessments, preview and download reference files inline, submit assignments, and track marks. |

---

## 📝 Assessment Module Flow

### 1. Manual Assessment
Teachers author tests question-by-question, defining statements, marks, options, and answers using manual form inputs.

### 2. Custom Quiz
Supports interactive MCQ authoring with options checks and incorrect toggle warnings.

### 3. Excel Import
Teachers import questions from spreadsheet templates. The client-side parser validates columns, data types, and values, flagging errors dynamically.

### 4. File Upload
Instructors create written assignments by uploading task documents (e.g. PDF/DOCX) which are saved to server storage.

### 5. Multiple Batch Selection
Teachers assign assessments to one or multiple student batches (Batch A, B, C, D) using checkboxes chip grids.

### 6. Assessment Publishing
Assessments saved as "published" become instantly queryable by learners. Draft assessments are hidden.

### 7. Student Submission
Learners solve tests using MCQ options selectors or written textareas, or by attaching response sheets. MCQ tests are submitted with `"submitted"` status and graded by instructors.

### 8. Grading Workflow
Teachers evaluate subjective or MCQ answers in the Review Modal. They save scored marks and feedback comments, transitioning the status to `"marked"`.

---

## 📂 File Management Flow

### 1. Upload Flow
Files are uploaded via `POST /api/uploads` multipart requests. The backend renames files with timestamp prefixes and writes them to `./uploads`.

### 2. Preview Flow
*   **PDF**: Embedded directly in custom `<iframe>` layouts.
*   **DOCX**: Mammoth.js parses the array buffer byte stream to HTML inline.
*   **XLSX/CSV**: SheetJS reads sheet tables, mapping data to visual grids.
*   **Images**: Native `<img>` layout rendering.

### 3. Download Flow
Calls `GET /api/files/download/{file}`. Streams resource bytes with `Content-Disposition: attachment` to trigger browser native download.

### 4. Supported File Types
*   Document files: `.docx`, `.doc`, `.pdf`, `.txt`, `.md`
*   Spreadsheets: `.xlsx`, `.xls`, `.csv`
*   Image files: `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`

---

## 📡 REST API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticates user; checks plain-text credentials and role |
| `GET` | `/api/assessments` | Fetches assessments list, supports `batch` and `timeFilter` |
| `POST` | `/api/assessments` | Saves new assessment (Teacher) |
| `DELETE` | `/api/assessments/{id}` | Deletes assessment record (Teacher) |
| `GET` | `/api/submissions` | Fetches submissions, including dynamic virtual pending/missing records |
| `POST` | `/api/submissions` | Saves student attempt response |
| `PATCH` | `/api/submissions/{id}/grade` | Enters subjective marks score and feedback comments |
| `POST` | `/api/submissions/bulk-grade` | Bulk grades multiple submissions |
| `POST` | `/api/submissions/bulk-reviewed` | Bulk marks submissions as reviewed |
| `POST` | `/api/uploads` | Uploads binary files to backend storage directory |
| `GET` | `/api/files/preview/{file}` | Streams file inline |
| `GET` | `/api/files/download/{file}` | Streams file as attachment download |

---

## 🗄️ Database Specifications

### Collection: `users`
*   **Purpose**: Manages system accounts and maps batches for learners.
*   **Fields**: `id`, `name`, `email`, `role`, `avatar`, `password`, `batch`, `rollNumber`.

### Collection: `assessments`
*   **Purpose**: Stores assessment parameters, batches, and embedded lists of questions.
*   **Fields**: `id`, `title`, `subject`, `batch`, `instructions`, `questionType`, `totalMarks`, `deadline`, `status`, `fileUrl`, `fileName`, `fileSize`, `batches`, `questions`.

### Collection: `submissions`
*   **Purpose**: Evaluates candidate responses and stores comments.
*   **Fields**: `id`, `assessmentId`, `assessmentTitle`, `subject`, `batch`, `learnerId`, `learnerName`, `answers`, `status`, `marksObtained`, `totalMarks`, `feedback`, `submittedAt`, `submittedFileUrl`, `submittedFileName`, `rollNumber`, `deadline`.

---

## 📷 Screenshots

### Login Page
*(Heading Placeholder)*

### Teacher Dashboard
*(Heading Placeholder)*

### Learner Dashboard
*(Heading Placeholder)*

### Assessment Interface
*(Heading Placeholder)*

### Materials Portal
*(Heading Placeholder)*

### Submission Hub
*(Heading Placeholder)*

### Grading Panel
*(Heading Placeholder)*

---

## 🚀 Future Enhancements
*   **Redis Caching Layer**: Implement Redis to cache materials and assessments metadata.
*   **Live WebSockets Notifications**: Alert learners in real time when new assessments are published.
*   **Containerization**: Dockerize Next.js and Spring Boot applications for consistent deployments.
*   **JWT Security Integration**: Replace plain-text passwords validation with bcrypt encryption and JWT authentication.

---

## 🤝 Contributing
1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author
*   **Pardhu Tirumalasetti** - *Full Stack Developer*
*   **GitHub**: [@Pardhu643](https://github.com/Pardhu643)
*   **LinkedIn**: [Pardhu Tirumalasetti](https://www.linkedin.com/in/pardhu-tirumalasetti-138379207/)

---

## 💖 Acknowledgements
*   **Xebia Internship Program** - Structured learning guides and assessment portals review guidelines.
*   Advanced Agentic Coding Pair Programming assistance.
