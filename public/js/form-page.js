// Bookings and Help Desk functionality for form.html
class FormManager {
    constructor() {
        this.bookings = [];
        this.tickets = [];
        this.loadData();
        this.init();
    }

    loadData() {
        const savedData = localStorage.getItem('campusForms');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.bookings = data.bookings || [];
            this.tickets = data.tickets || [];
        }
    }

    saveData() {
        const data = {
            bookings: this.bookings,
            tickets: this.tickets
        };
        localStorage.setItem('campusForms', JSON.stringify(data));
    }

    init() {
        this.setupBookingForm();
        this.setupTicketForm();
        this.renderBookings();
        this.renderTickets();
        
        // Set minimum date to today
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }
    }

    setupBookingForm() {
        const form = document.getElementById('booking-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleBookingSubmit(e);
            });
        }
    }

    setupTicketForm() {
        const form = document.getElementById('ticket-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleTicketSubmit(e);
            });
        }
    }

    handleBookingSubmit(e) {
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const room = formData.get('room');
        const date = formData.get('date');
        const time = formData.get('time');
        const purpose = formData.get('purpose');

        if (!name || !room || !date || !time) {
            alert('Please fill in all required fields');
            return;
        }

        const booking = {
            id: Date.now(),
            name: name,
            room: room,
            date: date,
            time: time,
            purpose: purpose || 'No purpose specified',
            createdAt: new Date().toISOString()
        };

        this.bookings.unshift(booking); // Add to beginning for newest first
        this.saveData();
        this.renderBookings();
        e.target.reset();
        
        // Show success message
        this.showNotification('Room booked successfully!', 'success');
    }

    handleTicketSubmit(e) {
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const priority = formData.get('priority');
        const issue = formData.get('issue');

        if (!name || !email || !subject || !priority || !issue) {
            alert('Please fill in all required fields');
            return;
        }

        const ticket = {
            id: Date.now(),
            name: name,
            email: email,
            subject: subject,
            priority: priority,
            issue: issue,
            status: 'pending',
            createdAt: new Date().toISOString(),
            position: this.tickets.filter(t => t.status === 'pending').length + 1
        };

        this.tickets.unshift(ticket); // Add to beginning for newest first
        this.saveData();
        this.renderTickets();
        e.target.reset();
        
        // Show success message with position
        this.showNotification(`Ticket submitted successfully! Your position in queue: ${ticket.position}`, 'success');
    }

    renderBookings() {
        const container = document.getElementById('bookings-list');
        if (!container) return;

        if (this.bookings.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No bookings yet. Book your first study room!</p></div>';
            return;
        }

        container.innerHTML = this.bookings.map(booking => `
            <div class="booking-item">
                <h4>${this.escapeHTML(booking.room)}</h4>
                <p><strong>Booked by:</strong> ${this.escapeHTML(booking.name)}</p>
                <p><strong>Date:</strong> ${this.formatDate(booking.date)}</p>
                <p><strong>Time:</strong> ${this.formatTime(booking.time)}</p>
                ${booking.purpose ? `<p><strong>Purpose:</strong> ${this.escapeHTML(booking.purpose)}</p>` : ''}
                <small>Booked: ${new Date(booking.createdAt).toLocaleDateString()}</small>
                <button class="cancel-btn" data-booking-id="${booking.id}">Cancel Booking</button>
            </div>
        `).join('');

        // Add event listeners to cancel buttons
        container.querySelectorAll('.cancel-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                if (confirm('Are you sure you want to cancel this booking?')) {
                    this.cancelBooking(e.target.dataset.bookingId);
                }
            });
        });
    }

    renderTickets() {
        const container = document.getElementById('queue-status');
        if (!container) return;

        // Show all tickets, not just pending ones
        const userTickets = this.tickets;

        if (userTickets.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No tickets submitted yet. Submit your first ticket if you need help!</p></div>';
            return;
        }

        container.innerHTML = userTickets.map(ticket => `
            <div class="ticket-item">
                <div class="ticket-status status-${ticket.status.toLowerCase().replace(' ', '-')}">
                    ${ticket.status}
                </div>
                <h4>${this.escapeHTML(ticket.subject)}</h4>
                <p><strong>Priority:</strong> ${ticket.priority}</p>
                <p>${this.escapeHTML(ticket.issue)}</p>
                ${ticket.status === 'pending' ? `<p><strong>Position in queue:</strong> ${ticket.position}</p>` : ''}
                <small>Submitted: ${new Date(ticket.createdAt).toLocaleString()}</small>
            </div>
        `).join('');
    }

    cancelBooking(bookingId) {
        this.bookings = this.bookings.filter(b => b.id !== parseInt(bookingId));
        this.saveData();
        this.renderBookings();
        this.showNotification('Booking cancelled successfully', 'info');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    }

    showNotification(message, type = 'info') {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? 'var(--color-success)' : type === 'error' ? 'var(--color-error)' : 'var(--color-info)'};
            color: white;
            border-radius: var(--radius-base);
            box-shadow: var(--shadow-lg);
            z-index: var(--z-modal);
            font-weight: var(--font-weight-medium);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new FormManager();
});