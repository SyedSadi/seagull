# Contributing to Seagull LMS

We’re excited you want to contribute to Seagull – a Learning Management System built with Django and React. The following is a guide to help you get started.

---

## 📦 Project Setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd server
python -m venv env
source env/bin/activate  # or env\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Ensure PostgreSQL is running and your `.env` is configured properly.

---

## 🛠 How to Contribute

### 1. Fork the Repository

Click the "Fork" button on the top-right corner of the repository page.

### 2. Clone Your Fork

```bash
git clone https://github.com/your-username/seagull.git
cd seagull
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 4. Make Changes

Follow our code style guides:
- **Frontend**: ESLint + Prettier
- **Backend**: PEP8 using Flake8 or Black

### 5. Run Tests (if applicable)

Make sure your changes don’t break anything.

### 6. Commit & Push

```bash
git add .
git commit -m "feat: add new feature"
git push origin feature/your-feature-name
```

### 7. Submit a Pull Request

Go to your forked repo and open a pull request against the `development` branch.

---

## ✅ Pull Request Guidelines

- Keep PRs focused on one issue.
- Include a clear title and description.
- Reference related issue(s) in your PR description.
- Add screenshots or screen recordings for UI changes.
- Ensure all tests pass and new tests are added for your changes.

---

## 📋 Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```
feat: add new quiz creation UI
fix: correct login redirect issue
docs: update README with setup instructions
```

---

## 🧪 Running Tests

### Django backend

```bash
pytest server/backend
```
---

## 🙌 Need Help?

Open an issue or ask in discussions. We're happy to support contributors!

---

Thank you for contributing! 🚀
