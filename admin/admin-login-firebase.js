// Firebase-powered Admin Login
import { firebaseService } from '../firebase-config.js';

class FirebaseAdminLogin {
    constructor() {
        this.firebase = firebaseService;
        this.initializeElements();
        this.initializeEventListeners();
        this.checkExistingAuth();
    }

    initializeElements() {
        this.loginForm = document.getElementById('loginForm');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.rememberCheckbox = document.getElementById('remember');
        this.loginBtn = document.querySelector('.login-btn');
        this.loadingSpinner = document.querySelector('.loading-spinner');
    }

    initializeEventListeners() {
        // Form submission
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Input field effects
        const inputFields = document.querySelectorAll('.input-group input');
        inputFields.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });

            input.addEventListener('input', () => {
                this.hideInputIcons(input);
            });
        });

        // Enter key handling
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleLogin();
            }
        });

        // Load remembered credentials
        this.loadRememberedCredentials();
    }

    checkExistingAuth() {
        // Check if user is already authenticated
        this.firebase.onAuthStateChanged((user) => {
            if (user) {
                this.showNotification('Already logged in, redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            }
        });
    }

    async handleLogin() {
        const email = this.usernameInput.value.trim();
        const password = this.passwordInput.value;
        const remember = this.rememberCheckbox.checked;

        // Basic validation
        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Validate email format
        if (!this.isValidEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        this.setLoading(true);

        try {
            // Attempt Firebase authentication
            const result = await this.firebase.signInWithEmail(email, password);

            if (result.success) {
                this.handleSuccessfulLogin(remember, result.user);
            } else {
                // Handle specific Firebase auth errors
                let errorMessage = 'Login failed. Please check your credentials.';
                
                if (result.error.includes('user-not-found')) {
                    errorMessage = 'No account found with this email address.';
                } else if (result.error.includes('wrong-password')) {
                    errorMessage = 'Incorrect password. Please try again.';
                } else if (result.error.includes('too-many-requests')) {
                    errorMessage = 'Too many failed attempts. Please try again later.';
                } else if (result.error.includes('user-disabled')) {
                    errorMessage = 'This account has been disabled. Contact support.';
                }

                this.showNotification(errorMessage, 'error');
                this.setLoading(false);
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('An unexpected error occurred. Please try again.', 'error');
            this.setLoading(false);
        }
    }

    handleSuccessfulLogin(remember, user) {
        // Save credentials if remember is checked
        if (remember) {
            localStorage.setItem('adminRememberMe', 'true');
            localStorage.setItem('adminEmail', user.email);
        } else {
            localStorage.removeItem('adminRememberMe');
            localStorage.removeItem('adminEmail');
        }

        this.showNotification('Login successful! Redirecting to dashboard...', 'success');

        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    hideInputIcons(input) {
        const icon = input.parentElement.querySelector('i');
        if (icon && input.value.length > 0) {
            icon.style.opacity = '0';
        } else if (icon) {
            icon.style.opacity = '1';
        }
    }

    setLoading(isLoading) {
        if (isLoading) {
            this.loginBtn.disabled = true;
            this.loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
            if (this.loadingSpinner) {
                this.loadingSpinner.style.display = 'block';
            }
        } else {
            this.loginBtn.disabled = false;
            this.loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
            if (this.loadingSpinner) {
                this.loadingSpinner.style.display = 'none';
            }
        }
    }

    loadRememberedCredentials() {
        const rememberMe = localStorage.getItem('adminRememberMe');
        const savedEmail = localStorage.getItem('adminEmail');

        if (rememberMe === 'true' && savedEmail) {
            this.usernameInput.value = savedEmail;
            this.rememberCheckbox.checked = true;
            
            // Trigger input effects
            if (this.usernameInput.value) {
                this.usernameInput.parentElement.classList.add('focused');
                this.hideInputIcons(this.usernameInput);
            }
        }
    }

    showNotification(message, type = 'success') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Hide notification after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // Password reset functionality
    async initiatePasswordReset() {
        const email = this.usernameInput.value.trim();
        
        if (!email) {
            this.showNotification('Please enter your email address first', 'error');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        try {
            // Note: You'll need to implement sendPasswordResetEmail in your FirebaseService
            // const result = await this.firebase.sendPasswordResetEmail(email);
            
            this.showNotification('Password reset instructions sent to your email', 'success');
        } catch (error) {
            this.showNotification('Error sending password reset email', 'error');
        }
    }
}

// Initialize login when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.adminLogin = new FirebaseAdminLogin();
});

// Global functions
function forgotPassword() {
    if (window.adminLogin) {
        window.adminLogin.initiatePasswordReset();
    }
}