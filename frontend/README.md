# NullPointer: A Community-Driven Q&A App.

A dynamic and interactive frontend built with React for seamless user engagement with a Q&A platform. It supports features like user authentication, posting and viewing questions and answers, infinite scrolling, and administrative actions, ensuring a rich and intuitive user experience.

## Features

- **Welcome Page**: Users are greeted with a welcoming interface, guiding them to explore questions or log in.
- **Authentication**: Supports user login, registration, and password reset via email.
- **Question Browsing**: Guests and logged-in users can view all questions with infinite scroll, pagination, and filtering.
- **Post Questions and Answers**: Logged-in users can post new questions and answers, which appear at the top of their respective lists.
- **User Profiles**: View user information, including questions or answers posted by them, with toggleable views.
- **Reputation Ranking**: Displays a sidebar ranking of users sorted by reputation.
- **Voting**: Logged-in users can vote on answers and see a list of users who voted on a specific answer.
- **Edit/Delete**: Users can edit or delete their own questions and answers, while administrators can manage all content.
- **Administrative Controls**: Admins can ban/unban users or promote them to admin status.
- **Responsive Design**: Dark mode toggle for improved accessibility and user preference.
- **Infinite Scroll**: Implemented across multiple sections for efficient content browsing.

## Prerequisites

Ensure the following are installed on your machine:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)

## Setup Instructions

### 1. Clone the Repository

```
mkdir forum_app
cd forum_app
git clone https://github.com/elab-development/internet-tehnologije-2024-projekat-forum_app_20210013_20210133.git .
cd frontend
```

### 2. Install Dependencies

Run the following command to install required packages:

```
npm install
```

### 3. Environment Variables

Create a `.env` file in the root of the frontend directory and add the following variables:

```
VITE_PORT=port_number
VITE_BACKEND_PORT=backend_port_number
```

| Variable            | Description                             |
| ------------------- | --------------------------------------- |
| `VITE_PORT`         | Port on which the server will run.      |
| `VITE_BACKEND_PORT` | Port on which the backend service runs. |

### 4. Run the Application

To start the development server, run:

```
npm build
```

## Navigation and Usage

### Welcome Page

- Users are greeted with options to browse questions as a guest or log in.

### Authentication Flow

- **Login Page**: Allows users to log in or navigate to the registration page.
- **Registration Page**: New users can register.
- **Password Reset**: Users can request a password reset link and reset their password via email.

### Questions Page

- Displays a list of all questions with infinite scroll.
- Sidebar shows a list of users sorted by reputation.
- Logged-in users can post new questions.
- Clicking a question opens its detailed page with all associated answers.

### Single Question Page

- Shows the selected question and all answers.
- Logged-in users can post answers, edit/delete their own answers, and vote on others' answers.
- Lists users who voted on a specific answer.

### User Profile Page

- Displays user details with toggleable views for:
  - Questions posted by the user.
  - Answers posted by the user.
- Admins see options to ban/unban or promote users. Banned users cannot post questions or answers.

### Additional Pages

- **Users Page**: Lists all users with infinite scroll for efficient browsing.
- **Single Answer**: Shows the selected answer and all users who voted on it.

## Directory Structure

```
src/
├── components/             # Reusable UI components
│   ├── Toolbar.jsx         # Component for the page toolbar
│   ├── Question.jsx        # Component to display individual questions
│   ├── Answer.jsx          # Component to display individual answers
├── pages/                  # Page-level components
│   ├── Landing.jsx         # Landing page for the application
│   ├── Questions.jsx       # Page displaying the list of all questions
│   ├── SingleQuestion.jsx  # Page for viewing a single question and its answers
│   ├── SingleAnswer.jsx    # Page for viewing a single answer and user votes
│   ├── UserProfile.jsx     # Page for viewing a user’s profile and activities
│   ├── Users.jsx           # Page for listing all users
├── hooks/                  # Custom React hooks
│   ├── useAuth.js          # Hook for managing user authentication state
│   ├── useDarkMode.js      # Hook for toggling between light and dark themes
├── config/                 # Helper files and configuration
│   ├── baseUrl.js          # Base API URL configuration
├── assets/                 # Static resources
└────
```

## Conclusion

This frontend provides a seamless and engaging user experience for interacting with the Q&A platform. Its modular structure and scalability ensure it can adapt to future features and requirements. Explore, contribute, and build upon this robust foundation for your community-driven projects.

Thank you for exploring this project—happy coding! 🚀
