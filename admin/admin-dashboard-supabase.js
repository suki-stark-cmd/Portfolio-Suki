// Supabase Admin Dashboard
import { supabaseService } from '../supabase-config.js';

class SupabaseAdminDashboard {
    constructor() {
        this.supabase = supabaseService;
        this.currentSection = 'personal';
        this.currentEditId = null;
        this.currentEditType = null;
        
        this.initializeDashboard();
        this.setupEventListeners();
        this.loadDashboardData();
    }

    async initializeDashboard() {
        // Check authentication
        const { user } = await this.supabase.getCurrentUser();
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        // Show user info
        this.displayUserInfo(user);
        
        // Setup auth state listener
        this.supabase.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                window.location.href = 'login.html';
            }
        });
    }

    displayUserInfo(user) {
        const userInfoElement = document.querySelector('.user-info');
        if (userInfoElement) {
            userInfoElement.innerHTML = `
                <span class="user-email">${user.email}</span>
                <button class="logout-btn" onclick="adminDashboard.logout()">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            `;
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                this.showSection(section);
            });
        });

        // Modal close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal') || e.target.classList.contains('close-modal')) {
                this.closeModal();
            }
        });

        // Form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('admin-form')) {
                e.preventDefault();
                this.handleFormSubmission(e.target);
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    async loadDashboardData() {
        try {
            await Promise.all([
                this.loadPersonalInfo(),
                this.loadAboutInfo(),
                this.loadProjects(),
                this.loadSkills(),
                this.loadExperience(),
                this.loadMessages()
            ]);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showNotification('Error loading data', 'error');
        }
    }

    showSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-section') === sectionName);
        });

        // Update content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.toggle('active', section.id === `${sectionName}-section`);
        });

        this.currentSection = sectionName;
    }

    // Personal Information Methods
    async loadPersonalInfo() {
        try {
            const result = await this.supabase.getPersonalInfo();
            if (result.success && result.data) {
                this.populatePersonalInfoForm(result.data);
            }
        } catch (error) {
            console.error('Error loading personal info:', error);
        }
    }

    populatePersonalInfoForm(data) {
        const form = document.getElementById('personalInfoForm');
        if (form) {
            Object.keys(data).forEach(key => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input && data[key] !== null) {
                    input.value = data[key];
                }
            });
        }
    }

    async savePersonalInfo(formData) {
        try {
            const data = {
                name: formData.get('name'),
                title: formData.get('title'),
                bio: formData.get('bio'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                location: formData.get('location'),
                github: formData.get('github'),
                linkedin: formData.get('linkedin'),
                twitter: formData.get('twitter')
            };

            const result = await this.supabase.updatePersonalInfo(data);
            if (result.success) {
                this.showNotification('Personal information updated successfully!', 'success');
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error saving personal info:', error);
            this.showNotification('Error updating personal information', 'error');
        }
    }

    // About Information Methods
    async loadAboutInfo() {
        try {
            const result = await this.supabase.getAboutInfo();
            if (result.success && result.data) {
                this.populateAboutInfoForm(result.data);
            }
        } catch (error) {
            console.error('Error loading about info:', error);
        }
    }

    populateAboutInfoForm(data) {
        const form = document.getElementById('aboutInfoForm');
        if (form) {
            // Basic fields
            const descriptionField = form.querySelector('[name="description"]');
            if (descriptionField && data.description) {
                descriptionField.value = data.description;
            }

            // Stats
            if (data.stats) {
                Object.keys(data.stats).forEach(key => {
                    const input = form.querySelector(`[name="stats_${key}"]`);
                    if (input) {
                        input.value = data.stats[key];
                    }
                });
            }

            // Skill categories
            if (data.skill_categories) {
                Object.keys(data.skill_categories).forEach(key => {
                    const titleInput = form.querySelector(`[name="category_${key}_title"]`);
                    const tagsInput = form.querySelector(`[name="category_${key}_tags"]`);
                    
                    if (titleInput && data.skill_categories[key].title) {
                        titleInput.value = data.skill_categories[key].title;
                    }
                    if (tagsInput && data.skill_categories[key].tags) {
                        tagsInput.value = data.skill_categories[key].tags.join(', ');
                    }
                });
            }

            // Resume
            if (data.resume) {
                const resumeLinkInput = form.querySelector('[name="resume_link"]');
                const resumeTextInput = form.querySelector('[name="resume_text"]');
                
                if (resumeLinkInput) resumeLinkInput.value = data.resume.link || '';
                if (resumeTextInput) resumeTextInput.value = data.resume.text || '';
            }
        }
    }

    async saveAboutInfo(formData) {
        try {
            const data = {
                description: formData.get('description'),
                stats: {
                    projects: formData.get('stats_projects'),
                    experience: formData.get('stats_experience'),
                    technologies: formData.get('stats_technologies'),
                    satisfaction: formData.get('stats_satisfaction')
                },
                skill_categories: {
                    ai_ml: {
                        title: formData.get('category_ai_ml_title'),
                        tags: formData.get('category_ai_ml_tags')?.split(',').map(tag => tag.trim()).filter(tag => tag)
                    },
                    programming: {
                        title: formData.get('category_programming_title'),
                        tags: formData.get('category_programming_tags')?.split(',').map(tag => tag.trim()).filter(tag => tag)
                    },
                    web: {
                        title: formData.get('category_web_title'),
                        tags: formData.get('category_web_tags')?.split(',').map(tag => tag.trim()).filter(tag => tag)
                    },
                    cloud: {
                        title: formData.get('category_cloud_title'),
                        tags: formData.get('category_cloud_tags')?.split(',').map(tag => tag.trim()).filter(tag => tag)
                    }
                },
                resume: {
                    link: formData.get('resume_link'),
                    text: formData.get('resume_text')
                }
            };

            const result = await this.supabase.updateAboutInfo(data);
            if (result.success) {
                this.showNotification('About information updated successfully!', 'success');
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error saving about info:', error);
            this.showNotification('Error updating about information', 'error');
        }
    }

    // Projects Methods
    async loadProjects() {
        try {
            const result = await this.supabase.getProjects();
            if (result.success) {
                this.displayProjects(result.data);
            }
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }

    displayProjects(projects) {
        const container = document.getElementById('projectsList');
        if (!container) return;

        container.innerHTML = projects.map(project => `
            <div class="data-item" data-id="${project.id}">
                <div class="item-content">
                    <h3>${project.title}</h3>
                    <p class="item-category">Category: ${project.category}</p>
                    <p class="item-description">${project.description}</p>
                    <p class="item-tech">Tech: ${project.technologies}</p>
                </div>
                <div class="item-actions">
                    <button class="edit-btn" onclick="adminDashboard.editItem('projects', ${project.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="adminDashboard.deleteItem('projects', ${project.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    async saveProject(formData) {
        try {
            const data = {
                title: formData.get('title'),
                description: formData.get('description'),
                category: formData.get('category'),
                technologies: formData.get('technologies'),
                image: formData.get('image'),
                demo_url: formData.get('demo_url'),
                github_url: formData.get('github_url')
            };

            let result;
            if (this.currentEditId) {
                result = await this.supabase.updateProject(this.currentEditId, data);
            } else {
                result = await this.supabase.addProject(data);
            }

            if (result.success) {
                this.showNotification(
                    `Project ${this.currentEditId ? 'updated' : 'added'} successfully!`, 
                    'success'
                );
                this.closeModal();
                this.loadProjects();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error saving project:', error);
            this.showNotification('Error saving project', 'error');
        }
    }

    // Skills Methods
    async loadSkills() {
        try {
            const result = await this.supabase.getSkills();
            if (result.success) {
                this.displaySkills(result.data);
            }
        } catch (error) {
            console.error('Error loading skills:', error);
        }
    }

    displaySkills(skills) {
        const container = document.getElementById('skillsList');
        if (!container) return;

        container.innerHTML = skills.map(skill => `
            <div class="data-item" data-id="${skill.id}">
                <div class="item-content">
                    <h3>${skill.name}</h3>
                    <p class="item-category">Category: ${skill.category}</p>
                    <p class="item-description">${skill.description}</p>
                    <p class="item-proficiency">Proficiency: ${skill.proficiency}%</p>
                </div>
                <div class="item-actions">
                    <button class="edit-btn" onclick="adminDashboard.editItem('skills', ${skill.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="adminDashboard.deleteItem('skills', ${skill.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    async saveSkill(formData) {
        try {
            const data = {
                name: formData.get('name'),
                category: formData.get('category'),
                description: formData.get('description'),
                proficiency: parseInt(formData.get('proficiency')),
                icon: formData.get('icon')
            };

            let result;
            if (this.currentEditId) {
                result = await this.supabase.updateSkill(this.currentEditId, data);
            } else {
                result = await this.supabase.addSkill(data);
            }

            if (result.success) {
                this.showNotification(
                    `Skill ${this.currentEditId ? 'updated' : 'added'} successfully!`, 
                    'success'
                );
                this.closeModal();
                this.loadSkills();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error saving skill:', error);
            this.showNotification('Error saving skill', 'error');
        }
    }

    // Experience Methods
    async loadExperience() {
        try {
            const result = await this.supabase.getExperience();
            if (result.success) {
                this.displayExperience(result.data);
            }
        } catch (error) {
            console.error('Error loading experience:', error);
        }
    }

    displayExperience(experiences) {
        const container = document.getElementById('experienceList');
        if (!container) return;

        container.innerHTML = experiences.map(exp => `
            <div class="data-item" data-id="${exp.id}">
                <div class="item-content">
                    <h3>${exp.position}</h3>
                    <p class="item-company">Company: ${exp.company}</p>
                    <p class="item-period">${exp.start_date} - ${exp.end_date || 'Present'}</p>
                    <p class="item-description">${exp.description}</p>
                </div>
                <div class="item-actions">
                    <button class="edit-btn" onclick="adminDashboard.editItem('experience', ${exp.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="adminDashboard.deleteItem('experience', ${exp.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    async saveExperience(formData) {
        try {
            const data = {
                position: formData.get('position'),
                company: formData.get('company'),
                start_date: formData.get('start_date'),
                end_date: formData.get('end_date') || null,
                description: formData.get('description'),
                technologies: formData.get('technologies'),
                location: formData.get('location')
            };

            let result;
            if (this.currentEditId) {
                result = await this.supabase.updateExperience(this.currentEditId, data);
            } else {
                result = await this.supabase.addExperience(data);
            }

            if (result.success) {
                this.showNotification(
                    `Experience ${this.currentEditId ? 'updated' : 'added'} successfully!`, 
                    'success'
                );
                this.closeModal();
                this.loadExperience();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error saving experience:', error);
            this.showNotification('Error saving experience', 'error');
        }
    }

    // Messages Methods
    async loadMessages() {
        try {
            const result = await this.supabase.getMessages();
            if (result.success) {
                this.displayMessages(result.data);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }

    displayMessages(messages) {
        const container = document.getElementById('messagesList');
        if (!container) return;

        container.innerHTML = messages.map(message => `
            <div class="message-item ${message.read ? 'read' : 'unread'}" data-id="${message.id}">
                <div class="message-header">
                    <h3>${message.name}</h3>
                    <span class="message-email">${message.email}</span>
                    <span class="message-date">${new Date(message.created_at).toLocaleDateString()}</span>
                </div>
                <div class="message-content">
                    <h4>${message.subject}</h4>
                    <p>${message.message}</p>
                </div>
                <div class="message-actions">
                    <button class="mark-read-btn" onclick="adminDashboard.toggleMessageRead(${message.id}, ${!message.read})">
                        <i class="fas fa-${message.read ? 'envelope' : 'envelope-open'}"></i>
                        ${message.read ? 'Mark Unread' : 'Mark Read'}
                    </button>
                    <button class="delete-btn" onclick="adminDashboard.deleteItem('messages', ${message.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    async toggleMessageRead(id, read) {
        try {
            const result = await this.supabase.updateMessage(id, { read });
            if (result.success) {
                this.loadMessages();
                this.showNotification(`Message marked as ${read ? 'read' : 'unread'}`, 'success');
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error updating message:', error);
            this.showNotification('Error updating message', 'error');
        }
    }

    // Generic Methods
    async handleFormSubmission(form) {
        const formData = new FormData(form);
        const formId = form.id;

        switch (formId) {
            case 'personalInfoForm':
                await this.savePersonalInfo(formData);
                break;
            case 'aboutInfoForm':
                await this.saveAboutInfo(formData);
                break;
            case 'projectForm':
                await this.saveProject(formData);
                break;
            case 'skillForm':
                await this.saveSkill(formData);
                break;
            case 'experienceForm':
                await this.saveExperience(formData);
                break;
        }
    }

    async editItem(type, id) {
        this.currentEditId = id;
        this.currentEditType = type;
        
        // Get item data and populate form
        let result;
        switch (type) {
            case 'projects':
                result = await this.supabase.getRecord('projects', id);
                break;
            case 'skills':
                result = await this.supabase.getRecord('skills', id);
                break;
            case 'experience':
                result = await this.supabase.getRecord('experience', id);
                break;
        }

        if (result.success && result.data) {
            this.showModal(type, result.data);
        }
    }

    async deleteItem(type, id) {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            let result;
            switch (type) {
                case 'projects':
                    result = await this.supabase.deleteProject(id);
                    break;
                case 'skills':
                    result = await this.supabase.deleteSkill(id);
                    break;
                case 'experience':
                    result = await this.supabase.deleteExperience(id);
                    break;
                case 'messages':
                    result = await this.supabase.deleteMessage(id);
                    break;
            }

            if (result.success) {
                this.showNotification('Item deleted successfully!', 'success');
                // Reload the appropriate section
                switch (type) {
                    case 'projects':
                        this.loadProjects();
                        break;
                    case 'skills':
                        this.loadSkills();
                        break;
                    case 'experience':
                        this.loadExperience();
                        break;
                    case 'messages':
                        this.loadMessages();
                        break;
                }
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            this.showNotification('Error deleting item', 'error');
        }
    }

    showModal(type, data = {}) {
        const modal = document.getElementById(`${type}Modal`);
        if (modal) {
            // Populate form with data if editing
            if (Object.keys(data).length > 0) {
                const form = modal.querySelector('form');
                if (form) {
                    Object.keys(data).forEach(key => {
                        const input = form.querySelector(`[name="${key}"]`);
                        if (input && data[key] !== null) {
                            input.value = data[key];
                        }
                    });
                }
            }
            modal.style.display = 'flex';
        }
    }

    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
            const form = modal.querySelector('form');
            if (form) form.reset();
        });
        this.currentEditId = null;
        this.currentEditType = null;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    async logout() {
        try {
            await this.supabase.signOut();
            // Redirect will be handled by auth state change
        } catch (error) {
            console.error('Logout error:', error);
            this.showNotification('Error logging out', 'error');
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminDashboard = new SupabaseAdminDashboard();
});