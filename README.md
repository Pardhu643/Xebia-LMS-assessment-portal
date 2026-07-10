# 🎓 Xebia LMS Assessment Portal

<p align="center">
  <img src="assessment-portal/public/images/xebia-logo.png" alt="Xebia Logo" width="180" />
</p>

<p align="center">
  <strong>An Enterprise-Grade Learning Management System Assessment & Resource Hub</strong>
</p>

---

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
  - [Teacher Features](#teacher-features)
  - [Learner Features](#learner-features)
- [Auto-Grading](#auto-grading)
- [Certificate Module](#certificate-module)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Folder Structure](#folder-structure)
- [Installation and Local Setup](#installation-and-local-setup)
- [Environment Variables](#environment-variables)
- [Login Credentials](#login-credentials)
- [API Overview](#api-overview)
- [Database Collections](#database-collections)
- [File Upload, Preview, and Download](#file-upload-preview-and-download)
- [Assessment Lifecycle](#assessment-lifecycle)
- [Excel Import Format](#excel-import-format)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)
- [Author](#author)

---

## Project Overview
The **Xebia LMS Assessment Portal** is a web-based Learning Management System module designed to streamline academic testing, resource sharing, and grading workflows. 

Traditional LMS platforms often treat assessment files as raw download links, forcing students to install external software locally to edit or view tasks. This project solves this friction by implementing **in-portal binary-safe rendering** for document formats, keeping the learning and evaluation experience consolidated, secure, and fast.

---

## Key Features

### Teacher Features
- **Dashboard**: High-level overview of core academic stats (active assessments, total batches, and total graded submissions).
- **Create Assessment Manually**: Author quizzes question-by-question, defining statement, marks, option choices, difficulty, and answers.
- **Import Quiz from Excel**: Instantly import complex quizzes using spreadsheet templates.
- **Upload File Assessment**: Create subjective/written assignments by uploading document templates.
- **Select Multiple Batches**: Assign a single assessment to multiple training batches simultaneously using checkbox chip grids.
- **Create New Batch**: Register new candidate groups dynamically on-the-fly directly from the assessment builder batch selector.
- **Save Assessment as Draft**: Keep assessments in draft mode to review and edit later before making them visible to students.
- **Publish Assessment**: Release drafted or new assessments to assigned batches instantly.
- **View and Filter Submissions**: Monitor student statuses (Pending, Submitted, Graded, Late, Missing) with advanced filters and search queries.
- **Grade Submissions**: Evaluate solved written sheets or subjective text answers in a slide-out grading panel.
- **Add Feedback**: Add constructive remarks alongside scores.

### Learner Features
- **Dashboard**: View personal dashboard showing active assignments and summary cards.
- **Assigned Assessments**: View active tests and files.
- **Automatic Batch-Based Assessment Filtering**: The portal automatically detects the student's registered batch profile and displays only targeted assessments.
- **Attempt Quiz**: Solve interactive MCQ tests inside a responsive player.
- **Upload Written/File Submission**: Solved subjective assignments can be submitted by uploading response files.
- **View Scorecard**: Open a detailed scorecard overlay detailing the completed attempt.
- **View Correct, Wrong, and Unanswered Answers**: View question-by-question cards with highlighted option indicators (Green for correct, Red for wrong, Gray for unanswered).
- **View Marks and Feedback**: Read instructor scores and comments.
- **View and Download Certificates**: Unlocked certificates can be printed or exported directly.
- **Materials and Deadlines**: Access shared materials and track assignment deadlines.

---

## Auto-Grading
The portal automates evaluation for structured quizzes using a built-in auto-grading engine:
- **Correct Answer Column in Excel**: The parser extracts option selections or string keys from the sheet.
- **Automatic Answer Comparison**: Upon submission, the engine matches the learner's options against the assessment's answer keys.
- **Marks Calculation**: Assigns configured question marks for exact matches and `0` for wrong or unanswered keys.
- **Percentage Calculation**: Computes `(Marks Obtained / Total Marks) * 100` dynamically.
- **Status Update**: Marks the submission status as `Auto Graded` or `marked`, making it immediately accessible for review.

---

## Certificate Module
The portal rewards academic success with an automated certification mechanism:
- **Certificate Eligibility Threshold**: Automatically unlocked when a learner obtains a score of **90% or above** on a published assessment.
- **Dynamic Fields**: Automatically binds data to render custom SVG certificates:
  - Learner's Name
  - Subject Name
  - Percentage Score
  - Issue Date (formatted ISO string)
  - Unique Certificate ID (MongoDB object identifier)
- **Certificate Preview**: Displays the certificate inline on an A4 landscape canvas.
- **Certificate Download**: Clients can download certificates as high-resolution PDF copies.
- **My Certificates Page**: Dedicated student sidebar workspace summarizing all earned certificates.

---

## Technology Stack

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Java, Spring Boot, Maven
- **Database**: MongoDB Atlas (Cloud Database)
- **APIs**: Restful Web Services
- **Libraries**: Mammoth.js (docx-to-html), SheetJS (xlsx parser), html2canvas & jsPDF (client PDF exporter), OpenPDF (backend PDF generation)

---

## System Architecture
1. **Client Tier**: Next.js UI captures user interactions and handles Mammoth/SheetJS document parsing.
2. **Gateway API Client**: Execution commands are routed through a consolidated client wrapper executing fetch actions.
3. **Application Server**: Spring Boot controllers map endpoints, implement security validation, and orchestrate transactions.
4. **Database Tier**: MongoDB Atlas persists collections for users, assessments, submissions, materials, and certificates.
5. **Physical Storage**: SOLVED sheets and reference resources are stored on the server disk under `./uploads`.

---

## Folder Structure

```text
assessment-portal1/
├── README.md
└── assessment-portal/
    ├── app/                     # Next.js Pages & Layouts
    │   ├── assessments/         # Solve player, builder, and list views
    │   ├── certificates/        # Verification & download viewer
    │   ├── dashboard/           # Metrics panels
    │   ├── materials/           # Resources downloader
    │   └── page.tsx             # Login interface
    ├── components/
    │   ├── certificates/
    │   │   ├── CertificateTemplate.tsx  # SVGCanvas design
    │   │   └── CertificatePreviewModal.tsx
    │   └── files/
    │       └── FilePreviewModal.tsx      # Mammoth/SheetJS iframe parser
    ├── lib/
    │   ├── apiService.ts        # consolidated fetch gateway
    │   └── context.tsx          # React Auth/App context provider
    ├── types/
    │   └── index.ts             # TypeScript definitions
    └── backend/
        ├── pom.xml              # Maven dependencies
        ├── src/main/java/com/assessmentportal/
        │   ├── controller/      # REST API Controllers
        │   ├── model/           # Mongo Document Classes
        │   ├── repository/      # Repository CRUD interfaces
        │   └── service/         # Business logic & PDF generators
        └── src/main/resources/
            └── application.properties # MongoDB connection strings
```

---

## Installation and Local Setup

### Prerequisites
* Java JDK 17+
* Node.js v18+
* MongoDB Atlas cluster

### 1. Clone the Project
```bash
git clone https://github.com/Pardhu643/Xebia-LMS-assessment-portal.git
cd Xebia-LMS-assessment-portal
```

### 2. Run MongoDB Atlas
Ensure your cluster is active and configure network access to permit connection requests.

### 3. Run Backend Server
```bash
cd assessment-portal/backend
# Set MongoDB URI variable
# On Windows Powershell:
$env:SPRING_DATA_MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/lms"
.\mvnw.cmd spring-boot:run
```
The server binds to `http://localhost:8080`.

### 4. Run Frontend Client
```bash
cd ../ # Move back to assessment-portal root
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## Environment Variables
Configure the following variable parameters:
- `SPRING_DATA_MONGODB_URI`: `mongodb+srv://<db_user>:<db_password>@cluster.mongodb.net/lmsDB`
- `PORT`: `8080` (Backend Web Server Port)

Do not commit raw database password credentials.

---

## Login Credentials

Seeded database user profiles:

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Teacher** | `teacher@lms.com` | `teacher123` | Assessment building, batch management, submission reviews, grading |
| **Learner** | `learner@lms.com` | `learner123` | Solves tests, uploads subjective answers, reviews scorecards, views certificates |

---

## API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Validates demo email/password profile credentials |
| `GET` | `/api/assessments` | Retrieves assessments filtered by batch, status, and role |
| `POST` | `/api/assessments/draft` | Creates a new assessment in DRAFT mode |
| `POST` | `/api/assessments/publish` | Creates a new assessment in PUBLISHED mode |
| `PATCH` | `/api/assessments/{id}/publish` | Transitions a draft assessment to PUBLISHED status |
| `DELETE` | `/api/assessments/{id}` | Deletes assessment record (Teacher only) |
| `GET` | `/api/batches` | Retrieves list of all batch groups |
| `POST` | `/api/batches` | Registers a new batch (prevents name duplication) |
| `GET` | `/api/submissions` | Fetches learner submission list (contains virtual pending/missing records) |
| `GET` | `/api/submissions/{id}/scorecard` | Fetches scorecard stats, counts, and question review answers |
| `POST` | `/api/submissions` | Saves solution solve attempt |
| `PATCH` | `/api/submissions/{id}/grade` | Grades written files and leaves feedback |
| `POST` | `/api/submissions/bulk-grade` | Scopes grading values across selected entries |
| `POST` | `/api/submissions/bulk-reviewed` | Marks selected files as reviewed |
| `POST` | `/api/uploads` | Writes binary files to `./uploads` storage directory |
| `GET` | `/api/files/preview/{file}` | Streams file content inline for browsers |
| `GET` | `/api/files/download/{file}` | Streams attachment download headers |
| `POST` | `/api/certificates/generate` | Generates a digital certificate metadata record |
| `GET` | `/api/certificates/student/{id}`| Lists certificates earned by student ID |
| `GET` | `/api/certificates/{id}` | Fetches individual certificate layout values |

---

## Database Collections

- **`users`**: Contains account profiles, avatars, credentials, and batch assignments.
- **`assessments`**: Contains assessment titles, instructions, deadline timestamps, status modes (draft/published), batch allocations, and embedded question arrays.
- **`submissions`**: Contains references to assessments, learner answers map, marks obtained, percentage score, submission files, and teacher comments.
- **`materials`**: Contains references to course download files and metadata details.
- **`certificates`**: Contains unique certification identifiers, student keys, scores, and dates.

---

## File Upload, Preview, and Download
- **Upload**: Handled via `POST /api/uploads`. Renames documents with timestamp prefixes to avoid collisions.
- **Preview**: Handled by `FilePreviewModal.tsx`:
  - `.pdf` / `.txt` / `.png` / `.jpg` are rendered using dedicated browser iframe containers.
  - `.docx` documents are converted to inline HTML markup using Mammoth.js.
  - `.xlsx` / `.csv` files are parsed into interactive spreadsheets grids using SheetJS.
- **Download**: Streams file chunks with attachment headers to force download actions.

---

## Assessment Lifecycle
```text
Create (Manual/Excel) ➔ Save as Draft ➔ Publish ➔ Learner Attempt ➔ Auto Grading / Teacher Evaluation ➔ Scorecard Review ➔ Certificate Release (if score >= 90%)
```

---

## Excel Import Format
Required spreadsheet layout columns:
1. `Question`: Question text.
2. `Option A`: First option choice.
3. `Option B`: Second option choice.
4. `Option C`: Third option choice (optional).
5. `Option D`: Fourth option choice (optional).
6. `Correct Answer`: String matching the exact correct option text (or letters A, B, C, D).
7. `Marks`: The question's grade weight.
8. `Question Type`: Set to `mcq` or `written`.
9. `Explanation`: Answer explanation text (optional).

---

## Deployment

### Frontend (Vercel)
1. Add new project on Vercel and import your repository.
2. Configure **Root Directory** as `assessment-portal`.
3. Add Environment Variable `NEXT_PUBLIC_API_URL` pointing to backend hosting.

### Backend (Railway/Render)
1. Add new web service project linking the Java project.
2. Configure **Root Directory** as `assessment-portal/backend`.
3. Set environment variable `SPRING_DATA_MONGODB_URI` pointing to your MongoDB Atlas cluster.
4. Run Maven build command `./mvnw clean package -DskipTests` and start application with `java -jar target/assessment-portal-backend-0.0.1-SNAPSHOT.jar`.

---

## Screenshots
Screenshots placeholders:
- Login Page: `assessment-portal/public/images/login-screenshot.png`
- Teacher Dashboard: `assessment-portal/public/images/teacher-dashboard.png`
- Learner Dashboard: `assessment-portal/public/images/learner-dashboard.png`

---

## Future Enhancements
- **Redis Caching**: Cache resource downloads to lower database traffic load.
- **OAuth Integration**: Secure authorization flows using Google OAuth2 and JWT.
- **Websockets Feed**: Alert users in real-time about new assessment deadlines.

---

## Author
**Pardhu Tirumalasetti**
- GitHub: [Pardhu643](https://github.com/Pardhu643)
