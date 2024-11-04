// JavaScript Code for Earncash Application

// User Data Storage (In-memory for demo purposes)
const users = {};
let currentUser = null;
let userEarnings = 0;
let referralEarnings = 0;

// Track withdrawals
const withdrawalHistory = [];

// Function to toggle visibility of different sections
function showSection(sectionId) {
    const sections = [
        'registration', 'login', 'forgot-password', 'main',
        'profile', 'referral', 'earnings-section', 'withdrawal',
        'customer-care', 'settings', 'about-us'
    ];
    sections.forEach(section => {
        document.getElementById(section).style.display = (section === sectionId) ? 'block' : 'none';
    });
}

// Event Listeners for navigation
document.getElementById('to-login').addEventListener('click', () => showSection('login'));
document.getElementById('to-register').addEventListener('click', () => showSection('registration'));
document.getElementById('forgot-password-link').addEventListener('click', () => showSection('forgot-password'));
document.getElementById('back-to-login').addEventListener('click', () => showSection('login'));
document.getElementById('back-to-main-profile').addEventListener('click', () => showSection('main'));
document.getElementById('back-to-main-referral').addEventListener('click', () => showSection('main'));
document.getElementById('back-to-main-earnings').addEventListener('click', () => showSection('main'));
document.getElementById('back-to-main-withdrawal').addEventListener('click', () => showSection('main'));
document.getElementById('back-to-main-customer-care').addEventListener('click', () => showSection('main'));
document.getElementById('back-to-main-settings').addEventListener('click', () => showSection('main'));
document.getElementById('back-to-main-about').addEventListener('click', () => showSection('main'));

// Logout Event Listener
document.getElementById('logout-button').addEventListener('click', () => {
    currentUser = null;
    userEarnings = 0;
    showSection('login');
});

// Register Event Listener
document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = this[0].value.trim();
    const email = this[1].value.trim();
    const password = this[2].value.trim();

    if (users[email] || Object.values(users).some(user => user.username === username)) {
        alert("User already registered with this email or username.");
        return;
    }
    
    if (!validateEmail(email)) {
        alert("Invalid email address.");
        return;
    }

    // Register User
    const userId = generateUniqueUserId();
    users[email] = { username, email, password, earnings: 0, referralLink: generateReferralLink(email), referrals: [], userId };
    alert("Registration successful! You can now login.");
    showSection('login');
});

// Login Event Listener
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this[0].value.trim();
    const password = this[1].value.trim();

    if (!users[email]) {
        alert("Email not registered.");
        return;
    }

    if (users[email].password !== password) {
        alert("Incorrect password.");
        return;
    }

    // Set current user and show main dashboard
    currentUser = users[email];
    userEarnings = currentUser.earnings;
    showDashboard();
});

// Show dashboard after login
function showDashboard() {
    document.getElementById('earnings-amount').textContent = `$${userEarnings.toFixed(3)}`;
    document.getElementById('profile-username').textContent = currentUser.username;
    document.getElementById('profile-email').textContent = currentUser.email;
    document.getElementById('profile-id').textContent = currentUser.userId;
    showSection('main');
}

// Generate a unique user ID (6-number random string)
function generateUniqueUserId() {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Validate email format
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Toggle menu visibility
function toggleMenu() {
    const menu = document.getElementById('dropdown-menu');
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

// Watch Video Event Listener
document.getElementById('watch-video').addEventListener('click', () => {
    userEarnings += 0.005;
    currentUser.earnings += 0.005; // Update user's earnings
    document.getElementById('video-earnings').textContent = `$${(currentUser.earnings).toFixed(3)} earned from videos.`;
    document.getElementById('earnings-amount').textContent = `$${(userEarnings).toFixed(3)}`;
});

// Referral Section
document.getElementById('copy-referral').addEventListener('click', function() {
    const referralLink = currentUser.referralLink;
    const input = document.getElementById('referral-link-input');
    input.value = referralLink;
    input.select();
    document.execCommand('copy');
    alert("Referral link copied to clipboard! You earn 5% on your referral's earnings for life.");
});

// Simulate referral earnings
function trackReferral(email) {
    if (users[email]) {
        referralEarnings += 0.005; // Example of referral earning
        users[email].earnings += 0.005 * 0.05; // 5% referral commission
        alert(`You earned a referral commission of $${(0.005 * 0.05).toFixed(3)} from ${email}.`);
    }
}

// Withdrawal Event Listener
document.getElementById('submit-withdrawal').addEventListener('click', function() {
    const amount = parseFloat(document.getElementById('withdrawal-amount').value);
    const method = document.getElementById('withdrawal-method').value;
    const address = document.getElementById('withdrawal-address').value.trim();

    if (amount < 3.00) {
        alert("Minimum withdrawal amount is $3.00.");
        return;
    }

    if (amount > userEarnings) {
        alert("Insufficient balance.");
        return;
    }

    // Process withdrawal
    userEarnings -= amount;
    currentUser.earnings -= amount; // Update user's balance
    document.getElementById('earnings-amount').textContent = `$${(userEarnings).toFixed(3)}`;

   // Add to withdrawal history
    withdrawalHistory.push({ amount, method, address, status: 'Pending' });
    updateWithdrawalHistory();

    alert(`Withdrawal of $${amount.toFixed(2)} using ${method} to ${address} submitted!`);
});

// Update withdrawal history display
function updateWithdrawalHistory() {
    const historyContainer = document.getElementById('withdrawal-history-list');
    historyContainer.innerHTML = ''; // Clear existing entries

    withdrawalHistory.forEach((withdrawal) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Withdrawal of $${withdrawal.amount.toFixed(2)} via ${withdrawal.method} to ${withdrawal.address} - Status: ${withdrawal.status}`;
        historyContainer.appendChild(listItem);
    });
}

// Reset Password
document.getElementById('forgot-password-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this[0].value.trim();

    if (!users[email]) {
        alert("Email not registered.");
        return;
    }

    alert("Reset link sent to your email!");
    showSection('login');
});

// Settings Form Submission
document.getElementById('settings-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert("Settings saved successfully!");
});

// Utility function to generate referral link
function generateReferralLink(username) {
    return `https://earncash.com/referral?ref=${btoa(username)}`; // Ensure this is a valid URL format
}

// Initial setup
showSection('registration');

// Menu Section Navigation
document.getElementById('profile-link').addEventListener('click', () => showSection('profile'));
document.getElementById('earnings-link').addEventListener('click', () => showSection('earnings-section'));
document.getElementById('referral-link').addEventListener('click', () => showSection('referral'));
document.getElementById('withdrawal-link').addEventListener('click', () => showSection('withdrawal'));
document.getElementById('customer-care-link').addEventListener('click', () => showSection('customer-care'));
document.getElementById('settings-link').addEventListener('click', () => showSection('settings'));
document.getElementById('about-us-link').addEventListener('click', () => showSection('about-us'));

// Sample referral tracking (This would be triggered appropriately in real use)
trackReferral('example@example.com'); // Example call to simulate a referral
