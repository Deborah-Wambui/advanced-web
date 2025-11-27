// Events and Clubs functionality for data.html
class DataManager {
    constructor() {
        this.events = [];
        this.clubs = [];
        this.loadData();
        this.init();
    }

    loadData() {
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
                image: './img/career-fair.jpg',
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
                image: "img/python-workshop.jpg",
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
                image: 'img/computer-science-society.png',
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
                image: 'img/photography-club.webp',
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
                image: "img/basketball-team.jpg",
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
        console.log('DataManager initialized');
        this.createModal();
        this.renderEvents();
        this.renderClubs();
        this.setupEventSearch();
        this.setupCategoryFilters();
    }

    createModal() {
        // Check if modal already exists
        if (document.querySelector('.details-modal')) {
            console.log('Modal already exists');
            return;
        }

        console.log('Creating modal...');
        
        // Create modal element
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

        // Close modal when clicking overlay or close button
        modal.querySelector('.modal-overlay').addEventListener('click', () => this.closeModal());
        modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });

        console.log('Modal created successfully');
    }

    showEventDetails(eventId) {
        console.log('Showing event details for:', eventId);
        const event = this.events.find(e => e.id === parseInt(eventId));
        if (!event) {
            console.error('Event not found:', eventId);
            return;
        }

        const modalBody = document.querySelector('.modal-body');
        if (!modalBody) {
            console.error('Modal body not found');
            return;
        }

        modalBody.innerHTML = `
            <div class="event-details">
                <div class="detail-header">
                    <span class="category-tag ${event.category}">${this.escapeHTML(event.category)}</span>
                    ${event.featured ? '<span class="featured-badge">Featured</span>' : ''}
                </div>
                <h2>${this.escapeHTML(event.title)}</h2>
                <div class="detail-meta">
                    <div class="meta-item">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                            <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                        </svg>
                        <span>${event.date} at ${event.time}</span>
                    </div>
                    <div class="meta-item">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        <span>${this.escapeHTML(event.location)}</span>
                    </div>
                </div>
                <div class="detail-content">
                    <h3>About this Event</h3>
                    <p>${this.escapeHTML(event.fullDescription)}</p>
                    
                    <div class="detail-grid">
                        <div class="detail-item">
                            <strong>Organizer:</strong>
                            <span>${this.escapeHTML(event.organizer)}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Capacity:</strong>
                            <span>${event.capacity} attendees</span>
                        </div>
                        <div class="detail-item">
                            <strong>Requirements:</strong>
                            <span>${this.escapeHTML(event.requirements)}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Contact:</strong>
                            <span>${this.escapeHTML(event.contact)}</span>
                        </div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary">Register for Event</button>
                    <button class="btn btn-secondary">Add to Calendar</button>
                </div>
            </div>
        `;

        this.openModal();
    }

    showClubDetails(clubId) {
        console.log('Showing club details for:', clubId);
        const club = this.clubs.find(c => c.id === parseInt(clubId));
        if (!club) {
            console.error('Club not found:', clubId);
            return;
        }

        const modalBody = document.querySelector('.modal-body');
        if (!modalBody) {
            console.error('Modal body not found');
            return;
        }

        modalBody.innerHTML = `
            <div class="club-details">
                <div class="detail-header">
                    <span class="category-tag ${club.category}">${this.escapeHTML(club.category)}</span>
                    <span class="members-count">${club.members} members</span>
                </div>
                <h2>${this.escapeHTML(club.name)}</h2>
                <div class="detail-meta">
                    <div class="meta-item">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                            <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                        </svg>
                        <span>${club.meetingTime}</span>
                    </div>
                    <div class="meta-item">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                        <span>${club.contact}</span>
                    </div>
                </div>
                <div class="detail-content">
                    <h3>About the Club</h3>
                    <p>${this.escapeHTML(club.fullDescription)}</p>
                    
                    <div class="detail-grid">
                        <div class="detail-item">
                            <strong>Club President:</strong>
                            <span>${this.escapeHTML(club.president)}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Social Media:</strong>
                            <span>${this.escapeHTML(club.socialMedia)}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Upcoming Events:</strong>
                            <span>${this.escapeHTML(club.upcomingEvents)}</span>
                        </div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary join-club-btn" data-club-id="${club.id}">
                        Join Club
                    </button>
                    <button class="btn btn-secondary">Contact Club</button>
                </div>
            </div>
        `;

        // Add event listener for join button in modal
        const joinBtn = modalBody.querySelector('.join-club-btn');
        if (joinBtn) {
            joinBtn.addEventListener('click', () => {
                this.joinClub(club.id);
                this.closeModal();
            });
        }

        this.openModal();
    }

    openModal() {
        console.log('Opening modal');
        const modal = document.querySelector('.details-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            console.error('Modal not found when trying to open');
        }
    }

    closeModal() {
        console.log('Closing modal');
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
    if (!container) {
        console.error('Events container not found');
        return;
    }

    console.log('🔍 DEBUG: Rendering events with images:', events);

    if (events.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No Events Found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }

    container.innerHTML = events.map(event => `
        <article class="event-card ${event.featured ? 'featured' : ''}">
            <div class="card-image">
                <img src="${event.image}" alt="${this.escapeHTML(event.title)}" 
                     onload="console.log('✅ Image loaded:', '${event.title}')"
                     onerror="console.log('❌ Image failed:', '${event.title}', '${event.image}')">
                ${event.featured ? '<span class="featured-badge">Featured</span>' : ''}
                <div class="card-overlay">
                    <button class="btn-icon" aria-label="Save event">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="card-content">
                <div class="card-meta">
                    <span class="category-tag ${event.category}">${this.escapeHTML(event.category)}</span>
                    <span class="date-time">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                            <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                        </svg>
                        ${event.date} at ${event.time}
                    </span>
                </div>
                <h3 class="card-title">${this.escapeHTML(event.title)}</h3>
                <p class="card-description">${this.escapeHTML(event.description)}</p>
                <div class="card-footer">
                    <div class="location">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        ${this.escapeHTML(event.location)}
                    </div>
                    <button class="btn btn-primary btn-sm view-details-btn" data-event-id="${event.id}">
                        View Details
                    </button>
                </div>
            </div>
        </article>
    `).join('');

    // Add event listeners to view details buttons
    container.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            this.showEventDetails(e.target.dataset.eventId);
        });
    });

    console.log('✅ Events rendered');
}

renderClubs() {
    const container = document.getElementById('clubs-container');
    if (!container) {
        console.error('Clubs container not found');
        return;
    }

    console.log('🔍 DEBUG: Rendering clubs with images:', this.clubs);

    container.innerHTML = this.clubs.map(club => `
        <article class="club-card">
            <div class="card-image">
                <img src="${club.image}" alt="${this.escapeHTML(club.name)}"
                     onload="console.log('✅ Club image loaded:', '${club.name}')"
                     onerror="console.log('❌ Club image failed:', '${club.name}', '${club.image}')">
                <div class="members-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                    <span class="member-count" data-club-id="${club.id}">${club.members}</span>
                </div>
            </div>
            <div class="card-content">
                <div class="card-meta">
                    <span class="category-tag ${club.category}">${this.escapeHTML(club.category)}</span>
                </div>
                <h3 class="card-title">${this.escapeHTML(club.name)}</h3>
                <p class="card-description">${this.escapeHTML(club.description)}</p>
                <div class="club-details">
                    <div class="detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                            <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                        </svg>
                        ${club.meetingTime}
                    </div>
                    <div class="detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                        ${club.contact}
                    </div>
                </div>
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
    console.log('✅ Clubs rendered');
}

    attachClubEventListeners() {
        document.querySelectorAll('.join-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.joinClub(e.target.dataset.clubId);
            });
        });

        document.querySelectorAll('.view-club-details').forEach(button => {
            button.addEventListener('click', (e) => {
                this.showClubDetails(e.target.dataset.clubId);
            });
        });
    }

    joinClub(clubId) {
        const club = this.clubs.find(c => c.id === parseInt(clubId));
        if (club) {
            club.members++;
            this.saveData();
            
            const memberCount = document.querySelector(`.member-count[data-club-id="${clubId}"]`);
            if (memberCount) {
                memberCount.textContent = club.members;
            }
            
            this.showNotification(`You've joined ${club.name}! Welcome to the club.`);
        }
    }

    showNotification(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-success);
            color: white;
            padding: 12px 20px;
            border-radius: var(--radius-base);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}

// Initialize when page loads kkkkkkk
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing DataManager...');
    new DataManager();
});