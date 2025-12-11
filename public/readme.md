 Campus Life Portal - University Services Platform

A comprehensive university portal for students to manage campus life including events, clubs, room bookings, and support services.

 Live Demo
[View Live Website](https://deborah-wambui.github.io/advanced-web/)

 Features

 Homepage
- Modern hero section with call-to-action buttons
- Feature cards highlighting all platform services
- Quick access dashboard button
- Responsive design optimized for all devices

 Events & Clubs
- Browse upcoming campus events with detailed information
- View student clubs and organizations
- Interactive event registration system
- Real-time attendance tracking
- Category filtering and search functionality

 My Dashboard
- **Personalized dashboard** for registered users
- View all event registrations in one place
- Track club memberships and application status
- Statistics and activity overview
- Manage bookings and registrations

 Room Booking System
- Reserve study rooms and facilities
- Date and time selection
- Purpose description field
- Real-time booking management

 Help Desk Support
- Submit support tickets with priority levels
- Track issue resolution status
- Multi-category support requests
- Email confirmation system

 User Authentication
- Email-based dashboard access
- Registration tracking
- Personal activity history

 Technology Stack

Frontend
- **HTML5** with semantic structure and ARIA landmarks
- **CSS3** with Grid/Flexbox responsive layouts
- **CSS Custom Properties** for theming and variables
- **Vanilla JavaScript** for interactive features
- **Firebase Firestore** for data persistence

Backend & Services
- **Firebase Authentication** (email-based access)
- **Firebase Firestore** database for:
  - Event registrations
  - Club memberships
  - Room bookings
  - Support tickets

DevOps & Deployment
- **GitHub Pages** for hosting
- **Docker** containerization
- **Git** version control

 Accessibility Features
- WCAG 2.1 AA compliance
- Semantic HTML landmarks (header, nav, main, footer)
- Keyboard navigation support
- Screen reader compatibility
- Skip to main content links
- Proper heading hierarchy (h1-h6)
- ARIA labels and roles
- Sufficient color contrast (4.5:1 minimum)
- Focus management and visible focus indicators
- Reduced motion preferences support

 Project Structure

 Quick Start

Local Development
```bash
# Clone the repository
git clone https://github.com/Deborah-Wambui/advanced-web.git
cd advanced-web

# Open the homepage
open docs/views/index.html
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    // ... other config
};

# or
start docs/views/index.html  # Windows
