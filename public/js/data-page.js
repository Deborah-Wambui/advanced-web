/* -----------------------------------------
   1. IMPORT FIREBASE LIBRARIES
-------------------------------------------- */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getFirestore, collection, addDoc 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* -----------------------------------------
   2. FIREBASE CONFIG
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
console.log("🔥 Firebase Connected in Data Page!");

/* -----------------------------------------
   3. DATA MANAGER CLASS
-------------------------------------------- */
class DataManager {
    constructor() {
        this.events = [];
        this.clubs = [];
        this.loadData();
        this.init();
    }

    loadData() {
        // We keep the logic to load from local storage if available, 
        // but rely on the hardcoded initialization if not found.
        const savedData = localStorage.getItem('campusData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.events = data.events || [];
            this.clubs = data.clubs || [];
        } else {
            this.initializeSampleData();
        }
    }

    initializeSampleData() {
        // HARDCODED VALUES AS REQUESTED - DO NOT TOUCH
        this.events = [
            {
                id: 1,
                title: 'Welcome Back Party',
                date: '2024-02-15',
                time: '18:00',
                location: 'Student Union',
                category: 'social',
                description: 'Kick off the semester with music and food! Join us for an unforgettable evening with live performances, great food, and opportunities to meet new friends.',
                fullDescription: 'Get ready to start the semester with a bang! Our Welcome Back Party features live music from student bands, delicious food from local vendors, games, and plenty of opportunities to connect with fellow students. This is the perfect chance to meet new people and get involved in campus life.',
                image: 'https://picsum.photos/400/250?random=1',
                featured: true,
                organizer: 'Student Activities Board',
                capacity: 200,
                requirements: 'Open to all students',
                contact: 'events@university.edu'
            },
            {
                id: 2,
                title: 'Career Fair 2024',
                date: '2024-02-20',
                time: '10:00',
                location: 'Main Hall',
                category: 'career',
                description: 'Connect with top employers from various industries. Bring your resume and make valuable professional connections.',
                fullDescription: 'Meet representatives from over 50 top companies including Google, Microsoft, Amazon, and local startups. This is your chance to explore internship and full-time opportunities across various industries. Professional dress recommended. Resume review services available.',
                image: 'https://picsum.photos/400/250?random=2',
                featured: false,
                organizer: 'Career Services',
                capacity: 500,
                requirements: 'Student ID required',
                contact: 'career@university.edu'
            },
            {
                id: 3,
                title: 'Python Workshop',
                date: '2024-02-18',
                time: '14:00',
                location: 'Computer Lab B',
                category: 'workshop',
                description: 'Perfect for beginners! Learn Python programming fundamentals through hands-on exercises.',
                fullDescription: 'This hands-on workshop will introduce you to Python programming from the ground up. We will cover variables, data types, control structures, functions, and basic file operations. By the end, you will have built your first Python application. Laptops will be provided, but feel free to bring your own.',
                image: "https://picsum.photos/400/250?random=3",
                featured: true,
                organizer: 'Computer Science Department',
                capacity: 30,
                requirements: 'No prior experience needed',
                contact: 'cs-workshops@university.edu'
            }
        ];

        this.clubs = [
            {
                id: 1,
                name: 'Computer Science Society',
                description: 'Join our vibrant community of tech enthusiasts. We host weekly coding sessions and hackathons.',
                fullDescription: 'The Computer Science Society is a community of students passionate about technology and programming. We organize weekly coding sessions, host guest speakers from the tech industry, participate in hackathons, and work on collaborative projects. All skill levels are welcome!',
                members: 45,
                category: 'academic',
                image: 'https://picsum.photos/400/250?random=4',
                meetingTime: 'Tuesdays 6:00 PM',
                contact: 'css@university.edu',
                president: 'Sarah Johnson',
                socialMedia: '@css_university',
                upcomingEvents: 'Hackathon - March 15th, Tech Talk with Google - March 22nd'
            },
            {
                id: 2,
                name: 'Photography Club',
                description: 'Capture beautiful moments and learn photography techniques through workshops and exhibitions.',
                fullDescription: 'Whether you are using a smartphone or a professional camera, our Photography Club welcomes all levels of photographers. We organize weekly photo walks, monthly workshops on different techniques, and semester-end exhibitions to showcase your work. Equipment is available for checkout.',
                members: 28,
                category: 'arts',
                image: 'https://picsum.photos/400/250?random=5',
                meetingTime: 'Thursdays 5:00 PM',
                contact: 'photography@university.edu',
                president: 'Mike Chen',
                socialMedia: '@university_photo',
                upcomingEvents: 'Sunset Photo Walk - This Friday, Portrait Workshop - Next Thursday'
            },
            {
                id: 3,
                name: 'Basketball Team',
                description: 'Join us for competitive games and skill development sessions in a supportive environment.',
                fullDescription: 'Our Basketball Team competes in inter-collegiate tournaments while maintaining a supportive environment for players of all skill levels. We have competitive and recreational divisions, with professional coaching available. Regular practice sessions focus on skill development, teamwork, and strategy.',
                members: 15,
                category: 'sports',
                image: "https://picsum.photos/400/250?random=6",
                meetingTime: 'Mon & Wed 4:00 PM',
                contact: 'basketball@university.edu',
                president: 'James Wilson',
                socialMedia: '@uni_hoops',
                upcomingEvents: 'Tryouts - Next Monday, Tournament vs City College - March 10th'
            }
        ];
        this.saveData();
    }

    saveData() {
        const data = {
            events: this.events,
            clubs: this.clubs
        };
        localStorage.setItem('campusData', JSON.stringify(data));
    }

    init() {
        this.createModal();
        this.renderEvents();
        this.renderClubs();
        this.setupEventSearch();
        this.setupCategoryFilters();
    }

    createModal() {
        if (document.querySelector('.details-modal')) return;

        const modal = document.createElement('div');
        modal.className = 'details-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close" aria-label="Close modal">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
                <div class="modal-body"></div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.modal-overlay').addEventListener('click', () => this.closeModal());
        modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    // ---------------------------------------------------------
    // EVENT DETAILS LOGIC
    // ---------------------------------------------------------
    showEventDetails(eventId) {
        const event = this.events.find(e => e.id === parseInt(eventId));
        if (!event) return;

        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="event-details">
                <div class="detail-header">
                    <span class="category-tag ${event.category}">${this.escapeHTML(event.category)}</span>
                    ${event.featured ? '<span class="featured-badge">Featured</span>' : ''}
                </div>
                <h2>${this.escapeHTML(event.title)}</h2>
                <div class="detail-meta">
                    <div class="meta-item">
                        <span>🗓 ${event.date} at ${event.time}</span>
                    </div>
                    <div class="meta-item">
                        <span>📍 ${this.escapeHTML(event.location)}</span>
                    </div>
                </div>
                <div class="detail-content">
                    <h3>About this Event</h3>
                    <p>${this.escapeHTML(event.fullDescription)}</p>
                    
                    <div class="detail-grid">
                        <div class="detail-item"><strong>Organizer:</strong> ${this.escapeHTML(event.organizer)}</div>
                        <div class="detail-item"><strong>Capacity:</strong> ${event.capacity} attendees</div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button id="btn-register-event" class="btn btn-primary">Register for Event</button>
                    <button id="btn-add-calendar" class="btn btn-secondary">Add to Calendar</button>
                </div>
            </div>
        `;

        // 1. REGISTER EVENT CLICK
        document.getElementById("btn-register-event").addEventListener("click", () => {
            this.renderRegistrationForm(event);
        });

        // 2. ADD TO CALENDAR CLICK
        document.getElementById("btn-add-calendar").addEventListener("click", () => {
            this.addToGoogleCalendar(event);
        });

        this.openModal();
    }

    // ---------------------------------------------------------
    // CLUB DETAILS LOGIC
    // ---------------------------------------------------------
    showClubDetails(clubId) {
        const club = this.clubs.find(c => c.id === parseInt(clubId));
        if (!club) return;

        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="club-details">
                <div class="detail-header">
                    <span class="category-tag ${club.category}">${this.escapeHTML(club.category)}</span>
                    <span class="members-count">${club.members} members</span>
                </div>
                <h2>${this.escapeHTML(club.name)}</h2>
                <div class="detail-meta">
                    <div class="meta-item">🕒 ${club.meetingTime}</div>
                    <div class="meta-item">📧 ${club.contact}</div>
                </div>
                <div class="detail-content">
                    <h3>About the Club</h3>
                    <p>${this.escapeHTML(club.fullDescription)}</p>
                </div>
                <div class="modal-actions">
                    <button id="btn-join-club-modal" class="btn btn-primary">
                        Join Club
                    </button>
                </div>
            </div>
        `;

        // 3. JOIN CLUB CLICK (Inside Modal)
        const joinBtn = document.getElementById('btn-join-club-modal');
        if (joinBtn) {
            joinBtn.addEventListener('click', () => {
                this.renderJoinClubForm(club);
            });
        }

        this.openModal();
    }

    // ---------------------------------------------------------
    // FORM RENDERING & SUBMISSION (FIREBASE)
    // ---------------------------------------------------------
    
    // Render the Event Registration Form inside the Modal
    renderRegistrationForm(event) {
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="form-container">
                <h3>Register for ${this.escapeHTML(event.title)}</h3>
                <form id="event-reg-form" style="margin-top:20px; display:flex; flex-direction:column; gap:15px;">
                    <div class="form-group">
                        <label>Your Name</label>
                        <input type="text" id="reg-name" required style="width:100%; padding:8px;">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="reg-email" required style="width:100%; padding:8px;">
                    </div>
                    <div class="form-group">
                        <label>Student ID</label>
                        <input type="text" id="reg-sid" required style="width:100%; padding:8px;">
                    </div>
                    <button type="submit" class="btn btn-primary">Confirm Registration</button>
                </form>
                <button id="back-to-details" class="btn btn-secondary" style="margin-top:10px;">Back</button>
            </div>
        `;

        document.getElementById("back-to-details").addEventListener("click", () => {
            this.showEventDetails(event.id);
        });

        document.getElementById("event-reg-form").addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("reg-name").value;
            const email = document.getElementById("reg-email").value;
            const studentId = document.getElementById("reg-sid").value;

            try {
                // FIREBASE LOGIC: Add to 'event_registrations' collection
                await addDoc(collection(db, "event_registrations"), {
                    eventName: event.title,
                    eventId: event.id,
                    studentName: name,
                    studentEmail: email,
                    studentId: studentId,
                    registeredAt: new Date()
                });
                
                alert(`Successfully registered for ${event.title}!`);
                this.closeModal();
            } catch (error) {
                console.error("Error registering:", error);
                alert("Failed to register. Please try again.");
            }
        });
    }

    // Render the Join Club Form inside the Modal
    renderJoinClubForm(club) {
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = `
             <div class="form-container">
                <h3>Join ${this.escapeHTML(club.name)}</h3>
                <p>Please fill out your details to request membership.</p>
                <form id="club-join-form" style="margin-top:20px; display:flex; flex-direction:column; gap:15px;">
                    <div class="form-group">
                        <label>Your Name</label>
                        <input type="text" id="join-name" required style="width:100%; padding:8px;">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="join-email" required style="width:100%; padding:8px;">
                    </div>
                    <div class="form-group">
                        <label>Interest / Reason to Join</label>
                        <textarea id="join-reason" required rows="3" style="width:100%; padding:8px;"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit Application</button>
                </form>
                <button id="back-to-club" class="btn btn-secondary" style="margin-top:10px;">Back</button>
            </div>
        `;

        document.getElementById("back-to-club").addEventListener("click", () => {
            this.showClubDetails(club.id);
        });

        document.getElementById("club-join-form").addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("join-name").value;
            const email = document.getElementById("join-email").value;
            const reason = document.getElementById("join-reason").value;

            try {
                // FIREBASE LOGIC: Add to 'club_memberships' collection
                await addDoc(collection(db, "club_memberships"), {
                    clubName: club.name,
                    clubId: club.id,
                    studentName: name,
                    studentEmail: email,
                    reason: reason,
                    status: "pending",
                    appliedAt: new Date()
                });

                // Update local UI
                club.members++;
                this.saveData();
                const memberCountBadge = document.querySelector(`.member-count[data-club-id="${club.id}"]`);
                if(memberCountBadge) memberCountBadge.textContent = club.members;

                alert(`Request to join ${club.name} submitted!`);
                this.closeModal();
            } catch (error) {
                console.error("Error joining club:", error);
                alert("Failed to join. Please try again.");
            }
        });
    }

    // ---------------------------------------------------------
    // ADD TO CALENDAR IMPLEMENTATION
    // ---------------------------------------------------------
    addToGoogleCalendar(event) {
        // Parse dates for Google Calendar format (YYYYMMDDTHHMMSSZ)
        // Note: This is a basic implementation. For production, handle timezones strictly.
        const startDate = new Date(event.date + 'T' + event.time);
        const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)); // Assume 2 hour duration

        const formatDate = (date) => {
            return date.toISOString().replace(/-|:|\.\d\d\d/g,"");
        };

        const start = formatDate(startDate);
        const end = formatDate(endDate);
        
        const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
        
        window.open(googleUrl, '_blank');
    }

    // ---------------------------------------------------------
    // UTILITIES & RENDERING HELPERS
    // ---------------------------------------------------------
    openModal() {
        const modal = document.querySelector('.details-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modal = document.querySelector('.details-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    setupEventSearch() {
        const searchInput = document.getElementById('event-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterEvents(e.target.value);
            });
        }
    }

    setupCategoryFilters() {
        const categorySelect = document.getElementById('event-category');
        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                this.filterByCategory(e.target.value);
            });
        }
    }

    filterEvents(searchTerm) {
        if (!searchTerm) {
            this.renderEvents();
            return;
        }
        const filtered = this.events.filter(event => 
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderEvents(filtered);
    }

    filterByCategory(category) {
        if (category === 'all') {
            this.renderEvents();
            return;
        }
        const filtered = this.events.filter(event => 
            event.category === category
        );
        this.renderEvents(filtered);
    }

    renderEvents(events = this.events) {
        const container = document.getElementById('events-container');
        if (!container) return;

        if (events.length === 0) {
            container.innerHTML = `<div class="empty-state"><h3>No Events Found</h3></div>`;
            return;
        }

        container.innerHTML = events.map(event => `
            <article class="event-card ${event.featured ? 'featured' : ''}">
                <div class="card-image">
                    <img src="${event.image}" alt="${this.escapeHTML(event.title)}">
                    ${event.featured ? '<span class="featured-badge">Featured</span>' : ''}
                </div>
                <div class="card-content">
                    <div class="card-meta">
                        <span class="category-tag ${event.category}">${this.escapeHTML(event.category)}</span>
                        <span class="date-time">${event.date} at ${event.time}</span>
                    </div>
                    <h3 class="card-title">${this.escapeHTML(event.title)}</h3>
                    <p class="card-description">${this.escapeHTML(event.description)}</p>
                    <div class="card-footer">
                        <div class="location">${this.escapeHTML(event.location)}</div>
                        <button class="btn btn-primary btn-sm view-details-btn" data-event-id="${event.id}">
                            View Details
                        </button>
                    </div>
                </div>
            </article>
        `).join('');

        container.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.showEventDetails(e.target.dataset.eventId);
            });
        });
    }

    renderClubs() {
        const container = document.getElementById('clubs-container');
        if (!container) return;

        container.innerHTML = this.clubs.map(club => `
            <article class="club-card">
                <div class="card-image">
                    <img src="${club.image}" alt="${this.escapeHTML(club.name)}">
                    <div class="members-badge">
                        <span class="member-count" data-club-id="${club.id}">${club.members}</span>
                    </div>
                </div>
                <div class="card-content">
                    <span class="category-tag ${club.category}">${this.escapeHTML(club.category)}</span>
                    <h3 class="card-title">${this.escapeHTML(club.name)}</h3>
                    <p class="card-description">${this.escapeHTML(club.description)}</p>
                    <div class="card-actions">
                        <button class="btn btn-primary join-btn" data-club-id="${club.id}">
                            Join Club
                        </button>
                        <button class="btn btn-secondary btn-sm view-club-details" data-club-id="${club.id}">
                            Learn More
                        </button>
                    </div>
                </div>
            </article>
        `).join('');

        this.attachClubEventListeners();
    }

    attachClubEventListeners() {
        // Direct "Join" button on card
        document.querySelectorAll('.join-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const club = this.clubs.find(c => c.id === parseInt(e.target.dataset.clubId));
                this.createModal(); // Ensure modal structure exists
                this.openModal();
                this.renderJoinClubForm(club);
            });
        });

        // "Learn More" button
        document.querySelectorAll('.view-club-details').forEach(button => {
            button.addEventListener('click', (e) => {
                this.showClubDetails(e.target.dataset.clubId);
            });
        });
    }

    escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new DataManager();
});