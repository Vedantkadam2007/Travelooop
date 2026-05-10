# Traveloop - Travel Planning & Itinerary Management System

A comprehensive web application for planning, organizing, and sharing travel itineraries with advanced features like activity management, user profiles, admin analytics, and more.

## 🌟 Features

### Core Features
- **User Authentication & Profiles** - Secure registration, login, and profile management
- **Trip Planning** - Create detailed travel itineraries with dates, destinations, and budgets
- **Activity Management** - Add activities to itinerary stops with time, location, and cost details
- **Destination Management** - Browse and save popular travel destinations
- **Packing Lists** - Generate and manage packing lists for trips
- **Public Sharing** - Share itineraries publicly with customizable access controls
- **Trip Notes & Journal** - Keep travel notes and memories organized

### Advanced Features
- **Admin Analytics Dashboard** - Comprehensive admin panel with user management and analytics
- **User Profiles & Settings** - Advanced profile management with preferences and privacy controls
- **Public Itinerary Sharing** - Share trips with unique URLs and copy functionality
- **Trip Notes & Journal** - Organized note-taking system with categories and search
- **Saved Destinations** - Personal destination wishlist with notes and visit tracking

### Technical Features
- **Responsive Design** - Mobile-friendly interface with modern UI/UX
- **Real-time Updates** - Dynamic content loading without page refreshes
- **Data Visualization** - Charts and analytics for trip patterns and user engagement
- **Search & Filtering** - Advanced search across trips, activities, and destinations
- **Export Functionality** - Export trip data in various formats
- **Image Upload** - Profile photos and trip cover images

## 🛠 Technology Stack

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - ORM for database management
- **SQLite** - Database for data persistence
- **JWT Authentication** - Secure token-based authentication
- **Flask-CORS** - Cross-origin resource sharing
- **Werkzeug** - Security and password hashing

### Frontend
- **HTML5/CSS3** - Modern semantic markup and styling
- **JavaScript (ES6+)** - Dynamic client-side functionality
- **Font Awesome** - Icon library for UI elements
- **Responsive Design** - Mobile-first responsive layout

### Database Models
- **Users** - Authentication, profiles, and preferences
- **Trips** - Trip planning and management
- **Itineraries** - Daily trip schedules and stops
- **Activities** - Detailed activity planning
- **Destinations** - Travel destination database
- **Notes** - Trip journaling and notes
- **Saved Destinations** - User wishlist functionality

## 📋 Project Structure

```
traveloop/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── models.py            # Database models
│   ├── seed_database.py     # Database seeding script
│   └── seed_activities.py   # Activities seeding script
├── uploads/                 # File upload directory
├── styles.css              # Main stylesheet
├── script.js               # Frontend JavaScript
├── index.html              # Main HTML file
├── requirements.txt         # Python dependencies
├── .gitignore            # Git ignore file
└── README.md              # Project documentation
```

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vedantkadam2007/Travelooop.git
   cd Travelooop
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Initialize the database**
   ```bash
   # Seed destinations and activities
   python backend/seed_database.py
   python backend/seed_activities.py
   ```

4. **Run the application**
   ```bash
   python backend/app.py
   ```

5. **Access the application**
   - Open browser to: `http://localhost:5000`
   - Register a new account or use existing credentials

### Environment Variables (Optional)
Create a `.env` file for custom configuration:
```bash
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=jwt-secret-string
SQLALCHEMY_DATABASE_URI=sqlite:///traveloop.db
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
```

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Trip Management
- `GET /api/trips` - Get user trips
- `POST /api/trips` - Create new trip
- `GET /api/trips/<id>` - Get specific trip
- `PUT /api/trips/<id>` - Update trip
- `DELETE /api/trips/<id>` - Delete trip

### Itinerary & Activities
- `GET /api/trips/<id>/itinerary` - Get trip itinerary
- `POST /api/trips/<id>/itinerary` - Add itinerary stop
- `GET /api/itinerary/<id>/activities` - Get activities
- `POST /api/activities` - Add activity

### Admin Endpoints
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - User management
- `POST /api/admin/users/<id>/toggle-status` - Toggle user status
- `GET /api/admin/analytics/*` - Various analytics endpoints

## 🎯 Usage Guide

### For Users
1. **Register/Login** - Create account or sign in
2. **Plan Trip** - Add new trip with basic details
3. **Build Itinerary** - Add daily stops and activities
4. **Manage Activities** - Add detailed activities with time/cost
5. **Share Trip** - Generate public sharing link
6. **Track Notes** - Add journal entries and memories

### For Administrators
1. **Access Dashboard** - Use admin credentials to access panel
2. **Monitor Users** - View user statistics and manage accounts
3. **Analytics** - Review platform usage and engagement
4. **Content Management** - Manage destinations and activities

## 🔧 Development

### Database Seeding
```bash
# Seed destinations database
python backend/seed_database.py

# Seed activities database
python backend/seed_activities.py
```

### File Uploads
- Profile photos: `uploads/profiles/`
- Trip covers: `uploads/covers/`
- Max file size: 16MB

### Security Features
- Password hashing with Werkzeug
- JWT token authentication
- CORS protection
- Input validation and sanitization
- Admin role-based access control

## 📱 Mobile Responsiveness

The application is fully responsive with optimized layouts for:
- **Desktop** (1200px+): Full-featured interface
- **Tablet** (768px-1199px): Adapted navigation and layouts
- **Mobile** (<768px): Touch-friendly interface with hamburger menu

## 🎨 UI/UX Features

- **Modern Design** - Clean, intuitive interface
- **Dark Mode Support** - CSS variables for theming
- **Smooth Animations** - CSS transitions and micro-interactions
- **Loading States** - Visual feedback during data operations
- **Error Handling** - User-friendly error messages
- **Toast Notifications** - Non-intrusive success/error alerts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Support & Contact

- **GitHub Issues**: Report bugs and request features
- **Email**: [your-email@example.com]
- **Documentation**: See inline comments and API docs

## 🔄 Version History

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added admin dashboard and analytics
- **v1.2.0** - Enhanced user profiles and settings
- **v1.3.0** - Added public sharing and trip notes
- **v1.4.0** - Added saved destinations and journal features

---

**Traveloop** - Your complete travel planning companion 🌍✈️
- **Budget Calculator**: Track expenses and estimate costs
- **Destination Search**: Explore cities and find popular activities
- **Packing Checklist**: Smart packing lists for different destinations
- **Trip Sharing**: Share itineraries with friends and collaborators
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 🌟 Advanced Features
- **Trip Analytics**: Insights about travel patterns
- **Expense Tracking**: Categorized expense management
- **Dashboard**: Comprehensive overview of travel statistics
- **Interactive Maps**: Visual trip planning (placeholder for future integration)
- **Mobile-First Design**: Optimized for all screen sizes

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, CSS Variables
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Inter)
- **Storage**: LocalStorage for data persistence
- **Design**: Responsive, Mobile-First Approach

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required

### Installation
1. Clone or download the project files
2. Navigate to the project directory
3. Open `index.html` in your web browser

```bash
# If using a local server (recommended)
npx serve .
# Or
python -m http.server 8000
# Then open http://localhost:8000
```

### Quick Start
1. **Sign Up**: Create a new account with your email and password
2. **Create Your First Trip**: Click "Create New Trip" from the dashboard
3. **Build Itinerary**: Add activities, locations, and timings
4. **Track Budget**: Add expenses and monitor spending
5. **Pack Smart**: Use the packing checklist to prepare
6. **Share**: Share your trip with friends and family

## Usage Guide

### Account Management
- **Sign Up**: Create an account with email, name, and password
- **Login**: Access your existing account
- **Logout**: Securely sign out from your account

### Trip Planning
1. **Create Trip**: 
   - Trip name and destination
   - Start and end dates
   - Budget estimation
   - Description

2. **Itinerary Building**:
   - Add activities with specific times
   - Include locations and notes
   - Organize by day or time

3. **Budget Management**:
   - Set total budget
   - Track expenses by category
   - Monitor spending vs. budget

4. **Packing Lists**:
   - Pre-built checklists
   - Custom items
   - Category-based organization

### Dashboard Features
- **Statistics**: Total trips, destinations, budget overview
- **Trip Grid**: Visual overview of all trips
- **Quick Actions**: Create new trips, view details
- **Recent Activity**: Latest updates and changes

## File Structure

```
traveloop/
├── index.html          # Main HTML file
├── styles.css          # Complete styling
├── script.js           # All JavaScript functionality
├── README.md           # This documentation
└── assets/             # Images and static files (if needed)
```

## Data Storage

The application uses LocalStorage for:
- User authentication data
- Trip information and itineraries
- Expense records
- Packing lists
- User preferences

Data is stored locally in the browser and persists between sessions.

## Responsive Design

### Breakpoints
- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: 320px - 767px

### Features
- Mobile navigation menu
- Touch-friendly buttons and interactions
- Optimized layouts for all screen sizes
- Readable typography across devices

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Security Features

- Password validation and encryption (client-side)
- Input sanitization
- XSS prevention
- Secure data storage practices

## Future Enhancements

### Planned Features
- [ ] Real-time collaboration
- [ ] Map integration (Google Maps/Mapbox)
- [ ] Weather integration
- [ ] Flight and hotel booking
- [ ] Mobile app (React Native)
- [ ] Backend API integration
- [ ] Social features and reviews
- [ ] AI-powered recommendations

### Technical Improvements
- [ ] Progressive Web App (PWA)
- [ ] Offline functionality
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Internationalization (i18n)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For questions, issues, or feature requests:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Font Awesome for icons
- Unsplash for placeholder images
- Google Fonts for typography
- Open source community for inspiration

---

**Traveloop** - Making travel planning simple, enjoyable, and collaborative! 🌍✈️
