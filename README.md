# 🚀 EquiScan: Accessibility & Document Analyzer

**EquiScan** is a fully functional **MERN Stack** (MongoDB, Express, React, Node.js) application designed to analyze the accessibility and quality of digital documents and web content against industry standards like **WCAG 2.1** and **ATS (Applicant Tracking System)**.

This project was developed as a Major College project Submission by Aditya Kumar & Team.

-

## 💡 Key Features and Technical Highlights

EquiScan stands out as a robust application powered by the **MERN Stack**, integrating advanced technologies for compliance and user experience.

### Secure and Robust Architecture

The project is built on a scalable **MERN architecture**, ensuring a secure and efficient user experience. We utilize **JWT (JSON Web Tokens)** for protected routes and industry-standard **`bcrypt` hashing** for password security. The application features essential **Email-based Password Reset functionality** through **Nodemailer**, enhancing user account management and credibility. The frontend delivers a superior user experience with a responsive, animated, **dark-themed UI** utilizing **React.js** and **Tailwind CSS**.

### Advanced Accessibility Analysis Engine

EquiScan’s core strength lies in its diverse analysis capabilities, handled securely in the Node.js backend:

* **Website Analysis:** Uses **Puppeteer (Headless Chromium)** to perform real-time DOM inspection of any live URL, providing a critical **WCAG-based** assessment of structural elements like H1 tags and alt attributes.
* **Document Scoring (ATS/WCAG):** The system processes complex file types (**PDF, DOCX, PPTX**) using CJS/Node libraries. It provides a composite score based on **ATS (Applicant Tracking System) keyword density** and checks for document accessibility rules.

### Integrated Artificial Intelligence (Gemini AI)

We leverage the **Gemini AI API** to transform raw error reports into actionable solutions:

* **AI-Generated Suggestions:** For every error detected (whether in a website or a document), the AI generates a **precise, technical suggestion** on how to fix the issue, focusing on web standards and WCAG compliance.
* **EquiScan AI Chatbot:** An integrated, specialized AI assistant provides instantaneous, authoritative answers on complex WCAG 2.1 guidelines, MERN stack questions, and project methodology.

---

## 🛠️ Project Setup and Installation

Follow these steps to get the project running locally.

### 1. Prerequisites

Ensure you have the following installed:

* **Node.js** (v18+) & **npm**
* **MongoDB Atlas** account (or local MongoDB)
* **Git**

### 2. Configuration (`.env` Setup)

Create a **`.env`** file inside the **`server`** directory and add your credentials. **(CRITICAL: This file is excluded via .gitignore for security.)**

**File: `server/.env`** 
MONGO_URI="YOUR_MONGODB_ATLAS_CONNECTION_STRING"

JWT_SECRET="A_STRONG_RANDOM_SECRET_KEY"

GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"

EMAIL_USER=your_gmail_id@gmail.com 

EMAIL_PASS=YOUR_GMAIL_APP_PASSWORD

### 3. Installation

Clone the repository and install dependencies:

```bash
# 1. Clone the repository
git clone https://github.com/adityak12322/EquiScan-Accessibility-Analyzer
cd EquiScan-Accessibility-Analyzer

# 2. Install Backend Dependencies
cd server
npm install

# 3. Install Frontend Dependencies
cd ../client
npm install


# 4. Running the Project
Open two separate terminal windows:

Terminal 1: Start Backend Server (API)
cd server
npm run dev
Terminal 2: Start Frontend Client (React App)
cd client
npm run dev

The application will launch on http://localhost:5173.

### 🧑‍💻 Developer Credit & SupportRoleDetails
Lead Developer : Aditya Kumar & Team
Email: adityak12322@gmail.com
