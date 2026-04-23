# InternNexus

InternNexus is a full-stack internship platform that connects students with companies for internship discovery and application management.

🔗 Live: https://intern-nexus-six.vercel.app

---

## Overview

- Students can browse, filter, and apply to internships  
- Companies can post internships and manage applicants  
- Secure role-based authentication system  

---

## Demo Notice

This project uses **simulated company data and internship listings** to demonstrate platform functionality.

In a real-world system, this would include:
- Company verification  
- Content moderation  
- Fraud prevention  

---

## How It Works

1. **Authentication**
   - Users register as Student or Company  
   - Login generates a JWT token stored in localStorage  
   - Token is sent with every API request  

2. **Student Flow**
   - Fetch internships from backend API  
   - Apply with one click  
   - Applications stored with status (Pending / Accepted / Rejected)  
   - Duplicate applications prevented at backend  

3. **Company Flow**
   - Post one or multiple internships  
   - View all applicants  
   - Accept or reject applications  

4. **Backend Logic**
   - REST API built with Express  
   - Role-based middleware protects routes  
   - Database handles users, internships, and applications  

---

## Features

- Real-time search and filtering  
- Application tracking system  
- Company dashboard  
- Instant UI updates (no page reload)  
- Responsive design  

---

## Tech Stack

**Frontend**
- React (Vite) – UI development  
- Tailwind CSS – styling  
- Axios – API communication  
- React Router – navigation  

**Backend**
- Node.js – runtime  
- Express.js – API layer  

**Database**
- PostgreSQL (Neon) – relational data storage  

**Authentication**
- JWT – session handling  
- bcrypt – password hashing  

**Deployment**
- Vercel – frontend  
- Render – backend  

---

## Status

This is a **portfolio project** demonstrating full-stack development and real-world application logic.

---