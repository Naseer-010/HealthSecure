# 🏥 HealthSecure - Blockchain-Enabled Medical Records Platform

A secure, decentralized healthcare records management system built with **Next.js** frontend, **Django REST API** backend, and **IPFS/Blockchain** integration for tamper-proof medical record storage.

![HealthSecure Platform](https://img.shields.io/badge/Platform-Health%20Tech-26A69A?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black?style=for-the-badge&logo=next.js)
![Django](https://img.shields.io/badge/Backend-Django%205-092E20?style=for-the-badge&logo=django)
![IPFS](https://img.shields.io/badge/Storage-IPFS-65C2CB?style=for-the-badge&logo=ipfs)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start with Docker](#-quick-start-with-docker)
- [Manual Setup (Without Docker)](#-manual-setup-without-docker)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)

---

## 🎯 Overview

**HealthSecure** is a modern healthcare records platform that addresses the critical challenges of medical data management:

- **Data Ownership**: Patients control who can view their records through visibility toggles
- **Immutability**: Medical records are hashed and stored on IPFS for tamper-proof verification
- **Interoperability**: Doctors can search patients by Health ID and add verified records
- **Security**: SHA256-based blockchain IDs provide cryptographic identity verification

### How It Works

1. **Patients** register and receive a unique Health ID (e.g., `HID-E364-FA82`) and blockchain identity
2. **Doctors** register with their medical license and can search for patients
3. **Medical Records** are created by doctors and optionally stored on IPFS
4. **Verification** is achieved through blockchain-style hashing and IPFS content addressing

---

## ✨ Features

### For Patients
- 🆔 Unique Health ID generation
- 📊 Personal dashboard with medical history
- 👁️ Control record visibility (hide/show from doctors)
- 🔐 Blockchain-based identity verification
- 📱 Responsive, mobile-friendly interface

### For Doctors
- 🔍 Search patients by Health ID
- 📝 Create medical records (prescriptions, diagnoses, lab reports)
- 📤 Upload certificates to IPFS
- ✅ Verified doctor badge system
- 📋 View patient medical history timeline

### Technical Features
- 🔗 **IPFS Integration** via Pinata for decentralized file storage
- 🔑 **JWT Authentication** with role-based access control
- 🛡️ **SHA256 Blockchain IDs** for user identity
- 📦 **Docker Support** for easy deployment
- 🌐 **i18n Ready** translation support

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS |
| **UI Components** | shadcn/ui, Radix UI, Lucide Icons |
| **Backend** | Django 5.x, Django REST Framework |
| **Authentication** | JWT (Simple JWT) |
| **Database** | SQLite (dev) / PostgreSQL (prod) |
| **Decentralized Storage** | IPFS via Pinata |
| **Containerization** | Docker, Docker Compose |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                    (Next.js + React)                         │
│         localhost:3000 / Docker: frontend:3000               │
└─────────────────────┬───────────────────────────────────────┘
                      │ REST API Calls
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                         Backend                              │
│                    (Django REST API)                         │
│         localhost:8000 / Docker: backend:8000                │
└──────────┬──────────────────────────────────┬───────────────┘
           │                                   │
           ▼                                   ▼
┌──────────────────────┐           ┌──────────────────────┐
│      Database        │           │        IPFS          │
│   (SQLite/Postgres)  │           │   (Pinata Gateway)   │
└──────────────────────┘           └──────────────────────┘
```

---

## 🐳 Quick Start with Docker

The fastest way to run HealthSecure is using Docker Compose.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/healthsecure.git
   cd healthsecure
   ```

2. **Set up environment variables** (optional, for IPFS)
   ```bash
   # Create .env file in project root
   echo "PINATA_API_KEY=your_pinata_api_key" >> .env
   echo "PINATA_SECRET_KEY=your_pinata_secret_key" >> .env
   ```

3. **Build and run**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api

5. **Stop the containers**
   ```bash
   docker-compose down
   ```

### Docker Services

| Service | Port | Description |
|---------|------|-------------|
| `frontend` | 3000 | Next.js application |
| `backend` | 8000 | Django REST API |

---

## 💻 Manual Setup (Without Docker)

### Prerequisites
- **Node.js** v20.x or higher
- **Python** 3.10 or higher
- **pip** (Python package manager)
- **npm** or **pnpm**

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   # Create .env file
   cat > .env << EOF
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   FRONTEND_URL=http://localhost:3000
   PINATA_API_KEY=your_pinata_api_key
   PINATA_SECRET_KEY=your_pinata_secret_key
   EOF
   ```

5. **Run migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start the server**
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

### Frontend Setup

1. **Navigate to project root** (in a new terminal)
   ```bash
   cd healthsecure  # project root, not backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open http://localhost:3000 in your browser

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `SECRET_KEY` | Django secret key | Yes |
| `DEBUG` | Enable debug mode | No (default: False) |
| `ALLOWED_HOSTS` | Comma-separated allowed hosts | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |
| `PINATA_API_KEY` | Pinata API key for IPFS | No |
| `PINATA_SECRET_KEY` | Pinata secret key | No |
| `PINATA_GATEWAY` | Custom IPFS gateway URL | No |

### Frontend (`.env.local`)

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login/` | Login (returns JWT tokens) |
| POST | `/api/auth/token/refresh/` | Refresh access token |
| POST | `/api/auth/register/patient/` | Register new patient |
| POST | `/api/auth/register/doctor/` | Register new doctor |

### Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/profile/` | Get current user profile |
| PUT | `/api/auth/profile/` | Update profile |
| GET | `/api/auth/stats/` | Get dashboard statistics |

### Medical Records

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/records/` | List user's records |
| POST | `/api/records/` | Create new record (doctors) |
| GET | `/api/records/{id}/` | Get record details |
| POST | `/api/records/{id}/toggle-visibility/` | Toggle record visibility |

### Patient Search (Doctors Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/patients/{health_id}/` | Search patient by Health ID |
| GET | `/api/records/patient/{health_id}/` | Get patient's visible records |

### IPFS Verification

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/ipfs/verify/{cid}/` | Verify IPFS content |

---

## 📁 Project Structure

```
healthsecure/
├── app/                      # Next.js app directory
│   ├── dashboard/            # Dashboard pages
│   │   ├── patient/          # Patient dashboard
│   │   └── doctor/           # Doctor dashboard
│   ├── login/                # Login page
│   ├── signup/               # Registration page
│   └── layout.tsx            # Root layout
├── components/               # React components
│   ├── dashboard/            # Dashboard-specific components
│   └── ui/                   # shadcn/ui components
├── hooks/                    # Custom React hooks
│   └── useAuth.ts            # Authentication hook
├── lib/                      # Utility libraries
│   ├── api.ts                # API client functions
│   └── utils.ts              # Helper utilities
├── backend/                  # Django backend
│   ├── healthsecure/         # Django project settings
│   ├── users/                # User management app
│   │   ├── models.py         # User, Patient, Doctor models
│   │   ├── views.py          # API views
│   │   ├── serializers.py    # DRF serializers
│   │   └── ipfs_service.py   # IPFS/Pinata integration
│   ├── records/              # Medical records app
│   ├── manage.py             # Django management script
│   ├── requirements.txt      # Python dependencies
│   └── Dockerfile            # Backend Docker config
├── docker-compose.yml        # Docker Compose configuration
├── Dockerfile                # Frontend Docker config
├── package.json              # Node.js dependencies
└── README.md                 # This file
```

---

## 🔑 User Roles

### Patient
- Can view their own medical records
- Can toggle visibility of records (hide from doctors)
- Receives unique Health ID on registration
- Gets blockchain identity for verification

### Doctor
- Can search for patients by Health ID
- Can view patient's visible medical records
- Can create new medical records for patients
- Can upload medical certificates to IPFS
- Requires verification (manual approval)

---

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
python manage.py test
```

### Run Frontend Tests (if configured)
```bash
npm test
```

---

## 🚀 Deployment

### Production Considerations

1. **Change secret keys** - Generate a new `SECRET_KEY` for Django
2. **Disable debug mode** - Set `DEBUG=False`
3. **Use PostgreSQL** - Configure a production database
4. **Set up HTTPS** - Use a reverse proxy like Nginx with SSL
5. **Configure CORS** - Restrict `ALLOWED_HOSTS` and CORS origins
6. **Set up Pinata** - Add production IPFS API keys

### Example Production Docker Compose

```yaml
services:
  backend:
    environment:
      - DEBUG=False
      - SECRET_KEY=${PRODUCTION_SECRET_KEY}
      - ALLOWED_HOSTS=your-domain.com
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Pinata](https://pinata.cloud/) for IPFS pinning services
- [Django REST Framework](https://www.django-rest-framework.org/) for the API framework

---

<p align="center">
  Made with ❤️ for better healthcare data management
</p>
