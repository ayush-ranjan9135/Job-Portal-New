<h1 align="center">🚀 Job Portal Web Application</h1>

<p align="center">
A Full Stack Job Portal where companies can post jobs and users can apply seamlessly.
</p>

<hr>

<h2>📌 Project Overview</h2>
<p>
The <strong>Job Portal Application</strong> is a full-stack web platform designed to connect job seekers and companies.
Companies can register, post jobs, and manage applications.
Users can browse jobs, apply for positions, and upload resumes.
</p>

<ul>
  <li>✔ Company Registration & Login</li>
  <li>✔ User Authentication</li>
  <li>✔ Post & Manage Jobs</li>
  <li>✔ Apply for Jobs</li>
  <li>✔ Resume Upload</li>
  <li>✔ Secure APIs</li>
</ul>

<hr>

<h2>🛠️ Tech Stack</h2>

<h3>Frontend</h3>
<ul>
  <li>React.js</li>
  <li>Tailwind CSS</li>
</ul>

<h3>Backend</h3>
<ul>
  <li>Node.js</li>
  <li>Express.js</li>
</ul>

<h3>Database</h3>
<ul>
  <li>MongoDB</li>
  <li>Mongoose</li>
</ul>

<h3>Authentication & Security</h3>
<ul>
  <li>Clerk Authentication</li>
  <li>JWT (JSON Web Token)</li>
</ul>

<h3>Cloud & Monitoring</h3>
<ul>
  <li>Cloudinary (File Upload)</li>
  <li>Sentry (Error Monitoring)</li>
</ul>

<hr>

<h2>⚙️ Project Architecture</h2>

<pre>
Frontend (React)
       ↓
Backend (Express REST API)
       ↓
MongoDB Database
</pre>

<p>
The application follows RESTful API architecture with proper route handling and middleware authentication.
</p>

<hr>

<h2>🔐 Authentication Flow</h2>

<h4>For Users:</h4>
<ul>
  <li>Handled using Clerk authentication</li>
  <li>User ID stored securely</li>
</ul>

<h4>For Companies:</h4>
<ul>
  <li>JWT-based authentication</li>
  <li>Protected routes using middleware</li>
</ul>

<hr>

<h2>📂 Database Design</h2>

<ul>
  <li><strong>User</strong> → Stores user details</li>
  <li><strong>Company</strong> → Stores company information</li>
  <li><strong>Job</strong> → Job details linked to company</li>
  <li><strong>JobApplication</strong> → Links user & job with status</li>
</ul>

<hr>

<h2>📡 API Endpoints</h2>

<h4>Company APIs</h4>
<ul>
  <li>Register Company</li>
  <li>Login Company</li>
  <li>Post Job</li>
  <li>View Applicants</li>
</ul>

<h4>User APIs</h4>
<ul>
  <li>Register / Login</li>
  <li>View Jobs</li>
  <li>Apply for Job</li>
</ul>

<hr>

<h2>🚀 Installation & Setup</h2>

<h4>1️⃣ Clone Repository</h4>

<pre>
git clone https://github.com/your-username/job-portal.git
cd job-portal
</pre>

<h4>2️⃣ Install Dependencies</h4>

<pre>
npm install
</pre>

<h4>3️⃣ Setup Environment Variables</h4>

<pre>
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
CLERK_SECRET_KEY=your_cler
CLOUDINARY_CLOUD_NAME=your_clo
CLOUDINARY_API_KEY=your
CLOUDINARY_API_SECRET=
</pre>

<h4>4️⃣ Start Server</h4>

<pre>
npm run dev
</pre>

<hr>

<h2>🌟 Extra Features</h2>

<ul>
  <li>Search & Filter Jobs</li>
  <li>Resume Upload with Cloud Storage</li>
  <li>Error Monitoring with Sentry</li>
  <li>Secure Middleware Protection</li>
</ul>

<hr>

<h2>📈 Future Improvements</h2>

<ul>
  <li>Real-time Notifications</li>
  <li>Email Alerts</li>
  <li>Admin Dashboard</li>
  <li>AI-based Job Recommendations</li>
</ul>

<hr>

<h2>👨‍💻 Author</h2>

<p>
<strong>Ayush</strong><br>
B.Tech CSE Student<br>
Backend & Full Stack Developer
</p>

<hr>

<h3 align="center">⭐ If you like this project, give it a star!</h3>
