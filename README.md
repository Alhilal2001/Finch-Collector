
# Finch_collector_SPA

This is a Full Stack Web Application built as a warm-up project before the final Capstone.

It allows users to create an account, manage their collection of finches and associated toys, log feedings, and upload photos.  
The project emphasizes secure authentication, user-specific data, and a clean, responsive design.

---

## Features

- User authentication (Signup, Login, Logout)
- Add, edit, delete finches (CRUD operations)
- Associate toys with each finch
- Upload photos for each finch
- Feeding log with date picker
- User-specific data and protected routes
- Responsive layout for all screen sizes

---

## Technologies Used

- Frontend: React
- Backend: Django REST Framework
- Database: PostgreSQL
- Authentication: JWT (JSON Web Tokens)
- Styling: Tailwind CSS
- Environment Management: Pipenv + python-dotenv

---

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/your-username/Finch_collector_SPA.git
```

2. Install backend dependencies:

```bash
cd backend
pipenv install
```

3. Activate the virtual environment:

```bash
pipenv shell
```

4. Install missing packages if needed:

```bash
pipenv install python-dotenv
```

5. Set up the database:

```bash
python manage.py migrate
```

6. Run the backend server:

```bash
python manage.py runserver
```

7. Install frontend dependencies:

```bash
cd frontend
npm install
```

8. Run the frontend server:

```bash
npm run dev
```

---

## Notes

- Ensure you have PostgreSQL installed and running.
- Create a `.env` file in the backend directory if needed, and define environment variables like `SECRET_KEY`, `DATABASE_URL`, and `DEBUG`.
- JWT Authentication is used for protecting API endpoints.
- Frontend and backend must be running simultaneously during development.

Example of `.env` file:

```env
SECRET_KEY=your_secret_key_here
DEBUG=True
DATABASE_URL=postgres://username:password@localhost:5432/your_database
```

---

## License

This project is for educational purposes as part of a bootcamp training.
