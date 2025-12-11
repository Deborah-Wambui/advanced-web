// js/dashboard.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getFirestore, collection, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* -----------------------------------------
   FIREBASE CONFIG (Same as your data.js)
-------------------------------------------- */
const firebaseConfig = {
    apiKey: "AIzaSyAXb2qJhuxbQGz6izzl53EKJMFvVO7KixA",
    authDomain: "campuslife-14f6f.firebaseapp.com",
    projectId: "campuslife-14f6f",
    storageBucket: "campuslife-14f6f.firebasestorage.app",
    messagingSenderId: "226330226174",
    appId: "1:226330226174:web:5f9a1f4355ba6d31e7e4af"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("🔥 Firebase Connected in Dashboard!");

/* -----------------------------------------
   DASHBOARD MANAGER
-------------------------------------------- */
class DashboardManager {
    constructor() {
        this.userEmail = null;
        this.eventRegistrations = [];
        this.clubMemberships = [];
        
        this.init();
    }

    async init() {
        // Show email prompt first
        this.showEmailPrompt();
        
        // Setup event listeners
        document.getElementById('load-dashboard')?.addEventListener('click', () => this.loadUserData());
        
        // Allow Enter key to submit
        document.getElementById('user-email')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.loadUserData();
            }
        });
    }

    showEmailPrompt() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('email-prompt').style.display = 'block';
    }

    async loadUserData() {
        this.userEmail = document.getElementById('user-email').value.trim();
        
        if (!this.userEmail) {
            alert('Please enter your email address');
            return;
        }
        
        if (!this.validateEmail(this.userEmail)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Hide prompt, show loading
        document.getElementById('email-prompt').style.display = 'none';
        document.getElementById('loading').style.display = 'block';
        
        try {
            // Fetch data from Firebase
            await this.fetchEventRegistrations();
            await this.fetchClubMemberships();
            
            // Display the data
            this.renderDashboard();
            
        } catch (error) {
            console.error('Error loading dashboard:', error);
            document.getElementById('loading').style.display = 'none';
            document.getElementById('email-prompt').style.display = 'block';
            alert('Error loading data. Please try again.');
        }
    }

    async fetchEventRegistrations() {
        try {
            const q = query(
                collection(db, "event_registrations"),
                where("studentEmail", "==", this.userEmail)
            );
            
            const querySnapshot = await getDocs(q);
            this.eventRegistrations = [];
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                this.eventRegistrations.push({
                    id: doc.id,
                    ...data,
                    registeredAt: data.registeredAt?.toDate() || new Date()
                });
            });
            
            console.log(`Found ${this.eventRegistrations.length} event registrations`);
            
        } catch (error) {
            console.error("Error fetching event registrations:", error);
            this.eventRegistrations = [];
        }
    }

    async fetchClubMemberships() {
        try {
            const q = query(
                collection(db, "club_memberships"),
                where("studentEmail", "==", this.userEmail)
            );
            
            const querySnapshot = await getDocs(q);
            this.clubMemberships = [];
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                this.clubMemberships.push({
                    id: doc.id,
                    ...data,
                    appliedAt: data.appliedAt?.toDate() || new Date()
                });
            });
            
            console.log(`Found ${this.clubMemberships.length} club memberships`);
            
        } catch (error) {
            console.error("Error fetching club memberships:", error);
            this.clubMemberships = [];
        }
    }

    renderDashboard() {
        // Hide loading, show dashboard
        document.getElementById('loading').style.display = 'none';
        document.getElementById('dashboard-content').style.display = 'block';
        
        // Update welcome message
        const userName = this.eventRegistrations[0]?.studentName || 'Student';
        document.getElementById('welcome-message').textContent = `Welcome back, ${userName}!`;
        
        // Render stats
        this.renderStats();
        
        // Render events
        this.renderEvents();
        
        // Render clubs
        this.renderClubs();
    }

    renderStats() {
        const statsContainer = document.getElementById('stats-container');
        
        const stats = [
            {
                number: this.eventRegistrations.length,
                label: 'Events Registered'
            },
            {
                number: this.clubMemberships.length,
                label: 'Clubs Joined'
            },
            {
                number: this.getUpcomingEventsCount(),
                label: 'Upcoming Events'
            },
            {
                number: this.getPendingClubsCount(),
                label: 'Pending Applications'
            }
        ];
        
        statsContainer.innerHTML = stats.map(stat => `
            <div class="stat-card">
                <div class="stat-number">${stat.number}</div>
                <div class="stat-label">${stat.label}</div>
            </div>
        `).join('');
    }

    renderEvents() {
        const eventsContainer = document.getElementById('events-container');
        const emptyEvents = document.getElementById('empty-events');
        
        if (this.eventRegistrations.length === 0) {
            eventsContainer.style.display = 'none';
            emptyEvents.style.display = 'block';
            return;
        }
        
        emptyEvents.style.display = 'none';
        eventsContainer.style.display = 'grid';
        
        eventsContainer.innerHTML = this.eventRegistrations.map(reg => {
            const eventDate = this.formatDate(reg.registeredAt);
            
            return `
                <div class="dashboard-card">
                    <div class="card-header">
                        <h3 class="card-title">${this.escapeHTML(reg.eventName)}</h3>
                        <span class="status-badge status-confirmed">Confirmed</span>
                    </div>
                    <div class="card-content">
                        <div class="card-detail">
                            <svg viewBox="0 0 24 24">
                                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 6v2h14V6H5zm2 4h10v2H7zm0 4h7v2H7z"/>
                            </svg>
                            <span>Registered on: ${eventDate}</span>
                        </div>
                        <div class="card-detail">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                            <span>Event ID: ${reg.eventId || 'N/A'}</span>
                        </div>
                        <div class="card-detail">
                            <svg viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                            </svg>
                            <span>Email: ${this.escapeHTML(reg.studentEmail)}</span>
                        </div>
                        <div class="card-detail">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                            <span>Student ID: ${reg.studentId || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-secondary" onclick="window.location.href='data.html'">
                            View Event
                        </button>
                        <button class="btn btn-danger" onclick="dashboard.cancelRegistration('${reg.id}', 'event')">
                            Cancel
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderClubs() {
        const clubsContainer = document.getElementById('clubs-container');
        const emptyClubs = document.getElementById('empty-clubs');
        
        if (this.clubMemberships.length === 0) {
            clubsContainer.style.display = 'none';
            emptyClubs.style.display = 'block';
            return;
        }
        
        emptyClubs.style.display = 'none';
        clubsContainer.style.display = 'grid';
        
        clubsContainer.innerHTML = this.clubMemberships.map(membership => {
            const appliedDate = this.formatDate(membership.appliedAt);
            const status = membership.status || 'pending';
            
            return `
                <div class="dashboard-card">
                    <div class="card-header">
                        <h3 class="card-title">${this.escapeHTML(membership.clubName)}</h3>
                        <span class="status-badge ${status === 'pending' ? 'status-pending' : 'status-confirmed'}">
                            ${status === 'pending' ? 'Pending' : 'Member'}
                        </span>
                    </div>
                    <div class="card-content">
                        <div class="card-detail">
                            <svg viewBox="0 0 24 24">
                                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 6v2h14V6H5z"/>
                            </svg>
                            <span>Applied on: ${appliedDate}</span>
                        </div>
                        <div class="card-detail">
                            <svg viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                            </svg>
                            <span>Email: ${this.escapeHTML(membership.studentEmail)}</span>
                        </div>
                        <div class="card-detail">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                            <span>Name: ${this.escapeHTML(membership.studentName)}</span>
                        </div>
                        ${membership.reason ? `
                            <div class="card-detail">
                                <svg viewBox="0 0 24 24">
                                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                                </svg>
                                <span>Interest: ${this.escapeHTML(membership.reason.substring(0, 50))}...</span>
                            </div>
                        ` : ''}
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-secondary" onclick="window.location.href='data.html'">
                            View Club
                        </button>
                        ${status === 'pending' ? `
                            <button class="btn btn-danger" onclick="dashboard.cancelApplication('${membership.id}')">
                                Cancel Application
                            </button>
                        ` : `
                            <button class="btn btn-danger" onclick="dashboard.leaveClub('${membership.id}')">
                                Leave Club
                            </button>
                        `}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Helper methods
    getUpcomingEventsCount() {
        // For demo, return the count of registrations made in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        return this.eventRegistrations.filter(reg => 
            reg.registeredAt > thirtyDaysAgo
        ).length;
    }

    getPendingClubsCount() {
        return this.clubMemberships.filter(membership => 
            membership.status === 'pending'
        ).length;
    }

    formatDate(date) {
        if (!date) return 'N/A';
        
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Action methods (to be implemented)
    cancelRegistration(regId, type) {
        if (confirm('Are you sure you want to cancel this registration?')) {
            alert(`Registration cancelled (demo). In a real app, this would delete from Firebase.\nID: ${regId}`);
            // In real app: deleteDoc(doc(db, "event_registrations", regId));
            this.loadUserData(); // Refresh
        }
    }

    cancelApplication(appId) {
        if (confirm('Are you sure you want to cancel this application?')) {
            alert(`Application cancelled (demo).\nID: ${appId}`);
            this.loadUserData(); // Refresh
        }
    }

    leaveClub(membershipId) {
        if (confirm('Are you sure you want to leave this club?')) {
            alert(`Left club (demo).\nID: ${membershipId}`);
            this.loadUserData(); // Refresh
        }
    }
}

// Initialize dashboard when page loads
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new DashboardManager();
    window.dashboard = dashboard; // Make accessible globally for onclick
});