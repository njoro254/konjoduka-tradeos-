// Initialize Lucide icons
lucide.createIcons();

// Popup Management
const overlay = document.getElementById('popup-overlay');

function openPopup(popupId) {
    overlay.style.display = 'block';
    document.getElementById(popupId).style.display = 'block';
}

function closePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
    if (!anyPopupOpen()) {
        overlay.style.display = 'none';
    }
}

function openNestedPopup(newPopupId, oldPopupId) {
    document.getElementById(oldPopupId).style.display = 'none';
    document.getElementById(newPopupId).style.display = 'block';
}

function anyPopupOpen() {
    return Array.from(document.querySelectorAll('.popup')).some(p => p.style.display === 'block');
}

overlay.onclick = () => {
    document.querySelectorAll('.popup').forEach(p => p.style.display = 'none');
    overlay.style.display = 'none';
};

// Mobile Menu Toggle
function toggleMobileMenu() {
    alert('Mobile menu functionality would be implemented here for small screens.');
}

// Authentication Handlers (Mockup for UI demo)
document.getElementById('login-form').onsubmit = (e) => {
    e.preventDefault();
    alert('Login API call would happen here using RSA JWT logic.');
    closePopup('login-popup');
};

document.getElementById('register-form').onsubmit = (e) => {
    e.preventDefault();
    alert('Registration API call would happen here.');
    closePopup('register-popup');
};

// Scroll Effects
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.main-nav');
    if (window.scrollY > 50) {
        nav.style.padding = '0.5rem 2rem';
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
    } else {
        nav.style.padding = '1rem 2rem';
        nav.style.background = 'white';
    }
});