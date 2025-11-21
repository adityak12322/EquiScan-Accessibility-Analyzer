🚀 EquiScan: Accessibility & Document Analyzer
EquiScan is a fully functional MERN Stack (MongoDB, Express, React, Node.js) application designed to analyze the accessibility and quality of digital documents and web content against industry standards like WCAG 2.1 and ATS (Applicant Tracking System).

This project was developed as a Major College Submission by Aditya Kumar & Team.

✨ Key Features and Technical HighlightsThis project combines robust full-stack development with advanced analysis techniques:Feature AreaKey FunctionalityCore Technology UsedUser Experience (UX)Modern UI: Animated, professional two-column, dark-themed UI.React.js, Tailwind CSSSecurity & AuthSecure Access: Uses JWT (JSON Web Tokens) for protected routes and bcrypt for password hashing. Also implements Email-based Password Reset.Node.js, Express, jsonwebtoken, nodemailerCore Web AnalysisWebsite Accessibility Check: Real-time DOM inspection for H1, Alt Text, and Title checks.Puppeteer (Headless Chromium)Document AnalysisFile Parsing: Logic implemented for extracting text from PDF, DOCX, and PPTX for analysis.pdf-parse, mammoth, pptx2json (CJS/Node Libraries)Artificial IntelligenceAI-Powered Suggestions: Provides concise, technical solutions for each error using the Gemini AI API.Gemini AI API, Node.js ControllerInteractive ChatbotEquiScan AI Assistant: A secure, specialized chatbot providing immediate answers on WCAG rules and the MERN stack.Gemini AI APIData ManagementCRUD Operations: Stores detailed analysis reports in MongoDB Atlas and allows history fetching and record deletion.MongoDB Atlas, Express 
🛠️ Project Setup and Installation
Follow these steps to get the project running locally.

1. Prerequisites
Ensure you have the following installed:

Node.js (v18+) & npm

MongoDB Atlas account (or local MongoDB)

Git

Here is the complete, final README.md file for your EquiScan Accessibility Analyzer project. This file is comprehensive, ready for submission, and includes all the features, libraries, and contact details you requested.🚀 EquiScan: Accessibility & Document AnalyzerEquiScan is a fully functional MERN Stack (MongoDB, Express, React, Node.js) application designed to analyze the accessibility and quality of digital documents and web content against industry standards like WCAG 2.1 and ATS (Applicant Tracking System).This project was developed as a Major College Submission by Aditya Kumar & Team.✨ Key Features and Technical HighlightsThis project combines robust full-stack development with advanced analysis techniques:Feature AreaKey FunctionalityCore Technology UsedUser Experience (UX)Modern UI: Animated, professional two-column, dark-themed UI.React.js, Tailwind CSSSecurity & AuthSecure Access: Uses JWT (JSON Web Tokens) for protected routes and bcrypt for password hashing. Also implements Email-based Password Reset.Node.js, Express, jsonwebtoken, nodemailerCore Web AnalysisWebsite Accessibility Check: Real-time DOM inspection for H1, Alt Text, and Title checks.Puppeteer (Headless Chromium)Document AnalysisFile Parsing: Logic implemented for extracting text from PDF, DOCX, and PPTX for analysis.pdf-parse, mammoth, pptx2json (CJS/Node Libraries)Artificial IntelligenceAI-Powered Suggestions: Provides concise, technical solutions for each error using the Gemini AI API.Gemini AI API, Node.js ControllerInteractive ChatbotEquiScan AI Assistant: A secure, specialized chatbot providing immediate answers on WCAG rules and the MERN stack.Gemini AI APIData ManagementCRUD Operations: Stores detailed analysis reports in MongoDB Atlas and allows history fetching and record deletion.MongoDB Atlas, Express Routing🛠️ Project Setup and InstallationFollow these steps to get the project running locally.1. PrerequisitesEnsure you have the following installed:Node.js (v18+) & npmMongoDB Atlas account (or local MongoDB)Git2. Configuration (.env Setup)Create a .env file inside the server directory and add your credentials. (IMPORTANT: This file is excluded from GitHub for security.)File: server/.env
# Database Connection (Crucial for storing users and reports)
MONGO_URI="YOUR_MONGODB_ATLAS_CONNECTION_STRING"

# Security Keys
JWT_SECRET="A_STRONG_RANDOM_SECRET_KEY"
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"

# Email Configuration (for Password Reset functionality)
EMAIL_USER=your_gmail_id@gmail.com
EMAIL_PASS=YOUR_GMAIL_APP_PASSWORD

Here is the complete, final README.md file for your EquiScan Accessibility Analyzer project. This file is comprehensive, ready for submission, and includes all the features, libraries, and contact details you requested.🚀 EquiScan: Accessibility & Document AnalyzerEquiScan is a fully functional MERN Stack (MongoDB, Express, React, Node.js) application designed to analyze the accessibility and quality of digital documents and web content against industry standards like WCAG 2.1 and ATS (Applicant Tracking System).This project was developed as a Major College Submission by Aditya Kumar & Team.✨ Key Features and Technical HighlightsThis project combines robust full-stack development with advanced analysis techniques:Feature AreaKey FunctionalityCore Technology UsedUser Experience (UX)Modern UI: Animated, professional two-column, dark-themed UI.React.js, Tailwind CSSSecurity & AuthSecure Access: Uses JWT (JSON Web Tokens) for protected routes and bcrypt for password hashing. Also implements Email-based Password Reset.Node.js, Express, jsonwebtoken, nodemailerCore Web AnalysisWebsite Accessibility Check: Real-time DOM inspection for H1, Alt Text, and Title checks.Puppeteer (Headless Chromium)Document AnalysisFile Parsing: Logic implemented for extracting text from PDF, DOCX, and PPTX for analysis.pdf-parse, mammoth, pptx2json (CJS/Node Libraries)Artificial IntelligenceAI-Powered Suggestions: Provides concise, technical solutions for each error using the Gemini AI API.Gemini AI API, Node.js ControllerInteractive ChatbotEquiScan AI Assistant: A secure, specialized chatbot providing immediate answers on WCAG rules and the MERN stack.Gemini AI APIData ManagementCRUD Operations: Stores detailed analysis reports in MongoDB Atlas and allows history fetching and record deletion.MongoDB Atlas, Express Routing🛠️ Project Setup and InstallationFollow these steps to get the project running locally.1. PrerequisitesEnsure you have the following installed:Node.js (v18+) & npmMongoDB Atlas account (or local MongoDB)Git2. Configuration (.env Setup)Create a .env file inside the server directory and add your credentials. (IMPORTANT: This file is excluded from GitHub for security.)File: server/.env# Database Connection (Crucial for storing users and reports)
MONGO_URI="YOUR_MONGODB_ATLAS_CONNECTION_STRING"

# Security Keys
JWT_SECRET="A_STRONG_RANDOM_SECRET_KEY"
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"

# Email Configuration (for Password Reset functionality)
EMAIL_USER=your_gmail_id@gmail.com
EMAIL_PASS=YOUR_GMAIL_APP_PASSWORD 
3. InstallationClone the repository and install dependencies for both the server and client:Bash# 1. Clone the repository
git clone YOUR_GITHUB_REPOSITORY_URL
cd EquiScan-Accessibility-Analyzer

# 2. Install Backend Dependencies (in server directory)
cd server
npm install

# 3. Install Frontend Dependencies (in client directory)
cd ../client
npm install
cd ..
4. Running the ProjectOpen two separate terminal windows:Terminal 1: Start Backend Server (API)Bashcd server
npm run dev 
Terminal 2: Start Frontend Client (React App)Bashcd client
npm run dev
The application will launch on http://localhost:5173.

Here is the complete, final README.md file for your EquiScan Accessibility Analyzer project. This file is comprehensive, ready for submission, and includes all the features, libraries, and contact details you requested.🚀 EquiScan: Accessibility & Document AnalyzerEquiScan is a fully functional MERN Stack (MongoDB, Express, React, Node.js) application designed to analyze the accessibility and quality of digital documents and web content against industry standards like WCAG 2.1 and ATS (Applicant Tracking System).This project was developed as a Major College Submission by Aditya Kumar & Team.✨ Key Features and Technical HighlightsThis project combines robust full-stack development with advanced analysis techniques:Feature AreaKey FunctionalityCore Technology UsedUser Experience (UX)Modern UI: Animated, professional two-column, dark-themed UI.React.js, Tailwind CSSSecurity & AuthSecure Access: Uses JWT (JSON Web Tokens) for protected routes and bcrypt for password hashing. Also implements Email-based Password Reset.Node.js, Express, jsonwebtoken, nodemailerCore Web AnalysisWebsite Accessibility Check: Real-time DOM inspection for H1, Alt Text, and Title checks.Puppeteer (Headless Chromium)Document AnalysisFile Parsing: Logic implemented for extracting text from PDF, DOCX, and PPTX for analysis.pdf-parse, mammoth, pptx2json (CJS/Node Libraries)Artificial IntelligenceAI-Powered Suggestions: Provides concise, technical solutions for each error using the Gemini AI API.Gemini AI API, Node.js ControllerInteractive ChatbotEquiScan AI Assistant: A secure, specialized chatbot providing immediate answers on WCAG rules and the MERN stack.Gemini AI APIData ManagementCRUD Operations: Stores detailed analysis reports in MongoDB Atlas and allows history fetching and record deletion.MongoDB Atlas, Express Routing🛠️ Project Setup and InstallationFollow these steps to get the project running locally.1. PrerequisitesEnsure you have the following installed:Node.js (v18+) & npmMongoDB Atlas account (or local MongoDB)Git2. Configuration (.env Setup)Create a .env file inside the server directory and add your credentials. (IMPORTANT: This file is excluded from GitHub for security.)File: server/.env# Database Connection (Crucial for storing users and reports)
MONGO_URI="YOUR_MONGODB_ATLAS_CONNECTION_STRING"

# Security Keys
JWT_SECRET="A_STRONG_RANDOM_SECRET_KEY"
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"

# Email Configuration (for Password Reset functionality)
EMAIL_USER=your_gmail_id@gmail.com
EMAIL_PASS=YOUR_GMAIL_APP_PASSWORD 
3. InstallationClone the repository and install dependencies for both the server and client:Bash# 1. Clone the repository
git clone YOUR_GITHUB_REPOSITORY_URL
cd EquiScan-Accessibility-Analyzer

# 2. Install Backend Dependencies (in server directory)
cd server
npm install

# 3. Install Frontend Dependencies (in client directory)
cd ../client
npm install
cd ..
4. Running the ProjectOpen two separate terminal windows:Terminal 1: Start Backend Server (API)Bashcd server
npm run dev 
Terminal 2: Start Frontend Client (React App)Bashcd client
npm run dev
The application will launch on http://localhost:5173.🧑‍💻 Developer Credit & SupportRoleDetailsContactLead DeveloperAditya Kumar & TeamEmail: adityak12322@gmail.comInstitutionDronacharya Group Of InstitutionsSupportFor technical questions regarding the MERN stack or analysis logic, contact the developer via email.
