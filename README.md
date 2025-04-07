# 🎓 Learning Management System (LMS)

[![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Django-4.2-092e20.svg)](https://www.djangoproject.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14.0-336791.svg)](https://www.postgresql.org/)

## 👥 Team

| Role        | Name                                          |
| ----------- | --------------------------------------------- |
| Team Leader | [ImamIfti056](https://github.com/ImamIfti056) |
| Developer   | [yuusaif](https://github.com/yuusaif)         |
| Developer   | [SyedSadi](https://github.com/SyedSadi)       |
| Mentor      | [maahad767](https://github.com/maahad767)     |

## 📝 Overview

A modern Learning Management System built to revolutionize online education. Our platform provides comprehensive tools for course management, interactive learning, and assessment.

### 🌟 Key Features

- **📚 Course Management**

  - Create and organize course content
  - Upload multiple file formats (PDF, PPT, Video)
  - Embed YouTube videos seamlessly
  - Track course progress

- **🎯 Interactive Learning**

  - Real-time discussion forums
  - Q&A sections
  - Community engagement features
  - Rating and feedback system

- **📝 Assessment System**
  - Timed MCQ quizzes (25 questions, 25 minutes)
  - Instant results and feedback
  - Progress tracking
  - Performance analytics

## 🛠️ Tech Stack

- **Frontend:**

  - React.js with Vite
  - TailwindCSS for styling
  - Redux for state management
  - Axios for API calls

- **Backend:**
  - Django REST Framework
  - PostgreSQL database
  - JWT Authentication
  - Celery for async tasks

## 🚀 Getting Started

### Prerequisites

```bash
# Required versions
Node.js >= 16.0.0
Python >= 3.8.0
PostgreSQL >= 14.0
```

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/seagull.git
cd seagull
```

2. **Backend Setup**

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
```

3. **Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```

## 🔧 Development

### Branch Naming Convention

- Feature: `feature/your-feature-name`
- Bugfix: `bugfix/issue-description`
- Hotfix: `hotfix/critical-fix`

### Commit Guidelines

- Use clear, descriptive commit messages
- Reference issue numbers when applicable
- Keep commits focused and atomic

## 📚 Documentation

- [API Documentation](docs/api.md)
- [Development Guide](docs/development.md)
- [Contributing Guidelines](CONTRIBUTING.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Special thanks to our mentor [@maahad767](https://github.com/maahad767)
- All contributors who have helped shape this project

---

<p align="center">Made with ❤️ by Team Seagull</p>
