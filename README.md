# Novel vs Novel Voting App

A web application that allows users to vote between two novels and view real-time results.

## Features

- User authentication (login/register)
- Admin dashboard to control voting
- Real-time vote counting
- Results display control
- Responsive design

## Tech Stack

- **Frontend**: Next.js, TailwindCSS
- **Backend**: Django, Django REST Framework
- **Authentication**: JWT (JSON Web Tokens)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create .env file:
   ```
   DEBUG=True
   SECRET_KEY=your-secret-key-here
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Create superuser:
   ```bash
   python manage.py createsuperuser
   ```

7. Run the server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create .env.local file:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Backend (Render)

1. Create a new Web Service on Render
2. Link your GitHub repository
3. Set build command: `./build.sh`
4. Set start command: `gunicorn backend.wsgi:application`
5. Add environment variables:
   - `DEBUG`: `False`
   - `SECRET_KEY`: your-secret-key

### Frontend (Vercel)

1. Create a new project on Vercel
2. Link your GitHub repository
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: your-render-backend-url

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 