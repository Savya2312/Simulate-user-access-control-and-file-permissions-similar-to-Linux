# Linux User Access Control & File Permission Simulator

A full-stack web application that simulates Linux-style users, groups, files, and permissions. Built with a premium Ubuntu-inspired UI.

## 🚀 Features
- **Virtual File System**: Create, edit, and delete files/folders stored in MongoDB.
- **Permission Engine**: Full implementation of `rwx` permissions for Owner, Group, and Others.
- **Chmod Simulator**: Support for both symbolic (`rwxr-xr-x`) and numeric (`755`) permission updates.
- **Identity Management**: Admin can manage users, roles (Admin/User), and groups.
- **Interactive Terminal**: CLI-style terminal to run commands like `ls`, `chmod`, `whoami`, and `pwd`.
- **Activity Logs**: Real-time audit trail of all system operations and access attempts.
- **Premium UI**: Ubuntu/Linux terminal theme with glassmorphism and smooth animations.

---

## 🛠️ Tech Stack
- **Frontend**: React, Tailwind CSS, Lucide React, Framer Motion, Axios.
- **Backend**: Node.js, Express, JWT, MongoDB (Mongoose), Bcrypt.
- **Architecture**: MVC (Model-View-Controller).

---

## 📖 Linux Permission Guide

### Understanding the String: `rwxr-xr--`
A permission string consists of 10 characters (the first is usually `d` for directory or `-` for file, followed by 3 sets of 3).

| Set | Target | Description |
|-----|--------|-------------|
| **1st (u)** | Owner | The user who created/owns the file. |
| **2nd (g)** | Group | Users who belong to the file's assigned group. |
| **3rd (o)** | Others | Any other user in the system. |

### Symbolic vs Numeric
- **r** (read) = 4
- **w** (write) = 2
- **x** (execute) = 1

**Example: 755**
- 7 = 4+2+1 (**rwx**)
- 5 = 4+0+1 (**r-x**)
- 5 = 4+0+1 (**r-x**)
- Result: `rwxr-xr-x`

---

## 📦 Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB installed and running

### 1. Backend Setup
```bash
cd backend
npm install
# Update .env with your MONGO_URI
npm start
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Sample Test Users
| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |
| user1 | user123 | Normal User |
| user2 | user234 | Normal User |

---

## 📸 Screenshots (Placeholders)
- [Dashboard View]
- [Terminal Interface]
- [Permission Modal]
- [Activity Logs Table]
