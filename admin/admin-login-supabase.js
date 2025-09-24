// Supabase Admin Authentication
import { supabaseService } from '../supabase-config.js';

class SupabaseAdminAuth {
    constructor() {
        this.supabase = supabaseService;
        this.initializeAuth();
        this.checkExistingSession();
    }

    initializeAuth() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }

        // Listen for auth state changes
        this.supabase.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                this.redirectToDashboard();
            } else if (event === 'SIGNED_OUT') {
                this.showLoginForm();
            }
        });
    }

    async checkExistingSession() {
        try {
            const { user } = await this.supabase.getCurrentUser();
            if (user) {
                this.redirectToDashboard();
            }
        } catch (error) {
            console.log('No existing session found');
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitBtn = document.querySelector('.login-btn');
        const errorDiv = document.querySelector('.error-message');
        
        // Clear previous errors
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';

        try {
            const result = await this.supabase.signIn(email, password);
            
            if (result.success) {
                // Success - redirect will be handled by auth state change
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
                submitBtn.classList.add('success');
            } else {
                throw new Error(result.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            
            // Show error message
            if (errorDiv) {
                errorDiv.textContent = this.getErrorMessage(error.message);
                errorDiv.style.display = 'block';
            }
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
            submitBtn.classList.remove('success');
        }
    }

    getErrorMessage(error) {
        if (error.includes('Invalid login credentials')) {
            return 'Invalid email or password. Please check your credentials.';
        } else if (error.includes('Email not confirmed')) {
            return 'Please confirm your email address before signing in.';
        } else if (error.includes('Too many requests')) {
            return 'Too many login attempts. Please wait a moment and try again.';
        } else {
            return 'Login failed. Please check your credentials and try again.';
        }
    }

    redirectToDashboard() {
        // Add smooth transition effect
        document.body.style.opacity = '0';
        document.body.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 300);
    }

    showLoginForm() {
        // Reset form if user is signed out
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.reset();
        }
        
        const submitBtn = document.querySelector('.login-btn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
            submitBtn.classList.remove('success');
        }
    }

    // Utility method to test Supabase connection
    async testConnection() {
        try {
            const result = await this.supabase.testConnection();
            console.log('Supabase connection test:', result);
            return result.success;
        } catch (error) {
            console.error('Supabase connection failed:', error);
            return false;
        }
    }
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminAuth = new SupabaseAdminAuth();
    
    // Test connection on load
    window.adminAuth.testConnection().then(connected => {
        if (!connected) {
            console.warn('Supabase connection issue detected');
            
            // Show connection warning
            const warningDiv = document.createElement('div');
            warningDiv.className = 'connection-warning';
            warningDiv.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                Connection issue detected. Please check your Supabase configuration.
            `;
            
            const container = document.querySelector('.login-container');
            if (container) {
                container.insertBefore(warningDiv, container.firstChild);
            }
        }
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.dispatchEvent(new Event('submit'));
            }
        }
    });
});

// Add CSS for connection warning
const style = document.createElement('style');
style.textContent = `
    .connection-warning {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #ef4444;
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.9rem;
    }
    
    .login-btn.success {
        background: linear-gradient(135deg, #22c55e, #16a34a);
        border-color: #22c55e;
    }
    
    .login-btn .fa-spinner {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);