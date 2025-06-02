# Prep Well - Interview Success Unlocked

**Group 2, Team AE**  
**Members:** Connor, Nobel, Oscar, Ben, Rusheel

🌐 **Live Application**: [https://intern-interview-app.web.app/](https://intern-interview-app.web.app/)

## Problem Statement

**How might we make internship interview processes more transparent and accessible to college students to promote fairer access to early career opportunities?**

## Project Overview

Prep Well is a web application designed to make internship interviews more transparent and accessible for students. With internship applications becoming nearly twice as competitive as last year (CNBC, 2025), our platform addresses the critical need for students to access real interview experiences and preparation insights. While recruiting technology has attempted to match students with jobs, there are significant limitations in these automated systems (Career Fair Plus, n.d.). Prep Well fills this gap by providing authentic, student-to-student knowledge sharing.

Our platform allows students to share their interview experiences, learn from others' journeys, and better prepare for their own interviews through real, detailed insights from peers who have successfully navigated the process.

## Mission Statement & UN SDG Alignment

We believe in creating equal opportunities for all students seeking internships. By making interview experiences transparent and accessible, we're working towards **UN Sustainable Development Goal 8: Decent Work and Economic Growth** - promoting sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all.

Our platform directly supports this goal by:
- **Promoting fair access** to career opportunities regardless of background
- **Reducing information asymmetry** in the job market
- **Supporting inclusive economic growth** through equal access to career preparation resources
- **Empowering students** with knowledge to secure decent work opportunities

## Key Features

- **Interview Experience Sharing**: Students can submit detailed interview experiences including questions, process, and preparation tips
- **Search & Discovery**: Browse interviews by company, role, or interview type
- **User Authentication**: Secure login and profile management with Firebase Auth
- **Bookmarking System**: Save interviews for later reference
- **Real-time Dashboard**: Track contributions and discover new content
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Firebase (Authentication, Firestore Database, Hosting)
- **State Management**: React Context API
- **Icons**: Lucide React

## Database Structure

We use Firebase Firestore to store interview experiences, user bookmarks, and authentication data in a NoSQL document-based structure that allows for flexible data organization and real-time updates.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd prep-well
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file with your Firebase configuration:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server
```bash
npm run dev
```

5. Visit `http://localhost:8080` in your browser

## User Personas

### Primary Target Users

#### 1. Sarah Chen - The Ambitious Computer Science Student
- **Profile**: 20-year-old CS junior at UC Berkeley
- **Goals**: Land FAANG internship, understand technical interview expectations
- **Pain Points**: Limited visibility into top-tier company interview processes
- **Usage**: Searches for specific companies, focuses on technical content

#### 2. Marcus Thompson - The First-Generation College Student  
- **Profile**: 19-year-old Business sophomore at University of Washington
- **Goals**: Understand corporate interview culture, build confidence
- **Pain Points**: No family network with corporate experience, impostor syndrome
- **Usage**: Broad industry searches, values preparation tips and general advice

#### 3. Priya Patel - The Career Changer
- **Profile**: 24-year-old transitioning from Psychology to UX Design
- **Goals**: Navigate design interviews, understand portfolio expectations
- **Pain Points**: No prior design interview experience, need to prove herself
- **Usage**: Design-specific searches, interested in career transition stories

## Testing Protocol

### Interactive Prototype Development
We create interactive Figma prototypes before development to run early usability tests and gather feedback on user flow, design, and functionality.

### Acceptance Testing

#### Feature 1: Interview Experience Submission
**Test Process**: User fills out interview experience form and submits
- **Pass Criteria**: Submission saved correctly to database and displays accurately
- **Fail Criteria**: Data lost, corrupted, or displays incorrectly

#### Feature 2: Search and Discovery
**Test Process**: User searches for company/role and views shared experiences
- **Pass Criteria**: Correct results retrieved and displayed clearly
- **Fail Criteria**: Irrelevant results, missing data, or interface errors

### User Testing Methodology

1. **Closed Beta Testing**: 10 target users complete structured tasks with feedback forms
2. **Moderated Usability Testing**: 5-8 participants using think-aloud protocols
3. **Analytics Monitoring**: Firebase Analytics tracking user behavior and drop-off points

### Bug Prioritization

- **Critical**: Authentication failures, data loss (fix immediately)
- **High**: Significant UX issues (24-48 hours)
- **Medium**: Minor functionality issues (1 week)
- **Low**: Cosmetic issues (when possible)

### Known Issues
- Google Sign-In may not work currently - please use regular email/password signup or login
- Firebase queries may require index creation for complex searches
- Initial mobile load time can be slow on 3G connections
- Bookmark status may have brief sync delays across devices

## Deployment

The application is deployed using Firebase Hosting with automatic builds from the main branch.

The application is deployed using Firebase Hosting with automatic builds from the main branch.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

Our team used pair programming for significant portions of development, which means commit history may not reflect individual contributions equally across all team members.

1. Create a feature branch from `main`
2. Implement changes following our component organization
3. Test thoroughly using acceptance testing protocol
4. Submit pull request with detailed description

## References

Applying for internships is nearly twice as competitive as last year, says new report—here's why. (2025, February 21). *CNBC*. https://www.cnbc.com/2025/02/21/applying-for-internships-is-nearly-twice-as-competitive-as-last-year-says-new-report.html

Pros and cons of relying on recruiting technology to match students with jobs. (n.d.). *Career Fair Plus*. Retrieved June 2, 2025, from https://www.careerfairplus.com/blog/pros-and-cons-of-relying-on-recruiting-technology-to-match-students-with-jobs

## License

This project is developed as part of an academic course and is not intended for commercial use.

## Contact

For questions or feedback, please contact the development team:
Connor, Nobel, Oscar, Ben, Rusheel