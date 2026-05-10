// Global Variables
let currentUser = null;
let trips = [];
let destinations = [];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    initializeEventListeners();
    loadDestinations();
});

// Event Listeners
function initializeEventListeners() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Authentication Functions
function showForgotPassword() {
    const modalHTML = `
        <div class="modal active" id="forgot-password-modal">
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <h2>Reset Password</h2>
                <p style="margin-bottom: 1.5rem; color: var(--text-light);">
                    Enter your email address and we\'ll send you instructions to reset your password.
                </p>
                <form id="forgot-password-form" onsubmit="handleForgotPassword(event)">
                    <div class="form-group">
                        <label for="forgot-email">Email Address</label>
                        <input type="email" id="forgot-email" required onblur="validateEmail('forgot-email')">
                        <span class="error-message" id="forgot-email-error"></span>
                    </div>
                    <button type="submit" class="btn-primary" style="width: 100%;">Send Reset Link</button>
                </form>
                <p style="text-align: center; margin-top: 1rem;">
                    Remember your password? <a href="#" onclick="showLogin()">Back to Login</a>
                </p>
            </div>
        </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHTML;
}

function showTerms() {
    const modalHTML = `
        <div class="modal active" id="terms-modal">
            <div class="modal-content" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <h2>Terms of Service</h2>
                <div style="text-align: left; line-height: 1.6;">
                    <h3>1. Acceptance of Terms</h3>
                    <p>By accessing and using Traveloop, you accept and agree to be bound by the terms and provision of this agreement.</p>
                    
                    <h3>2. Use License</h3>
                    <p>Permission is granted to temporarily download one copy of the materials on Traveloop for personal, non-commercial transitory viewing only.</p>
                    
                    <h3>3. Disclaimer</h3>
                    <p>The materials on Traveloop are provided on an 'as is' basis. Traveloop makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                    
                    <h3>4. Limitations</h3>
                    <p>In no event shall Traveloop or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Traveloop.</p>
                    
                    <h3>5. Privacy Policy</h3>
                    <p>Your Privacy is important to us. Please review our Privacy Policy, which also governs the Site, to understand our practices.</p>
                </div>
                <button class="btn-primary" style="width: 100%; margin-top: 1.5rem;" onclick="closeModal()">I Understand</button>
            </div>
        </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHTML;
}

function showPrivacy() {
    const modalHTML = `
        <div class="modal active" id="privacy-modal">
            <div class="modal-content" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <h2>Privacy Policy</h2>
                <div style="text-align: left; line-height: 1.6;">
                    <h3>1. Information We Collect</h3>
                    <p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us.</p>
                    
                    <h3>2. How We Use Your Information</h3>
                    <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
                    
                    <h3>3. Information Sharing</h3>
                    <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
                    
                    <h3>4. Data Security</h3>
                    <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                    
                    <h3>5. Your Rights</h3>
                    <p>You have the right to access, update, or delete your personal information at any time through your account settings.</p>
                </div>
                <button class="btn-primary" style="width: 100%; margin-top: 1.5rem;" onclick="closeModal()">I Understand</button>
            </div>
        </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHTML;
}

function showLogin() {
    const modalHTML = `
        <div class="modal active" id="login-modal">
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <h2>Login to Traveloop</h2>
                <form id="login-form" onsubmit="handleLogin(event)">
                    <div class="form-group">
                        <label for="login-email">Email</label>
                        <input type="email" id="login-email" required onblur="validateEmail('login-email')">
                        <span class="error-message" id="login-email-error"></span>
                    </div>
                    <div class="form-group">
                        <label for="login-password">Password</label>
                        <input type="password" id="login-password" required onblur="validatePassword('login-password')">
                        <span class="error-message" id="login-password-error"></span>
                    </div>
                    <div class="form-group" style="display: flex; justify-content: space-between; align-items: center;">
                        <label style="display: flex; align-items: center; font-weight: normal;">
                            <input type="checkbox" id="remember-me" style="margin-right: 0.5rem;">
                            Remember me
                        </label>
                        <a href="#" onclick="showForgotPassword()" style="color: var(--primary-color); text-decoration: none;">Forgot Password?</a>
                    </div>
                    <button type="submit" class="btn-primary" style="width: 100%;">Login</button>
                </form>
                <p style="text-align: center; margin-top: 1rem;">
                    Don't have an account? <a href="#" onclick="showSignup()">Sign up</a>
                </p>
            </div>
        </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHTML;
}

function showSignup() {
    const modalHTML = `
        <div class="modal active" id="signup-modal">
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <h2>Join Traveloop</h2>
                <form id="signup-form" onsubmit="handleSignup(event)">
                    <div class="form-group">
                        <label for="signup-name">Full Name</label>
                        <input type="text" id="signup-name" required onblur="validateName('signup-name')">
                        <span class="error-message" id="signup-name-error"></span>
                    </div>
                    <div class="form-group">
                        <label for="signup-email">Email</label>
                        <input type="email" id="signup-email" required onblur="validateEmail('signup-email')">
                        <span class="error-message" id="signup-email-error"></span>
                    </div>
                    <div class="form-group">
                        <label for="signup-password">Password</label>
                        <input type="password" id="signup-password" required minlength="6" oninput="checkPasswordStrength('signup-password')" onblur="validatePassword('signup-password')">
                        <span class="error-message" id="signup-password-error"></span>
                        <div class="password-strength" id="signup-password-strength"></div>
                    </div>
                    <div class="form-group">
                        <label for="signup-confirm">Confirm Password</label>
                        <input type="password" id="signup-confirm" required minlength="6" onblur="validatePasswordConfirm('signup-confirm')">
                        <span class="error-message" id="signup-confirm-error"></span>
                    </div>
                    <div class="form-group">
                        <label style="display: flex; align-items: center; font-weight: normal;">
                            <input type="checkbox" id="terms-accept" required style="margin-right: 0.5rem;">
                            I agree to the <a href="#" onclick="showTerms()" style="color: var(--primary-color);">Terms of Service</a> and <a href="#" onclick="showPrivacy()" style="color: var(--primary-color);">Privacy Policy</a>
                        </label>
                    </div>
                    <button type="submit" class="btn-primary" style="width: 100%;">Sign Up</button>
                </form>
                <p style="text-align: center; margin-top: 1rem;">
                    Already have an account? <a href="#" onclick="showLogin()">Login</a>
                </p>
            </div>
        </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHTML;
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me')?.checked || false;
    
    // Validate form
    if (!validateLoginForm()) {
        return;
    }
    
    // Simulate authentication (in real app, this would be an API call)
    const users = JSON.parse(localStorage.getItem('traveloop_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        if (rememberMe) {
            localStorage.setItem('traveloop_current_user', JSON.stringify(user));
            localStorage.setItem('traveloop_remember_me', 'true');
        } else {
            sessionStorage.setItem('traveloop_current_user', JSON.stringify(user));
            localStorage.removeItem('traveloop_remember_me');
        }
        closeModal();
        showToast('Login successful!', 'success');
        showDashboard();
    } else {
        showToast('Invalid email or password', 'error');
    }
}

function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('forgot-email').value;
    
    if (!validateEmail('forgot-email')) {
        return;
    }
    
    // Check if user exists
    const users = JSON.parse(localStorage.getItem('traveloop_users') || '[]');
    const user = users.find(u => u.email === email);
    
    if (user) {
        // Simulate sending reset email (in real app, this would send an actual email)
        const resetToken = generateResetToken();
        localStorage.setItem(`traveloop_reset_${email}`, JSON.stringify({
            token: resetToken,
            timestamp: Date.now()
        }));
        
        showToast('Password reset instructions have been sent to your email!', 'success');
        setTimeout(() => showLogin(), 2000);
    } else {
        showToast('If an account with this email exists, reset instructions have been sent.', 'success');
        setTimeout(() => showLogin(), 2000);
    }
    
    closeModal();
}

function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    const termsAccepted = document.getElementById('terms-accept')?.checked || false;
    
    // Validate form
    if (!validateSignupForm()) {
        return;
    }
    
    if (!termsAccepted) {
        showToast('You must accept the terms of service and privacy policy', 'error');
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('traveloop_users') || '[]');
    if (users.find(u => u.email === email)) {
        showToast('User with this email already exists', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('traveloop_users', JSON.stringify(users));
    
    currentUser = newUser;
    localStorage.setItem('traveloop_current_user', JSON.stringify(newUser));
    
    closeModal();
    showToast('Account created successfully!', 'success');
    showDashboard();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('traveloop_current_user');
    location.reload();
}

// Dashboard Functions
function showDashboard() {
    if (!currentUser) return;
    
    // Hide homepage and show dashboard
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.features').style.display = 'none';
    document.querySelector('.destinations').style.display = 'none';
    document.querySelector('.footer').style.display = 'none';
    
    // Get user-specific data
    const recentTrips = getRecentTrips();
    const upcomingTrips = getUpcomingTripsList();
    const budgetHighlights = getBudgetHighlights();
    const recommendedDestinations = getRecommendedDestinations();
    
    // Create enhanced dashboard
    const dashboardHTML = `
        <div class="dashboard active">
            <div class="dashboard-header">
                <div class="container">
                    <div class="welcome-section">
                        <div>
                            <h1>Welcome back, ${currentUser.name}!</h1>
                            <p class="welcome-subtitle">${getWelcomeMessage()}</p>
                        </div>
                        <button class="btn-secondary" onclick="logout()">Logout</button>
                    </div>
                </div>
            </div>
            
            <div class="dashboard-content">
                <div class="container">
                    <!-- Quick Actions Section -->
                    <div class="quick-actions-section">
                        <h2>Quick Actions</h2>
                        <div class="quick-actions-grid">
                            <button class="quick-action-btn primary" onclick="showCreateTripModal()">
                                <i class="fas fa-plus"></i>
                                <span>Plan New Trip</span>
                            </button>
                            <button class="quick-action-btn" onclick="showExploreDestinations()">
                                <i class="fas fa-compass"></i>
                                <span>Explore Destinations</span>
                            </button>
                            <button class="quick-action-btn" onclick="showBudgetOverview()">
                                <i class="fas fa-chart-pie"></i>
                                <span>Budget Overview</span>
                            </button>
                            <button class="quick-action-btn" onclick="showPackingTemplates()">
                                <i class="fas fa-suitcase"></i>
                                <span>Packing Lists</span>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Stats Overview -->
                    <div class="stats-section">
                        <h2>Your Travel Stats</h2>
                        <div class="stats-grid">
                            <div class="stat-card">
                                <i class="fas fa-map-marked-alt"></i>
                                <h3>${trips.length}</h3>
                                <p>Total Trips</p>
                            </div>
                            <div class="stat-card">
                                <i class="fas fa-globe"></i>
                                <h3>${getUniqueDestinations()}</h3>
                                <p>Places Visited</p>
                            </div>
                            <div class="stat-card">
                                <i class="fas fa-dollar-sign"></i>
                                <h3>$${calculateTotalBudget()}</h3>
                                <p>Total Budget</p>
                            </div>
                            <div class="stat-card">
                                <i class="fas fa-calendar-check"></i>
                                <h3>${getUpcomingTrips()}</h3>
                                <p>Upcoming</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="dashboard-main-content">
                        <!-- Recent Trips Section -->
                        <div class="recent-trips-section">
                            <div class="section-header">
                                <h2>Recent Trips</h2>
                                <a href="#" onclick="showAllTrips()" class="view-all-link">View All</a>
                            </div>
                            <div class="trips-grid" id="recent-trips-grid">
                                ${renderRecentTrips(recentTrips)}
                            </div>
                        </div>
                        
                        <!-- Budget Highlights Section -->
                        <div class="budget-highlights-section">
                            <div class="section-header">
                                <h2>Budget Highlights</h2>
                                <a href="#" onclick="showBudgetDetails()" class="view-all-link">Details</a>
                            </div>
                            <div class="budget-highlights">
                                ${renderBudgetHighlights(budgetHighlights)}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Recommended Destinations Section -->
                    <div class="recommended-destinations-section">
                        <div class="section-header">
                            <h2>Recommended Destinations</h2>
                            <a href="#" onclick="showAllDestinations()" class="view-all-link">Explore All</a>
                        </div>
                        <div class="destinations-grid">
                            ${renderRecommendedDestinations(recommendedDestinations)}
                        </div>
                    </div>
                    
                    <!-- Upcoming Trips Timeline -->
                    <div class="upcoming-trips-section">
                        <div class="section-header">
                            <h2>Upcoming Adventures</h2>
                            <a href="#" onclick="showCalendar()" class="view-all-link">Calendar</a>
                        </div>
                        <div class="timeline">
                            ${renderUpcomingTripsTimeline(upcomingTrips)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', dashboardHTML);
}

function renderTrips() {
    if (trips.length === 0) {
        return '<p style="text-align: center; color: var(--text-light);">No trips yet. Create your first trip!</p>';
    }
    
    return trips.map(trip => `
        <div class="trip-card">
            <h3>${trip.name}</h3>
            <div class="trip-meta">
                <span><i class="fas fa-map-marker-alt"></i> ${trip.destination}</span>
                <span><i class="fas fa-calendar"></i> ${trip.startDate} - ${trip.endDate}</span>
                <span><i class="fas fa-dollar-sign"></i> Budget: $${trip.budget}</span>
            </div>
            <div class="trip-actions">
                <button class="btn-view" onclick="viewTrip('${trip.id}')">View</button>
                <button class="btn-edit" onclick="editTrip('${trip.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteTrip('${trip.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Trip Management Functions
function showCreateTripModal() {
    const modalHTML = `
        <div class="modal active" id="create-trip-modal">
            <div class="modal-content" style="max-width: 700px;">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <h2>Create New Trip</h2>
                <form id="create-trip-form" onsubmit="handleCreateTrip(event)">
                    <div class="trip-creation-layout">
                        <div class="trip-form-left">
                            <div class="form-group">
                                <label for="trip-name">Trip Name *</label>
                                <input type="text" id="trip-name" required onblur="validateTripName('trip-name')">
                                <span class="error-message" id="trip-name-error"></span>
                            </div>
                            
                            <div class="form-group">
                                <label for="trip-destination">Destination *</label>
                                <select id="trip-destination" required onblur="validateDestination('trip-destination')">
                                    <option value="">Select a destination</option>
                                    ${destinations.map(dest => `<option value="${dest.name}">${dest.name}</option>`).join('')}
                                </select>
                                <span class="error-message" id="trip-destination-error"></span>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="trip-start-date">Start Date *</label>
                                    <input type="date" id="trip-start-date" required onblur="validateDates()">
                                    <span class="error-message" id="trip-start-date-error"></span>
                                </div>
                                <div class="form-group">
                                    <label for="trip-end-date">End Date *</label>
                                    <input type="date" id="trip-end-date" required onblur="validateDates()">
                                    <span class="error-message" id="trip-end-date-error"></span>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="trip-budget">Budget ($) *</label>
                                <input type="number" id="trip-budget" min="0" step="0.01" required onblur="validateBudget('trip-budget')">
                                <span class="error-message" id="trip-budget-error"></span>
                            </div>
                            
                            <div class="form-group">
                                <label for="trip-description">Trip Description</label>
                                <textarea id="trip-description" placeholder="Tell us about your dream trip..." rows="4" oninput="updateDescriptionCharCount()"></textarea>
                                <div class="char-count">
                                    <span id="description-char-count">0</span>/500 characters
                                </div>
                            </div>
                        </div>
                        
                        <div class="trip-form-right">
                            <div class="form-group">
                                <label>Cover Photo</label>
                                <div class="photo-upload-area" id="photo-upload-area">
                                    <input type="file" id="trip-cover-photo" accept="image/*" onchange="handlePhotoUpload(event)" style="display: none;">
                                    <div class="photo-upload-placeholder" id="photo-placeholder">
                                        <i class="fas fa-camera"></i>
                                        <p>Click to upload cover photo</p>
                                        <span>Optional • JPG, PNG up to 5MB</span>
                                    </div>
                                    <div class="photo-preview" id="photo-preview" style="display: none;">
                                        <img id="preview-image" src="" alt="Cover photo preview">
                                        <button type="button" class="remove-photo-btn" onclick="removePhoto()">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label>Quick Templates</label>
                                <div class="trip-templates">
                                    <button type="button" class="template-btn" onclick="applyTemplate('weekend')">
                                        <i class="fas fa-calendar-week"></i>
                                        Weekend Getaway
                                    </button>
                                    <button type="button" class="template-btn" onclick="applyTemplate('beach')">
                                        <i class="fas fa-umbrella-beach"></i>
                                        Beach Vacation
                                    </button>
                                    <button type="button" class="template-btn" onclick="applyTemplate('city')">
                                        <i class="fas fa-city"></i>
                                        City Break
                                    </button>
                                    <button type="button" class="template-btn" onclick="applyTemplate('adventure')">
                                        <i class="fas fa-hiking"></i>
                                        Adventure
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                        <button type="submit" class="btn-primary" id="create-trip-btn">Create Trip</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHTML;
    
    // Initialize photo upload area click handler
    setTimeout(() => {
        const uploadArea = document.getElementById('photo-upload-area');
        const fileInput = document.getElementById('trip-cover-photo');
        
        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', () => fileInput.click());
        }
        
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        const startDateInput = document.getElementById('trip-start-date');
        const endDateInput = document.getElementById('trip-end-date');
        
        if (startDateInput) startDateInput.min = today;
        if (endDateInput) endDateInput.min = today;
    }, 100);
}

function handleCreateTrip(event) {
    event.preventDefault();
    
    // Validate all fields
    if (!validateCreateTripForm()) {
        return;
    }
    
    // Get cover photo if uploaded
    const coverPhoto = document.getElementById('preview-image')?.src || null;
    
    const trip = {
        id: Date.now().toString(),
        name: document.getElementById('trip-name').value,
        destination: document.getElementById('trip-destination').value,
        startDate: document.getElementById('trip-start-date').value,
        endDate: document.getElementById('trip-end-date').value,
        budget: document.getElementById('trip-budget').value,
        description: document.getElementById('trip-description').value,
        coverPhoto: coverPhoto,
        userId: currentUser.id,
        createdAt: new Date().toISOString(),
        itinerary: [],
        expenses: []
    };
    
    trips.push(trip);
    saveTrips();
    closeModal();
    showToast('Trip created successfully!', 'success');
    updateDashboard();
}

function viewTrip(tripId) {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;
    
    const modalHTML = `
        <div class="modal active" id="view-trip-modal">
            <div class="modal-content" style="max-width: 800px;">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <h2>${trip.name}</h2>
                <div class="trip-details">
                    <div class="form-group">
                        <strong>Destination:</strong> ${trip.destination}
                    </div>
                    <div class="form-group">
                        <strong>Date:</strong> ${trip.startDate} - ${trip.endDate}
                    </div>
                    <div class="form-group">
                        <strong>Budget:</strong> $${trip.budget}
                    </div>
                    <div class="form-group">
                        <strong>Description:</strong> ${trip.description || 'No description provided'}
                    </div>
                </div>
                
                <div class="trip-sections">
                    <div class="section">
                        <h3>Itinerary</h3>
                        <button class="btn-primary" onclick="showAddItineraryItem('${trip.id}')">Add Item</button>
                        <div id="itinerary-items">
                            ${renderItinerary(trip.itinerary)}
                        </div>
                    </div>
                    
                    <div class="section">
                        <h3>Expenses</h3>
                        <button class="btn-primary" onclick="showAddExpense('${trip.id}')">Add Expense</button>
                        <div id="expense-items">
                            ${renderExpenses(trip.expenses)}
                        </div>
                    </div>
                    
                    <div class="section">
                        <h3>Packing Checklist</h3>
                        <button class="btn-primary" onclick="showPackingList('${trip.id}')">View Packing List</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHTML;
}

function editTrip(tripId) {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;
    
    const modalHTML = `
        <div class="modal active" id="edit-trip-modal">
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <h2>Edit Trip</h2>
                <form id="edit-trip-form" onsubmit="handleEditTrip(event, '${tripId}')">
                    <div class="form-group">
                        <label for="edit-trip-name">Trip Name</label>
                        <input type="text" id="edit-trip-name" value="${trip.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-trip-destination">Destination</label>
                        <select id="edit-trip-destination" required>
                            ${destinations.map(dest => `
                                <option value="${dest.name}" ${dest.name === trip.destination ? 'selected' : ''}>${dest.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit-trip-start-date">Start Date</label>
                        <input type="date" id="edit-trip-start-date" value="${trip.startDate}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-trip-end-date">End Date</label>
                        <input type="date" id="edit-trip-end-date" value="${trip.endDate}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-trip-budget">Budget ($)</label>
                        <input type="number" id="edit-trip-budget" value="${trip.budget}" min="0" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-trip-description">Description</label>
                        <textarea id="edit-trip-description">${trip.description || ''}</textarea>
                    </div>
                    <button type="submit" class="btn-primary" style="width: 100%;">Update Trip</button>
                </form>
            </div>
        </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHTML;
}

function handleEditTrip(event, tripId) {
    event.preventDefault();
    
    const tripIndex = trips.findIndex(t => t.id === tripId);
    if (tripIndex === -1) return;
    
    trips[tripIndex] = {
        ...trips[tripIndex],
        name: document.getElementById('edit-trip-name').value,
        destination: document.getElementById('edit-trip-destination').value,
        startDate: document.getElementById('edit-trip-start-date').value,
        endDate: document.getElementById('edit-trip-end-date').value,
        budget: document.getElementById('edit-trip-budget').value,
        description: document.getElementById('edit-trip-description').value
    };
    
    saveTrips();
    closeModal();
    showToast('Trip updated successfully!', 'success');
    updateDashboard();
}

function deleteTrip(tripId) {
    if (confirm('Are you sure you want to delete this trip?')) {
        trips = trips.filter(t => t.id !== tripId);
        saveTrips();
        showToast('Trip deleted successfully', 'success');
        updateDashboard();
    }
}

// Itinerary Functions
function renderItinerary(itinerary) {
    if (!itinerary || itinerary.length === 0) {
        return '<p style="color: var(--text-light);">No itinerary items yet.</p>';
    }
    
    return itinerary.map(item => `
        <div class="itinerary-item" style="padding: 1rem; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 0.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <strong>${item.time}</strong> - ${item.activity}
                    <p style="color: var(--text-light); margin: 0.5rem 0;">${item.location}</p>
                </div>
                <button class="btn-delete" onclick="deleteItineraryItem('${item.id}')">&times;</button>
            </div>
        </div>
    `).join('');
}

function showAddItineraryItem(tripId) {
    const modalHTML = `
        <div class="modal active" id="add-itinerary-modal">
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <h2>Add Itinerary Item</h2>
                <form onsubmit="handleAddItineraryItem(event, '${tripId}')">
                    <div class="form-group">
                        <label for="itinerary-time">Time</label>
                        <input type="time" id="itinerary-time" required>
                    </div>
                    <div class="form-group">
                        <label for="itinerary-activity">Activity</label>
                        <input type="text" id="itinerary-activity" required>
                    </div>
                    <div class="form-group">
                        <label for="itinerary-location">Location</label>
                        <input type="text" id="itinerary-location" required>
                    </div>
                    <div class="form-group">
                        <label for="itinerary-notes">Notes</label>
                        <textarea id="itinerary-notes"></textarea>
                    </div>
                    <button type="submit" class="btn-primary" style="width: 100%;">Add Item</button>
                </form>
            </div>
        </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHTML;
}

function handleAddItineraryItem(event, tripId) {
    event.preventDefault();
    
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;
    
    const item = {
        id: Date.now().toString(),
        time: document.getElementById('itinerary-time').value,
        activity: document.getElementById('itinerary-activity').value,
        location: document.getElementById('itinerary-location').value,
        notes: document.getElementById('itinerary-notes').value
    };
    
    if (!trip.itinerary) trip.itinerary = [];
    trip.itinerary.push(item);
    
    saveTrips();
    closeModal();
    showToast('Itinerary item added!', 'success');
    viewTrip(tripId);
}

function deleteItineraryItem(itemId) {
    // This would need to be implemented to find and remove the item
    showToast('Item deleted', 'success');
}

// Expense Functions
function renderExpenses(expenses) {
    if (!expenses || expenses.length === 0) {
        return '<p style="color: var(--text-light);">No expenses recorded yet.</p>';
    }
    
    const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    
    return `
        <div style="margin-bottom: 1rem;">
            <strong>Total: $${total.toFixed(2)}</strong>
        </div>
        ${expenses.map(exp => `
            <div class="expense-item" style="padding: 1rem; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 0.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${exp.category}</strong> - $${exp.amount}
                        <p style="color: var(--text-light); margin: 0.5rem 0;">${exp.description}</p>
                    </div>
                    <button class="btn-delete" onclick="deleteExpense('${exp.id}')">&times;</button>
                </div>
            </div>
        `).join('')}
    `;
}

function showAddExpense(tripId) {
    const modalHTML = `
        <div class="modal active" id="add-expense-modal">
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <h2>Add Expense</h2>
                <form onsubmit="handleAddExpense(event, '${tripId}')">
                    <div class="form-group">
                        <label for="expense-category">Category</label>
                        <select id="expense-category" required>
                            <option value="">Select category</option>
                            <option value="Accommodation">Accommodation</option>
                            <option value="Food">Food</option>
                            <option value="Transportation">Transportation</option>
                            <option value="Activities">Activities</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="expense-amount">Amount ($)</label>
                        <input type="number" id="expense-amount" min="0" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label for="expense-description">Description</label>
                        <input type="text" id="expense-description" required>
                    </div>
                    <button type="submit" class="btn-primary" style="width: 100%;">Add Expense</button>
                </form>
            </div>
        </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHTML;
}

function handleAddExpense(event, tripId) {
    event.preventDefault();
    
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;
    
    const expense = {
        id: Date.now().toString(),
        category: document.getElementById('expense-category').value,
        amount: document.getElementById('expense-amount').value,
        description: document.getElementById('expense-description').value,
        date: new Date().toISOString()
    };
    
    if (!trip.expenses) trip.expenses = [];
    trip.expenses.push(expense);
    
    saveTrips();
    closeModal();
    showToast('Expense added!', 'success');
    viewTrip(tripId);
}

function deleteExpense(expenseId) {
    // This would need to be implemented to find and remove the expense
    showToast('Expense deleted', 'success');
}

// Packing List Functions
function showPackingList(tripId) {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;
    
    const packingItems = [
        { id: '1', item: 'Passport/ID', packed: false, category: 'Documents' },
        { id: '2', item: 'Phone Charger', packed: false, category: 'Electronics' },
        { id: '3', item: 'Toiletries', packed: false, category: 'Personal' },
        { id: '4', item: 'Clothing', packed: false, category: 'Clothing' },
        { id: '5', item: 'Medications', packed: false, category: 'Health' },
        { id: '6', item: 'Camera', packed: false, category: 'Electronics' },
        { id: '7', item: 'Sunscreen', packed: false, category: 'Personal' },
        { id: '8', item: 'Travel Insurance', packed: false, category: 'Documents' }
    ];
    
    const modalHTML = `
        <div class="modal active" id="packing-list-modal">
            <div class="modal-content" style="max-width: 600px;">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <h2>Packing Checklist</h2>
                <div class="packing-list">
                    ${packingItems.map(item => `
                        <div class="packing-item" style="display: flex; align-items: center; padding: 0.5rem; border-bottom: 1px solid var(--border-color);">
                            <input type="checkbox" id="pack-${item.id}" ${item.packed ? 'checked' : ''} onchange="togglePacked('${item.id}')">
                            <label for="pack-${item.id}" style="margin-left: 1rem; flex: 1;">
                                ${item.item}
                                <span style="color: var(--text-light); font-size: 0.9rem; margin-left: 0.5rem;">(${item.category})</span>
                            </label>
                        </div>
                    `).join('')}
                </div>
                <button class="btn-primary" onclick="addCustomPackingItem('${tripId}')" style="width: 100%; margin-top: 1rem;">Add Custom Item</button>
            </div>
        </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHTML;
}

function togglePacked(itemId) {
    // This would update the packed status
    showToast('Item status updated', 'success');
}

function addCustomPackingItem(tripId) {
    const itemName = prompt('Enter custom item name:');
    if (itemName) {
        showToast('Custom item added!', 'success');
    }
}

// Utility Functions
function closeModal() {
    document.getElementById('modal-container').innerHTML = '';
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function calculateTotalBudget() {
    return trips.reduce((sum, trip) => sum + parseFloat(trip.budget || 0), 0).toFixed(0);
}

function getUpcomingTrips() {
    const today = new Date();
    return trips.filter(trip => new Date(trip.startDate) > today).length;
}

function updateDashboard() {
    const tripsGrid = document.getElementById('trips-grid');
    if (tripsGrid) {
        tripsGrid.innerHTML = renderTrips();
    }
    
    // Update stats
    const statCards = document.querySelectorAll('.stat-card h3');
    if (statCards.length >= 4) {
        statCards[0].textContent = trips.length;
        statCards[1].textContent = destinations.length;
        statCards[2].textContent = `$${calculateTotalBudget()}`;
        statCards[3].textContent = getUpcomingTrips();
    }
}

// Data Persistence Functions
function loadUserData() {
    const savedUser = localStorage.getItem('traveloop_current_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        loadTrips();
    }
    
    const savedDestinations = localStorage.getItem('traveloop_destinations');
    if (savedDestinations) {
        destinations = JSON.parse(savedDestinations);
    }
}

function loadTrips() {
    if (currentUser) {
        const savedTrips = localStorage.getItem(`traveloop_trips_${currentUser.id}`);
        if (savedTrips) {
            trips = JSON.parse(savedTrips);
        }
    }
}

function saveTrips() {
    if (currentUser) {
        localStorage.setItem(`traveloop_trips_${currentUser.id}`, JSON.stringify(trips));
    }
}

function loadDestinations() {
    // Default destinations if none exist
    if (destinations.length === 0) {
        destinations = [
            { id: '1', name: 'Paris, France', country: 'France', description: 'City of Light', rating: 4.8, activities: 120 },
            { id: '2', name: 'Tokyo, Japan', country: 'Japan', description: 'Modern Metropolis', rating: 4.9, activities: 200 },
            { id: '3', name: 'Bali, Indonesia', country: 'Indonesia', description: 'Tropical Paradise', rating: 4.7, activities: 150 },
            { id: '4', name: 'New York, USA', country: 'USA', description: 'City That Never Sleeps', rating: 4.6, activities: 180 },
            { id: '5', name: 'London, UK', country: 'UK', description: 'Historic Capital', rating: 4.7, activities: 160 },
            { id: '6', name: 'Rome, Italy', country: 'Italy', description: 'Eternal City', rating: 4.8, activities: 140 }
        ];
        localStorage.setItem('traveloop_destinations', JSON.stringify(destinations));
    }
}

// Search and Filter Functions
function searchDestinations(query) {
    if (!query) return destinations;
    
    return destinations.filter(dest => 
        dest.name.toLowerCase().includes(query.toLowerCase()) ||
        dest.country.toLowerCase().includes(query.toLowerCase()) ||
        dest.description.toLowerCase().includes(query.toLowerCase())
    );
}

function filterTripsByStatus(status) {
    const today = new Date();
    
    switch(status) {
        case 'upcoming':
            return trips.filter(trip => new Date(trip.startDate) > today);
        case 'ongoing':
            return trips.filter(trip => {
                const start = new Date(trip.startDate);
                const end = new Date(trip.endDate);
                return start <= today && end >= today;
            });
        case 'past':
            return trips.filter(trip => new Date(trip.endDate) < today);
        default:
            return trips;
    }
}

// Share Functions
function shareTrip(tripId) {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;
    
    // Generate shareable link (in real app, this would create a unique URL)
    const shareUrl = `${window.location.origin}/shared-trip/${tripId}`;
    
    if (navigator.share) {
        navigator.share({
            title: trip.name,
            text: `Check out my trip to ${trip.destination}!`,
            url: shareUrl
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareUrl);
        showToast('Share link copied to clipboard!', 'success');
    }
}

// Budget Calculator Functions
function calculateBudgetBreakdown(tripId) {
    const trip = trips.find(t => t.id === tripId);
    if (!trip || !trip.expenses) return {};
    
    const breakdown = {};
    trip.expenses.forEach(expense => {
        if (!breakdown[expense.category]) {
            breakdown[expense.category] = 0;
        }
        breakdown[expense.category] += parseFloat(expense.amount);
    });
    
    return breakdown;
}

function getBudgetStatus(tripId) {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return 'unknown';
    
    const totalExpenses = trip.expenses ? trip.expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0) : 0;
    const budget = parseFloat(trip.budget);
    
    if (totalExpenses > budget) return 'over';
    if (totalExpenses > budget * 0.8) return 'warning';
    return 'good';
}

// Validation Functions
function validateEmail(fieldId) {
    const email = document.getElementById(fieldId)?.value;
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (!email) {
        if (errorElement) errorElement.textContent = 'Email is required';
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        if (errorElement) errorElement.textContent = 'Please enter a valid email address';
        return false;
    }
    
    if (errorElement) errorElement.textContent = '';
    return true;
}

function validatePassword(fieldId) {
    const password = document.getElementById(fieldId)?.value;
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (!password) {
        if (errorElement) errorElement.textContent = 'Password is required';
        return false;
    }
    
    if (password.length < 6) {
        if (errorElement) errorElement.textContent = 'Password must be at least 6 characters';
        return false;
    }
    
    if (errorElement) errorElement.textContent = '';
    return true;
}

function validatePasswordConfirm(fieldId) {
    const password = document.getElementById('signup-password')?.value;
    const confirm = document.getElementById(fieldId)?.value;
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (!confirm) {
        if (errorElement) errorElement.textContent = 'Please confirm your password';
        return false;
    }
    
    if (password !== confirm) {
        if (errorElement) errorElement.textContent = 'Passwords do not match';
        return false;
    }
    
    if (errorElement) errorElement.textContent = '';
    return true;
}

function validateName(fieldId) {
    const name = document.getElementById(fieldId)?.value;
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (!name) {
        if (errorElement) errorElement.textContent = 'Name is required';
        return false;
    }
    
    if (name.length < 2) {
        if (errorElement) errorElement.textContent = 'Name must be at least 2 characters';
        return false;
    }
    
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        if (errorElement) errorElement.textContent = 'Name can only contain letters and spaces';
        return false;
    }
    
    if (errorElement) errorElement.textContent = '';
    return true;
}

function validateLoginForm() {
    const emailValid = validateEmail('login-email');
    const passwordValid = validatePassword('login-password');
    return emailValid && passwordValid;
}

function validateSignupForm() {
    const nameValid = validateName('signup-name');
    const emailValid = validateEmail('signup-email');
    const passwordValid = validatePassword('signup-password');
    const confirmValid = validatePasswordConfirm('signup-confirm');
    return nameValid && emailValid && passwordValid && confirmValid;
}

function checkPasswordStrength(fieldId) {
    const password = document.getElementById(fieldId)?.value;
    const strengthElement = document.getElementById(`${fieldId}-strength`);
    
    if (!password || !strengthElement) return;
    
    let strength = 0;
    let message = '';
    let color = '';
    
    // Check password strength
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    switch(strength) {
        case 0:
        case 1:
            message = 'Weak';
            color = '#ef4444';
            break;
        case 2:
        case 3:
            message = 'Medium';
            color = '#f59e0b';
            break;
        case 4:
        case 5:
            message = 'Strong';
            color = '#10b981';
            break;
    }
    
    strengthElement.innerHTML = `
        <div style="display: flex; align-items: center; margin-top: 0.5rem;">
            <span style="font-size: 0.85rem; color: ${color}; margin-right: 0.5rem;">Password strength: ${message}</span>
            <div style="flex: 1; height: 4px; background: #e5e7eb; border-radius: 2px; overflow: hidden;">
                <div style="width: ${(strength / 5) * 100}%; height: 100%; background: ${color}; transition: width 0.3s ease;"></div>
            </div>
        </div>
    `;
}

function generateResetToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Dashboard Helper Functions
function getWelcomeMessage() {
    const hour = new Date().getHours();
    const upcomingTripsCount = getUpcomingTrips();
    
    if (hour < 12) {
        return `Good morning! Ready to plan your next adventure?${upcomingTripsCount > 0 ? ` You have ${upcomingTripsCount} upcoming trip${upcomingTripsCount > 1 ? 's' : ''}.` : ''}`;
    } else if (hour < 18) {
        return `Good afternoon!${upcomingTripsCount > 0 ? ` ${upcomingTripsCount} exciting trip${upcomingTripsCount > 1 ? 's are' : ' is'} coming up!` : ' Time to plan your next journey!'}`;
    } else {
        return `Good evening!${upcomingTripsCount > 0 ? ` Dreaming about your ${upcomingTripsCount} upcoming trip${upcomingTripsCount > 1 ? 's' : ''}?` : ' Let\'s find your next destination!'}`;
    }
}

function getRecentTrips() {
    return trips
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
}

function getUpcomingTripsList() {
    const today = new Date();
    return trips
        .filter(trip => new Date(trip.startDate) > today)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        .slice(0, 5);
}

function getUniqueDestinations() {
    const uniqueDestinations = new Set(trips.map(trip => trip.destination));
    return uniqueDestinations.size;
}

function getBudgetHighlights() {
    const totalBudget = trips.reduce((sum, trip) => sum + parseFloat(trip.budget || 0), 0);
    const totalSpent = trips.reduce((sum, trip) => {
        if (!trip.expenses) return sum;
        return sum + trip.expenses.reduce((expenseSum, expense) => expenseSum + parseFloat(expense.amount || 0), 0);
    }, 0);
    
    return {
        totalBudget,
        totalSpent,
        remaining: totalBudget - totalSpent,
        averageTripBudget: trips.length > 0 ? totalBudget / trips.length : 0,
        topSpendingCategory: getTopSpendingCategory()
    };
}

function getTopSpendingCategory() {
    const categorySpending = {};
    
    trips.forEach(trip => {
        if (trip.expenses) {
            trip.expenses.forEach(expense => {
                const category = expense.category || 'Other';
                categorySpending[category] = (categorySpending[category] || 0) + parseFloat(expense.amount || 0);
            });
        }
    });
    
    return Object.keys(categorySpending).length > 0 
        ? Object.keys(categorySpending).reduce((a, b) => categorySpending[a] > categorySpending[b] ? a : b)
        : 'No expenses yet';
}

function getRecommendedDestinations() {
    const visitedDestinations = new Set(trips.map(trip => trip.destination));
    return destinations
        .filter(dest => !visitedDestinations.has(dest.name))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);
}

function renderRecentTrips(recentTrips) {
    if (recentTrips.length === 0) {
        return '<p style="text-align: center; color: var(--text-light); grid-column: 1 / -1;">No trips yet. Create your first trip!</p>';
    }
    
    return recentTrips.map(trip => {
        const status = getTripStatus(trip);
        const statusClass = status === 'ongoing' ? 'ongoing' : status === 'upcoming' ? 'upcoming' : 'past';
        const coverImage = trip.coverPhoto || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
        
        return `
            <div class="trip-card ${statusClass}">
                <div class="trip-status">${status}</div>
                <div class="trip-cover">
                    <img src="${coverImage}" alt="${trip.name}" onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'">
                </div>
                <div class="trip-content">
                    <h3>${trip.name}</h3>
                    <div class="trip-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${trip.destination}</span>
                        <span><i class="fas fa-calendar"></i> ${formatDate(trip.startDate)}</span>
                        <span><i class="fas fa-dollar-sign"></i> $${trip.budget}</span>
                    </div>
                    <div class="trip-actions">
                        <button class="btn-view" onclick="viewTrip('${trip.id}')">View</button>
                        <button class="btn-edit" onclick="editTrip('${trip.id}')">Edit</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderBudgetHighlights(highlights) {
    const spentPercentage = highlights.totalBudget > 0 ? (highlights.totalSpent / highlights.totalBudget) * 100 : 0;
    
    return `
        <div class="budget-overview">
            <div class="budget-card">
                <h4>Total Budget</h4>
                <div class="budget-amount">$${highlights.totalBudget.toFixed(2)}</div>
            </div>
            <div class="budget-card">
                <h4>Total Spent</h4>
                <div class="budget-amount spent">$${highlights.totalSpent.toFixed(2)}</div>
            </div>
            <div class="budget-card">
                <h4>Remaining</h4>
                <div class="budget-amount ${highlights.remaining < 0 ? 'negative' : 'positive'}">$${Math.abs(highlights.remaining).toFixed(2)}</div>
            </div>
        </div>
        <div class="budget-progress">
            <div class="progress-label">
                <span>Budget Usage</span>
                <span>${spentPercentage.toFixed(1)}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill ${spentPercentage > 100 ? 'over' : spentPercentage > 80 ? 'warning' : 'good'}" 
                     style="width: ${Math.min(spentPercentage, 100)}%"></div>
            </div>
        </div>
        <div class="budget-insights">
            <div class="insight-item">
                <i class="fas fa-chart-line"></i>
                <span>Avg Trip Budget: $${highlights.averageTripBudget.toFixed(0)}</span>
            </div>
            <div class="insight-item">
                <i class="fas fa-tag"></i>
                <span>Top Category: ${highlights.topSpendingCategory}</span>
            </div>
        </div>
    `;
}

function renderRecommendedDestinations(recommendedDestinations) {
    if (recommendedDestinations.length === 0) {
        return '<p style="text-align: center; color: var(--text-light); grid-column: 1 / -1;">You\'ve visited all our destinations! Time for new adventures!</p>';
    }
    
    return recommendedDestinations.map(dest => `
        <div class="destination-card recommended">
            <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="${dest.name}">
            <div class="destination-info">
                <h3>${dest.name}</h3>
                <p>${dest.description}</p>
                <div class="destination-stats">
                    <span><i class="fas fa-star"></i> ${dest.rating}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${dest.activities} activities</span>
                </div>
                <button class="btn-primary" onclick="createTripToDestination('${dest.name}')" style="margin-top: 1rem; width: 100%;">Plan Trip Here</button>
            </div>
        </div>
    `).join('');
}

function renderUpcomingTripsTimeline(upcomingTrips) {
    if (upcomingTrips.length === 0) {
        return '<p style="text-align: center; color: var(--text-light);">No upcoming trips. Start planning your next adventure!</p>';
    }
    
    return upcomingTrips.map((trip, index) => {
        const daysUntil = Math.ceil((new Date(trip.startDate) - new Date()) / (1000 * 60 * 60 * 24));
        const isNext = index === 0;
        
        return `
            <div class="timeline-item ${isNext ? 'next' : ''}">
                <div class="timeline-marker ${isNext ? 'active' : ''}"></div>
                <div class="timeline-content">
                    <div class="timeline-date">
                        <div class="date-main">${formatDate(trip.startDate)}</div>
                        <div class="date-sub">${daysUntil} days away</div>
                    </div>
                    <div class="timeline-trip">
                        <h4>${trip.name}</h4>
                        <p><i class="fas fa-map-marker-alt"></i> ${trip.destination}</p>
                        <p><i class="fas fa-dollar-sign"></i> Budget: $${trip.budget}</p>
                    </div>
                    <button class="btn-view" onclick="viewTrip('${trip.id}')">View Details</button>
                </div>
            </div>
        `;
    }).join('');
}

function getTripStatus(trip) {
    const today = new Date();
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    
    if (today >= startDate && today <= endDate) {
        return 'Ongoing';
    } else if (today < startDate) {
        return 'Upcoming';
    } else {
        return 'Completed';
    }
}

function formatDate(dateString) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Dashboard Action Functions
function showExploreDestinations() {
    closeModal();
    document.querySelector('.dashboard').style.display = 'none';
    document.querySelector('.destinations').style.display = 'block';
    document.querySelector('.footer').style.display = 'block';
    document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' });
}

function showAllTrips() {
    closeModal();
    const allTripsModal = `
        <div class="modal active" id="all-trips-modal">
            <div class="modal-content" style="max-width: 1200px; max-height: 90vh;">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="all-trips-header">
                    <h2>All Your Trips</h2>
                    <div class="trips-controls">
                        <div class="filter-section">
                            <select id="trip-filter" onchange="filterTrips()">
                                <option value="all">All Trips</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="ongoing">Ongoing</option>
                                <option value="past">Past</option>
                            </select>
                        </div>
                        <div class="sort-section">
                            <select id="trip-sort" onchange="sortTrips()">
                                <option value="date-desc">Newest First</option>
                                <option value="date-asc">Oldest First</option>
                                <option value="name-asc">Name A-Z</option>
                                <option value="name-desc">Name Z-A</option>
                                <option value="budget-desc">Budget High-Low</option>
                                <option value="budget-asc">Budget Low-High</option>
                            </select>
                        </div>
                        <div class="search-section">
                            <input type="text" id="trip-search" placeholder="Search trips..." oninput="searchTrips()">
                        </div>
                        <button class="btn-primary" onclick="showCreateTripModal()">
                            <i class="fas fa-plus"></i> New Trip
                        </button>
                    </div>
                </div>
                
                <div class="trips-stats-bar">
                    <div class="stat-item">
                        <span class="stat-number">${trips.length}</span>
                        <span class="stat-label">Total Trips</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${getUpcomingTrips()}</span>
                        <span class="stat-label">Upcoming</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${getOngoingTrips()}</span>
                        <span class="stat-label">Ongoing</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">$${calculateTotalBudget()}</span>
                        <span class="stat-label">Total Budget</span>
                    </div>
                </div>
                
                <div class="all-trips-grid" id="all-trips-container">
                    ${renderAllTrips(trips)}
                </div>
            </div>
        </div>
    `;
    document.getElementById('modal-container').innerHTML = allTripsModal;
}

function renderAllTrips(tripsToRender) {
    if (tripsToRender.length === 0) {
        return `
            <div class="empty-state">
                <i class="fas fa-map-marked-alt"></i>
                <h3>No trips found</h3>
                <p>Start planning your adventure by creating your first trip!</p>
                <button class="btn-primary" onclick="closeModal(); showCreateTripModal();">
                    <i class="fas fa-plus"></i> Create Your First Trip
                </button>
            </div>
        `;
    }
    
    return tripsToRender.map(trip => {
        const status = getTripStatus(trip);
        const statusClass = status === 'ongoing' ? 'ongoing' : status === 'upcoming' ? 'upcoming' : 'past';
        const coverImage = trip.coverPhoto || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
        const duration = calculateTripDuration(trip.startDate, trip.endDate);
        const daysUntil = calculateDaysUntil(trip.startDate);
        const spentAmount = calculateTripSpent(trip);
        const budgetPercentage = trip.budget > 0 ? (spentAmount / parseFloat(trip.budget)) * 100 : 0;
        
        return `
            <div class="trip-list-card ${statusClass}" data-trip-id="${trip.id}">
                <div class="trip-list-cover">
                    <img src="${coverImage}" alt="${trip.name}" onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'">
                    <div class="trip-status-badge">${status}</div>
                </div>
                
                <div class="trip-list-content">
                    <div class="trip-list-header">
                        <h3>${trip.name}</h3>
                        <div class="trip-list-meta">
                            <span class="meta-item">
                                <i class="fas fa-map-marker-alt"></i>
                                ${trip.destination}
                            </span>
                            <span class="meta-item">
                                <i class="fas fa-calendar"></i>
                                ${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}
                            </span>
                            <span class="meta-item">
                                <i class="fas fa-clock"></i>
                                ${duration} days
                            </span>
                        </div>
                    </div>
                    
                    <div class="trip-list-description">
                        ${trip.description ? `<p>${trip.description.substring(0, 150)}${trip.description.length > 150 ? '...' : ''}</p>` : '<p>No description provided</p>'}
                    </div>
                    
                    <div class="trip-list-stats">
                        <div class="budget-stat">
                            <div class="budget-info">
                                <span class="budget-amount">$${parseFloat(trip.budget).toFixed(2)}</span>
                                <span class="budget-label">Budget</span>
                            </div>
                            <div class="budget-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill ${budgetPercentage > 100 ? 'over' : budgetPercentage > 80 ? 'warning' : 'good'}" 
                                         style="width: ${Math.min(budgetPercentage, 100)}%"></div>
                                </div>
                                <span class="budget-spent">$${spentAmount.toFixed(2)} spent</span>
                            </div>
                        </div>
                        
                        ${status === 'upcoming' ? `
                            <div class="countdown-stat">
                                <i class="fas fa-hourglass-half"></i>
                                <span>${daysUntil} days away</span>
                            </div>
                        ` : ''}
                        
                        <div class="destination-count">
                            <i class="fas fa-globe"></i>
                            <span>${getUniqueDestinations()} places visited</span>
                        </div>
                    </div>
                    
                    <div class="trip-list-actions">
                        <button class="action-btn view-btn" onclick="viewTrip('${trip.id}')" title="View Trip Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit-btn" onclick="editTrip('${trip.id}')" title="Edit Trip">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn duplicate-btn" onclick="duplicateTrip('${trip.id}')" title="Duplicate Trip">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="action-btn share-btn" onclick="shareTrip('${trip.id}')" title="Share Trip">
                            <i class="fas fa-share-alt"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteTrip('${trip.id}')" title="Delete Trip">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function calculateTripDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
}

function calculateDaysUntil(startDate) {
    const today = new Date();
    const start = new Date(startDate);
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    return Math.ceil((start - today) / (1000 * 60 * 60 * 24));
}

function calculateTripSpent(trip) {
    if (!trip.expenses || trip.expenses.length === 0) {
        return 0;
    }
    return trip.expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
}

function getOngoingTrips() {
    const today = new Date();
    return trips.filter(trip => {
        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);
        return today >= start && today <= end;
    }).length;
}

// Trip List Management Functions
function filterTrips() {
    const filterValue = document.getElementById('trip-filter')?.value || 'all';
    let filteredTrips = trips;
    
    switch(filterValue) {
        case 'upcoming':
            filteredTrips = filterTripsByStatus('upcoming');
            break;
        case 'ongoing':
            filteredTrips = filterTripsByStatus('ongoing');
            break;
        case 'past':
            filteredTrips = filterTripsByStatus('past');
            break;
        default:
            filteredTrips = trips;
    }
    
    const container = document.getElementById('all-trips-container');
    if (container) {
        container.innerHTML = renderAllTrips(filteredTrips);
    }
}

function filterTripsByStatus(status) {
    const today = new Date();
    return trips.filter(trip => {
        const tripStatus = getTripStatus(trip);
        return tripStatus.toLowerCase() === status.toLowerCase();
    });
}

function sortTrips() {
    const sortValue = document.getElementById('trip-sort')?.value || 'date-desc';
    const container = document.getElementById('all-trips-container');
    const currentFilter = document.getElementById('trip-filter')?.value || 'all';
    
    let tripsToSort = trips;
    if (currentFilter !== 'all') {
        tripsToSort = filterTripsByStatus(currentFilter);
    }
    
    let sortedTrips = [...tripsToSort];
    
    switch(sortValue) {
        case 'date-asc':
            sortedTrips.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
            break;
        case 'date-desc':
            sortedTrips.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
            break;
        case 'name-asc':
            sortedTrips.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            sortedTrips.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'budget-asc':
            sortedTrips.sort((a, b) => parseFloat(a.budget) - parseFloat(b.budget));
            break;
        case 'budget-desc':
            sortedTrips.sort((a, b) => parseFloat(b.budget) - parseFloat(a.budget));
            break;
    }
    
    if (container) {
        container.innerHTML = renderAllTrips(sortedTrips);
    }
}

function searchTrips() {
    const searchTerm = document.getElementById('trip-search')?.value?.toLowerCase() || '';
    const container = document.getElementById('all-trips-container');
    
    if (!searchTerm) {
        container.innerHTML = renderAllTrips(trips);
        return;
    }
    
    const filteredTrips = trips.filter(trip => 
        trip.name.toLowerCase().includes(searchTerm) ||
        trip.destination.toLowerCase().includes(searchTerm) ||
        (trip.description && trip.description.toLowerCase().includes(searchTerm))
    );
    
    if (container) {
        container.innerHTML = renderAllTrips(filteredTrips);
    }
}

function duplicateTrip(tripId) {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;
    
    const duplicatedTrip = {
        ...trip,
        id: Date.now().toString(),
        name: `${trip.name} (Copy)`,
        createdAt: new Date().toISOString()
    };
    
    trips.push(duplicatedTrip);
    saveTrips();
    showToast('Trip duplicated successfully!', 'success');
    
    // Refresh the all trips view
    setTimeout(() => showAllTrips(), 100);
}

function viewTrip(tripId) {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;
    
    const modalHTML = `
        <div class="modal active" id="view-trip-modal">
            <div class="modal-content" style="max-width: 1200px; max-height: 90vh;">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="trip-view-header">
                    <h2>${trip.name}</h2>
                    <div class="trip-view-tabs">
                        <button class="tab-btn ${!currentTripView || currentTripView === 'overview' ? 'active' : ''}" onclick="switchTripView('overview', '${tripId}')">Overview</button>
                        <button class="tab-btn ${currentTripView === 'itinerary' ? 'active' : ''}" onclick="switchTripView('itinerary', '${tripId}')">Itinerary</button>
                        <button class="tab-btn ${currentTripView === 'expenses' ? 'active' : ''}" onclick="switchTripView('expenses', '${tripId}')">Expenses</button>
                        <button class="tab-btn ${currentTripView === 'packing' ? 'active' : ''}" onclick="switchTripView('packing', '${tripId}')">Packing</button>
                    </div>
                </div>
                
                <div class="trip-view-content" id="trip-view-content">
                    ${currentTripView === 'itinerary' ? renderItineraryBuilder(trip) : renderTripOverview(trip)}
                </div>
            </div>
        </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHTML;
    
    // Initialize itinerary builder if that's the current view
    if (currentTripView === 'itinerary') {
        initializeItineraryBuilder(tripId);
    }
}

let currentTripView = 'overview';

function switchTripView(view, tripId) {
    currentTripView = view;
    const trip = trips.find(t => t.id === tripId);
    const contentDiv = document.getElementById('trip-view-content');
    
    if (contentDiv && trip) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // Update content
        switch(view) {
            case 'itinerary':
                contentDiv.innerHTML = renderItineraryBuilder(trip);
                initializeItineraryBuilder(tripId);
                break;
            case 'expenses':
                contentDiv.innerHTML = renderExpensesView(trip);
                break;
            case 'packing':
                contentDiv.innerHTML = renderPackingView(trip);
                break;
            default:
                contentDiv.innerHTML = renderTripOverview(trip);
        }
    }
}

function renderExpensesView(trip) {
    return `
        <div class="expenses-view">
            <h3>Expenses</h3>
            <p>Expense tracking functionality coming soon...</p>
        </div>
    `;
}

function renderPackingView(trip) {
    return `
        <div class="packing-view">
            <h3>Packing List</h3>
            <p>Packing list functionality coming soon...</p>
        </div>
    `;
}

function showItineraryView(tripId) {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;
    
    const modalHTML = `
        <div class="modal active" id="itinerary-view-modal">
            <div class="modal-content" style="max-width: 1400px; max-height: 95vh;">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="itinerary-view-header">
                    <div class="itinerary-view-title">
                        <h2>${trip.name} - Itinerary</h2>
                        <p class="itinerary-dates">${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}</p>
                    </div>
                    <div class="itinerary-view-controls">
                        <div class="view-mode-toggle">
                            <button class="mode-btn ${currentItineraryViewMode === 'list' ? 'active' : ''}" onclick="switchItineraryViewMode('list', '${tripId}')">
                                <i class="fas fa-list"></i> List View
                            </button>
                            <button class="mode-btn ${currentItineraryViewMode === 'calendar' ? 'active' : ''}" onclick="switchItineraryViewMode('calendar', '${tripId}')">
                                <i class="fas fa-calendar-alt"></i> Calendar View
                            </button>
                            <button class="mode-btn ${currentItineraryViewMode === 'timeline' ? 'active' : ''}" onclick="switchItineraryViewMode('timeline', '${tripId}')">
                                <i class="fas fa-stream"></i> Timeline View
                            </button>
                        </div>
                        <div class="itinerary-actions">
                            <button class="btn-secondary" onclick="exportItineraryView('${tripId}')">
                                <i class="fas fa-download"></i> Export
                            </button>
                            <button class="btn-primary" onclick="editItinerary('${tripId}')">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="itinerary-view-content">
                    ${renderItineraryView(trip)}
                </div>
            </div>
        </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHTML;
}

let currentItineraryViewMode = 'list';

function renderItineraryView(trip) {
    const itinerary = trip.itinerary || [];
    
    if (itinerary.length === 0) {
        return `
            <div class="empty-itinerary-view">
                <i class="fas fa-route"></i>
                <h3>No itinerary created yet</h3>
                <p>Start building your trip itinerary to see it here!</p>
                <button class="btn-primary" onclick="closeModal(); viewTrip('${trip.id}'); switchTripView('itinerary', '${trip.id}');">
                    <i class="fas fa-plus"></i> Build Itinerary
                </button>
            </div>
        `;
    }
    
    switch(currentItineraryViewMode) {
        case 'calendar':
            return renderCalendarView(trip);
        case 'timeline':
            return renderTimelineView(trip);
        default:
            return renderListView(trip);
    }
}

function renderListView(trip) {
    const itinerary = trip.itinerary || [];
    const groupedByDay = groupItineraryByDay(itinerary);
    
    return `
        <div class="itinerary-list-view">
            <div class="itinerary-summary-bar">
                <div class="summary-stat">
                    <span class="stat-icon"><i class="fas fa-map-marker-alt"></i></span>
                    <span class="stat-text">${getItineraryCities(itinerary).length} Cities</span>
                </div>
                <div class="summary-stat">
                    <span class="stat-icon"><i class="fas fa-calendar-day"></i></span>
                    <span class="stat-text">${Object.keys(groupedByDay).length} Days</span>
                </div>
                <div class="summary-stat">
                    <span class="stat-icon"><i class="fas fa-tasks"></i></span>
                    <span class="stat-text">${getTotalActivities(itinerary)} Activities</span>
                </div>
                <div class="summary-stat">
                    <span class="stat-icon"><i class="fas fa-dollar-sign"></i></span>
                    <span class="stat-text">$${getTotalItineraryCost(itinerary)} Total Cost</span>
                </div>
            </div>
            
            <div class="itinerary-days">
                ${Object.entries(groupedByDay).map(([date, stops], dayIndex) => `
                    <div class="itinerary-day" data-date="${date}">
                        <div class="day-header">
                            <div class="day-number">
                                <span class="day-label">Day ${dayIndex + 1}</span>
                                <span class="day-date">${formatDate(date)}</span>
                            </div>
                            <div class="day-summary">
                                ${stops.map(stop => stop.city).filter((city, index, arr) => arr.indexOf(city) === index).join(', ')}
                            </div>
                        </div>
                        
                        <div class="day-activities">
                            ${stops.map(stop => renderStopActivitiesList(stop, trip)).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderCalendarView(trip) {
    const itinerary = trip.itinerary || [];
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    return `
        <div class="itinerary-calendar-view">
            <div class="calendar-header">
                <div class="calendar-info">
                    <h3>${formatMonthYear(startDate)}</h3>
                    <p>${days} days • ${getItineraryCities(itinerary).length} cities</p>
                </div>
            </div>
            
            <div class="calendar-grid">
                ${Array.from({length: days}, (_, i) => {
                    const currentDate = new Date(startDate);
                    currentDate.setDate(startDate.getDate() + i);
                    const dateStr = currentDate.toISOString().split('T')[0];
                    const dayStops = itinerary.filter(stop => stop.date === dateStr);
                    
                    return `
                        <div class="calendar-day ${dayStops.length > 0 ? 'has-activities' : ''}" data-date="${dateStr}">
                            <div class="calendar-day-header">
                                <span class="day-number">${currentDate.getDate()}</span>
                                <span class="day-name">${currentDate.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                            </div>
                            <div class="calendar-day-content">
                                ${dayStops.map(stop => `
                                    <div class="calendar-stop">
                                        <div class="stop-city">${stop.city}</div>
                                        ${stop.activities && stop.activities.length > 0 ? `
                                            <div class="stop-activities-mini">
                                                ${stop.activities.slice(0, 3).map(activity => `
                                                    <div class="mini-activity" title="${activity.activity}">
                                                        <span class="activity-time">${activity.time || ''}</span>
                                                        <span class="activity-name">${activity.activity}</span>
                                                    </div>
                                                `).join('')}
                                                ${stop.activities.length > 3 ? `
                                                    <div class="more-activities">+${stop.activities.length - 3} more</div>
                                                ` : ''}
                                            </div>
                                        ` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function renderTimelineView(trip) {
    const itinerary = trip.itinerary || [];
    const allActivities = getAllActivitiesInOrder(itinerary);
    
    return `
        <div class="itinerary-timeline-view">
            <div class="timeline-header">
                <div class="timeline-info">
                    <h3>Activity Timeline</h3>
                    <p>Chronological view of all activities</p>
                </div>
            </div>
            
            <div class="timeline-container">
                <div class="timeline-line"></div>
                <div class="timeline-items">
                    ${allActivities.map((activity, index) => `
                        <div class="timeline-item ${activity.isNewDay ? 'new-day' : ''}">
                            <div class="timeline-marker">
                                <div class="timeline-dot ${activity.isNewDay ? 'major' : 'minor'}"></div>
                                ${activity.isNewDay ? `
                                    <div class="timeline-date">
                                        <span class="date-label">Day ${activity.dayNumber}</span>
                                        <span class="date-text">${formatDate(activity.date)}</span>
                                    </div>
                                ` : ''}
                            </div>
                            
                            <div class="timeline-content">
                                <div class="timeline-activity">
                                    <div class="activity-header">
                                        <div class="activity-time-location">
                                            <span class="activity-time">${activity.time || 'All day'}</span>
                                            <span class="activity-location">
                                                <i class="fas fa-map-marker-alt"></i>
                                                ${activity.city}
                                            </span>
                                        </div>
                                        ${activity.cost ? `
                                            <div class="activity-cost">$${parseFloat(activity.cost).toFixed(2)}</div>
                                        ` : ''}
                                    </div>
                                    <div class="activity-details">
                                        <div class="activity-name">${activity.activity}</div>
                                        ${activity.location ? `
                                            <div class="activity-venue">
                                                <i class="fas fa-location-dot"></i>
                                                ${activity.location}
                                            </div>
                                        ` : ''}
                                        ${activity.notes ? `
                                            <div class="activity-notes">
                                                <i class="fas fa-sticky-note"></i>
                                                ${activity.notes}
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderStopActivitiesList(stop, trip) {
    const activities = stop.activities || [];
    
    return `
        <div class="stop-activities-list">
            <div class="stop-header">
                <div class="stop-info">
                    <h4 class="stop-city-name">${stop.city}</h4>
                    ${stop.endDate && stop.endDate !== stop.date ? `
                        <span class="stop-duration">${formatDate(stop.date)} - ${formatDate(stop.endDate)}</span>
                    ` : ''}
                </div>
                <div class="stop-activities-count">
                    ${activities.length} ${activities.length === 1 ? 'activity' : 'activities'}
                </div>
            </div>
            
            <div class="activities-grid">
                ${activities.map(activity => `
                    <div class="activity-card">
                        <div class="activity-card-header">
                            <div class="activity-time">${activity.time || 'All day'}</div>
                            ${activity.cost ? `
                                <div class="activity-cost">$${parseFloat(activity.cost).toFixed(2)}</div>
                            ` : ''}
                        </div>
                        <div class="activity-card-content">
                            <div class="activity-title">${activity.activity}</div>
                            ${activity.location ? `
                                <div class="activity-location">
                                    <i class="fas fa-map-marker-alt"></i>
                                    ${activity.location}
                                </div>
                            ` : ''}
                            ${activity.notes ? `
                                <div class="activity-notes">
                                    <i class="fas fa-sticky-note"></i>
                                    ${activity.notes}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
                
                ${activities.length === 0 ? `
                    <div class="no-activities-message">
                        <i class="fas fa-calendar-times"></i>
                        <p>No activities scheduled</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Helper Functions for Itinerary View
function groupItineraryByDay(itinerary) {
    const grouped = {};
    
    itinerary.forEach(stop => {
        if (stop.date) {
            if (!grouped[stop.date]) {
                grouped[stop.date] = [];
            }
            grouped[stop.date].push(stop);
        }
    });
    
    // Sort dates
    return Object.keys(grouped).sort().reduce((result, date) => {
        result[date] = grouped[date];
        return result;
    }, {});
}

function getTotalActivities(itinerary) {
    return itinerary.reduce((total, stop) => {
        return total + (stop.activities ? stop.activities.length : 0);
    }, 0);
}

function getTotalItineraryCost(itinerary) {
    return itinerary.reduce((total, stop) => {
        if (stop.activities) {
            return total + stop.activities.reduce((stopTotal, activity) => {
                return stopTotal + (activity.cost ? parseFloat(activity.cost) : 0);
            }, 0);
        }
        return total;
    }, 0).toFixed(2);
}

function getAllActivitiesInOrder(itinerary) {
    const allActivities = [];
    
    itinerary.forEach((stop, stopIndex) => {
        if (stop.activities) {
            stop.activities.forEach((activity, activityIndex) => {
                allActivities.push({
                    ...activity,
                    city: stop.city,
                    date: stop.date,
                    stopIndex,
                    activityIndex,
                    isNewDay: activityIndex === 0,
                    dayNumber: stopIndex + 1
                });
            });
        }
    });
    
    // Sort by date and time
    return allActivities.sort((a, b) => {
        const dateCompare = new Date(a.date) - new Date(b.date);
        if (dateCompare !== 0) return dateCompare;
        
        const timeA = a.time || '00:00';
        const timeB = b.time || '00:00';
        return timeA.localeCompare(timeB);
    });
}

function formatMonthYear(date) {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function switchItineraryViewMode(mode, tripId) {
    currentItineraryViewMode = mode;
    
    // Update button states
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Re-render content
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
        const contentDiv = document.querySelector('.itinerary-view-content');
        if (contentDiv) {
            contentDiv.innerHTML = renderItineraryView(trip);
        }
    }
}

function exportItineraryView(tripId) {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;
    
    let exportText = `${trip.name} - Complete Itinerary\\n`;
    exportText += `Destination: ${trip.destination}\\n`;
    exportText += `Dates: ${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}\\n`;
    exportText += `Generated: ${formatDate(new Date())}\\n\\n`;
    
    const itinerary = trip.itinerary || [];
    const groupedByDay = groupItineraryByDay(itinerary);
    
    Object.entries(groupedByDay).forEach(([date, stops], dayIndex) => {
        exportText += `\\n${'='.repeat(50)}\\n`;
        exportText += `DAY ${dayIndex + 1} - ${formatDate(date)}\\n`;
        exportText += `${'='.repeat(50)}\\n\\n`;
        
        stops.forEach(stop => {
            exportText += `📍 ${stop.city}\\n`;
            if (stop.endDate && stop.endDate !== stop.date) {
                exportText += `   Duration: ${formatDate(stop.date)} - ${formatDate(stop.endDate)}\\n`;
            }
            
            if (stop.activities && stop.activities.length > 0) {
                stop.activities.forEach(activity => {
                    exportText += `\\n   ${activity.time || 'All day'} - ${activity.activity}\\n`;
                    if (activity.location) {
                        exportText += `   📍 ${activity.location}\\n`;
                    }
                    if (activity.cost) {
                        exportText += `   💰 $${parseFloat(activity.cost).toFixed(2)}\\n`;
                    }
                    if (activity.notes) {
                        exportText += `   📝 ${activity.notes}\\n`;
                    }
                });
            } else {
                exportText += `   No activities scheduled\\n`;
            }
            exportText += `\\n`;
        });
    });
    
    exportText += `\\n${'='.repeat(50)}\\n`;
    exportText += `SUMMARY\\n`;
    exportText += `${'='.repeat(50)}\\n`;
    exportText += `Total Cities: ${getItineraryCities(itinerary).length}\\n`;
    exportText += `Total Days: ${Object.keys(groupedByDay).length}\\n`;
    exportText += `Total Activities: ${getTotalActivities(itinerary)}\\n`;
    exportText += `Total Cost: $${getTotalItineraryCost(itinerary)}\\n`;
    
    // Create and download file
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${trip.name}_complete_itinerary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Itinerary exported successfully!', 'success');
}

function shareItinerary(tripId) {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;
    
    const shareText = `Check out my trip to ${trip.destination}!\\n\\n${trip.name}\\n${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}\\n\\n${getTotalActivities(trip.itinerary || [])} activities planned across ${getItineraryCities(trip.itinerary || []).length} cities.`;
    
    if (navigator.share) {
        navigator.share({
            title: trip.name,
            text: shareText,
            url: window.location.href
        }).then(() => {
            showToast('Itinerary shared successfully!', 'success');
        }).catch(() => {
            copyToClipboard(shareText);
        });
    } else {
        copyToClipboard(shareText);
    }
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('Itinerary copied to clipboard!', 'success');
}

function editItinerary(tripId) {
    closeModal();
    viewTrip(tripId);
    switchTripView('itinerary', tripId);
}

// City Search Functions
let currentTripIdForCitySearch = null;

function showCitySearch(tripId) {
    currentTripIdForCitySearch = tripId;
    
    const modalHTML = `
        <div class="modal active" id="city-search-modal">
            <div class="modal-content" style="max-width: 1200px; max-height: 95vh;">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="city-search-header">
                    <h2>Search Cities</h2>
                    <p>Discover and add cities to your trip</p>
                </div>
                
                <div class="city-search-container">
                    <div class="search-filters">
                        <div class="search-bar">
                            <input type="text" id="city-search-input" placeholder="Search cities..." onkeyup="searchCities()">
                            <button class="btn-primary" onclick="searchCities()">
                                <i class="fas fa-search"></i> Search
                            </button>
                        </div>
                        
                        <div class="filter-sections">
                            <div class="filter-section">
                                <label for="country-filter">Country</label>
                                <select id="country-filter" onchange="searchCities()">
                                    <option value="">All Countries</option>
                                </select>
                            </div>
                            
                            <div class="filter-section">
                                <label for="region-filter">Region</label>
                                <select id="region-filter" onchange="searchCities()">
                                    <option value="">All Regions</option>
                                </select>
                            </div>
                            
                            <div class="filter-section">
                                <label for="city-type-filter">City Type</label>
                                <select id="city-type-filter" onchange="searchCities()">
                                    <option value="">All Types</option>
                                </select>
                            </div>
                            
                            <div class="filter-section">
                                <label for="sort-filter">Sort By</label>
                                <select id="sort-filter" onchange="searchCities()">
                                    <option value="name">Name</option>
                                    <option value="popularity">Popularity</option>
                                    <option value="cost">Cost (Low to High)</option>
                                    <option value="rating">Rating</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="cost-filter">
                            <label>Daily Cost Range ($)</label>
                            <div class="cost-range">
                                <input type="number" id="min-cost" placeholder="Min" onchange="searchCities()">
                                <span>-</span>
                                <input type="number" id="max-cost" placeholder="Max" onchange="searchCities()">
                            </div>
                        </div>
                    </div>
                    
                    <div class="search-results">
                        <div class="results-header">
                            <h3>Search Results</h3>
                            <div class="results-count" id="results-count">Loading...</div>
                        </div>
                        
                        <div class="cities-grid" id="cities-grid">
                            <div class="loading-state">
                                <i class="fas fa-spinner fa-spin"></i>
                                <p>Loading cities...</p>
                            </div>
                        </div>
                        
                        <div class="pagination" id="pagination">
                            <!-- Pagination will be added dynamically -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalHTML;
    
    // Load initial data
    loadCityFilters();
    searchCities();
}

async function loadCityFilters() {
    try {
        // Perform a search to get filter options
        const response = await fetch('/api/cities/search');
        const data = await response.json();
        
        if (data.filters) {
            // Populate country filter
            const countrySelect = document.getElementById('country-filter');
            data.filters.countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                option.textContent = country;
                countrySelect.appendChild(option);
            });
            
            // Populate region filter
            const regionSelect = document.getElementById('region-filter');
            data.filters.regions.forEach(region => {
                const option = document.createElement('option');
                option.value = region;
                option.textContent = region;
                regionSelect.appendChild(option);
            });
            
            // Populate city type filter
            const cityTypeSelect = document.getElementById('city-type-filter');
            data.filters.city_types.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
                cityTypeSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading filters:', error);
    }
}

async function searchCities(page = 1) {
    try {
        const query = document.getElementById('city-search-input').value;
        const country = document.getElementById('country-filter').value;
        const region = document.getElementById('region-filter').value;
        const cityType = document.getElementById('city-type-filter').value;
        const sortBy = document.getElementById('sort-filter').value;
        const minCost = document.getElementById('min-cost').value;
        const maxCost = document.getElementById('max-cost').value;
        
        // Build query parameters
        const params = new URLSearchParams({
            q: query,
            page: page,
            per_page: 12,
            sort_by: sortBy
        });
        
        if (country) params.append('country', country);
        if (region) params.append('region', region);
        if (cityType) params.append('city_type', cityType);
        if (minCost) params.append('min_cost', minCost);
        if (maxCost) params.append('max_cost', maxCost);
        
        const response = await fetch(`/api/cities/search?${params}`);
        const data = await response.json();
        
        if (response.ok) {
            displayCities(data.cities);
            updatePagination(data.pagination);
            document.getElementById('results-count').textContent = `${data.pagination.total} cities found`;
        } else {
            throw new Error(data.error || 'Search failed');
        }
    } catch (error) {
        console.error('Error searching cities:', error);
        document.getElementById('cities-grid').innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error loading cities. Please try again.</p>
            </div>
        `;
    }
}

function displayCities(cities) {
    const citiesGrid = document.getElementById('cities-grid');
    
    if (cities.length === 0) {
        citiesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No cities found</h3>
                <p>Try adjusting your search criteria or filters</p>
            </div>
        `;
        return;
    }
    
    citiesGrid.innerHTML = cities.map(city => `
        <div class="city-card">
            <div class="city-image">
                ${city.image_url ? 
                    `<img src="${city.image_url}" alt="${city.name}" onerror="this.style.display='none'">` : 
                    `<div class="city-image-placeholder">
                        <i class="fas fa-city"></i>
                    </div>`
                }
            </div>
            
            <div class="city-info">
                <div class="city-header">
                    <h3>${city.name}</h3>
                    <div class="city-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${city.country}
                    </div>
                </div>
                
                <div class="city-meta">
                    <div class="meta-item">
                        <span class="meta-label">Cost Index</span>
                        <span class="meta-value cost-index ${getCostIndexClass(city.cost_index)}">
                            ${city.cost_index.toFixed(0)}
                        </span>
                    </div>
                    
                    <div class="meta-item">
                        <span class="meta-label">Popularity</span>
                        <span class="meta-value popularity">
                            <i class="fas fa-star"></i>
                            ${city.popularity_score.toFixed(1)}
                        </span>
                    </div>
                    
                    <div class="meta-item">
                        <span class="meta-label">Daily Cost</span>
                        <span class="meta-value cost">
                            $${city.average_cost.toFixed(0)}
                        </span>
                    </div>
                    
                    <div class="meta-item">
                        <span class="meta-label">Rating</span>
                        <span class="meta-value rating">
                            <i class="fas fa-star"></i>
                            ${city.rating.toFixed(1)}
                        </span>
                    </div>
                </div>
                
                ${city.description ? `
                    <div class="city-description">
                        ${city.description.substring(0, 100)}${city.description.length > 100 ? '...' : ''}
                    </div>
                ` : ''}
                
                <div class="city-actions">
                    <button class="btn-secondary" onclick="viewCityDetails(${city.id})">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                    <button class="btn-primary" onclick="showAddCityToTrip(${city.id}, '${city.name}')">
                        <i class="fas fa-plus"></i> Add to Trip
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function getCostIndexClass(costIndex) {
    if (costIndex < 50) return 'low';
    if (costIndex < 100) return 'medium';
    return 'high';
}

function updatePagination(pagination) {
    const paginationDiv = document.getElementById('pagination');
    
    if (pagination.pages <= 1) {
        paginationDiv.innerHTML = '';
        return;
    }
    
    let paginationHTML = '<div class="pagination-controls">';
    
    // Previous button
    if (pagination.has_prev) {
        paginationHTML += `
            <button class="pagination-btn" onclick="searchCities(${pagination.page - 1})">
                <i class="fas fa-chevron-left"></i> Previous
            </button>
        `;
    }
    
    // Page numbers
    const startPage = Math.max(1, pagination.page - 2);
    const endPage = Math.min(pagination.pages, pagination.page + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === pagination.page ? 'active' : '';
        paginationHTML += `
            <button class="pagination-btn ${activeClass}" onclick="searchCities(${i})">
                ${i}
            </button>
        `;
    }
    
    // Next button
    if (pagination.has_next) {
        paginationHTML += `
            <button class="pagination-btn" onclick="searchCities(${pagination.page + 1})">
                Next <i class="fas fa-chevron-right"></i>
            </button>
        `;
    }
    
    paginationHTML += '</div>';
    paginationDiv.innerHTML = paginationHTML;
}

async function viewCityDetails(cityId) {
    try {
        const response = await fetch(`/api/cities/${cityId}`);
        const city = await response.json();
        
        if (response.ok) {
            const modalHTML = `
                <div class="modal active" id="city-details-modal">
                    <div class="modal-content" style="max-width: 800px;">
                        <button class="modal-close" onclick="closeModal()">&times;</button>
                        <div class="city-details">
                            <div class="city-details-header">
                                ${city.image_url ? 
                                    `<img src="${city.image_url}" alt="${city.name}" class="city-details-image">` : 
                                    `<div class="city-details-image-placeholder">
                                        <i class="fas fa-city"></i>
                                    </div>`
                                }
                                <div class="city-details-title">
                                    <h2>${city.name}</h2>
                                    <p class="city-details-location">
                                        <i class="fas fa-map-marker-alt"></i>
                                        ${city.country}
                                    </p>
                                </div>
                            </div>
                            
                            <div class="city-details-content">
                                <div class="city-details-stats">
                                    <div class="stat-item">
                                        <span class="stat-label">Cost Index</span>
                                        <span class="stat-value cost-index ${getCostIndexClass(city.cost_index)}">
                                            ${city.cost_index.toFixed(0)}
                                        </span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-label">Daily Cost</span>
                                        <span class="stat-value">$${city.average_cost.toFixed(0)}</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-label">Popularity</span>
                                        <span class="stat-value">
                                            <i class="fas fa-star"></i>
                                            ${city.popularity_score.toFixed(1)}
                                        </span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-label">Rating</span>
                                        <span class="stat-value">
                                            <i class="fas fa-star"></i>
                                            ${city.rating.toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                                
                                ${city.description ? `
                                    <div class="city-details-section">
                                        <h3>About</h3>
                                        <p>${city.description}</p>
                                    </div>
                                ` : ''}
                                
                                ${city.popular_activities && city.popular_activities.length > 0 ? `
                                    <div class="city-details-section">
                                        <h3>Popular Activities</h3>
                                        <div class="activities-list">
                                            ${city.popular_activities.map(activity => `
                                                <div class="activity-tag">${activity}</div>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                                
                                <div class="city-details-section">
                                    <h3>Travel Information</h3>
                                    <div class="travel-info">
                                        ${city.best_time_to_visit ? `
                                            <div class="info-item">
                                                <span class="info-label">Best Time to Visit:</span>
                                                <span class="info-value">${city.best_time_to_visit}</span>
                                            </div>
                                        ` : ''}
                                        ${city.currency ? `
                                            <div class="info-item">
                                                <span class="info-label">Currency:</span>
                                                <span class="info-value">${city.currency}</span>
                                            </div>
                                        ` : ''}
                                        ${city.language ? `
                                            <div class="info-item">
                                                <span class="info-label">Language:</span>
                                                <span class="info-value">${city.language}</span>
                                            </div>
                                        ` : ''}
                                        ${city.timezone ? `
                                            <div class="info-item">
                                                <span class="info-label">Timezone:</span>
                                                <span class="info-value">${city.timezone}</span>
                                            </div>
                                        ` : ''}
                                        ${city.population ? `
                                            <div class="info-item">
                                                <span class="info-label">Population:</span>
                                                <span class="info-value">${city.population.toLocaleString()}</span>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                                
                                <div class="city-details-actions">
                                    <button class="btn-primary" onclick="showAddCityToTrip(${city.id}, '${city.name}')">
                                        <i class="fas fa-plus"></i> Add to Trip
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.getElementById('modal-container').innerHTML = modalHTML;
        } else {
            throw new Error(city.error || 'Failed to load city details');
        }
    } catch (error) {
        console.error('Error loading city details:', error);
        showToast('Error loading city details', 'error');
    }
}

function showAddCityToTrip(cityId, cityName) {
    const modalHTML = `
        <div class="modal active" id="add-city-modal">
            <div class="modal-content" style="max-width: 500px;">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="add-city-form">
                    <h2>Add ${cityName} to Trip</h2>
                    
                    <form id="add-city-form" onsubmit="addCityToTrip(event, ${cityId})">
                        <div class="form-group">
                            <label for="city-date">Start Date</label>
                            <input type="date" id="city-date" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="city-end-date">End Date (Optional)</label>
                            <input type="date" id="city-end-date">
                            <small>Leave empty for single-day visit</small>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-plus"></i> Add to Trip
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalHTML;
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('city-date').setAttribute('min', today);
    document.getElementById('city-end-date').setAttribute('min', today);
}

async function addCityToTrip(event, cityId) {
    event.preventDefault();
    
    try {
        const startDate = document.getElementById('city-date').value;
        const endDate = document.getElementById('city-end-date').value;
        
        if (!currentTripIdForCitySearch) {
            showToast('No trip selected', 'error');
            return;
        }
        
        const response = await fetch(`/api/trips/${currentTripIdForCitySearch}/add-city`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
                city_id: cityId,
                date: startDate,
                end_date: endDate
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('City added to trip successfully!', 'success');
            closeModal();
            
            // Refresh the itinerary view if it's open
            const itineraryView = document.querySelector('.itinerary-view-content');
            if (itineraryView) {
                const trip = trips.find(t => t.id === currentTripIdForCitySearch);
                if (trip) {
                    itineraryView.innerHTML = renderItineraryView(trip);
                }
            }
        } else {
            throw new Error(data.error || 'Failed to add city to trip');
        }
    } catch (error) {
        console.error('Error adding city to trip:', error);
        showToast(error.message || 'Failed to add city to trip', 'error');
    }
}

// Activity Search Functions
let currentStopIdForActivitySearch = null;

function showActivitySearch(stopId) {
    currentStopIdForActivitySearch = stopId;
    
    const modalHTML = `
        <div class="modal active" id="activity-search-modal">
            <div class="modal-content" style="max-width: 1400px; max-height: 95vh;">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="activity-search-header">
                    <h2>Search Activities</h2>
                    <p>Find exciting experiences for your trip</p>
                </div>
                
                <div class="activity-search-container">
                    <div class="activity-search-filters">
                        <div class="activity-search-bar">
                            <input type="text" id="activity-search-input" placeholder="Search activities..." onkeyup="searchActivities()">
                            <button class="btn-primary" onclick="searchActivities()">
                                <i class="fas fa-search"></i> Search
                            </button>
                        </div>
                        
                        <div class="activity-filter-sections">
                            <div class="activity-filter-section">
                                <label for="category-filter">Category</label>
                                <select id="category-filter" onchange="searchActivities()">
                                    <option value="">All Categories</option>
                                </select>
                            </div>
                            
                            <div class="activity-filter-section">
                                <label for="subcategory-filter">Subcategory</label>
                                <select id="subcategory-filter" onchange="searchActivities()">
                                    <option value="">All Subcategories</option>
                                </select>
                            </div>
                            
                            <div class="activity-filter-section">
                                <label for="difficulty-filter">Difficulty</label>
                                <select id="difficulty-filter" onchange="searchActivities()">
                                    <option value="">All Levels</option>
                                </select>
                            </div>
                            
                            <div class="activity-filter-section">
                                <label for="location-type-filter">Location Type</label>
                                <select id="location-type-filter" onchange="searchActivities()">
                                    <option value="">All Types</option>
                                </select>
                            </div>
                            
                            <div class="activity-filter-section">
                                <label for="age-filter">Age Group</label>
                                <select id="age-filter" onchange="searchActivities()">
                                    <option value="">All Ages</option>
                                </select>
                            </div>
                            
                            <div class="activity-filter-section">
                                <label for="sort-activities-filter">Sort By</label>
                                <select id="sort-activities-filter" onchange="searchActivities()">
                                    <option value="name">Name</option>
                                    <option value="rating">Rating</option>
                                    <option value="cost">Cost (Low to High)</option>
                                    <option value="duration">Duration</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="activity-cost-filter">
                            <label>Cost Range ($)</label>
                            <div class="activity-cost-range">
                                <input type="number" id="min-activity-cost" placeholder="Min" onchange="searchActivities()">
                                <span>-</span>
                                <input type="number" id="max-activity-cost" placeholder="Max" onchange="searchActivities()">
                            </div>
                        </div>
                        
                        <div class="activity-duration-filter">
                            <label>Duration (hours)</label>
                            <div class="activity-duration-range">
                                <input type="number" id="min-duration" placeholder="Min" step="0.5" onchange="searchActivities()">
                                <span>-</span>
                                <input type="number" id="max-duration" placeholder="Max" step="0.5" onchange="searchActivities()">
                            </div>
                        </div>
                        
                        <div class="activity-rating-filter">
                            <label for="min-rating">Minimum Rating</label>
                            <select id="min-rating" onchange="searchActivities()">
                                <option value="">Any Rating</option>
                                <option value="3">3+ Stars</option>
                                <option value="4">4+ Stars</option>
                                <option value="4.5">4.5+ Stars</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="activity-search-results">
                        <div class="activity-results-header">
                            <h3>Activities</h3>
                            <div class="activity-results-count" id="activity-results-count">Loading...</div>
                        </div>
                        
                        <div class="activities-grid" id="activities-grid">
                            <div class="loading-state">
                                <i class="fas fa-spinner fa-spin"></i>
                                <p>Loading activities...</p>
                            </div>
                        </div>
                        
                        <div class="activity-pagination" id="activity-pagination">
                            <!-- Pagination will be added dynamically -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalHTML;
    
    // Load initial data
    loadActivityFilters();
    searchActivities();
}

async function loadActivityFilters() {
    try {
        // Perform a search to get filter options
        const response = await fetch('/api/activities/search');
        const data = await response.json();
        
        if (data.filters) {
            // Populate category filter
            const categorySelect = document.getElementById('category-filter');
            data.filters.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                categorySelect.appendChild(option);
            });
            
            // Populate subcategory filter
            const subcategorySelect = document.getElementById('subcategory-filter');
            data.filters.subcategories.forEach(subcategory => {
                const option = document.createElement('option');
                option.value = subcategory;
                option.textContent = subcategory.charAt(0).toUpperCase() + subcategory.slice(1);
                subcategorySelect.appendChild(option);
            });
            
            // Populate difficulty filter
            const difficultySelect = document.getElementById('difficulty-filter');
            data.filters.difficulties.forEach(difficulty => {
                const option = document.createElement('option');
                option.value = difficulty;
                option.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
                difficultySelect.appendChild(option);
            });
            
            // Populate location type filter
            const locationTypeSelect = document.getElementById('location-type-filter');
            data.filters.location_types.forEach(locationType => {
                const option = document.createElement('option');
                option.value = locationType;
                option.textContent = locationType.charAt(0).toUpperCase() + locationType.slice(1);
                locationTypeSelect.appendChild(option);
            });
            
            // Populate age group filter
            const ageSelect = document.getElementById('age-filter');
            data.filters.age_groups.forEach(ageGroup => {
                const option = document.createElement('option');
                option.value = ageGroup;
                option.textContent = ageGroup.charAt(0).toUpperCase() + ageGroup.slice(1);
                ageSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading activity filters:', error);
    }
}

async function searchActivities(page = 1) {
    try {
        const query = document.getElementById('activity-search-input').value;
        const category = document.getElementById('category-filter').value;
        const subcategory = document.getElementById('subcategory-filter').value;
        const difficulty = document.getElementById('difficulty-filter').value;
        const locationType = document.getElementById('location-type-filter').value;
        const ageGroup = document.getElementById('age-filter').value;
        const sortBy = document.getElementById('sort-activities-filter').value;
        const minCost = document.getElementById('min-activity-cost').value;
        const maxCost = document.getElementById('max-activity-cost').value;
        const minDuration = document.getElementById('min-duration').value;
        const maxDuration = document.getElementById('max-duration').value;
        const minRating = document.getElementById('min-rating').value;
        
        // Build query parameters
        const params = new URLSearchParams({
            q: query,
            page: page,
            per_page: 12,
            sort_by: sortBy
        });
        
        if (category) params.append('category', category);
        if (subcategory) params.append('subcategory', subcategory);
        if (difficulty) params.append('difficulty', difficulty);
        if (locationType) params.append('location_type', locationType);
        if (ageGroup) params.append('age_appropriate', ageGroup);
        if (minCost) params.append('min_cost', minCost);
        if (maxCost) params.append('max_cost', maxCost);
        if (minDuration) params.append('min_duration', minDuration);
        if (maxDuration) params.append('max_duration', maxDuration);
        if (minRating) params.append('min_rating', minRating);
        
        const response = await fetch(`/api/activities/search?${params}`);
        const data = await response.json();
        
        if (response.ok) {
            displayActivities(data.activities);
            updateActivityPagination(data.pagination);
            document.getElementById('activity-results-count').textContent = `${data.pagination.total} activities found`;
        } else {
            throw new Error(data.error || 'Search failed');
        }
    } catch (error) {
        console.error('Error searching activities:', error);
        document.getElementById('activities-grid').innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error loading activities. Please try again.</p>
            </div>
        `;
    }
}

function displayActivities(activities) {
    const activitiesGrid = document.getElementById('activities-grid');
    
    if (activities.length === 0) {
        activitiesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No activities found</h3>
                <p>Try adjusting your search criteria or filters</p>
            </div>
        `;
        return;
    }
    
    activitiesGrid.innerHTML = activities.map(activity => `
        <div class="activity-card">
            <div class="activity-image">
                ${activity.image_url ? 
                    `<img src="${activity.image_url}" alt="${activity.name}" onerror="this.style.display='none'">` : 
                    `<div class="activity-image-placeholder">
                        <i class="fas fa-hiking"></i>
                    </div>`
                }
            </div>
            
            <div class="activity-info">
                <div class="activity-header">
                    <h3>${activity.name}</h3>
                    <div class="activity-category">
                        <span class="category-tag">${activity.category}</span>
                        ${activity.subcategory ? `
                            <span class="subcategory-tag">${activity.subcategory}</span>
                        ` : ''}
                    </div>
                </div>
                
                <div class="activity-meta">
                    <div class="meta-item">
                        <span class="meta-label">Duration</span>
                        <span class="meta-value duration">
                            <i class="fas fa-clock"></i>
                            ${activity.duration_hours}h
                        </span>
                    </div>
                    
                    <div class="meta-item">
                        <span class="meta-label">Difficulty</span>
                        <span class="meta-value difficulty ${getDifficultyClass(activity.difficulty_level)}">
                            ${activity.difficulty_level}
                        </span>
                    </div>
                    
                    <div class="meta-item">
                        <span class="meta-label">Cost</span>
                        <span class="meta-value cost">
                            <i class="fas fa-dollar-sign"></i>
                            ${activity.cost_range_min === activity.cost_range_max ? 
                                `$${activity.cost_range_min}` : 
                                `$${activity.cost_range_min}-${activity.cost_range_max}`
                            }
                        </span>
                    </div>
                    
                    <div class="meta-item">
                        <span class="meta-label">Rating</span>
                        <span class="meta-value rating">
                            <i class="fas fa-star"></i>
                            ${activity.rating.toFixed(1)}
                        </span>
                    </div>
                </div>
                
                ${activity.description ? `
                    <div class="activity-description">
                        ${activity.description.substring(0, 120)}${activity.description.length > 120 ? '...' : ''}
                    </div>
                ` : ''}
                
                <div class="activity-tags">
                    ${activity.location_type ? `
                        <span class="tag location-tag">
                            <i class="fas fa-${getLocationIcon(activity.location_type)}"></i>
                            ${activity.location_type}
                        </span>
                    ` : ''}
                    ${activity.age_appropriate ? `
                        <span class="tag age-tag">
                            <i class="fas fa-users"></i>
                            ${activity.age_appropriate}
                        </span>
                    ` : ''}
                    ${activity.booking_required ? `
                        <span class="tag booking-tag">
                            <i class="fas fa-calendar-check"></i>
                            Booking Required
                        </span>
                    ` : ''}
                </div>
                
                <div class="activity-actions">
                    <button class="btn-secondary" onclick="viewActivityDetails(${activity.id})">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                    <button class="btn-primary" onclick="showAddActivityToStop(${activity.id}, '${activity.name}')">
                        <i class="fas fa-plus"></i> Add to Stop
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function getDifficultyClass(difficulty) {
    switch(difficulty.toLowerCase()) {
        case 'easy': return 'easy';
        case 'moderate': return 'moderate';
        case 'hard': return 'hard';
        default: return 'easy';
    }
}

function getLocationIcon(locationType) {
    switch(locationType.toLowerCase()) {
        case 'indoor': return 'home';
        case 'outdoor': return 'tree';
        case 'both': return 'arrows-alt';
        default: return 'map-marker-alt';
    }
}

function updateActivityPagination(pagination) {
    const paginationDiv = document.getElementById('activity-pagination');
    
    if (pagination.pages <= 1) {
        paginationDiv.innerHTML = '';
        return;
    }
    
    let paginationHTML = '<div class="pagination-controls">';
    
    // Previous button
    if (pagination.has_prev) {
        paginationHTML += `
            <button class="pagination-btn" onclick="searchActivities(${pagination.page - 1})">
                <i class="fas fa-chevron-left"></i> Previous
            </button>
        `;
    }
    
    // Page numbers
    const startPage = Math.max(1, pagination.page - 2);
    const endPage = Math.min(pagination.pages, pagination.page + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === pagination.page ? 'active' : '';
        paginationHTML += `
            <button class="pagination-btn ${activeClass}" onclick="searchActivities(${i})">
                ${i}
            </button>
        `;
    }
    
    // Next button
    if (pagination.has_next) {
        paginationHTML += `
            <button class="pagination-btn" onclick="searchActivities(${pagination.page + 1})">
                Next <i class="fas fa-chevron-right"></i>
            </button>
        `;
    }
    
    paginationHTML += '</div>';
    paginationDiv.innerHTML = paginationHTML;
}

async function viewActivityDetails(activityId) {
    try {
        const response = await fetch(`/api/activities/${activityId}`);
        const activity = await response.json();
        
        if (response.ok) {
            const modalHTML = `
                <div class="modal active" id="activity-details-modal">
                    <div class="modal-content" style="max-width: 900px;">
                        <button class="modal-close" onclick="closeModal()">&times;</button>
                        <div class="activity-details">
                            <div class="activity-details-header">
                                ${activity.image_url ? 
                                    `<img src="${activity.image_url}" alt="${activity.name}" class="activity-details-image">` : 
                                    `<div class="activity-details-image-placeholder">
                                        <i class="fas fa-hiking"></i>
                                    </div>`
                                }
                                <div class="activity-details-title">
                                    <h2>${activity.name}</h2>
                                    <div class="activity-details-category">
                                        <span class="category-tag">${activity.category}</span>
                                        ${activity.subcategory ? `
                                            <span class="subcategory-tag">${activity.subcategory}</span>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="activity-details-content">
                                <div class="activity-details-stats">
                                    <div class="stat-item">
                                        <span class="stat-label">Duration</span>
                                        <span class="stat-value">
                                            <i class="fas fa-clock"></i>
                                            ${activity.duration_hours} hours
                                        </span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-label">Difficulty</span>
                                        <span class="stat-value difficulty ${getDifficultyClass(activity.difficulty_level)}">
                                            ${activity.difficulty_level}
                                        </span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-label">Cost Range</span>
                                        <span class="stat-value">
                                            $${activity.cost_range_min} - $${activity.cost_range_max}
                                        </span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-label">Rating</span>
                                        <span class="stat-value">
                                            <i class="fas fa-star"></i>
                                            ${activity.rating.toFixed(1)} (${activity.review_count} reviews)
                                        </span>
                                    </div>
                                </div>
                                
                                ${activity.description ? `
                                    <div class="activity-details-section">
                                        <h3>About This Activity</h3>
                                        <p>${activity.description}</p>
                                    </div>
                                ` : ''}
                                
                                <div class="activity-details-section">
                                    <h3>Activity Details</h3>
                                    <div class="activity-info-grid">
                                        ${activity.location_type ? `
                                            <div class="info-item">
                                                <span class="info-label">Location Type:</span>
                                                <span class="info-value">
                                                    <i class="fas fa-${getLocationIcon(activity.location_type)}"></i>
                                                    ${activity.location_type}
                                                </span>
                                            </div>
                                        ` : ''}
                                        ${activity.best_time_of_day ? `
                                            <div class="info-item">
                                                <span class="info-label">Best Time:</span>
                                                <span class="info-value">${activity.best_time_of_day}</span>
                                            </div>
                                        ` : ''}
                                        ${activity.age_appropriate ? `
                                            <div class="info-item">
                                                <span class="info-label">Age Group:</span>
                                                <span class="info-value">${activity.age_appropriate}</span>
                                            </div>
                                        ` : ''}
                                        ${activity.group_size_max ? `
                                            <div class="info-item">
                                                <span class="info-label">Group Size:</span>
                                                <span class="info-value">${activity.group_size_min} - ${activity.group_size_max} people</span>
                                            </div>
                                        ` : ''}
                                        ${activity.booking_required ? `
                                            <div class="info-item">
                                                <span class="info-label">Booking:</span>
                                                <span class="info-value">
                                                    ${activity.advance_booking_days > 0 ? 
                                                        `Required (${activity.advance_booking_days} days in advance)` : 
                                                        'Required'
                                                    }
                                                </span>
                                            </div>
                                        ` : ''}
                                        ${activity.accessibility ? `
                                            <div class="info-item">
                                                <span class="info-label">Accessibility:</span>
                                                <span class="info-value">${activity.accessibility}</span>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                                
                                ${activity.what_to_bring && activity.what_to_bring.length > 0 ? `
                                    <div class="activity-details-section">
                                        <h3>What to Bring</h3>
                                        <div class="items-list">
                                            ${activity.what_to_bring.map(item => `
                                                <div class="item-tag">
                                                    <i class="fas fa-check"></i>
                                                    ${item}
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                                
                                ${activity.included_items && activity.included_items.length > 0 ? `
                                    <div class="activity-details-section">
                                        <h3>What's Included</h3>
                                        <div class="items-list">
                                            ${activity.included_items.map(item => `
                                                <div class="item-tag included">
                                                    <i class="fas fa-plus"></i>
                                                    ${item}
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                                
                                ${activity.tips ? `
                                    <div class="activity-details-section">
                                        <h3>Tips & Recommendations</h3>
                                        <p>${activity.tips}</p>
                                    </div>
                                ` : ''}
                                
                                ${activity.safety_notes ? `
                                    <div class="activity-details-section">
                                        <h3>Safety Information</h3>
                                        <p>${activity.safety_notes}</p>
                                    </div>
                                ` : ''}
                                
                                <div class="activity-details-actions">
                                    <button class="btn-primary" onclick="showAddActivityToStop(${activity.id}, '${activity.name}')">
                                        <i class="fas fa-plus"></i> Add to Stop
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.getElementById('modal-container').innerHTML = modalHTML;
        } else {
            throw new Error(activity.error || 'Failed to load activity details');
        }
    } catch (error) {
        console.error('Error loading activity details:', error);
        showToast('Error loading activity details', 'error');
    }
}

function showAddActivityToStop(activityId, activityName) {
    const modalHTML = `
        <div class="modal active" id="add-activity-modal">
            <div class="modal-content" style="max-width: 500px;">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="add-activity-form">
                    <h2>Add ${activityName}</h2>
                    
                    <form id="add-activity-form" onsubmit="addActivityToStop(event, ${activityId})">
                        <div class="form-group">
                            <label for="activity-time">Time</label>
                            <input type="time" id="activity-time" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="activity-location">Location (Optional)</label>
                            <input type="text" id="activity-location" placeholder="Specific location or venue">
                        </div>
                        
                        <div class="form-group">
                            <label for="activity-cost">Cost (Optional)</label>
                            <input type="number" id="activity-cost" placeholder="Custom cost" step="0.01" min="0">
                            <small>Leave empty to use default cost</small>
                        </div>
                        
                        <div class="form-group">
                            <label for="activity-notes">Notes (Optional)</label>
                            <textarea id="activity-notes" rows="3" placeholder="Additional notes or preferences"></textarea>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-plus"></i> Add to Stop
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalHTML;
}

async function addActivityToStop(event, activityId) {
    event.preventDefault();
    
    try {
        const time = document.getElementById('activity-time').value;
        const location = document.getElementById('activity-location').value;
        const cost = document.getElementById('activity-cost').value;
        const notes = document.getElementById('activity-notes').value;
        
        if (!currentStopIdForActivitySearch) {
            showToast('No stop selected', 'error');
            return;
        }
        
        const response = await fetch(`/api/itinerary/${currentStopIdForActivitySearch}/add-activity-template`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
                activity_template_id: activityId,
                time: time,
                location: location,
                cost: cost ? parseFloat(cost) : null,
                notes: notes
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Activity added successfully!', 'success');
            closeModal();
            
            // Refresh the itinerary view if it's open
            const itineraryView = document.querySelector('.itinerary-view-content');
            if (itineraryView) {
                const trip = trips.find(t => t.id === currentTripIdForCitySearch);
                if (trip) {
                    itineraryView.innerHTML = renderItineraryView(trip);
                }
            }
        } else {
            throw new Error(data.error || 'Failed to add activity');
        }
    } catch (error) {
        console.error('Error adding activity:', error);
        showToast(error.message || 'Failed to add activity', 'error');
    }
}

// Budget and Expense Management Functions
let currentTripIdForBudget = null;

function showBudgetBreakdown(tripId) {
    currentTripIdForBudget = tripId;
    
    const modalHTML = `
        <div class="modal active" id="budget-modal">
            <div class="modal-content" style="max-width: 1200px; max-height: 95vh;">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="budget-header">
                    <h2>Trip Budget & Cost Breakdown</h2>
                    <div class="budget-actions">
                        <button class="btn-secondary" onclick="showAddExpense()">
                            <i class="fas fa-plus"></i> Add Expense
                        </button>
                        <button class="btn-secondary" onclick="showExpenseList()">
                            <i class="fas fa-list"></i> View Expenses
                        </button>
                        <button class="btn-secondary" onclick="getBudgetSuggestions()">
                            <i class="fas fa-lightbulb"></i> Get Suggestions
                        </button>
                    </div>
                </div>
                
                <div class="budget-content">
                    <div class="budget-overview" id="budget-overview">
                        <div class="loading-state">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>Loading budget data...</p>
                        </div>
                    </div>
                    
                    <div class="budget-charts">
                        <div class="chart-container">
                            <h3>Cost Breakdown by Category</h3>
                            <div id="pie-chart-container">
                                <canvas id="budget-pie-chart"></canvas>
                            </div>
                        </div>
                        
                        <div class="chart-container">
                            <h3>Daily Spending Trend</h3>
                            <div id="bar-chart-container">
                                <canvas id="budget-bar-chart"></canvas>
                            </div>
                        </div>
                    </div>
                    
                    <div class="budget-suggestions" id="budget-suggestions">
                        <!-- Budget suggestions will be loaded here -->
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalHTML;
    
    // Load budget data
    loadBudgetData();
}

async function loadBudgetData() {
    try {
        const response = await fetch(`/api/trips/${currentTripIdForBudget}/budget`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        
        const budgetData = await response.json();
        
        if (response.ok) {
            displayBudgetOverview(budgetData);
            createBudgetCharts(budgetData);
        } else {
            throw new Error(budgetData.error || 'Failed to load budget data');
        }
    } catch (error) {
        console.error('Error loading budget data:', error);
        document.getElementById('budget-overview').innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error loading budget data. Please try again.</p>
            </div>
        `;
    }
}

function displayBudgetOverview(budgetData) {
    const overviewHTML = `
        <div class="budget-summary">
            <div class="budget-status ${budgetData.budget_status}">
                <div class="status-icon">
                    <i class="fas fa-${getBudgetStatusIcon(budgetData.budget_status)}"></i>
                </div>
                <div class="status-content">
                    <h3>${getBudgetStatusText(budgetData.budget_status)}</h3>
                    <p>${getBudgetStatusMessage(budgetData.budget_status, budgetData)}</p>
                </div>
            </div>
            
            <div class="budget-cards">
                <div class="budget-card total">
                    <div class="card-icon">
                        <i class="fas fa-wallet"></i>
                    </div>
                    <div class="card-content">
                        <h4>Total Budget</h4>
                        <p class="amount">$${budgetData.total_budget.toFixed(2)}</p>
                    </div>
                </div>
                
                <div class="budget-card spent">
                    <div class="card-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <div class="card-content">
                        <h4>Total Spent</h4>
                        <p class="amount">$${budgetData.total_spent.toFixed(2)}</p>
                    </div>
                </div>
                
                <div class="budget-card remaining ${budgetData.remaining_budget < 0 ? 'negative' : ''}">
                    <div class="card-icon">
                        <i class="fas fa-piggy-bank"></i>
                    </div>
                    <div class="card-content">
                        <h4>Remaining</h4>
                        <p class="amount">$${Math.abs(budgetData.remaining_budget).toFixed(2)}</p>
                    </div>
                </div>
                
                <div class="budget-card daily">
                    <div class="card-icon">
                        <i class="fas fa-calendar-day"></i>
                    </div>
                    <div class="card-content">
                        <h4>Daily Average</h4>
                        <p class="amount">$${budgetData.daily_average.toFixed(2)}</p>
                        <small>of $${budgetData.budget_daily_average.toFixed(2)} budgeted</small>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="budget-breakdown">
            <h3>Cost Breakdown by Category</h3>
            <div class="breakdown-items">
                ${Object.entries(budgetData.breakdown).map(([category, amount]) => `
                    <div class="breakdown-item">
                        <div class="breakdown-label">
                            <i class="fas fa-${getCategoryIcon(category)}"></i>
                            <span>${getCategoryName(category)}</span>
                        </div>
                        <div class="breakdown-amount">
                            <span class="amount">$${amount.toFixed(2)}</span>
                            <span class="percentage">${((amount / budgetData.total_spent) * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.getElementById('budget-overview').innerHTML = overviewHTML;
}

function getBudgetStatusIcon(status) {
    switch(status) {
        case 'on_track': return 'check-circle';
        case 'caution': return 'exclamation-triangle';
        case 'warning': return 'exclamation-circle';
        case 'over_budget': return 'times-circle';
        default: return 'info-circle';
    }
}

function getBudgetStatusText(status) {
    switch(status) {
        case 'on_track': return 'On Track';
        case 'caution': return 'Caution';
        case 'warning': return 'Warning';
        case 'over_budget': return 'Over Budget';
        default: return 'Unknown';
    }
}

function getBudgetStatusMessage(status, budgetData) {
    switch(status) {
        case 'on_track': 
            return `You're within budget with $${budgetData.remaining_budget.toFixed(2)} remaining.`;
        case 'caution': 
            return `You've used ${((budgetData.total_spent / budgetData.total_budget) * 100).toFixed(1)}% of your budget.`;
        case 'warning': 
            return `You're approaching your budget limit. Only $${budgetData.remaining_budget.toFixed(2)} remaining.`;
        case 'over_budget': 
            return `You're $${Math.abs(budgetData.remaining_budget).toFixed(2)} over budget!`;
        default: 
            return 'Budget status unknown.';
    }
}

function getCategoryIcon(category) {
    switch(category) {
        case 'transport': return 'plane';
        case 'accommodation': return 'bed';
        case 'meals': return 'utensils';
        case 'activities': return 'hiking';
        case 'shopping': return 'shopping-bag';
        case 'other': return 'ellipsis-h';
        default: return 'question-circle';
    }
}

function getCategoryName(category) {
    switch(category) {
        case 'transport': return 'Transportation';
        case 'accommodation': return 'Accommodation';
        case 'meals': return 'Meals & Dining';
        case 'activities': return 'Activities';
        case 'shopping': return 'Shopping';
        case 'other': return 'Other';
        default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
}

function createBudgetCharts(budgetData) {
    // Create pie chart
    createPieChart(budgetData.breakdown);
    
    // Create bar chart for daily spending
    createBarChart(budgetData);
}

function createPieChart(breakdown) {
    const canvas = document.getElementById('budget-pie-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const data = Object.entries(breakdown);
    const total = data.reduce((sum, [_, amount]) => sum + amount, 0);
    
    // Simple pie chart implementation
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    let currentAngle = -Math.PI / 2;
    const colors = [
        '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'
    ];
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    data.forEach(([category, amount], index) => {
        const sliceAngle = (amount / total) * 2 * Math.PI;
        
        // Draw slice
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();
        
        // Draw label
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${((amount / total) * 100).toFixed(1)}%`, labelX, labelY);
        
        currentAngle += sliceAngle;
    });
    
    // Draw legend
    let legendY = 20;
    data.forEach(([category, amount], index) => {
        ctx.fillStyle = colors[index % colors.length];
        ctx.fillRect(10, legendY, 15, 15);
        
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`${getCategoryName(category)}: $${amount.toFixed(2)}`, 30, legendY + 12);
        
        legendY += 20;
    });
}

function createBarChart(budgetData) {
    const canvas = document.getElementById('budget-bar-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Simple bar chart showing daily average vs budget
    const dailySpent = budgetData.daily_average;
    const dailyBudget = budgetData.budget_daily_average;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = 60;
    const barSpacing = 40;
    const maxHeight = canvas.height - 60;
    const maxValue = Math.max(dailySpent, dailyBudget) * 1.2;
    
    // Draw spent bar
    const spentHeight = (dailySpent / maxValue) * maxHeight;
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(canvas.width / 2 - barWidth - barSpacing / 2, canvas.height - 40 - spentHeight, barWidth, spentHeight);
    
    // Draw budget bar
    const budgetHeight = (dailyBudget / maxValue) * maxHeight;
    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(canvas.width / 2 + barSpacing / 2, canvas.height - 40 - budgetHeight, barWidth, budgetHeight);
    
    // Draw labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    // Spent label
    ctx.fillText('Spent', canvas.width / 2 - barWidth / 2 - barSpacing / 2, canvas.height - 20);
    ctx.fillText(`$${dailySpent.toFixed(2)}`, canvas.width / 2 - barWidth / 2 - barSpacing / 2, canvas.height - 40 - spentHeight - 5);
    
    // Budget label
    ctx.fillText('Budget', canvas.width / 2 + barWidth / 2 + barSpacing / 2, canvas.height - 20);
    ctx.fillText(`$${dailyBudget.toFixed(2)}`, canvas.width / 2 + barWidth / 2 + barSpacing / 2, canvas.height - 40 - budgetHeight - 5);
    
    // Title
    ctx.font = '14px Arial';
    ctx.fillText('Daily Spending vs Budget', canvas.width / 2, 15);
}

async function getBudgetSuggestions() {
    try {
        const response = await fetch(`/api/trips/${currentTripIdForBudget}/budget/suggestions`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayBudgetSuggestions(data.suggestions);
        } else {
            throw new Error(data.error || 'Failed to get suggestions');
        }
    } catch (error) {
        console.error('Error getting budget suggestions:', error);
        showToast('Error loading budget suggestions', 'error');
    }
}

function displayBudgetSuggestions(suggestions) {
    const suggestionsHTML = `
        <div class="suggestions-container">
            <h3>Budget Suggestions</h3>
            <div class="suggestions-list">
                ${suggestions.map(suggestion => `
                    <div class="suggestion-item ${suggestion.type}">
                        <div class="suggestion-icon">
                            <i class="fas fa-${getSuggestionIcon(suggestion.type)}"></i>
                        </div>
                        <div class="suggestion-content">
                            <p>${suggestion.message}</p>
                            ${suggestion.potential_savings > 0 ? 
                                `<span class="potential-savings">Potential savings: $${suggestion.potential_savings.toFixed(2)}</span>` : 
                                ''
                            }
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.getElementById('budget-suggestions').innerHTML = suggestionsHTML;
}

function getSuggestionIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'info': return 'info-circle';
        case 'warning': return 'exclamation-triangle';
        case 'critical': return 'exclamation-circle';
        default: return 'lightbulb';
    }
}

function showAddExpense() {
    const modalHTML = `
        <div class="modal active" id="add-expense-modal">
            <div class="modal-content" style="max-width: 500px;">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="add-expense-form">
                    <h2>Add Expense</h2>
                    
                    <form id="add-expense-form" onsubmit="addExpense(event)">
                        <div class="form-group">
                            <label for="expense-category">Category</label>
                            <select id="expense-category" required>
                                <option value="">Select Category</option>
                                <option value="transport">Transportation</option>
                                <option value="accommodation">Accommodation</option>
                                <option value="meals">Meals & Dining</option>
                                <option value="activities">Activities</option>
                                <option value="shopping">Shopping</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="expense-description">Description</label>
                            <input type="text" id="expense-description" required placeholder="What was this expense for?">
                        </div>
                        
                        <div class="form-group">
                            <label for="expense-amount">Amount</label>
                            <input type="number" id="expense-amount" required step="0.01" min="0" placeholder="0.00">
                        </div>
                        
                        <div class="form-group">
                            <label for="expense-date">Date</label>
                            <input type="date" id="expense-date" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="expense-currency">Currency</label>
                            <select id="expense-currency">
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="JPY">JPY</option>
                            </select>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-plus"></i> Add Expense
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalHTML;
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expense-date').value = today;
}

async function addExpense(event) {
    event.preventDefault();
    
    try {
        const category = document.getElementById('expense-category').value;
        const description = document.getElementById('expense-description').value;
        const amount = document.getElementById('expense-amount').value;
        const date = document.getElementById('expense-date').value;
        const currency = document.getElementById('expense-currency').value;
        
        const response = await fetch(`/api/trips/${currentTripIdForBudget}/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
                category,
                description,
                amount: parseFloat(amount),
                date,
                currency
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Expense added successfully!', 'success');
            closeModal();
            
            // Refresh budget data
            loadBudgetData();
        } else {
            throw new Error(data.error || 'Failed to add expense');
        }
    } catch (error) {
        console.error('Error adding expense:', error);
        showToast(error.message || 'Failed to add expense', 'error');
    }
}

async function showExpenseList() {
    try {
        const response = await fetch(`/api/trips/${currentTripIdForBudget}/expenses`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        
        const expenses = await response.json();
        
        if (response.ok) {
            const modalHTML = `
                <div class="modal active" id="expense-list-modal">
                    <div class="modal-content" style="max-width: 800px;">
                        <button class="modal-close" onclick="closeModal()">&times;</button>
                        <div class="expense-list">
                            <h2>Expense List</h2>
                            <div class="expense-items">
                                ${expenses.length === 0 ? 
                                    '<p class="no-expenses">No expenses recorded yet.</p>' :
                                    expenses.map(expense => `
                                        <div class="expense-item">
                                            <div class="expense-info">
                                                <div class="expense-header">
                                                    <span class="expense-category">${getCategoryName(expense.category)}</span>
                                                    <span class="expense-date">${formatDate(expense.date)}</span>
                                                </div>
                                                <div class="expense-description">${expense.description}</div>
                                            </div>
                                            <div class="expense-amount">
                                                <span class="amount">$${expense.amount.toFixed(2)}</span>
                                                <span class="currency">${expense.currency}</span>
                                            </div>
                                        </div>
                                    `).join('')
                                }
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.getElementById('modal-container').innerHTML = modalHTML;
        } else {
            throw new Error('Failed to load expenses');
        }
    } catch (error) {
        console.error('Error loading expenses:', error);
        showToast('Error loading expenses', 'error');
    }
}

// Packing Checklist Functions
let currentTripIdForPacking = null;

function showPackingChecklist(tripId) {
    currentTripIdForPacking = tripId;
    
    const modalHTML = `
        <div class="modal active" id="packing-modal">
            <div class="modal-content" style="max-width: 1000px; max-height: 95vh;">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="packing-header">
                    <h2>Packing Checklist</h2>
                    <div class="packing-actions">
                        <button class="btn-secondary" onclick="showAddPackingItem()">
                            <i class="fas fa-plus"></i> Add Item
                        </button>
                        <button class="btn-secondary" onclick="showPackingTemplates()">
                            <i class="fas fa-list"></i> Templates
                        </button>
                        <button class="btn-secondary" onclick="resetPackingList()">
                            <i class="fas fa-redo"></i> Reset
                        </button>
                    </div>
                </div>
                
                <div class="packing-content">
                    <div class="packing-progress" id="packing-progress">
                        <div class="loading-state">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>Loading packing list...</p>
                        </div>
                    </div>
                    
                    <div class="packing-categories" id="packing-categories">
                        <!-- Packing categories will be loaded here -->
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalHTML;
    
    // Load packing data
    loadPackingList();
}

async function loadPackingList() {
    try {
        const response = await fetch(`/api/trips/${currentTripIdForPacking}/packing-list`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        
        const packingData = await response.json();
        
        if (response.ok) {
            displayPackingProgress(packingData);
            displayPackingCategories(packingData);
        } else {
            throw new Error(packingData.error || 'Failed to load packing list');
        }
    } catch (error) {
        console.error('Error loading packing list:', error);
        document.getElementById('packing-progress').innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error loading packing list. Please try again.</p>
            </div>
        `;
    }
}

function displayPackingProgress(packingData) {
    const progressHTML = `
        <div class="progress-overview">
            <div class="progress-stats">
                <div class="progress-item">
                    <div class="progress-icon">
                        <i class="fas fa-box"></i>
                    </div>
                    <div class="progress-content">
                        <h3>${packingData.packed_items}</h3>
                        <p>Packed Items</p>
                    </div>
                </div>
                
                <div class="progress-item">
                    <div class="progress-icon">
                        <i class="fas fa-list"></i>
                    </div>
                    <div class="progress-content">
                        <h3>${packingData.total_items}</h3>
                        <p>Total Items</p>
                    </div>
                </div>
                
                <div class="progress-item">
                    <div class="progress-icon">
                        <i class="fas fa-percentage"></i>
                    </div>
                    <div class="progress-content">
                        <h3>${packingData.progress_percentage.toFixed(1)}%</h3>
                        <p>Complete</p>
                    </div>
                </div>
            </div>
            
            <div class="progress-bar-container">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${packingData.progress_percentage}%"></div>
                </div>
                <span class="progress-text">${packingData.packed_items} of ${packingData.total_items} items packed</span>
            </div>
        </div>
    `;
    
    document.getElementById('packing-progress').innerHTML = progressHTML;
}

function displayPackingCategories(packingData) {
    const categoriesHTML = `
        <div class="categories-container">
            ${Object.entries(packingData.items_by_category).map(([category, items]) => `
                <div class="packing-category">
                    <div class="category-header">
                        <h3>
                            <i class="fas fa-${getCategoryIcon(category)}"></i>
                            ${getCategoryName(category)}
                        </h3>
                        <div class="category-stats">
                            <span class="item-count">${items.length} items</span>
                            <span class="packed-count">${items.filter(item => item.packed).length} packed</span>
                        </div>
                    </div>
                    
                    <div class="category-items">
                        ${items.map(item => `
                            <div class="packing-item ${item.packed ? 'packed' : ''} ${item.essential ? 'essential' : ''}" data-item-id="${item.id}">
                                <div class="item-checkbox">
                                    <input type="checkbox" 
                                           id="item-${item.id}" 
                                           ${item.packed ? 'checked' : ''}
                                           onchange="togglePackedItem(${item.id}, this.checked)">
                                    <label for="item-${item.id}"></label>
                                </div>
                                
                                <div class="item-content">
                                    <div class="item-header">
                                        <span class="item-name">${item.name}</span>
                                        <div class="item-badges">
                                            ${item.essential ? '<span class="badge essential">Essential</span>' : ''}
                                            ${item.quantity > 1 ? `<span class="badge quantity">x${item.quantity}</span>` : ''}
                                        </div>
                                    </div>
                                    ${item.notes ? `<div class="item-notes">${item.notes}</div>` : ''}
                                </div>
                                
                                <div class="item-actions">
                                    <button class="btn-icon edit" onclick="editPackingItem(${item.id})" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn-icon delete" onclick="deletePackingItem(${item.id})" title="Delete">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    document.getElementById('packing-categories').innerHTML = categoriesHTML;
}

function getCategoryIcon(category) {
    switch(category) {
        case 'clothing': return 'tshirt';
        case 'documents': return 'passport';
        case 'electronics': return 'laptop';
        case 'toiletries': return 'soap';
        case 'accessories': return 'glasses';
        case 'gear': return 'backpack';
        case 'safety': return 'shield-alt';
        default: return 'box';
    }
}

function getCategoryName(category) {
    switch(category) {
        case 'clothing': return 'Clothing';
        case 'documents': return 'Documents';
        case 'electronics': return 'Electronics';
        case 'toiletries': return 'Toiletries';
        case 'accessories': return 'Accessories';
        case 'gear': return 'Gear';
        case 'safety': return 'Safety';
        default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
}

async function togglePackedItem(itemId, packed) {
    try {
        const response = await fetch(`/api/packing-items/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({ packed })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Update UI
            const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
            if (itemElement) {
                if (packed) {
                    itemElement.classList.add('packed');
                } else {
                    itemElement.classList.remove('packed');
                }
            }
            
            // Refresh progress
            loadPackingList();
        } else {
            throw new Error(data.error || 'Failed to update item');
        }
    } catch (error) {
        console.error('Error updating item:', error);
        showToast('Error updating item', 'error');
    }
}

function showAddPackingItem() {
    const modalHTML = `
        <div class="modal active" id="add-packing-item-modal">
            <div class="modal-content" style="max-width: 500px;">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="add-packing-item-form">
                    <h2>Add Packing Item</h2>
                    
                    <form id="add-packing-item-form" onsubmit="addPackingItem(event)">
                        <div class="form-group">
                            <label for="item-name">Item Name</label>
                            <input type="text" id="item-name" required placeholder="Enter item name">
                        </div>
                        
                        <div class="form-group">
                            <label for="item-category">Category</label>
                            <select id="item-category" required>
                                <option value="">Select Category</option>
                                <option value="clothing">Clothing</option>
                                <option value="documents">Documents</option>
                                <option value="electronics">Electronics</option>
                                <option value="toiletries">Toiletries</option>
                                <option value="accessories">Accessories</option>
                                <option value="gear">Gear</option>
                                <option value="safety">Safety</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="item-quantity">Quantity</label>
                            <input type="number" id="item-quantity" min="1" value="1" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="item-notes">Notes (Optional)</label>
                            <textarea id="item-notes" rows="3" placeholder="Any additional notes"></textarea>
                        </div>
                        
                        <div class="form-group checkbox-group">
                            <label>
                                <input type="checkbox" id="item-essential">
                                <span>Mark as essential item</span>
                            </label>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-plus"></i> Add Item
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalHTML;
}

async function addPackingItem(event) {
    event.preventDefault();
    
    try {
        const name = document.getElementById('item-name').value;
        const category = document.getElementById('item-category').value;
        const quantity = document.getElementById('item-quantity').value;
        const notes = document.getElementById('item-notes').value;
        const essential = document.getElementById('item-essential').checked;
        
        const response = await fetch(`/api/trips/${currentTripIdForPacking}/packing-items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
                name,
                category,
                quantity: parseInt(quantity),
                notes,
                essential
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Item added successfully!', 'success');
            closeModal();
            
            // Refresh packing list
            loadPackingList();
        } else {
            throw new Error(data.error || 'Failed to add item');
        }
    } catch (error) {
        console.error('Error adding item:', error);
        showToast(error.message || 'Failed to add item', 'error');
    }
}

async function editPackingItem(itemId) {
    try {
        // Get current item data
        const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
        const itemName = itemElement.querySelector('.item-name').textContent;
        
        const modalHTML = `
            <div class="modal active" id="edit-packing-item-modal">
                <div class="modal-content" style="max-width: 500px;">
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                    <div class="edit-packing-item-form">
                        <h2>Edit Packing Item</h2>
                        
                        <form id="edit-packing-item-form" onsubmit="updatePackingItem(event, ${itemId})">
                            <div class="form-group">
                                <label for="edit-item-name">Item Name</label>
                                <input type="text" id="edit-item-name" value="${itemName}" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="edit-item-notes">Notes (Optional)</label>
                                <textarea id="edit-item-notes" rows="3" placeholder="Any additional notes"></textarea>
                            </div>
                            
                            <div class="form-group checkbox-group">
                                <label>
                                    <input type="checkbox" id="edit-item-essential">
                                    <span>Mark as essential item</span>
                                </label>
                            </div>
                            
                            <div class="form-actions">
                                <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                                <button type="submit" class="btn-primary">
                                    <i class="fas fa-save"></i> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('modal-container').innerHTML = modalHTML;
    } catch (error) {
        console.error('Error editing item:', error);
        showToast('Error editing item', 'error');
    }
}

async function updatePackingItem(event, itemId) {
    event.preventDefault();
    
    try {
        const name = document.getElementById('edit-item-name').value;
        const notes = document.getElementById('edit-item-notes').value;
        const essential = document.getElementById('edit-item-essential').checked;
        
        const response = await fetch(`/api/packing-items/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
                name,
                notes,
                essential
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Item updated successfully!', 'success');
            closeModal();
            
            // Refresh packing list
            loadPackingList();
        } else {
            throw new Error(data.error || 'Failed to update item');
        }
    } catch (error) {
        console.error('Error updating item:', error);
        showToast(error.message || 'Failed to update item', 'error');
    }
}

async function deletePackingItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/packing-items/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Item deleted successfully!', 'success');
            
            // Refresh packing list
            loadPackingList();
        } else {
            throw new Error(data.error || 'Failed to delete item');
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        showToast(error.message || 'Failed to delete item', 'error');
    }
}

async function resetPackingList() {
    if (!confirm('Are you sure you want to reset all items to unpacked? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/trips/${currentTripIdForPacking}/packing-list/reset`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Packing list reset successfully!', 'success');
            
            // Refresh packing list
            loadPackingList();
        } else {
            throw new Error(data.error || 'Failed to reset packing list');
        }
    } catch (error) {
        console.error('Error resetting packing list:', error);
        showToast(error.message || 'Failed to reset packing list', 'error');
    }
}

async function showPackingTemplates() {
    try {
        const response = await fetch(`/api/trips/${currentTripIdForPacking}/packing-list/templates`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            const modalHTML = `
                <div class="modal active" id="packing-templates-modal">
                    <div class="modal-content" style="max-width: 600px;">
                        <button class="modal-close" onclick="closeModal()">&times;</button>
                        <div class="packing-templates">
                            <h2>Packing Templates</h2>
                            <p>Choose a template to quickly populate your packing list:</p>
                            
                            <div class="template-options">
                                <div class="template-option ${data.recommended_template === 'beach' ? 'recommended' : ''}">
                                    <h3>
                                        <i class="fas fa-umbrella-beach"></i>
                                        Beach Vacation
                                        ${data.recommended_template === 'beach' ? '<span class="recommended-badge">Recommended</span>' : ''}
                                    </h3>
                                    <p>Perfect for tropical destinations and beach resorts</p>
                                    <button class="btn-primary" onclick="applyPackingTemplate('beach')">
                                        Apply Template
                                    </button>
                                </div>
                                
                                <div class="template-option ${data.recommended_template === 'business' ? 'recommended' : ''}">
                                    <h3>
                                        <i class="fas fa-briefcase"></i>
                                        Business Trip
                                        ${data.recommended_template === 'business' ? '<span class="recommended-badge">Recommended</span>' : ''}
                                    </h3>
                                    <p>Essential items for professional travel</p>
                                    <button class="btn-primary" onclick="applyPackingTemplate('business')">
                                        Apply Template
                                    </button>
                                </div>
                                
                                <div class="template-option ${data.recommended_template === 'adventure' ? 'recommended' : ''}">
                                    <h3>
                                        <i class="fas fa-hiking"></i>
                                        Adventure Travel
                                        ${data.recommended_template === 'adventure' ? '<span class="recommended-badge">Recommended</span>' : ''}
                                    </h3>
                                    <p>For hiking, camping, and outdoor activities</p>
                                    <button class="btn-primary" onclick="applyPackingTemplate('adventure')">
                                        Apply Template
                                    </button>
                                </div>
                                
                                <div class="template-option ${data.recommended_template === 'city' ? 'recommended' : ''}">
                                    <h3>
                                        <i class="fas fa-city"></i>
                                        City Exploration
                                        ${data.recommended_template === 'city' ? '<span class="recommended-badge">Recommended</span>' : ''}
                                    </h3>
                                    <p>Perfect for urban sightseeing and city breaks</p>
                                    <button class="btn-primary" onclick="applyPackingTemplate('city')">
                                        Apply Template
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.getElementById('modal-container').innerHTML = modalHTML;
        } else {
            throw new Error(data.error || 'Failed to load templates');
        }
    } catch (error) {
        console.error('Error loading templates:', error);
        showToast('Error loading templates', 'error');
    }
}

async function applyPackingTemplate(templateType) {
    if (!confirm('This will add template items to your packing list. Continue?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/trips/${currentTripIdForPacking}/packing-list/apply-template`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
                template_type: templateType,
                clear_existing: false
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Template applied successfully!', 'success');
            closeModal();
            
            // Refresh packing list
            loadPackingList();
        } else {
            throw new Error(data.error || 'Failed to apply template');
        }
    } catch (error) {
        console.error('Error applying template:', error);
        showToast(error.message || 'Failed to apply template', 'error');
    }
}

// Public Itinerary Sharing Functions
let currentTripIdForSharing = null;

function showShareItinerary(tripId) {
    currentTripIdForSharing = tripId;
    
    const modalHTML = `
        <div class="modal active" id="share-modal">
            <div class="modal-content" style="max-width: 600px;">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="share-itinerary">
                    <h2>Share Itinerary</h2>
                    
                    <div class="share-settings">
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="make-public" onchange="togglePublicShare()">
                                <span>Make itinerary public</span>
                            </label>
                            <p class="help-text">Anyone with the link can view your itinerary</p>
                        </div>
                        
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="allow-copy" checked>
                                <span>Allow others to copy this itinerary</span>
                            </label>
                            <p class="help-text">Others can create their own copy of your trip</p>
                        </div>
                        
                        <div class="form-group">
                            <label for="expiry-date">Link expires (optional)</label>
                            <input type="date" id="expiry-date">
                            <p class="help-text">Leave blank for no expiration</p>
                        </div>
                    </div>
                    
                    <div class="share-actions">
                        <button class="btn-primary" onclick="createPublicShare()">
                            <i class="fas fa-share"></i> Create Share Link
                        </button>
                    </div>
                    
                    <div id="share-result" class="share-result">
                        <!-- Share result will be displayed here -->
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalHTML;
    
    // Load existing share settings
    loadShareSettings();
}

async function loadShareSettings() {
    try {
        const response = await fetch(`/api/trips/${currentTripIdForSharing}/share`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const share = data.share;
            
            // Update form with existing settings
            document.getElementById('make-public').checked = share.is_public;
            document.getElementById('allow-copy').checked = share.allow_copy;
            
            if (share.expires_at) {
                const expiryDate = new Date(share.expires_at).toISOString().split('T')[0];
                document.getElementById('expiry-date').value = expiryDate;
            }
            
            // Show share result if already public
            if (share.is_public) {
                displayShareResult(data);
            }
        }
    } catch (error) {
        console.error('Error loading share settings:', error);
    }
}

async function createPublicShare() {
    try {
        const isPublic = document.getElementById('make-public').checked;
        const allowCopy = document.getElementById('allow-copy').checked;
        const expiryDate = document.getElementById('expiry-date').value;
        
        const response = await fetch(`/api/trips/${currentTripIdForSharing}/share`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
                is_public: isPublic,
                allow_copy: allowCopy,
                expires_at: expiryDate || null
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Share link created successfully!', 'success');
            displayShareResult(data);
        } else {
            throw new Error(data.error || 'Failed to create share link');
        }
    } catch (error) {
        console.error('Error creating share link:', error);
        showToast(error.message || 'Failed to create share link', 'error');
    }
}

function displayShareResult(data) {
    const shareResultHTML = `
        <div class="share-result-content">
            <h3>Your itinerary is now public!</h3>
            
            <div class="share-url">
                <label>Public URL:</label>
                <div class="url-input-group">
                    <input type="text" id="public-url" value="${data.public_url}" readonly>
                    <button class="btn-secondary" onclick="copyShareUrl()">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
            </div>
            
            <div class="share-analytics">
                <div class="analytics-item">
                    <i class="fas fa-eye"></i>
                    <span>${data.share.view_count} views</span>
                </div>
                <div class="analytics-item">
                    <i class="fas fa-copy"></i>
                    <span>${data.share.copy_count} copies</span>
                </div>
            </div>
            
            <div class="social-sharing">
                <h4>Share on social media:</h4>
                <div class="social-buttons">
                    <button class="social-btn facebook" onclick="shareOnFacebook('${data.public_url}')">
                        <i class="fab fa-facebook-f"></i> Facebook
                    </button>
                    <button class="social-btn twitter" onclick="shareOnTwitter('${data.public_url}')">
                        <i class="fab fa-twitter"></i> Twitter
                    </button>
                    <button class="social-btn linkedin" onclick="shareOnLinkedIn('${data.public_url}')">
                        <i class="fab fa-linkedin-in"></i> LinkedIn
                    </button>
                    <button class="social-btn whatsapp" onclick="shareOnWhatsApp('${data.public_url}')">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('share-result').innerHTML = shareResultHTML;
}

function copyShareUrl() {
    const urlInput = document.getElementById('public-url');
    urlInput.select();
    urlInput.setSelectionRange(0, 99999); // For mobile devices
    
    navigator.clipboard.writeText(urlInput.value).then(() => {
        showToast('URL copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        document.execCommand('copy');
        showToast('URL copied to clipboard!', 'success');
    });
}

function shareOnFacebook(url) {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

function shareOnTwitter(url) {
    const text = 'Check out this amazing travel itinerary I created!';
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

function shareOnLinkedIn(url) {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

function shareOnWhatsApp(url) {
    const text = `Check out this travel itinerary: ${url}`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
}

// Public Itinerary View Functions
function showPublicItinerary(shareToken) {
    // This would typically be called when someone visits a public URL
    // For demo purposes, we'll create a modal view
    loadPublicItinerary(shareToken);
}

async function loadPublicItinerary(shareToken) {
    try {
        const response = await fetch(`/api/public/itinerary/${shareToken}`);
        
        const data = await response.json();
        
        if (response.ok) {
            displayPublicItinerary(data);
        } else {
            if (response.status === 404) {
                showPublicError('Itinerary not found');
            } else if (response.status === 410) {
                showPublicError('This itinerary link has expired');
            } else if (response.status === 403) {
                showPublicError('This itinerary is not publicly available');
            } else {
                showPublicError(data.error || 'Failed to load itinerary');
            }
        }
    } catch (error) {
        console.error('Error loading public itinerary:', error);
        showPublicError('Error loading itinerary');
    }
}

function displayPublicItinerary(data) {
    const trip = data.trip;
    const itinerary = data.itinerary;
    const shareInfo = data.share_info;
    
    const publicViewHTML = `
        <div class="public-itinerary-view">
            <div class="public-header">
                <div class="trip-cover">
                    ${trip.cover_photo_url ? 
                        `<img src="${trip.cover_photo_url}" alt="${trip.name}">` : 
                        `<div class="cover-placeholder">
                            <i class="fas fa-map-marked-alt"></i>
                        </div>`
                    }
                </div>
                
                <div class="trip-info">
                    <h1>${trip.name}</h1>
                    <p class="trip-destination">${trip.destination}</p>
                    <p class="trip-dates">
                        <i class="fas fa-calendar"></i>
                        ${formatDate(trip.start_date)} - ${formatDate(trip.end_date)}
                    </p>
                    <p class="trip-budget">
                        <i class="fas fa-dollar-sign"></i>
                        Budget: $${trip.budget.toFixed(2)}
                    </p>
                    ${trip.description ? `<p class="trip-description">${trip.description}</p>` : ''}
                </div>
                
                <div class="view-stats">
                    <div class="stat-item">
                        <i class="fas fa-eye"></i>
                        <span>${shareInfo.view_count} views</span>
                    </div>
                </div>
            </div>
            
            <div class="public-content">
                <div class="itinerary-section">
                    <h2>
                        <i class="fas fa-route"></i>
                        Itinerary
                    </h2>
                    <div class="public-itinerary">
                        ${itinerary.map((stop, index) => `
                            <div class="public-stop">
                                <div class="stop-header">
                                    <h3>
                                        <span class="stop-number">${index + 1}</span>
                                        ${stop.destination}
                                    </h3>
                                    <p class="stop-dates">
                                        ${formatDate(stop.start_date)} - ${formatDate(stop.end_date)}
                                    </p>
                                </div>
                                
                                ${stop.notes ? `<p class="stop-notes">${stop.notes}</p>` : ''}
                                
                                ${stop.activities && stop.activities.length > 0 ? `
                                    <div class="stop-activities">
                                        <h4>Activities</h4>
                                        <div class="activities-list">
                                            ${stop.activities.map(activity => `
                                                <div class="public-activity">
                                                    <div class="activity-time">
                                                        <i class="fas fa-clock"></i>
                                                        ${activity.time || 'All day'}
                                                    </div>
                                                    <div class="activity-details">
                                                        <h5>${activity.name}</h5>
                                                        ${activity.location ? `<p class="activity-location">${activity.location}</p>` : ''}
                                                        ${activity.cost ? `<p class="activity-cost">$${activity.cost.toFixed(2)}</p>` : ''}
                                                        ${activity.notes ? `<p class="activity-notes">${activity.notes}</p>` : ''}
                                                    </div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                ${data.packing_items && data.packing_items.length > 0 ? `
                    <div class="packing-section">
                        <h2>
                            <i class="fas fa-suitcase"></i>
                            Packing List
                        </h2>
                        <div class="public-packing">
                            ${Object.entries(groupPackingItems(data.packing_items)).map(([category, items]) => `
                                <div class="packing-category">
                                    <h3>${getCategoryName(category)}</h3>
                                    <ul>
                                        ${items.map(item => `
                                            <li>
                                                ${item.essential ? '<i class="fas fa-star essential"></i>' : ''}
                                                ${item.name}
                                                ${item.quantity > 1 ? `<span class="quantity">x${item.quantity}</span>` : ''}
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
            
            ${shareInfo.allow_copy ? `
                <div class="public-footer">
                    <button class="btn-primary" onclick="copyPublicItinerary('${shareToken}')">
                        <i class="fas fa-copy"></i> Copy This Trip
                    </button>
                    <p class="copy-note">Create your own version of this trip</p>
                </div>
            ` : ''}
        </div>
    `;
    
    // Replace entire page content for public view
    document.body.innerHTML = publicViewHTML;
    document.body.className = 'public-view';
}

function groupPackingItems(items) {
    const grouped = {};
    items.forEach(item => {
        if (!grouped[item.category]) {
            grouped[item.category] = [];
        }
        grouped[item.category].push(item);
    });
    return grouped;
}

function copyPublicItinerary(shareToken) {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    
    if (!token) {
        showToast('Please log in to copy this itinerary', 'warning');
        // Redirect to login or show login modal
        return;
    }
    
    const tripName = prompt('Enter a name for your copied trip:');
    
    if (!tripName) {
        return;
    }
    
    copyItineraryFromPublic(shareToken, tripName);
}

async function copyItineraryFromPublic(shareToken, tripName) {
    try {
        const response = await fetch(`/api/public/itinerary/${shareToken}/copy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
                name: tripName,
                copy_packing: true
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Trip copied successfully!', 'success');
            // Redirect to user's trips or refresh page
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } else {
            throw new Error(data.error || 'Failed to copy trip');
        }
    } catch (error) {
        console.error('Error copying trip:', error);
        showToast(error.message || 'Failed to copy trip', 'error');
    }
}

function showPublicError(message) {
    const errorHTML = `
        <div class="public-error">
            <div class="error-container">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>Itinerary Unavailable</h2>
                <p>${message}</p>
                <button class="btn-primary" onclick="window.location.href='/'">
                    <i class="fas fa-home"></i> Go to Homepage
                </button>
            </div>
        </div>
    `;
    
    document.body.innerHTML = errorHTML;
    document.body.className = 'public-view error';
}

// Check if we're on a public itinerary page
function checkPublicItineraryPage() {
    const path = window.location.pathname;
    if (path.includes('/public/itinerary/')) {
        const shareToken = path.split('/').pop();
        showPublicItinerary(shareToken);
    }
}

// User Profile and Settings Functions
let currentUserId = null;

function showUserProfile() {
    const modalHTML = `
        <div class="modal active" id="profile-modal">
            <div class="modal-content" style="max-width: 900px; max-height: 95vh;">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="profile-screen">
                    <div class="profile-header">
                        <h2>Profile & Settings</h2>
                    </div>
                    
                    <div class="profile-content">
                        <div class="profile-sidebar">
                            <div class="profile-nav">
                                <button class="nav-btn active" onclick="showProfileSection('profile')">
                                    <i class="fas fa-user"></i> Profile
                                </button>
                                <button class="nav-btn" onclick="showProfileSection('preferences')">
                                    <i class="fas fa-cog"></i> Preferences
                                </button>
                                <button class="nav-btn" onclick="showProfileSection('saved-destinations')">
                                    <i class="fas fa-bookmark"></i> Saved Destinations
                                </button>
                                <button class="nav-btn" onclick="showProfileSection('security')">
                                    <i class="fas fa-shield-alt"></i> Security
                                </button>
                                <button class="nav-btn" onclick="showProfileSection('privacy')">
                                    <i class="fas fa-lock"></i> Privacy
                                </button>
                            </div>
                        </div>
                        
                        <div class="profile-main">
                            <div id="profile-sections">
                                <!-- Profile sections will be loaded here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalHTML;
    
    // Load user data and show profile section
    loadUserProfile();
    showProfileSection('profile');
}

async function loadUserProfile() {
    try {
        const response = await fetch('/api/user/profile', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        
        if (response.ok) {
            const userData = await response.json();
            currentUserId = userData.id;
            // Store user data for use in profile sections
            window.currentUser = userData;
        } else {
            throw new Error('Failed to load user profile');
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
        showToast('Error loading profile', 'error');
    }
}

function showProfileSection(section) {
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Load appropriate section
    switch(section) {
        case 'profile':
            showProfileInfo();
            break;
        case 'preferences':
            showPreferences();
            break;
        case 'saved-destinations':
            showSavedDestinations();
            break;
        case 'security':
            showSecurity();
            break;
        case 'privacy':
            showPrivacy();
            break;
    }
}

function showProfileInfo() {
    const user = window.currentUser || {};
    
    const profileHTML = `
        <div class="profile-section">
            <h3>Profile Information</h3>
            
            <div class="profile-photo-section">
                <div class="photo-upload">
                    <div class="current-photo">
                        ${user.profile_photo_url ? 
                            `<img src="${user.profile_photo_url}" alt="Profile Photo">` : 
                            `<div class="photo-placeholder">
                                <i class="fas fa-user"></i>
                            </div>`
                        }
                    </div>
                    <div class="photo-controls">
                        <input type="file" id="profile-photo-input" accept="image/*" style="display: none;" onchange="uploadProfilePhoto(event)">
                        <button class="btn-secondary" onclick="document.getElementById('profile-photo-input').click()">
                            <i class="fas fa-camera"></i> Change Photo
                        </button>
                    </div>
                </div>
            </div>
            
            <form id="profile-form" onsubmit="updateProfile(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label for="first-name">First Name</label>
                        <input type="text" id="first-name" value="${user.first_name || ''}" placeholder="Enter first name">
                    </div>
                    <div class="form-group">
                        <label for="last-name">Last Name</label>
                        <input type="text" id="last-name" value="${user.last_name || ''}" placeholder="Enter last name">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" value="${user.username || ''}" readonly>
                    <small class="help-text">Username cannot be changed</small>
                </div>
                
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" value="${user.email || ''}" readonly>
                    <button type="button" class="btn-link" onclick="showEmailChange()">Change Email</button>
                </div>
                
                <div class="form-group">
                    <label for="bio">Bio</label>
                    <textarea id="bio" rows="4" placeholder="Tell us about yourself...">${user.bio || ''}</textarea>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-save"></i> Save Changes
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.getElementById('profile-sections').innerHTML = profileHTML;
}

function showPreferences() {
    const user = window.currentUser || {};
    
    const preferencesHTML = `
        <div class="profile-section">
            <h3>Preferences</h3>
            
            <form id="preferences-form" onsubmit="updatePreferences(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label for="language">Language</label>
                        <select id="language">
                            <option value="en" ${user.language_preference === 'en' ? 'selected' : ''}>English</option>
                            <option value="es" ${user.language_preference === 'es' ? 'selected' : ''}>Spanish</option>
                            <option value="fr" ${user.language_preference === 'fr' ? 'selected' : ''}>French</option>
                            <option value="de" ${user.language_preference === 'de' ? 'selected' : ''}>German</option>
                            <option value="it" ${user.language_preference === 'it' ? 'selected' : ''}>Italian</option>
                            <option value="zh" ${user.language_preference === 'zh' ? 'selected' : ''}>Chinese</option>
                            <option value="ja" ${user.language_preference === 'ja' ? 'selected' : ''}>Japanese</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="timezone">Timezone</label>
                        <select id="timezone">
                            <option value="UTC" ${user.timezone === 'UTC' ? 'selected' : ''}>UTC</option>
                            <option value="America/New_York" ${user.timezone === 'America/New_York' ? 'selected' : ''}>Eastern Time</option>
                            <option value="America/Chicago" ${user.timezone === 'America/Chicago' ? 'selected' : ''}>Central Time</option>
                            <option value="America/Denver" ${user.timezone === 'America/Denver' ? 'selected' : ''}>Mountain Time</option>
                            <option value="America/Los_Angeles" ${user.timezone === 'America/Los_Angeles' ? 'selected' : ''}>Pacific Time</option>
                            <option value="Europe/London" ${user.timezone === 'Europe/London' ? 'selected' : ''}>London</option>
                            <option value="Europe/Paris" ${user.timezone === 'Europe/Paris' ? 'selected' : ''}>Paris</option>
                            <option value="Asia/Tokyo" ${user.timezone === 'Asia/Tokyo' ? 'selected' : ''}>Tokyo</option>
                            <option value="Australia/Sydney" ${user.timezone === 'Australia/Sydney' ? 'selected' : ''}>Sydney</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="date-format">Date Format</label>
                        <select id="date-format">
                            <option value="MM/DD/YYYY" ${user.date_format === 'MM/DD/YYYY' ? 'selected' : ''}>MM/DD/YYYY</option>
                            <option value="DD/MM/YYYY" ${user.date_format === 'DD/MM/YYYY' ? 'selected' : ''}>DD/MM/YYYY</option>
                            <option value="YYYY-MM-DD" ${user.date_format === 'YYYY-MM-DD' ? 'selected' : ''}>YYYY-MM-DD</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="currency">Currency Preference</label>
                        <select id="currency">
                            <option value="USD" ${user.currency_preference === 'USD' ? 'selected' : ''}>USD ($)</option>
                            <option value="EUR" ${user.currency_preference === 'EUR' ? 'selected' : ''}>EUR (€)</option>
                            <option value="GBP" ${user.currency_preference === 'GBP' ? 'selected' : ''}>GBP (£)</option>
                            <option value="JPY" ${user.currency_preference === 'JPY' ? 'selected' : ''}>JPY (¥)</option>
                            <option value="AUD" ${user.currency_preference === 'AUD' ? 'selected' : ''}>AUD (A$)</option>
                            <option value="CAD" ${user.currency_preference === 'CAD' ? 'selected' : ''}>CAD (C$)</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-save"></i> Save Preferences
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.getElementById('profile-sections').innerHTML = preferencesHTML;
}

async function showSavedDestinations() {
    try {
        const response = await fetch('/api/user/saved-destinations', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        
        if (response.ok) {
            const savedDestinations = await response.json();
            displaySavedDestinations(savedDestinations);
        } else {
            throw new Error('Failed to load saved destinations');
        }
    } catch (error) {
        console.error('Error loading saved destinations:', error);
        showToast('Error loading saved destinations', 'error');
    }
}

function displaySavedDestinations(destinations) {
    const savedHTML = `
        <div class="profile-section">
            <div class="section-header">
                <h3>Saved Destinations</h3>
                <button class="btn-primary" onclick="showAddSavedDestination()">
                    <i class="fas fa-plus"></i> Add Destination
                </button>
            </div>
            
            <div class="saved-destinations-list">
                ${destinations.length === 0 ? 
                    '<p class="empty-state">No saved destinations yet. Start exploring and save places you want to visit!</p>' :
                    destinations.map(dest => `
                        <div class="saved-destination-card">
                            <div class="destination-info">
                                <h4>${dest.destination.name}</h4>
                                <p class="destination-location">${dest.destination.country}</p>
                                ${dest.notes ? `<p class="destination-notes">${dest.notes}</p>` : ''}
                                ${dest.visit_date ? `<p class="visit-date">Planned visit: ${formatDate(dest.visit_date)}</p>` : ''}
                            </div>
                            <div class="destination-actions">
                                <span class="priority-badge priority-${dest.priority}">${dest.priority}</span>
                                <button class="btn-icon delete" onclick="removeSavedDestination(${dest.id})" title="Remove">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')
                }
            </div>
        </div>
    `;
    
    document.getElementById('profile-sections').innerHTML = savedHTML;
}

function showSecurity() {
    const securityHTML = `
        <div class="profile-section">
            <h3>Security Settings</h3>
            
            <div class="security-sections">
                <div class="security-section">
                    <h4>Change Password</h4>
                    <form id="password-form" onsubmit="updatePassword(event)">
                        <div class="form-group">
                            <label for="current-password">Current Password</label>
                            <input type="password" id="current-password" required>
                        </div>
                        <div class="form-group">
                            <label for="new-password">New Password</label>
                            <input type="password" id="new-password" required minlength="8">
                        </div>
                        <div class="form-group">
                            <label for="confirm-password">Confirm New Password</label>
                            <input type="password" id="confirm-password" required minlength="8">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-key"></i> Update Password
                            </button>
                        </div>
                    </form>
                </div>
                
                <div class="security-section danger-zone">
                    <h4>Delete Account</h4>
                    <p class="warning-text">Once you delete your account, there is no going back. Please be certain.</p>
                    <button class="btn-danger" onclick="showDeleteAccountConfirmation()">
                        <i class="fas fa-trash"></i> Delete Account
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('profile-sections').innerHTML = securityHTML;
}

function showPrivacy() {
    const user = window.currentUser || {};
    
    const privacyHTML = `
        <div class="profile-section">
            <h3>Privacy Settings</h3>
            
            <form id="privacy-form" onsubmit="updatePrivacy(event)">
                <div class="privacy-options">
                    <div class="privacy-option">
                        <label class="toggle-label">
                            <input type="checkbox" id="profile-public" ${user.privacy_profile_public ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                            <span class="toggle-text">Make profile public</span>
                        </label>
                        <p class="option-description">Allow other users to see your profile information</p>
                    </div>
                    
                    <div class="privacy-option">
                        <label class="toggle-label">
                            <input type="checkbox" id="show-trips" ${user.privacy_show_trips ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                            <span class="toggle-text">Show trips in public profile</span>
                        </label>
                        <p class="option-description">Display your trips when others view your public profile</p>
                    </div>
                    
                    <div class="privacy-option">
                        <label class="toggle-label">
                            <input type="checkbox" id="email-notifications" ${user.email_notifications ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                            <span class="toggle-text">Email notifications</span>
                        </label>
                        <p class="option-description">Receive email updates about your trips and account</p>
                    </div>
                    
                    <div class="privacy-option">
                        <label class="toggle-label">
                            <input type="checkbox" id="push-notifications" ${user.push_notifications ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                            <span class="toggle-text">Push notifications</span>
                        </label>
                        <p class="option-description">Receive push notifications in your browser</p>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-save"></i> Save Privacy Settings
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.getElementById('profile-sections').innerHTML = privacyHTML;
}

async function updateProfile(event) {
    event.preventDefault();
    
    try {
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const bio = document.getElementById('bio').value;
        
        const response = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                bio: bio
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Profile updated successfully!', 'success');
            window.currentUser = data.user;
        } else {
            throw new Error(data.error || 'Failed to update profile');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showToast(error.message || 'Failed to update profile', 'error');
    }
}

async function updatePreferences(event) {
    event.preventDefault();
    
    try {
        const language = document.getElementById('language').value;
        const timezone = document.getElementById('timezone').value;
        const dateFormat = document.getElementById('date-format').value;
        const currency = document.getElementById('currency').value;
        
        const response = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
                language_preference: language,
                timezone: timezone,
                date_format: dateFormat,
                currency_preference: currency
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Preferences updated successfully!', 'success');
            window.currentUser = data.user;
        } else {
            throw new Error(data.error || 'Failed to update preferences');
        }
    } catch (error) {
        console.error('Error updating preferences:', error);
        showToast(error.message || 'Failed to update preferences', 'error');
    }
}

async function updatePassword(event) {
    event.preventDefault();
    
    try {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (newPassword !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }
        
        const response = await fetch('/api/user/password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Password updated successfully!', 'success');
            // Clear form
            document.getElementById('password-form').reset();
        } else {
            throw new Error(data.error || 'Failed to update password');
        }
    } catch (error) {
        console.error('Error updating password:', error);
        showToast(error.message || 'Failed to update password', 'error');
    }
}

async function updatePrivacy(event) {
    event.preventDefault();
    
    try {
        const profilePublic = document.getElementById('profile-public').checked;
        const showTrips = document.getElementById('show-trips').checked;
        const emailNotifications = document.getElementById('email-notifications').checked;
        const pushNotifications = document.getElementById('push-notifications').checked;
        
        const response = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
                privacy_profile_public: profilePublic,
                privacy_show_trips: showTrips,
                email_notifications: emailNotifications,
                push_notifications: pushNotifications
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Privacy settings updated successfully!', 'success');
            window.currentUser = data.user;
        } else {
            throw new Error(data.error || 'Failed to update privacy settings');
        }
    } catch (error) {
        console.error('Error updating privacy settings:', error);
        showToast(error.message || 'Failed to update privacy settings', 'error');
    }
}

async function uploadProfilePhoto(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/user/profile-photo', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Profile photo updated successfully!', 'success');
            // Update photo display
            const photoElement = document.querySelector('.current-photo img, .photo-placeholder');
            if (photoElement) {
                photoElement.outerHTML = `<img src="${data.profile_photo_url}" alt="Profile Photo">`;
            }
        } else {
            throw new Error(data.error || 'Failed to upload photo');
        }
    } catch (error) {
        console.error('Error uploading photo:', error);
        showToast(error.message || 'Failed to upload photo', 'error');
    }
}

function showEmailChange() {
    const modalHTML = `
        <div class="modal active" id="email-change-modal">
            <div class="modal-content" style="max-width: 500px;">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="email-change-form">
                    <h3>Change Email Address</h3>
                    
                    <form id="email-change-form" onsubmit="updateEmail(event)">
                        <div class="form-group">
                            <label for="new-email">New Email Address</label>
                            <input type="email" id="new-email" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="email-password">Current Password</label>
                            <input type="password" id="email-password" required>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                            <button type="submit" class="btn-primary">Update Email</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalHTML;
}

async function updateEmail(event) {
    event.preventDefault();
    
    try {
        const newEmail = document.getElementById('new-email').value;
        const password = document.getElementById('email-password').value;
        
        const response = await fetch('/api/user/email', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
                email: newEmail,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Email updated successfully!', 'success');
            closeModal();
            // Update email display
            document.getElementById('email').value = newEmail;
            window.currentUser = data.user;
        } else {
            throw new Error(data.error || 'Failed to update email');
        }
    } catch (error) {
        console.error('Error updating email:', error);
        showToast(error.message || 'Failed to update email', 'error');
    }
}

async function removeSavedDestination(savedId) {
    if (!confirm('Are you sure you want to remove this saved destination?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/user/saved-destinations/${savedId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        
        if (response.ok) {
            showToast('Destination removed successfully!', 'success');
            showSavedDestinations(); // Refresh the list
        } else {
            throw new Error('Failed to remove destination');
        }
    } catch (error) {
        console.error('Error removing destination:', error);
        showToast('Failed to remove destination', 'error');
    }
}

function showDeleteAccountConfirmation() {
    const modalHTML = `
        <div class="modal active" id="delete-account-modal">
            <div class="modal-content" style="max-width: 500px;">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="delete-account-form">
                    <h3>Delete Account</h3>
                    <div class="warning-box">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p><strong>Warning:</strong> This action cannot be undone. All your data will be permanently deleted.</p>
                    </div>
                    
                    <form id="delete-account-form" onsubmit="deleteAccount(event)">
                        <div class="form-group">
                            <label for="delete-password">Password</label>
                            <input type="password" id="delete-password" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="delete-confirmation">Type "DELETE" to confirm</label>
                            <input type="text" id="delete-confirmation" required>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                            <button type="submit" class="btn-danger">Delete Account</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalHTML;
}

async function deleteAccount(event) {
    event.preventDefault();
    
    try {
        const password = document.getElementById('delete-password').value;
        const confirmation = document.getElementById('delete-confirmation').value;
        
        const response = await fetch('/api/user/delete-account', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
                password: password,
                confirmation: confirmation
            })
        });
        
        if (response.ok) {
            showToast('Account deleted successfully', 'success');
            // Clear local storage and redirect
            localStorage.clear();
            window.location.href = '/';
        } else {
            const data = await response.json();
            throw new Error(data.error || 'Failed to delete account');
        }
    } catch (error) {
        console.error('Error deleting account:', error);
        showToast(error.message || 'Failed to delete account', 'error');
    }
}

// Trip Notes and Journal Functions
let currentTripIdForNotes = null;
let currentNotes = [];

function showTripNotes(tripId) {
    currentTripIdForNotes = tripId;
    
    const modalHTML = `
        <div class="modal active" id="notes-modal">
            <div class="modal-content" style="max-width: 900px; max-height: 95vh;">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="notes-screen">
                    <div class="notes-header">
                        <h2>Trip Notes & Journal</h2>
                        <div class="notes-actions">
                            <button class="btn-primary" onclick="showAddNote()">
                                <i class="fas fa-plus"></i> Add Note
                            </button>
                            <button class="btn-secondary" onclick="showNoteSearch()">
                                <i class="fas fa-search"></i> Search
                            </button>
                            <button class="btn-secondary" onclick="exportNotes()">
                                <i class="fas fa-download"></i> Export
                            </button>
                        </div>
                    </div>
                    
                    <div class="notes-content">
                        <div class="notes-sidebar">
                            <div class="note-filters">
                                <h4>Categories</h4>
                                <div id="category-filters">
                                    <!-- Category filters will be loaded here -->
                                </div>
                            </div>
                        </div>
                        
                        <div class="notes-main">
                            <div id="notes-list">
                                <!-- Notes will be displayed here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalHTML;
    
    // Load notes and categories
    loadTripNotes();
    loadNoteCategories();
}

async function loadTripNotes() {
    try {
        const response = await fetch(`/api/trips/${currentTripIdForNotes}/notes`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        
        if (response.ok) {
            const notes = await response.json();
            currentNotes = notes;
            displayNotes(notes);
        } else {
            throw new Error('Failed to load notes');
        }
    } catch (error) {
        console.error('Error loading notes:', error);
        showToast('Error loading notes', 'error');
    }
}

async function loadNoteCategories() {
    try {
        const response = await fetch(`/api/trips/${currentTripIdForNotes}/notes/categories`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        
        if (response.ok) {
            const categories = await response.json();
            displayCategoryFilters(categories);
        } else {
            throw new Error('Failed to load categories');
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

function displayNotes(notes) {
    const notesList = document.getElementById('notes-list');
    
    if (notes.length === 0) {
        notesList.innerHTML = `
            <div class="empty-notes">
                <i class="fas fa-sticky-note"></i>
                <h3>No notes yet</h3>
                <p>Start adding notes to keep track of important information during your trip.</p>
                <button class="btn-primary" onclick="showAddNote()">
                    <i class="fas fa-plus"></i> Add Your First Note
                </button>
            </div>
        `;
        return;
    }
    
    const notesHTML = notes.map(note => `
        <div class="note-card ${note.is_pinned ? 'pinned' : ''}" data-note-id="${note.id}">
            <div class="note-header">
                <div class="note-title-section">
                    <h3>${note.title}</h3>
                    ${note.is_pinned ? '<i class="fas fa-thumbtack pin-icon"></i>' : ''}
                </div>
                <div class="note-meta">
                    <span class="note-category category-${note.category}">${getCategoryDisplayName(note.category)}</span>
                    <span class="note-date">${formatDate(note.note_date || note.created_at)}</span>
                </div>
            </div>
            
            <div class="note-content">
                <p>${note.content}</p>
            </div>
            
            ${note.tags && note.tags.length > 0 ? `
                <div class="note-tags">
                    ${note.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
            
            <div class="note-actions">
                <button class="btn-icon edit" onclick="editNote(${note.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon delete" onclick="deleteNote(${note.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="btn-icon pin" onclick="togglePinNote(${note.id})" title="${note.is_pinned ? 'Unpin' : 'Pin'}">
                    <i class="fas fa-thumbtack"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    notesList.innerHTML = notesHTML;
}

function displayCategoryFilters(categories) {
    const categoryFilters = document.getElementById('category-filters');
    
    const allCategories = ['general', 'hotel', 'transport', 'contacts', 'reminders', 'food', 'activities', 'documents'];
    const availableCategories = allCategories.filter(cat => categories.includes(cat) || cat === 'general');
    
    const filtersHTML = `
        <button class="category-filter active" data-category="all" onclick="filterByCategory('all')">
            All Notes
        </button>
        ${availableCategories.map(category => `
            <button class="category-filter" data-category="${category}" onclick="filterByCategory('${category}')">
                <i class="fas ${getCategoryIcon(category)}"></i>
                ${getCategoryDisplayName(category)}
            </button>
        `).join('')}
    `;
    
    categoryFilters.innerHTML = filtersHTML;
}

function getCategoryDisplayName(category) {
    const categoryNames = {
        'general': 'General',
        'hotel': 'Hotel',
        'transport': 'Transport',
        'contacts': 'Contacts',
        'reminders': 'Reminders',
        'food': 'Food',
        'activities': 'Activities',
        'documents': 'Documents'
    };
    return categoryNames[category] || category;
}

function getCategoryIcon(category) {
    const categoryIcons = {
        'general': 'fa-sticky-note',
        'hotel': 'fa-bed',
        'transport': 'fa-plane',
        'contacts': 'fa-phone',
        'reminders': 'fa-bell',
        'food': 'fa-utensils',
        'activities': 'fa-hiking',
        'documents': 'fa-passport'
    };
    return categoryIcons[category] || 'fa-sticky-note';
}

function showAddNote() {
    const modalHTML = `
        <div class="modal active" id="add-note-modal">
            <div class="modal-content" style="max-width: 600px;">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="note-form">
                    <h3>Add New Note</h3>
                    
                    <form id="add-note-form" onsubmit="addNote(event)">
                        <div class="form-group">
                            <label for="note-title">Title</label>
                            <input type="text" id="note-title" required placeholder="Enter note title">
                        </div>
                        
                        <div class="form-group">
                            <label for="note-category">Category</label>
                            <select id="note-category">
                                <option value="general">General</option>
                                <option value="hotel">Hotel</option>
                                <option value="transport">Transport</option>
                                <option value="contacts">Contacts</option>
                                <option value="reminders">Reminders</option>
                                <option value="food">Food</option>
                                <option value="activities">Activities</option>
                                <option value="documents">Documents</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="note-date">Note Date (optional)</label>
                            <input type="date" id="note-date">
                        </div>
                        
                        <div class="form-group">
                            <label for="note-tags">Tags (comma separated)</label>
                            <input type="text" id="note-tags" placeholder="e.g., important, urgent, confirm">
                        </div>
                        
                        <div class="form-group">
                            <label for="note-content">Content</label>
                            <textarea id="note-content" rows="6" required placeholder="Write your note here..."></textarea>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-save"></i> Save Note
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalHTML;
}

async function addNote(event) {
    event.preventDefault();
    
    try {
        const title = document.getElementById('note-title').value;
        const category = document.getElementById('note-category').value;
        const noteDate = document.getElementById('note-date').value;
        const tagsInput = document.getElementById('note-tags').value;
        const content = document.getElementById('note-content').value;
        
        // Parse tags
        const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
        
        const response = await fetch(`/api/trips/${currentTripIdForNotes}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
                title: title,
                content: content,
                category: category,
                note_date: noteDate || null,
                tags: tags
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Note added successfully!', 'success');
            closeModal();
            loadTripNotes(); // Refresh notes list
        } else {
            throw new Error(data.error || 'Failed to add note');
        }
    } catch (error) {
        console.error('Error adding note:', error);
        showToast(error.message || 'Failed to add note', 'error');
    }
}

function editNote(noteId) {
    const note = currentNotes.find(n => n.id === noteId);
    if (!note) return;
    
    const modalHTML = `
        <div class="modal active" id="edit-note-modal">
            <div class="modal-content" style="max-width: 600px;">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="note-form">
                    <h3>Edit Note</h3>
                    
                    <form id="edit-note-form" onsubmit="updateNote(event, ${noteId})">
                        <div class="form-group">
                            <label for="edit-note-title">Title</label>
                            <input type="text" id="edit-note-title" value="${note.title}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="edit-note-category">Category</label>
                            <select id="edit-note-category">
                                <option value="general" ${note.category === 'general' ? 'selected' : ''}>General</option>
                                <option value="hotel" ${note.category === 'hotel' ? 'selected' : ''}>Hotel</option>
                                <option value="transport" ${note.category === 'transport' ? 'selected' : ''}>Transport</option>
                                <option value="contacts" ${note.category === 'contacts' ? 'selected' : ''}>Contacts</option>
                                <option value="reminders" ${note.category === 'reminders' ? 'selected' : ''}>Reminders</option>
                                <option value="food" ${note.category === 'food' ? 'selected' : ''}>Food</option>
                                <option value="activities" ${note.category === 'activities' ? 'selected' : ''}>Activities</option>
                                <option value="documents" ${note.category === 'documents' ? 'selected' : ''}>Documents</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="edit-note-date">Note Date (optional)</label>
                            <input type="date" id="edit-note-date" value="${note.note_date || ''}">
                        </div>
                        
                        <div class="form-group">
                            <label for="edit-note-tags">Tags (comma separated)</label>
                            <input type="text" id="edit-note-tags" value="${note.tags ? note.tags.join(', ') : ''}">
                        </div>
                        
                        <div class="form-group">
                            <label for="edit-note-content">Content</label>
                            <textarea id="edit-note-content" rows="6" required>${note.content}</textarea>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-save"></i> Update Note
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalHTML;
}

async function updateNote(event, noteId) {
    event.preventDefault();
    
    try {
        const title = document.getElementById('edit-note-title').value;
        const category = document.getElementById('edit-note-category').value;
        const noteDate = document.getElementById('edit-note-date').value;
        const tagsInput = document.getElementById('edit-note-tags').value;
        const content = document.getElementById('edit-note-content').value;
        
        // Parse tags
        const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
        
        const response = await fetch(`/api/notes/${noteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
                title: title,
                content: content,
                category: category,
                note_date: noteDate || null,
                tags: tags
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Note updated successfully!', 'success');
            closeModal();
            loadTripNotes(); // Refresh notes list
        } else {
            throw new Error(data.error || 'Failed to update note');
        }
    } catch (error) {
        console.error('Error updating note:', error);
        showToast(error.message || 'Failed to update note', 'error');
    }
}

async function deleteNote(noteId) {
    if (!confirm('Are you sure you want to delete this note?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/notes/${noteId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        
        if (response.ok) {
            showToast('Note deleted successfully!', 'success');
            loadTripNotes(); // Refresh notes list
        } else {
            throw new Error('Failed to delete note');
        }
    } catch (error) {
        console.error('Error deleting note:', error);
        showToast('Failed to delete note', 'error');
    }
}

async function togglePinNote(noteId) {
    try {
        const note = currentNotes.find(n => n.id === noteId);
        const newPinStatus = !note.is_pinned;
        
        const response = await fetch(`/api/notes/${noteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
                is_pinned: newPinStatus
            })
        });
        
        if (response.ok) {
            showToast(newPinStatus ? 'Note pinned!' : 'Note unpinned!', 'success');
            loadTripNotes(); // Refresh notes list
        } else {
            throw new Error('Failed to toggle pin');
        }
    } catch (error) {
        console.error('Error toggling pin:', error);
        showToast('Failed to toggle pin', 'error');
    }
}

function showNoteSearch() {
    const modalHTML = `
        <div class="modal active" id="search-notes-modal">
            <div class="modal-content" style="max-width: 500px;">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="search-form">
                    <h3>Search Notes</h3>
                    
                    <form id="search-notes-form" onsubmit="searchNotes(event)">
                        <div class="form-group">
                            <label for="search-query">Search</label>
                            <input type="text" id="search-query" placeholder="Search in titles and content...">
                        </div>
                        
                        <div class="form-group">
                            <label for="search-category">Category</label>
                            <select id="search-category">
                                <option value="">All Categories</option>
                                <option value="general">General</option>
                                <option value="hotel">Hotel</option>
                                <option value="transport">Transport</option>
                                <option value="contacts">Contacts</option>
                                <option value="reminders">Reminders</option>
                                <option value="food">Food</option>
                                <option value="activities">Activities</option>
                                <option value="documents">Documents</option>
                            </select>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-search"></i> Search
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalHTML;
}

async function searchNotes(event) {
    event.preventDefault();
    
    try {
        const query = document.getElementById('search-query').value;
        const category = document.getElementById('search-category').value;
        
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (category) params.append('category', category);
        
        const response = await fetch(`/api/trips/${currentTripIdForNotes}/notes/search?${params}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        
        if (response.ok) {
            const notes = await response.json();
            currentNotes = notes;
            displayNotes(notes);
            closeModal();
            showToast(`Found ${notes.length} note(s)`, 'success');
        } else {
            throw new Error('Failed to search notes');
        }
    } catch (error) {
        console.error('Error searching notes:', error);
        showToast('Failed to search notes', 'error');
    }
}

async function filterByCategory(category) {
    try {
        // Update active filter button
        document.querySelectorAll('.category-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        if (category === 'all') {
            // Load all notes
            loadTripNotes();
        } else {
            // Filter by category
            const response = await fetch(`/api/trips/${currentTripIdForNotes}/notes/search?category=${category}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            
            if (response.ok) {
                const notes = await response.json();
                currentNotes = notes;
                displayNotes(notes);
            } else {
                throw new Error('Failed to filter notes');
            }
        }
    } catch (error) {
        console.error('Error filtering notes:', error);
        showToast('Failed to filter notes', 'error');
    }
}

async function exportNotes() {
    try {
        const response = await fetch(`/api/trips/${currentTripIdForNotes}/notes/export`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        
        if (response.ok) {
            const exportData = await response.json();
            
            // Create downloadable JSON file
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `${exportData.trip_name}_notes_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            showToast('Notes exported successfully!', 'success');
        } else {
            throw new Error('Failed to export notes');
        }
    } catch (error) {
        console.error('Error exporting notes:', error);
        showToast('Failed to export notes', 'error');
    }
}

// Admin Analytics Dashboard Functions
let currentAdminData = {};

function showAdminDashboard() {
    const modalHTML = `
        <div class="modal active" id="admin-modal">
            <div class="modal-content" style="max-width: 95vw; max-height: 95vh;">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="admin-dashboard">
                    <div class="admin-header">
                        <h2>Admin Analytics Dashboard</h2>
                        <div class="admin-actions">
                            <button class="btn-secondary" onclick="exportAdminData('all')">
                                <i class="fas fa-download"></i> Export All Data
                            </button>
                        </div>
                    </div>
                    
                    <div class="admin-content">
                        <div class="admin-sidebar">
                            <div class="admin-nav">
                                <button class="nav-btn active" onclick="showAdminSection('overview')">
                                    <i class="fas fa-chart-line"></i> Overview
                                </button>
                                <button class="nav-btn" onclick="showAdminSection('users')">
                                    <i class="fas fa-users"></i> Users
                                </button>
                                <button class="nav-btn" onclick="showAdminSection('trips')">
                                    <i class="fas fa-plane"></i> Trips
                                </button>
                                <button class="nav-btn" onclick="showAdminSection('activities')">
                                    <i class="fas fa-hiking"></i> Activities
                                </button>
                                <button class="nav-btn" onclick="showAdminSection('engagement')">
                                    <i class="fas fa-chart-bar"></i> Engagement
                                </button>
                            </div>
                        </div>
                        
                        <div class="admin-main">
                            <div id="admin-sections">
                                <!-- Admin sections will be loaded here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalHTML;
    
    // Load admin data and show overview
    loadAdminDashboard();
    showAdminSection('overview');
}

async function loadAdminDashboard() {
    try {
        const response = await fetch('/api/admin/dashboard', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            currentAdminData = data;
        } else if (response.status === 403) {
            showToast('Admin access required', 'error');
            closeModal();
        } else {
            throw new Error('Failed to load admin dashboard');
        }
    } catch (error) {
        console.error('Error loading admin dashboard:', error);
        showToast('Error loading admin dashboard', 'error');
        closeModal();
    }
}

function showAdminSection(section) {
    // Update navigation
    document.querySelectorAll('.admin-nav .nav-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Load appropriate section
    switch(section) {
        case 'overview':
            showAdminOverview();
            break;
        case 'users':
            showAdminUsers();
            break;
        case 'trips':
            showAdminTrips();
            break;
        case 'activities':
            showAdminActivities();
            break;
        case 'engagement':
            showAdminEngagement();
            break;
    }
}

function showAdminOverview() {
    const data = currentAdminData;
    
    const overviewHTML = `
        <div class="admin-section">
            <h3>Platform Overview</h3>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-content">
                        <h4>${data.overview.total_users}</h4>
                        <p>Total Users</p>
                        <span class="stat-change">+${data.overview.users_today} today</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-plane"></i>
                    </div>
                    <div class="stat-content">
                        <h4>${data.overview.total_trips}</h4>
                        <p>Total Trips</p>
                        <span class="stat-change">+${data.overview.trips_today} today</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-hiking"></i>
                    </div>
                    <div class="stat-content">
                        <h4>${data.overview.total_activities}</h4>
                        <p>Total Activities</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-sticky-note"></i>
                    </div>
                    <div class="stat-content">
                        <h4>${data.overview.total_notes}</h4>
                        <p>Total Notes</p>
                    </div>
                </div>
            </div>
            
            <div class="analytics-row">
                <div class="analytics-card">
                    <h4>User Engagement</h4>
                    <div class="engagement-stats">
                        <div class="engagement-item">
                            <span class="label">Active Users:</span>
                            <span class="value">${data.engagement.active_users}</span>
                        </div>
                        <div class="engagement-item">
                            <span class="label">Users with Trips:</span>
                            <span class="value">${data.engagement.users_with_trips}</span>
                        </div>
                        <div class="engagement-item">
                            <span class="label">Avg Trips per User:</span>
                            <span class="value">${data.engagement.avg_trips_per_user}</span>
                        </div>
                        <div class="engagement-item">
                            <span class="label">Engagement Rate:</span>
                            <span class="value">${data.engagement.user_engagement_rate}%</span>
                        </div>
                    </div>
                </div>
                
                <div class="analytics-card">
                    <h4>Top Destinations</h4>
                    <div class="destination-list">
                        ${data.top_destinations.map(dest => `
                            <div class="destination-item">
                                <span class="destination-name">${dest.destination}</span>
                                <span class="destination-count">${dest.trip_count} trips</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="analytics-row">
                <div class="analytics-card full-width">
                    <h4>Recent Activity</h4>
                    <div class="recent-activity-tabs">
                        <button class="tab-btn active" onclick="showRecentActivity('trips')">Recent Trips</button>
                        <button class="tab-btn" onclick="showRecentActivity('users')">New Users</button>
                    </div>
                    <div id="recent-activity-content">
                        ${renderRecentTrips(data.recent_activity.trips)}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('admin-sections').innerHTML = overviewHTML;
}

function renderRecentTrips(trips) {
    return `
        <div class="recent-list">
            ${trips.map(trip => `
                <div class="recent-item">
                    <div class="item-info">
                        <h5>${trip.name}</h5>
                        <p>${trip.destination} • ${formatDate(trip.start_date)} - ${formatDate(trip.end_date)}</p>
                    </div>
                    <div class="item-meta">
                        <span class="user-info">by ${trip.user.username}</span>
                        <span class="date">${formatDate(trip.created_at)}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderRecentUsers(users) {
    return `
        <div class="recent-list">
            ${users.map(user => `
                <div class="recent-item">
                    <div class="item-info">
                        <h5>${user.first_name || ''} ${user.last_name || ''} (@${user.username})</h5>
                        <p>${user.email}</p>
                    </div>
                    <div class="item-meta">
                        <span class="status-badge ${user.is_active ? 'active' : 'inactive'}">
                            ${user.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span class="date">${formatDate(user.created_at)}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function showRecentActivity(type) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update content
    const contentDiv = document.getElementById('recent-activity-content');
    if (type === 'trips') {
        contentDiv.innerHTML = renderRecentTrips(currentAdminData.recent_activity.trips);
    } else {
        contentDiv.innerHTML = renderRecentUsers(currentAdminData.recent_activity.users);
    }
}

async function showAdminUsers() {
    try {
        const response = await fetch('/api/admin/users', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            displayAdminUsers(data);
        } else {
            throw new Error('Failed to load users');
        }
    } catch (error) {
        console.error('Error loading users:', error);
        showToast('Error loading users', 'error');
    }
}

function displayAdminUsers(data) {
    const usersHTML = `
        <div class="admin-section">
            <div class="section-header">
                <h3>User Management</h3>
                <div class="user-controls">
                    <input type="text" id="user-search" placeholder="Search users..." onkeyup="searchUsers()">
                    <select id="user-status-filter" onchange="filterUsers()">
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>
            
            <div class="users-table-container">
                <table class="users-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Last Login</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.users.map(user => `
                            <tr>
                                <td>
                                    <div class="user-info">
                                        <strong>${user.first_name || ''} ${user.last_name || ''}</strong>
                                        <span>@${user.username}</span>
                                    </div>
                                </td>
                                <td>${user.email}</td>
                                <td>
                                    <span class="status-badge ${user.is_active ? 'active' : 'inactive'}">
                                        ${user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>${formatDate(user.created_at)}</td>
                                <td>${user.last_login ? formatDate(user.last_login) : 'Never'}</td>
                                <td>
                                    <button class="btn-icon toggle" onclick="toggleUserStatus(${user.id})" title="${user.is_active ? 'Deactivate' : 'Activate'}">
                                        <i class="fas fa-${user.is_active ? 'toggle-on' : 'toggle-off'}"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            ${data.pagination.pages > 1 ? `
                <div class="pagination">
                    <button class="btn-secondary" ${!data.pagination.has_prev ? 'disabled' : ''} onclick="changeUserPage(${data.pagination.page - 1})">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <span>Page ${data.pagination.page} of ${data.pagination.pages}</span>
                    <button class="btn-secondary" ${!data.pagination.has_next ? 'disabled' : ''} onclick="changeUserPage(${data.pagination.page + 1})">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('admin-sections').innerHTML = usersHTML;
}

async function toggleUserStatus(userId) {
    try {
        const response = await fetch(`/api/admin/users/${userId}/toggle-status`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast(data.message, 'success');
            showAdminUsers(); // Refresh the list
        } else {
            throw new Error(data.error || 'Failed to toggle user status');
        }
    } catch (error) {
        console.error('Error toggling user status:', error);
        showToast(error.message || 'Failed to toggle user status', 'error');
    }
}

async function showAdminTrips() {
    try {
        const response = await fetch('/api/admin/analytics/trips', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            displayAdminTrips(data);
        } else {
            throw new Error('Failed to load trip analytics');
        }
    } catch (error) {
        console.error('Error loading trip analytics:', error);
        showToast('Error loading trip analytics', 'error');
    }
}

function displayAdminTrips(data) {
    const tripsHTML = `
        <div class="admin-section">
            <h3>Trip Analytics</h3>
            
            <div class="analytics-row">
                <div class="analytics-card">
                    <h4>Budget Statistics</h4>
                    <div class="budget-stats">
                        <div class="budget-item">
                            <span class="label">Average Budget:</span>
                            <span class="value">$${data.budget_statistics.average.toFixed(2)}</span>
                        </div>
                        <div class="budget-item">
                            <span class="label">Minimum Budget:</span>
                            <span class="value">$${data.budget_statistics.minimum.toFixed(2)}</span>
                        </div>
                        <div class="budget-item">
                            <span class="label">Maximum Budget:</span>
                            <span class="value">$${data.budget_statistics.maximum.toFixed(2)}</span>
                        </div>
                        <div class="budget-item">
                            <span class="label">Total Budget:</span>
                            <span class="value">$${data.budget_statistics.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="analytics-card">
                    <h4>Popular Trip Durations</h4>
                    <div class="duration-list">
                        ${data.popular_durations.map(duration => `
                            <div class="duration-item">
                                <span class="duration-name">${duration.duration}</span>
                                <span class="duration-count">${duration.count} trips</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="analytics-card full-width">
                <h4>Trips by Destination</h4>
                <div class="destination-chart">
                    ${data.trips_by_destination.map(dest => `
                        <div class="destination-bar">
                            <span class="destination-label">${dest.destination}</span>
                            <div class="bar-container">
                                <div class="bar" style="width: ${(dest.count / Math.max(...data.trips_by_destination.map(d => d.count))) * 100}%"></div>
                            </div>
                            <span class="destination-count">${dest.count}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('admin-sections').innerHTML = tripsHTML;
}

async function showAdminActivities() {
    try {
        const response = await fetch('/api/admin/analytics/activities', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            displayAdminActivities(data);
        } else {
            throw new Error('Failed to load activity analytics');
        }
    } catch (error) {
        console.error('Error loading activity analytics:', error);
        showToast('Error loading activity analytics', 'error');
    }
}

function displayAdminActivities(data) {
    const activitiesHTML = `
        <div class="admin-section">
            <h3>Activity Analytics</h3>
            
            <div class="analytics-row">
                <div class="analytics-card">
                    <h4>Activities by Category</h4>
                    <div class="category-chart">
                        ${data.activities_by_category.map(cat => `
                            <div class="category-bar">
                                <span class="category-label">${cat.category}</span>
                                <div class="bar-container">
                                    <div class="bar" style="width: ${(cat.count / Math.max(...data.activities_by_category.map(c => c.count))) * 100}%"></div>
                                </div>
                                <span class="category-count">${cat.count}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="analytics-card">
                    <h4>Activities by Cost Range</h4>
                    <div class="cost-chart">
                        ${data.activities_by_cost.map(cost => `
                            <div class="cost-bar">
                                <span class="cost-label">${cost.range}</span>
                                <div class="bar-container">
                                    <div class="bar" style="width: ${(cost.count / Math.max(...data.activities_by_cost.map(c => c.count))) * 100}%"></div>
                                </div>
                                <span class="cost-count">${cost.count}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="analytics-card">
                <h4>Average Activity Cost</h4>
                <div class="average-cost">
                    <span class="cost-value">$${data.average_cost.toFixed(2)}</span>
                    <span class="cost-label">per activity</span>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('admin-sections').innerHTML = activitiesHTML;
}

async function showAdminEngagement() {
    try {
        const response = await fetch('/api/admin/analytics/engagement', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            displayAdminEngagement(data);
        } else {
            throw new Error('Failed to load engagement analytics');
        }
    } catch (error) {
        console.error('Error loading engagement analytics:', error);
        showToast('Error loading engagement analytics', 'error');
    }
}

function displayAdminEngagement(data) {
    const engagementHTML = `
        <div class="admin-section">
            <h3>User Engagement Analytics</h3>
            
            <div class="analytics-row">
                <div class="analytics-card">
                    <h4>User Activity Levels</h4>
                    <div class="activity-chart">
                        ${data.user_activity_levels.map(level => `
                            <div class="activity-bar">
                                <span class="activity-label">${level.level}</span>
                                <div class="bar-container">
                                    <div class="bar" style="width: ${(level.count / Math.max(...data.user_activity_levels.map(l => l.count))) * 100}%"></div>
                                </div>
                                <span class="activity-count">${level.count} users</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="analytics-card">
                    <h4>Retention Metrics</h4>
                    <div class="retention-stats">
                        <div class="retention-item">
                            <span class="label">Active Users (30 days):</span>
                            <span class="value">${data.retention_metrics.active_users_30_days}</span>
                        </div>
                        <div class="retention-item">
                            <span class="label">Retention Rate:</span>
                            <span class="value">${data.retention_metrics.retention_rate}%</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="analytics-card full-width">
                <h4>User Registration Trends</h4>
                <div class="registration-chart">
                    ${data.registrations_by_month.map(reg => `
                        <div class="registration-bar">
                            <span class="registration-label">${new Date(reg.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                            <div class="bar-container">
                                <div class="bar" style="width: ${(reg.count / Math.max(...data.registrations_by_month.map(r => r.count))) * 100}%"></div>
                            </div>
                            <span class="registration-count">${reg.count}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('admin-sections').innerHTML = engagementHTML;
}

async function exportAdminData(type) {
    try {
        const response = await fetch(`/api/admin/export/data?type=${type}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        
        if (response.ok) {
            const exportData = await response.json();
            
            // Create downloadable JSON file
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `traveloop_admin_export_${type}_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            showToast('Data exported successfully!', 'success');
        } else {
            throw new Error('Failed to export data');
        }
    } catch (error) {
        console.error('Error exporting data:', error);
        showToast('Failed to export data', 'error');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    checkPublicItineraryPage();
});

function renderItineraryBuilder(trip) {
    const itinerary = trip.itinerary || [];
    const cities = getItineraryCities(itinerary);
    
    return `
        <div class="itinerary-builder">
            <div class="itinerary-header">
                <div class="itinerary-controls">
                    <button class="btn-primary" onclick="addItineraryStop('${trip.id}')">
                        <i class="fas fa-plus"></i> Add Stop
                    </button>
                    <button class="btn-secondary" onclick="showItineraryTemplates('${trip.id}')">
                        <i class="fas fa-magic"></i> Templates
                    </button>
                    <button class="btn-secondary" onclick="exportItinerary('${trip.id}')">
                        <i class="fas fa-download"></i> Export
                    </button>
                </div>
                
                <div class="itinerary-summary">
                    <div class="summary-item">
                        <span class="summary-label">Cities:</span>
                        <span class="summary-value">${cities.length}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Activities:</span>
                        <span class="summary-value">${itinerary.length}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Duration:</span>
                        <span class="summary-value">${calculateTripDuration(trip.startDate, trip.endDate)} days</span>
                    </div>
                </div>
            </div>
            
            <div class="itinerary-content" id="itinerary-stops">
                ${renderItineraryStops(itinerary)}
            </div>
        </div>
    `;
}

function renderItineraryStops(itinerary) {
    if (itinerary.length === 0) {
        return `
            <div class="empty-itinerary">
                <i class="fas fa-map-marked-alt"></i>
                <h3>No stops added yet</h3>
                <p>Start building your itinerary by adding your first stop!</p>
                <button class="btn-primary" onclick="addItineraryStop(currentEditingTripId)">
                    <i class="fas fa-plus"></i> Add First Stop
                </button>
            </div>
        `;
    }
    
    return itinerary.map((stop, index) => `
        <div class="itinerary-stop" data-stop-id="${stop.id}" draggable="true">
            <div class="stop-header">
                <div class="stop-number">${index + 1}</div>
                <div class="stop-info">
                    <h4>${stop.city || 'Stop ' + (index + 1)}</h4>
                    <p class="stop-dates">${formatDate(stop.date)}${stop.endDate ? ' - ' + formatDate(stop.endDate) : ''}</p>
                </div>
                <div class="stop-actions">
                    <button class="action-btn" onclick="editItineraryStop('${stop.id}')" title="Edit Stop">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="deleteItineraryStop('${stop.id}')" title="Delete Stop">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            
            <div class="stop-activities">
                <div class="activities-header">
                    <h5>Activities</h5>
                    <button class="add-activity-btn" onclick="addActivityToStop('${stop.id}')" title="Add Activity">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="activities-list">
                    ${renderStopActivities(stop.activities || [])}
                </div>
            </div>
        </div>
    `).join('');
}

function renderStopActivities(activities) {
    if (activities.length === 0) {
        return '<p class="no-activities">No activities added</p>';
    }
    
    return activities.map((activity, index) => `
        <div class="activity-item" draggable="true" data-activity-id="${activity.id}">
            <div class="activity-time">${activity.time || 'All day'}</div>
            <div class="activity-details">
                <div class="activity-name">${activity.activity}</div>
                <div class="activity-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${activity.location || 'No location specified'}
                </div>
            </div>
            <div class="activity-actions">
                <button class="mini-btn" onclick="editActivity('${activity.id}')" title="Edit Activity">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="mini-btn" onclick="deleteActivity('${activity.id}')" title="Delete Activity">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Itinerary Builder Functions
let currentEditingTripId = null;

function initializeItineraryBuilder(tripId) {
    currentEditingTripId = tripId;
    
    // Initialize drag and drop
    initializeDragAndDrop();
    
    // Auto-save functionality
    setInterval(() => {
        if (currentEditingTripId) {
            saveItineraryChanges();
        }
    }, 5000); // Auto-save every 5 seconds
}

function addItineraryStop(tripId) {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;
    
    const stop = {
        id: Date.now().toString(),
        city: '',
        date: '',
        endDate: '',
        activities: []
    };
    
    if (!trip.itinerary) trip.itinerary = [];
    trip.itinerary.push(stop);
    
    saveTrips();
    switchTripView('itinerary', tripId);
    showToast('Stop added successfully!', 'success');
}

function editItineraryStop(stopId) {
    const trip = trips.find(t => t.id === currentEditingTripId);
    if (!trip) return;
    
    const stop = trip.itinerary.find(s => s.id === stopId);
    if (!stop) return;
    
    const modalHTML = `
        <div class="modal active" id="edit-stop-modal">
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <h3>Edit Stop</h3>
                <form onsubmit="handleEditStop(event, '${stopId}')">
                    <div class="form-group">
                        <label for="stop-city">City *</label>
                        <input type="text" id="stop-city" value="${stop.city || ''}" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="stop-date">Start Date *</label>
                            <input type="date" id="stop-date" value="${stop.date || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="stop-end-date">End Date</label>
                            <input type="date" id="stop-end-date" value="${stop.endDate || ''}">
                        </div>
                    </div>
                    <button type="submit" class="btn-primary" style="width: 100%;">Save Stop</button>
                </form>
            </div>
        </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHTML;
}

function handleEditStop(event, stopId) {
    event.preventDefault();
    
    const trip = trips.find(t => t.id === currentEditingTripId);
    if (!trip) return;
    
    const stop = trip.itinerary.find(s => s.id === stopId);
    if (!stop) return;
    
    stop.city = document.getElementById('stop-city').value;
    stop.date = document.getElementById('stop-date').value;
    stop.endDate = document.getElementById('stop-end-date').value;
    
    saveTrips();
    closeModal();
    showToast('Stop updated successfully!', 'success');
    switchTripView('itinerary', currentEditingTripId);
}

function deleteItineraryStop(stopId) {
    if (!confirm('Are you sure you want to delete this stop?')) return;
    
    const trip = trips.find(t => t.id === currentEditingTripId);
    if (!trip) return;
    
    trip.itinerary = trip.itinerary.filter(s => s.id !== stopId);
    
    saveTrips();
    showToast('Stop deleted successfully!', 'success');
    switchTripView('itinerary', currentEditingTripId);
}

function addActivityToStop(stopId) {
    const trip = trips.find(t => t.id === currentEditingTripId);
    if (!trip) return;
    
    const stop = trip.itinerary.find(s => s.id === stopId);
    if (!stop) return;
    
    const activity = {
        id: Date.now().toString(),
        time: '09:00',
        activity: '',
        location: ''
    };
    
    if (!stop.activities) stop.activities = [];
    stop.activities.push(activity);
    
    saveTrips();
    switchTripView('itinerary', currentEditingTripId);
    showToast('Activity added successfully!', 'success');
}

function editActivity(activityId) {
    const modalHTML = `
        <div class="modal active" id="edit-activity-modal">
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <h3>Edit Activity</h3>
                <form onsubmit="handleEditActivity(event, '${activityId}')">
                    <div class="form-group">
                        <label for="activity-time">Time *</label>
                        <input type="time" id="activity-time" required>
                    </div>
                    <div class="form-group">
                        <label for="activity-name">Activity *</label>
                        <input type="text" id="activity-name" required>
                    </div>
                    <div class="form-group">
                        <label for="activity-location">Location *</label>
                        <input type="text" id="activity-location" required>
                    </div>
                    <div class="form-group">
                        <label for="activity-notes">Notes</label>
                        <textarea id="activity-notes" rows="3"></textarea>
                    </div>
                    <button type="submit" class="btn-primary" style="width: 100%;">Save Activity</button>
                </form>
            </div>
        </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHTML;
}

function handleEditActivity(event, activityId) {
    event.preventDefault();
    
    const trip = trips.find(t => t.id === currentEditingTripId);
    if (!trip) return;
    
    // Find the activity across all stops
    let targetActivity = null;
    for (const stop of trip.itinerary) {
        const activity = stop.activities.find(a => a.id === activityId);
        if (activity) {
            targetActivity = activity;
            break;
        }
    }
    
    if (!targetActivity) return;
    
    targetActivity.time = document.getElementById('activity-time').value;
    targetActivity.activity = document.getElementById('activity-name').value;
    targetActivity.location = document.getElementById('activity-location').value;
    targetActivity.notes = document.getElementById('activity-notes').value;
    
    saveTrips();
    closeModal();
    showToast('Activity updated successfully!', 'success');
    switchTripView('itinerary', currentEditingTripId);
}

function deleteActivity(activityId) {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    
    const trip = trips.find(t => t.id === currentEditingTripId);
    if (!trip) return;
    
    // Find and remove the activity
    for (const stop of trip.itinerary) {
        const activityIndex = stop.activities.findIndex(a => a.id === activityId);
        if (activityIndex !== -1) {
            stop.activities.splice(activityIndex, 1);
            break;
        }
    }
    
    saveTrips();
    showToast('Activity deleted successfully!', 'success');
    switchTripView('itinerary', currentEditingTripId);
}

// Helper Functions
function getItineraryCities(itinerary) {
    const cities = new Set();
    itinerary.forEach(stop => {
        if (stop.city) cities.add(stop.city);
    });
    return Array.from(cities);
}

function showItineraryTemplates(tripId) {
    const templates = {
        cityBreak: {
            name: 'City Break',
            stops: [
                { city: 'Day 1: Arrival', activities: [{ time: '10:00', activity: 'Airport pickup', location: 'Airport' }] },
                { city: 'Day 2: Exploration', activities: [{ time: '09:00', activity: 'City tour', location: 'City center' }] },
                { city: 'Day 3: Culture', activities: [{ time: '10:00', activity: 'Museum visit', location: 'Art district' }] }
            ]
        },
        beachVacation: {
            name: 'Beach Vacation',
            stops: [
                { city: 'Day 1: Beach Day', activities: [{ time: '10:00', activity: 'Swimming', location: 'Main beach' }] },
                { city: 'Day 2: Water Sports', activities: [{ time: '09:00', activity: 'Snorkeling', location: 'Beach club' }] },
                { city: 'Day 3: Relaxation', activities: [{ time: '11:00', activity: 'Beach walk', location: 'Shore line' }] }
            ]
        }
    };
    
    const modalHTML = `
        <div class="modal active" id="itinerary-templates-modal">
            <div class="modal-content" style="max-width: 800px;">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <h3>Itinerary Templates</h3>
                <div class="templates-grid">
                    ${Object.entries(templates).map(([key, template]) => `
                        <div class="template-card" onclick="applyItineraryTemplate('${tripId}', '${key}')">
                            <h4>${template.name}</h4>
                            <p>${template.stops.length} stops included</p>
                            <div class="template-preview">
                                ${template.stops.map(stop => `
                                    <div class="mini-stop">
                                        <strong>${stop.city}</strong>
                                        <small>${stop.activities.length} activities</small>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHTML;
}

function applyItineraryTemplate(tripId, templateKey) {
    const templates = {
        cityBreak: {
            name: 'City Break',
            stops: [
                { city: 'Day 1: Arrival', activities: [{ time: '10:00', activity: 'Airport pickup', location: 'Airport' }] },
                { city: 'Day 2: Exploration', activities: [{ time: '09:00', activity: 'City tour', location: 'City center' }] },
                { city: 'Day 3: Culture', activities: [{ time: '10:00', activity: 'Museum visit', location: 'Art district' }] }
            ]
        },
        beachVacation: {
            name: 'Beach Vacation',
            stops: [
                { city: 'Day 1: Beach Day', activities: [{ time: '10:00', activity: 'Swimming', location: 'Main beach' }] },
                { city: 'Day 2: Water Sports', activities: [{ time: '09:00', activity: 'Snorkeling', location: 'Beach club' }] },
                { city: 'Day 3: Relaxation', activities: [{ time: '11:00', activity: 'Beach walk', location: 'Shore line' }] }
            ]
        }
    };
    
    const template = templates[templateKey];
    if (!template) return;
    
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;
    
    // Apply template with unique IDs
    const newItinerary = template.stops.map(stop => ({
        ...stop,
        id: Date.now().toString() + Math.random(),
        activities: stop.activities.map(activity => ({
            ...activity,
            id: Date.now().toString() + Math.random()
        }))
    }));
    
    trip.itinerary = newItinerary;
    saveTrips();
    closeModal();
    showToast(`${template.name} template applied!`, 'success');
    switchTripView('itinerary', tripId);
}

function exportItinerary(tripId) {
    const trip = trips.find(t => t.id === tripId);
    if (!trip || !trip.itinerary) return;
    
    let exportText = `${trip.name} - Itinerary\\n`;
    exportText += `Destination: ${trip.destination}\\n`;
    exportText += `Dates: ${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}\\n\\n`;
    
    trip.itinerary.forEach((stop, index) => {
        exportText += `\\nStop ${index + 1}: ${stop.city}\\n`;
        exportText += `Date: ${formatDate(stop.date)}\\n`;
        if (stop.endDate) exportText += `End Date: ${formatDate(stop.endDate)}\\n`;
        
        if (stop.activities && stop.activities.length > 0) {
            exportText += `Activities:\\n`;
            stop.activities.forEach(activity => {
                exportText += `  ${activity.time} - ${activity.activity}`;
                if (activity.location) exportText += ` (${activity.location})`;
                exportText += `\\n`;
            });
        }
        exportText += `\\n`;
    });
    
    // Create and download file
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${trip.name}_itinerary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Itinerary exported successfully!', 'success');
}

function saveItineraryChanges() {
    const trip = trips.find(t => t.id === currentEditingTripId);
    if (trip) {
        saveTrips();
    }
}

// Drag and Drop Functionality
function initializeDragAndDrop() {
    let draggedElement = null;
    let draggedType = null;
    
    document.addEventListener('dragstart', (e) => {
        draggedElement = e.target;
        draggedType = e.target.classList.contains('itinerary-stop') ? 'stop' : 'activity';
        e.target.style.opacity = '0.5';
    });
    
    document.addEventListener('dragend', (e) => {
        if (draggedElement) {
            draggedElement.style.opacity = '';
        }
        draggedElement = null;
        draggedType = null;
    });
    
    document.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    
    document.addEventListener('drop', (e) => {
        e.preventDefault();
        
        const dropTarget = e.target.closest('.itinerary-stop') || e.target.closest('.activities-list');
        if (!dropTarget) return;
        
        if (draggedType === 'stop' && dropTarget.classList.contains('itinerary-stops')) {
            // Reorder stops
            const stopsContainer = document.getElementById('itinerary-stops');
            const allStops = Array.from(stopsContainer.children);
            const draggedIndex = allStops.indexOf(draggedElement);
            const dropIndex = allStops.indexOf(dropTarget);
            
            if (draggedIndex !== dropIndex) {
                allStops.splice(draggedIndex, 1);
                allStops.splice(dropIndex, 0, draggedElement);
                stopsContainer.innerHTML = renderItineraryStops(allStops.map(stop => ({
                    ...stop,
                    id: stop.dataset.stopId
                })));
                updateItineraryOrder();
            }
        } else if (draggedType === 'activity' && dropTarget.classList.contains('activities-list')) {
            // Reorder activities within the same stop
            const activitiesContainer = dropTarget;
            const allActivities = Array.from(activitiesContainer.children);
            const draggedIndex = allActivities.indexOf(draggedElement);
            const dropIndex = allActivities.indexOf(dropTarget);
            
            if (draggedIndex !== dropIndex) {
                allActivities.splice(draggedIndex, 1);
                allActivities.splice(dropIndex, 0, draggedElement);
                activitiesContainer.innerHTML = renderStopActivities(allActivities.map(activity => ({
                    ...activity,
                    id: activity.dataset.activityId
                })));
                saveItineraryChanges();
            }
        }
    });
}

function updateItineraryOrder() {
    const trip = trips.find(t => t.id === currentEditingTripId);
    if (!trip) return;
    
    const stopsContainer = document.getElementById('itinerary-stops');
    const stopElements = Array.from(stopsContainer.children);
    
    const newOrder = stopElements.map((stopEl, index) => {
        const stopId = stopEl.dataset.stopId;
        const stop = trip.itinerary.find(s => s.id === stopId);
        return stop || { id: stopId, city: `Stop ${index + 1}` };
    });
    
    trip.itinerary = newOrder;
    saveTrips();
}

function showPackingTemplates() {
    const modalHTML = `
        <div class="modal active" id="packing-templates-modal">
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <h2>Packing List Templates</h2>
                <div class="packing-templates">
                    <div class="template-card">
                        <h3>Beach Vacation</h3>
                        <ul>
                            <li>Swimsuit</li>
                            <li>Sunscreen</li>
                            <li>Sunglasses</li>
                            <li>Beach towel</li>
                            <li>Flip flops</li>
                        </ul>
                        <button class="btn-primary" onclick="usePackingTemplate('beach')">Use Template</button>
                    </div>
                    <div class="template-card">
                        <h3>City Break</h3>
                        <ul>
                            <li>Comfortable walking shoes</li>
                            <li>City map</li>
                            <li>Camera</li>
                            <li>Portable charger</li>
                            <li>Light jacket</li>
                        </ul>
                        <button class="btn-primary" onclick="usePackingTemplate('city')">Use Template</button>
                    </div>
                    <div class="template-card">
                        <h3>Adventure Trip</h3>
                        <ul>
                            <li>Hiking boots</li>
                            <li>Backpack</li>
                            <li>First aid kit</li>
                            <li>Water bottle</li>
                            <li>Weather-appropriate clothing</li>
                        </ul>
                        <button class="btn-primary" onclick="usePackingTemplate('adventure')">Use Template</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHTML;
}

function createTripToDestination(destination) {
    showCreateTripModal();
    setTimeout(() => {
        const destSelect = document.getElementById('trip-destination');
        if (destSelect) {
            destSelect.value = destination;
        }
    }, 100);
}

function usePackingTemplate(type) {
    showToast(`Packing template "${type}" has been applied to your next trip!`, 'success');
    closeModal();
}

// Trip Creation Form Functions
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type and size
    if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showToast('Image size must be less than 5MB', 'error');
        return;
    }
    
    // Read and preview the image
    const reader = new FileReader();
    reader.onload = function(e) {
        const previewImage = document.getElementById('preview-image');
        const photoPreview = document.getElementById('photo-preview');
        const photoPlaceholder = document.getElementById('photo-placeholder');
        
        if (previewImage && photoPreview && photoPlaceholder) {
            previewImage.src = e.target.result;
            photoPreview.style.display = 'block';
            photoPlaceholder.style.display = 'none';
        }
    };
    reader.readAsDataURL(file);
}

function removePhoto() {
    const fileInput = document.getElementById('trip-cover-photo');
    const previewImage = document.getElementById('preview-image');
    const photoPreview = document.getElementById('photo-preview');
    const photoPlaceholder = document.getElementById('photo-placeholder');
    
    if (fileInput) fileInput.value = '';
    if (previewImage) previewImage.src = '';
    if (photoPreview) photoPreview.style.display = 'none';
    if (photoPlaceholder) photoPlaceholder.style.display = 'block';
}

function updateDescriptionCharCount() {
    const textarea = document.getElementById('trip-description');
    const charCount = document.getElementById('description-char-count');
    
    if (textarea && charCount) {
        const count = textarea.value.length;
        charCount.textContent = count;
        
        if (count > 500) {
            textarea.value = textarea.value.substring(0, 500);
            charCount.textContent = 500;
        }
        
        // Update char count color
        if (count > 450) {
            charCount.style.color = '#ef4444';
        } else if (count > 400) {
            charCount.style.color = '#f59e0b';
        } else {
            charCount.style.color = 'var(--text-light)';
        }
    }
}

function applyTemplate(templateType) {
    const templates = {
        weekend: {
            name: 'Weekend Getaway',
            budget: 500,
            description: 'A perfect weekend escape to relax and recharge. Short but sweet adventure to explore new places and create lasting memories.',
            duration: 3
        },
        beach: {
            name: 'Beach Vacation',
            budget: 2000,
            description: 'Sun, sand, and sea! The ultimate beach vacation with plenty of time for swimming, sunbathing, and water sports.',
            duration: 7
        },
        city: {
            name: 'City Break',
            budget: 1500,
            description: 'Explore the vibrant city life, visit iconic landmarks, enjoy local cuisine, and immerse yourself in urban culture.',
            duration: 5
        },
        adventure: {
            name: 'Adventure Trip',
            budget: 3000,
            description: 'An exciting outdoor adventure with hiking, exploration, and thrilling activities in nature\'s playground.',
            duration: 10
        }
    };
    
    const template = templates[templateType];
    if (!template) return;
    
    // Set template values
    const nameInput = document.getElementById('trip-name');
    const budgetInput = document.getElementById('trip-budget');
    const descriptionInput = document.getElementById('trip-description');
    const startDateInput = document.getElementById('trip-start-date');
    const endDateInput = document.getElementById('trip-end-date');
    
    if (nameInput) nameInput.value = template.name;
    if (budgetInput) budgetInput.value = template.budget;
    if (descriptionInput) {
        descriptionInput.value = template.description;
        updateDescriptionCharCount();
    }
    
    // Set dates based on template duration
    if (startDateInput && endDateInput) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 7); // Start next week
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + template.duration - 1);
        
        startDateInput.value = startDate.toISOString().split('T')[0];
        endDateInput.value = endDate.toISOString().split('T')[0];
    }
    
    showToast(`${template.name} template applied!`, 'success');
}

// Trip Creation Validation Functions
function validateTripName(fieldId) {
    const name = document.getElementById(fieldId)?.value;
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (!name) {
        if (errorElement) errorElement.textContent = 'Trip name is required';
        return false;
    }
    
    if (name.length < 3) {
        if (errorElement) errorElement.textContent = 'Trip name must be at least 3 characters';
        return false;
    }
    
    if (name.length > 50) {
        if (errorElement) errorElement.textContent = 'Trip name must be less than 50 characters';
        return false;
    }
    
    if (errorElement) errorElement.textContent = '';
    return true;
}

function validateDestination(fieldId) {
    const destination = document.getElementById(fieldId)?.value;
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (!destination) {
        if (errorElement) errorElement.textContent = 'Please select a destination';
        return false;
    }
    
    if (errorElement) errorElement.textContent = '';
    return true;
}

function validateDates() {
    const startDate = document.getElementById('trip-start-date')?.value;
    const endDate = document.getElementById('trip-end-date')?.value;
    const startError = document.getElementById('trip-start-date-error');
    const endError = document.getElementById('trip-end-date-error');
    
    let isValid = true;
    
    // Clear previous errors
    if (startError) startError.textContent = '';
    if (endError) endError.textContent = '';
    
    if (!startDate) {
        if (startError) startError.textContent = 'Start date is required';
        isValid = false;
    }
    
    if (!endDate) {
        if (endError) endError.textContent = 'End date is required';
        isValid = false;
    }
    
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (start < today) {
            if (startError) startError.textContent = 'Start date cannot be in the past';
            isValid = false;
        }
        
        if (end < start) {
            if (endError) endError.textContent = 'End date must be after start date';
            isValid = false;
        }
        
        // Check if duration is reasonable (max 365 days)
        const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        if (duration > 365) {
            if (endError) endError.textContent = 'Trip duration cannot exceed 365 days';
            isValid = false;
        }
    }
    
    return isValid;
}

function validateBudget(fieldId) {
    const budget = document.getElementById(fieldId)?.value;
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (!budget) {
        if (errorElement) errorElement.textContent = 'Budget is required';
        return false;
    }
    
    const budgetValue = parseFloat(budget);
    
    if (isNaN(budgetValue)) {
        if (errorElement) errorElement.textContent = 'Please enter a valid budget amount';
        return false;
    }
    
    if (budgetValue <= 0) {
        if (errorElement) errorElement.textContent = 'Budget must be greater than 0';
        return false;
    }
    
    if (budgetValue > 1000000) {
        if (errorElement) errorElement.textContent = 'Budget seems too high (max $1,000,000)';
        return false;
    }
    
    if (errorElement) errorElement.textContent = '';
    return true;
}

function validateCreateTripForm() {
    const nameValid = validateTripName('trip-name');
    const destinationValid = validateDestination('trip-destination');
    const datesValid = validateDates();
    const budgetValid = validateBudget('trip-budget');
    
    return nameValid && destinationValid && datesValid && budgetValid;
}

// Enhanced user data loading with remember me functionality
function loadUserData() {
    // Check for remember me preference first
    const rememberMe = localStorage.getItem('traveloop_remember_me');
    
    if (rememberMe === 'true') {
        const savedUser = localStorage.getItem('traveloop_current_user');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            loadTrips();
        }
    } else {
        const savedUser = sessionStorage.getItem('traveloop_current_user');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            loadTrips();
        }
    }
    
    const savedDestinations = localStorage.getItem('traveloop_destinations');
    if (savedDestinations) {
        destinations = JSON.parse(savedDestinations);
    }
}
