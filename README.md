# Notes App

A modern, responsive note-taking application built with React, Vite, Tailwind CSS, and Flowbite-React.

## Features

- **User Authentication** - Secure login and registration with JWT tokens
- **Note Management** - Create, read, update, and delete notes
- **Modern UI** - Beautiful, responsive design with Tailwind CSS and Flowbite components
- **Protected Routes** - Secure access to notes and profile pages
- **Mobile Responsive** - Works seamlessly on all device sizes
- **Fast Performance** - Built with Vite for optimal development and build performance

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Flowbite-React
- **Routing**: React Router DOM
- **Icons**: React Icons
- **State Management**: React Hooks

## Project Structure

```
src/
├── api/
│   └── notesApi.js          # API integration functions
├── components/
│   ├── Navbar.jsx           # Navigation component
│   ├── NoteCard.jsx         # Individual note display card
│   ├── NoteEditor.jsx       # Modal for creating/editing notes
│   └── ProtectedRoute.jsx   # Route protection component
├── pages/
│   ├── Login.jsx            # Login page
│   ├── Register.jsx         # Registration page
│   ├── Notes.jsx            # Main notes dashboard
│   └── Profile.jsx          # User profile page
├── App.jsx                  # Main app component with routing
├── main.jsx                 # App entry point
└── styles.css               # Tailwind CSS imports
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd note_app
```

2. Install dependencies:
```bash
npm install
```

3. Update the API base URL in `src/api/notesApi.js`:
```javascript
const API_BASE_URL = 'your-api-endpoint-here';
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## API Integration

The app is designed to work with a REST API that provides the following endpoints:

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user and receive JWT token
- `GET /auth/me` - Get current user information

### Notes
- `GET /notes` - Get all notes for authenticated user
- `POST /notes` - Create a new note
- `PUT /notes/:id` - Update an existing note
- `DELETE /notes/:id` - Delete a note

All notes endpoints require an `Authorization: Bearer <token>` header.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

### Vercel Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to Vercel:
```bash
npx vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Features Overview

### Authentication
- Secure login and registration forms
- JWT token storage in localStorage
- Automatic redirection based on authentication status
- Logout functionality

### Notes Management
- Create notes with title and content
- Edit existing notes in a modal interface
- Delete notes with confirmation
- Responsive grid layout for note cards
- Real-time UI updates without page refresh

### User Interface
- Clean, modern design inspired by the provided mockup
- Responsive navigation bar
- Loading states and error handling
- Mobile-first responsive design
- Consistent color scheme with green accent colors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
