// Main JavaScript for the Pizza App

// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const userMenu = document.getElementById('userMenu');

// Toggle mobile menu
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar') && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
    }
});

// Update user menu based on login status
function updateUserMenu() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (userMenu) {
        if (currentUser) {
            userMenu.innerHTML = `
                <span class="user-greeting">Hi, ${currentUser.name}</span>
                <a href="order.html" class="btn btn-outline">Order Now</a>
                <button class="btn btn-primary" id="logoutBtn">Logout</button>
            `;
            
            // Update nav menu to show user is logged in
            const navAuth = document.querySelector('.nav-auth');
            if (navAuth) {
                navAuth.style.display = 'none';
            }
            
            // Add logout functionality
            document.getElementById('logoutBtn').addEventListener('click', logout);
        } else {
            userMenu.innerHTML = '';
            
            // Show auth buttons in nav menu
            const navAuth = document.querySelector('.nav-auth');
            if (navAuth) {
                navAuth.style.display = 'flex';
            }
        }
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    updateUserMenu();
    
    // Redirect to home page if not already there
    if (!window.location.pathname.includes('index.html') && 
        !window.location.pathname.endsWith('/')) {
        window.location.href = 'index.html';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateUserMenu();
    
    // Add active class to current page in navigation
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});