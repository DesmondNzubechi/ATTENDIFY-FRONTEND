# ATTENDIFY - FRONTEND

**Attendify** is a web-based attendance management system designed to modernize how attendance is tracked and recorded in academic environments. This frontend application is built using **React with Vite**, along with supporting libraries and tools such as **Zustand**, **Tailwind CSS**, and the native **Fetch API**, to deliver a responsive, fast, and user-friendly experience for administrators, lecturers, and students.

---

## 📖 Project Overview

### What is Attendify?

Attendify is a centralized platform that allows schools and academic institutions to handle attendance digitally. It was born out of a real-life challenge — as a class representative, I often experienced the difficulties of managing physical attendance sheets. Lecturers would lose them, or they’d get misplaced entirely. In such cases, no backup existed, and attendance data was permanently lost.

Moreover, the Head of Department (HOD) wanted to monitor students' attendance performance, but the manual process made it nearly impossible to analyze or retrieve that data effectively.

With Attendify, these problems are solved through digital transformation.

---

## Key Features

### Authentication System
- Only authenticated users can access the platform.
- Role-based access: Admin and Lecturer.
- No public registration. Only the admin can add users (students or lecturers).
- Auth state is globally managed using React Context and Zustand.

### Admin Capabilities
- Add and manage **academic sessions**.
- Add **subjects** that students are enrolled in.
- Upload **student data** to the platform.
- Create and manage **lecturer accounts** (assigned with default passwords).
- Create, view, and manage **attendance** for each class.
- Access detailed **analytics** and **activity logs**.
- Export attendance data in **Word or PDF format**.

### Lecturer Capabilities
- Login using credentials provided by the admin.
- Change default password after logging in.
- View subjects and attendance assigned to them.
- Activate, mark, and deactivate attendance for their classes.

### Attendance Management
- Attendance data is saved in the backend immediately after being marked.
- The UI updates in real-time to reflect marked status.
- Export options are provided for Word and PDF formats.

### Activity Logs
- Every action taken on the platform (e.g., creating/deleting attendance, adding students) is recorded.
- Includes the action, date, and user responsible.
- Displayed in the admin dashboard for transparency and monitoring.

### Analytics Dashboard
- The admin dashboard provides real-time statistics on:
  - Number of students
  - Attendance sessions
  - Participation rates
  - Recent activities

---

## Tech Stack

| Technology      | Purpose                            |
|-----------------|------------------------------------|
| React (Vite)    | Frontend framework                 |
| TypeScript      | Type safety                        |
| Tailwind CSS    | Utility-first CSS framework        |
| Zustand         | Global state management            |
| React Context   | Authentication context             |
| Fetch API       | HTTP requests                      |
| React Hook Form | Form validation                    |
| html2pdf.js     | PDF Export                         |
| docx            | Word Export                        |

---

## 📁 Project Structure

```
src/
├── assets/            // Images and icons
├── components/        // Reusable UI components
├── context/           // Authentication context
├── layouts/           // Application layout wrapper
├── pages/             // Main route components
├── services/          // API logic (auth, attendance, etc.)
├── store/             // Zustand state slices
├── styles/            // Tailwind config and global styles
├── utils/             // Helper functions
└── main.tsx           // App entry point
```

---

## 🌐 API Communication

### API Client

- The app uses the native **Fetch API** for all HTTP requests.
- A reusable helper function is used to wrap the Fetch logic.
- All endpoints can be accessed by passing in the route and options (method, body, headers).

### Auth Service

- Handles all authentication-related requests (login, logout, etc.)
- Centralized in `authServices.ts`.

### Integration Flow

- All service functions are used in components via hooks or directly in event handlers.
- Authentication status and user data are stored in Zustand and provided globally via `AuthContext`.

---

##  Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/attendify-frontend.git
cd attendify-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Environment Variables

Create a `.env` file in the root directory and add the following:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Replace with your actual backend API URL.

### 4. Start the Development Server

```bash
npm run dev
```

---

## 📤 Export Options

- Attendance data can be exported as:
  - **PDF** using `html2pdf.js`
  - **Word** using the `docx` package

These features are available on the attendance page once the data is populated.

---

## ✅ Future Improvements

- Add student login interface for performance monitoring.
- Add parent portal for tracking child’s attendance.
- Enable push notifications for attendance reminders.
- Support biometric integration for physical attendance tracking.

---

## 📌 Backend

Attendify uses a **Node.js + Express** backend with **MongoDB** for storing attendance data, user profiles, logs, and more.

[Backend README →](#) *(Replace with the actual GitHub link)*

---

## 👨‍💻 Author

**Desmond Nzubechukwu**  
Software Engineer | Product Builder  
📫 [LinkedIn](https://linkedin.com/in/desmond-nzubechukwu)  
🐦 [Twitter](https://twitter.com/desmond_dev)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---