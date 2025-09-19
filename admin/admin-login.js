// Admin Login JavaScript

// Demo credentials (in a real application, this would be handled server-side)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123',
    email: 'admin@portfolio.com'
};

// Login form elements
const loginForm = document.getElementById('admin-login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const rememberCheckbox = document.getElementById('remember-me');
const loginButton = document.querySelector('.login-btn');
const togglePassword = document.querySelector('.toggle-password');

// Security indicators
const strengthIndicator = document.querySelector('.strength-indicator');
const strengthText = document.querySelector('.strength-text');
const capsLockIndicator = document.querySelector('.caps-lock-indicator');

// Initialize login page
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    checkExistingSession();
    
    // Add event listeners
    setupEventListeners();
    
    // Initialize security features
    initializeSecurity();
    
    // Load remembered credentials if any
    loadRememberedCredentials();
});

function setupEventListeners() {
    // Form submission
    loginForm.addEventListener('submit', handleLogin);
    
    // Password toggle
    togglePassword.addEventListener('click', togglePasswordVisibility);
    
    // Password strength checking
    passwordInput.addEventListener('input', checkPasswordStrength);
    
    // Caps lock detection
    document.addEventListener('keydown', detectCapsLock);
    document.addEventListener('keyup', detectCapsLock);
    
    // Input validation
    usernameInput.addEventListener('input', validateUsername);
    passwordInput.addEventListener('input', validatePassword);
    
    // Enter key submission
    usernameInput.addEventListener('keypress', handleEnterKey);
    passwordInput.addEventListener('keypress', handleEnterKey);
    
    // Icon hiding functionality
    setupIconHiding();
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const remember = rememberCheckbox.checked;
    
    // Validate inputs
    if (!validateInputs(username, password)) {
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    // Simulate authentication delay
    setTimeout(() => {
        if (authenticateUser(username, password)) {
            handleSuccessfulLogin(remember);
        } else {
            handleFailedLogin();
        }
        setLoadingState(false);
    }, 1500);
}

function authenticateUser(username, password) {
    // Simple authentication check (in production, this would be server-side)
    return (username === ADMIN_CREDENTIALS.username || username === ADMIN_CREDENTIALS.email) 
           && password === ADMIN_CREDENTIALS.password;
}

function handleSuccessfulLogin(remember) {
    try {
        // Save session with consistent keys
        sessionStorage.setItem('adminAuthenticated', 'true');
        sessionStorage.setItem('adminLoginTime', Date.now().toString());
        
        // Save credentials if remember is checked
        if (remember) {
            localStorage.setItem('adminRememberMe', 'true');
            localStorage.setItem('adminUsername', usernameInput.value);
        } else {
            localStorage.removeItem('adminRememberMe');
            localStorage.removeItem('adminUsername');
        }
        
        showNotification('Login successful! Redirecting...', 'success');
        
        // Redirect to dashboard with error handling
        setTimeout(() => {
            try {
                window.location.replace('dashboard.html');
            } catch (error) {
                console.error('Error redirecting to dashboard:', error);
                window.location.href = 'dashboard.html';
            }
        }, 1000);
    } catch (error) {
        console.error('Error in successful login handler:', error);
        showNotification('Login successful but there was an error. Please try refreshing.', 'warning');
    }
}

function handleFailedLogin() {
    showNotification('Invalid username or password. Please try again.', 'error');
    
    // Add shake animation to form
    const loginCard = document.querySelector('.login-card');
    loginCard.classList.add('shake');
    setTimeout(() => {
        loginCard.classList.remove('shake');
    }, 500);
    
    // Clear password field
    passwordInput.value = '';
    passwordInput.focus();
    
    // Update security indicator
    updateSecurityIndicator('Invalid credentials', 'error');
}

function validateInputs(username, password) {
    let isValid = true;
    
    if (!username) {
        showFieldError(usernameInput, 'Username is required');
        isValid = false;
    } else {
        clearFieldError(usernameInput);
    }
    
    if (!password) {
        showFieldError(passwordInput, 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showFieldError(passwordInput, 'Password must be at least 6 characters');
        isValid = false;
    } else {
        clearFieldError(passwordInput);
    }
    
    return isValid;
}

function validateUsername() {
    const username = usernameInput.value.trim();
    if (username.length > 0) {
        clearFieldError(usernameInput);
    }
}

function validatePassword() {
    const password = passwordInput.value;
    if (password.length > 0) {
        clearFieldError(passwordInput);
    }
}

function showFieldError(input, message) {
    const inputGroup = input.closest('.input-group');
    inputGroup.classList.add('error');
    
    let errorElement = inputGroup.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        inputGroup.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function clearFieldError(input) {
    const inputGroup = input.closest('.input-group');
    inputGroup.classList.remove('error');
    
    const errorElement = inputGroup.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function togglePasswordVisibility() {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePassword.innerHTML = isPassword ? 
        '<i class="fas fa-eye-slash"></i>' : 
        '<i class="fas fa-eye"></i>';
}

function checkPasswordStrength() {
    const password = passwordInput.value;
    const strength = calculatePasswordStrength(password);
    
    updateStrengthIndicator(strength);
}

function calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 25;
    if (/\d/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 10;
    
    return Math.min(score, 100);
}

function updateStrengthIndicator(strength) {
    const strengthBar = strengthIndicator.querySelector('.strength-bar');
    const strengthFill = strengthBar.querySelector('.strength-fill');
    
    strengthFill.style.width = strength + '%';
    
    if (strength < 30) {
        strengthFill.className = 'strength-fill weak';
        strengthText.textContent = 'Weak';
        strengthText.className = 'strength-text weak';
    } else if (strength < 60) {
        strengthFill.className = 'strength-fill medium';
        strengthText.textContent = 'Medium';
        strengthText.className = 'strength-text medium';
    } else {
        strengthFill.className = 'strength-fill strong';
        strengthText.textContent = 'Strong';
        strengthText.className = 'strength-text strong';
    }
}

function detectCapsLock(e) {
    const capsOn = e.getModifierState && e.getModifierState('CapsLock');
    
    if (capsOn && e.target === passwordInput) {
        capsLockIndicator.style.display = 'block';
    } else {
        capsLockIndicator.style.display = 'none';
    }
}

function handleEnterKey(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        loginForm.requestSubmit();
    }
}

function setLoadingState(loading) {
    loginButton.disabled = loading;
    
    if (loading) {
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        loginButton.classList.add('loading');
    } else {
        loginButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
        loginButton.classList.remove('loading');
    }
}

function checkExistingSession() {
    try {
        const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
        const loginTime = sessionStorage.getItem('adminLoginTime');
        
        if (isAuthenticated && loginTime) {
            const sessionAge = Date.now() - parseInt(loginTime);
            const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours
            
            if (sessionAge < maxSessionAge) {
                // Valid session exists, redirect to dashboard
                showNotification('Session found, redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 500);
                return;
            } else {
                // Session expired, clear it
                sessionStorage.removeItem('adminAuthenticated');
                sessionStorage.removeItem('adminLoginTime');
            }
        }
    } catch (error) {
        console.error('Error checking session:', error);
        // Clear any corrupted session data
        sessionStorage.removeItem('adminAuthenticated');
        sessionStorage.removeItem('adminLoginTime');
    }
}

function loadRememberedCredentials() {
    const rememberMe = localStorage.getItem('adminRememberMe');
    const savedUsername = localStorage.getItem('adminUsername');
    
    if (rememberMe === 'true' && savedUsername) {
        usernameInput.value = savedUsername;
        rememberCheckbox.checked = true;
        passwordInput.focus();
    }
}

function initializeSecurity() {
    // Update security indicator initially
    updateSecurityIndicator('Enter your credentials', 'info');
    
    // Add form security enhancements
    loginForm.setAttribute('autocomplete', 'off');
    
    // Prevent form injection
    const inputs = loginForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('paste', (e) => {
            // Allow paste but sanitize
            setTimeout(() => {
                input.value = input.value.replace(/[<>]/g, '');
            }, 0);
        });
    });
}

function updateSecurityIndicator(message, type) {
    const securityIndicator = document.querySelector('.security-indicator');
    const indicatorText = securityIndicator.querySelector('span');
    const indicatorIcon = securityIndicator.querySelector('i');
    
    indicatorText.textContent = message;
    
    // Update icon and color based on type
    securityIndicator.className = `security-indicator ${type}`;
    
    switch (type) {
        case 'success':
            indicatorIcon.className = 'fas fa-check-circle';
            break;
        case 'error':
            indicatorIcon.className = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            indicatorIcon.className = 'fas fa-exclamation-triangle';
            break;
        default:
            indicatorIcon.className = 'fas fa-info-circle';
    }
}

function setupIconHiding() {
    // Get all input groups
    const inputGroups = document.querySelectorAll('.input-group');
    
    inputGroups.forEach(group => {
        const input = group.querySelector('input');
        const icon = group.querySelector('i:not(.toggle-password i)');
        
        if (input && icon) {
            // Function to toggle icon visibility
            const toggleIcon = () => {
                if (input.value.length > 0) {
                    icon.style.opacity = '0';
                    icon.style.transform = 'translateX(-10px)';
                } else {
                    icon.style.opacity = '1';
                    icon.style.transform = 'translateX(0)';
                }
            };
            
            // Add event listeners
            input.addEventListener('input', toggleIcon);
            input.addEventListener('focus', toggleIcon);
            input.addEventListener('blur', toggleIcon);
            
            // Initial check
            toggleIcon();
        }
    });
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Add CSS for animations and error states
const style = document.createElement('style');
style.textContent = `
    .login-card.shake {
        animation: shake 0.5s;
    }
    
    @keyframes shake {
        0%, 20%, 40%, 60%, 80% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    }
    
    .input-group.error input {
        border-color: #f44336 !important;
        box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1) !important;
    }
    
    .field-error {
        color: #f44336;
        font-size: 0.75rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .field-error::before {
        content: "⚠";
    }
    
    .login-btn.loading {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    .strength-fill.weak {
        background: #f44336;
    }
    
    .strength-fill.medium {
        background: #ff9800;
    }
    
    .strength-fill.strong {
        background: #4caf50;
    }
    
    .strength-text.weak {
        color: #f44336;
    }
    
    .strength-text.medium {
        color: #ff9800;
    }
    
    .strength-text.strong {
        color: #4caf50;
    }
    
    .security-indicator.success {
        color: #4caf50;
    }
    
    .security-indicator.error {
        color: #f44336;
    }
    
    .security-indicator.warning {
        color: #ff9800;
    }
    
    .security-indicator.info {
        color: #3b82f6;
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(26, 26, 46, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(59, 130, 246, 0.2);
        border-radius: 12px;
        padding: 1rem;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        border-color: rgba(76, 175, 80, 0.5);
    }
    
    .notification.error {
        border-color: rgba(244, 67, 54, 0.5);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: #ffffff;
    }
    
    .notification.success i {
        color: #4caf50;
    }
    
    .notification.error i {
        color: #f44336;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.7);
        cursor: pointer;
        margin-left: auto;
        padding: 0.25rem;
        border-radius: 4px;
        transition: all 0.3s ease;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff;
    }
    
    @media (max-width: 768px) {
        .notification {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }
`;
document.head.appendChild(style);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter for quick login
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        loginForm.requestSubmit();
    }
    
    // Escape to clear form
    if (e.key === 'Escape') {
        loginForm.reset();
        usernameInput.focus();
    }
});
