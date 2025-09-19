// Admin Dashboard Script with localStorage Integration
class AdminDashboard {
    constructor() {
        this.currentView = 'overview';
        this.storagePrefix = 'portfolio_';
        this.initializeEventListeners();
        this.loadStoredData();
        this.updateStats();
    }

    initializeEventListeners() {
        // Navigation menu
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const view = item.getAttribute('data-section');
                this.switchView(view);
                
                // Update active nav item
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // User menu toggle
        const userMenuBtn = document.querySelector('.user-menu');
        if (userMenuBtn) {
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const dropdown = document.getElementById('user-dropdown');
                dropdown.classList.toggle('show');
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            const dropdown = document.getElementById('user-dropdown');
            if (dropdown) {
                dropdown.classList.remove('show');
            }
        });

        // Logout button
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }

        // Form submissions
        this.initializeFormHandlers();
        
        // Modal handlers
        this.initializeModalHandlers();
    }

    initializeFormHandlers() {
        // Profile form
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProfile();
            });
        }

        // Skill modal form
        const skillForm = document.getElementById('skill-modal-form');
        if (skillForm) {
            skillForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveSkill();
            });

            // Proficiency slider
            const proficiencySlider = skillForm.querySelector('#skillProficiency');
            if (proficiencySlider) {
                proficiencySlider.addEventListener('input', (e) => {
                    document.getElementById('proficiency-display').textContent = e.target.value + '%';
                });
            }
        }

        // Project modal form
        const projectForm = document.getElementById('project-modal-form');
        if (projectForm) {
            projectForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProject();
            });
        }

        // Experience modal form
        const experienceForm = document.getElementById('experience-modal-form');
        if (experienceForm) {
            experienceForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveExperience();
            });
        }
    }

    initializeModalHandlers() {
        // Close modal buttons
        const closeButtons = document.querySelectorAll('.close-modal');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Close modal on overlay click
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    switchView(view) {
        // Hide all sections
        const sections = document.querySelectorAll('.admin-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(`${view}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        this.currentView = view;

        // Load data for the specific view
        this.loadViewData(view);
    }

    loadViewData(view) {
        switch(view) {
            case 'projects':
                this.loadProjects();
                break;
            case 'skills':
                this.loadSkills();
                break;
            case 'experience':
                this.loadExperience();
                break;
            case 'profile':
                this.loadProfile();
                break;
            case 'messages':
                this.loadMessages();
                break;
        }
    }

    // Data Storage Methods
    saveData(key, data) {
        try {
            localStorage.setItem(this.storagePrefix + key, JSON.stringify(data));
            this.showNotification('Data saved successfully!', 'success');
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            this.showNotification('Error saving data!', 'error');
            return false;
        }
    }

    getData(key) {
        try {
            const data = localStorage.getItem(this.storagePrefix + key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting data:', error);
            return null;
        }
    }

    // Profile Management
    saveProfile() {
        const form = document.getElementById('profile-form');
        const formData = new FormData(form);
        
        const profileData = {
            name: formData.get('fullName'),
            title: formData.get('jobTitle'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            location: formData.get('location'),
            bio: formData.get('bio'),
            github: formData.get('github'),
            linkedin: formData.get('linkedin'),
            twitter: formData.get('twitter'),
            updated_at: new Date().toISOString()
        };

        this.saveData('personal_info', profileData);
        this.updateStats();
    }

    loadProfile() {
        const profileData = this.getData('personal_info');
        if (profileData) {
            const form = document.getElementById('profile-form');
            if (form) {
                form.fullName.value = profileData.name || '';
                form.jobTitle.value = profileData.title || '';
                form.email.value = profileData.email || '';
                form.phone.value = profileData.phone || '';
                form.location.value = profileData.location || '';
                form.bio.value = profileData.bio || '';
                form.github.value = profileData.github || '';
                form.linkedin.value = profileData.linkedin || '';
                form.twitter.value = profileData.twitter || '';
            }
        }
    }

    // Skills Management
    loadSkills() {
        const skills = this.getData('skills') || [];
        const tableBody = document.getElementById('skills-table-body');
        
        if (tableBody) {
            if (skills.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5" class="no-data">No skills added yet.</td></tr>';
            } else {
                tableBody.innerHTML = skills.map(skill => `
                    <tr>
                        <td>${skill.name}</td>
                        <td>${skill.category}</td>
                        <td>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <div style="width: 100px; height: 6px; background: rgba(59, 130, 246, 0.2); border-radius: 3px;">
                                    <div style="width: ${skill.proficiency}%; height: 100%; background: #3b82f6; border-radius: 3px;"></div>
                                </div>
                                <span>${skill.proficiency}%</span>
                            </div>
                        </td>
                        <td><i class="${skill.icon || 'fas fa-cog'}"></i></td>
                        <td>
                            <div class="action-buttons">
                                <button class="action-btn edit" onclick="adminDashboard.editSkill(${skill.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn delete" onclick="adminDashboard.deleteSkill(${skill.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('');
            }
        }
    }

    openSkillModal(skillId = null) {
        const modal = document.getElementById('skill-modal');
        const form = document.getElementById('skill-modal-form');
        const title = document.getElementById('skill-modal-title');

        if (skillId) {
            const skills = this.getData('skills') || [];
            const skill = skills.find(s => s.id === skillId);
            if (skill) {
                title.textContent = 'Edit Skill';
                form.skillId.value = skill.id;
                form.skillName.value = skill.name;
                form.skillCategory.value = skill.category;
                form.skillProficiency.value = skill.proficiency;
                form.skillIcon.value = skill.icon || '';
                form.skillDescription.value = skill.description || '';
                document.getElementById('proficiency-display').textContent = skill.proficiency + '%';
            }
        } else {
            title.textContent = 'Add New Skill';
            form.reset();
            form.skillId.value = '';
            document.getElementById('proficiency-display').textContent = '80%';
        }

        modal.classList.add('show');
    }

    editSkill(skillId) {
        this.openSkillModal(skillId);
    }

    deleteSkill(skillId) {
        if (confirm('Are you sure you want to delete this skill?')) {
            let skills = this.getData('skills') || [];
            skills = skills.filter(s => s.id !== skillId);
            this.saveData('skills', skills);
            this.loadSkills();
            this.updateStats();
        }
    }

    saveSkill() {
        const form = document.getElementById('skill-modal-form');
        const formData = new FormData(form);
        
        const skillData = {
            name: formData.get('skillName'),
            category: formData.get('skillCategory'),
            proficiency: parseInt(formData.get('skillProficiency')),
            icon: formData.get('skillIcon') || 'fas fa-cog',
            description: formData.get('skillDescription')
        };

        const skillId = formData.get('skillId');
        let skills = this.getData('skills') || [];

        if (skillId) {
            // Update existing skill
            const index = skills.findIndex(s => s.id === parseInt(skillId));
            if (index !== -1) {
                skills[index] = { id: parseInt(skillId), ...skillData };
            }
        } else {
            // Add new skill
            const newId = Math.max(...skills.map(s => s.id), 0) + 1;
            skills.push({ id: newId, ...skillData });
        }

        this.saveData('skills', skills);
        this.closeModal('skill-modal');
        this.loadSkills();
        this.updateStats();
    }

    // Projects Management
    loadProjects() {
        const projects = this.getData('projects') || [];
        const container = document.getElementById('projects-container');
        
        if (container) {
            if (projects.length === 0) {
                container.innerHTML = '<p class="no-data">No projects added yet.</p>';
            } else {
                container.innerHTML = projects.map(project => `
                    <div class="project-card-admin">
                        <div class="project-header">
                            <h3 class="project-title">${project.title}</h3>
                            <span class="project-category-tag">${(project.category || '').toUpperCase()}</span>
                        </div>
                        <p class="project-description">${project.description}</p>
                        <div class="project-technologies">
                            ${project.technologies ? project.technologies.split(',').map(tech => `<span class="tech-tag">${tech.trim()}</span>`).join('') : ''}
                        </div>
                        <div class="project-actions">
                            <div class="project-links">
                                ${project.demo_url ? `<a href="${project.demo_url}" target="_blank" class="project-link">Demo</a>` : ''}
                                ${project.github_url ? `<a href="${project.github_url}" target="_blank" class="project-link">GitHub</a>` : ''}
                            </div>
                            <div class="action-buttons">
                                <button class="action-btn edit" onclick="adminDashboard.editProject(${project.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn delete" onclick="adminDashboard.deleteProject(${project.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    openProjectModal(projectId = null) {
        const modal = document.getElementById('project-modal');
        const form = document.getElementById('project-modal-form');
        const title = document.getElementById('project-modal-title');

        if (projectId) {
            const projects = this.getData('projects') || [];
            const project = projects.find(p => p.id === projectId);
            if (project) {
                title.textContent = 'Edit Project';
                form.projectId.value = project.id;
                form.projectTitle.value = project.title;
                form.projectCategory.value = project.category;
                form.projectDescription.value = project.description;
                form.projectImage.value = project.image || '';
                form.projectDemo.value = project.demo_url || '';
                form.projectGithub.value = project.github_url || '';
                form.projectTechnologies.value = project.technologies || '';
            }
        } else {
            title.textContent = 'Add New Project';
            form.reset();
            form.projectId.value = '';
        }

        modal.classList.add('show');
    }

    editProject(projectId) {
        this.openProjectModal(projectId);
    }

    deleteProject(projectId) {
        if (confirm('Are you sure you want to delete this project?')) {
            let projects = this.getData('projects') || [];
            projects = projects.filter(p => p.id !== projectId);
            this.saveData('projects', projects);
            this.loadProjects();
            this.updateStats();
        }
    }

    saveProject() {
        const form = document.getElementById('project-modal-form');
        const formData = new FormData(form);
        
        const projectData = {
            title: formData.get('projectTitle'),
            category: formData.get('projectCategory'),
            description: formData.get('projectDescription'),
            image: formData.get('projectImage'),
            demo_url: formData.get('projectDemo'),
            github_url: formData.get('projectGithub'),
            technologies: formData.get('projectTechnologies'),
            created_at: new Date().toISOString()
        };

        const projectId = formData.get('projectId');
        let projects = this.getData('projects') || [];

        if (projectId) {
            // Update existing project
            const index = projects.findIndex(p => p.id === parseInt(projectId));
            if (index !== -1) {
                projects[index] = { id: parseInt(projectId), ...projectData };
            }
        } else {
            // Add new project
            const newId = Math.max(...projects.map(p => p.id), 0) + 1;
            projects.push({ id: newId, ...projectData });
        }

        this.saveData('projects', projects);
        this.closeModal('project-modal');
        this.loadProjects();
        this.updateStats();
    }

    // Experience Management
    loadExperience() {
        const experiences = this.getData('experience') || [];
        const container = document.getElementById('experience-container');
        
        if (container) {
            if (experiences.length === 0) {
                container.innerHTML = '<p class="no-data">No experience added yet.</p>';
            } else {
                container.innerHTML = experiences.map(exp => `
                    <div class="experience-card-admin">
                        <div class="experience-header">
                            <h3 class="experience-title">${exp.position}</h3>
                            <span class="experience-date">${exp.start_date} - ${exp.end_date || 'Present'}</span>
                        </div>
                        <h4 class="experience-company">${exp.company}</h4>
                        <p class="experience-description">${exp.description}</p>
                        ${exp.technologies ? `<div class="experience-technologies">${exp.technologies.split(',').map(tech => `<span class="tech-tag">${tech.trim()}</span>`).join('')}</div>` : ''}
                        <div class="experience-actions">
                            <button class="action-btn edit" onclick="adminDashboard.editExperience(${exp.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete" onclick="adminDashboard.deleteExperience(${exp.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    openExperienceModal(expId = null) {
        const modal = document.getElementById('experience-modal');
        const form = document.getElementById('experience-modal-form');
        const title = document.getElementById('experience-modal-title');

        if (expId) {
            const experiences = this.getData('experience') || [];
            const exp = experiences.find(e => e.id === expId);
            if (exp) {
                title.textContent = 'Edit Experience';
                form.experienceId.value = exp.id;
                form.experienceTitle.value = exp.position;
                form.experienceCompany.value = exp.company;
                form.experienceDescription.value = exp.description;
                form.experienceStart.value = exp.start_date;
                form.experienceEnd.value = exp.end_date || '';
                form.experienceTechnologies.value = exp.technologies || '';
            }
        } else {
            title.textContent = 'Add New Experience';
            form.reset();
            form.experienceId.value = '';
        }

        modal.classList.add('show');
    }

    editExperience(expId) {
        this.openExperienceModal(expId);
    }

    deleteExperience(expId) {
        if (confirm('Are you sure you want to delete this experience?')) {
            let experiences = this.getData('experience') || [];
            experiences = experiences.filter(e => e.id !== expId);
            this.saveData('experience', experiences);
            this.loadExperience();
            this.updateStats();
        }
    }

    saveExperience() {
        const form = document.getElementById('experience-modal-form');
        const formData = new FormData(form);
        
        const expData = {
            position: formData.get('experienceTitle'),
            company: formData.get('experienceCompany'),
            description: formData.get('experienceDescription'),
            start_date: formData.get('experienceStart'),
            end_date: formData.get('experienceEnd'),
            technologies: formData.get('experienceTechnologies'),
            created_at: new Date().toISOString()
        };

        const expId = formData.get('experienceId');
        let experiences = this.getData('experience') || [];

        if (expId) {
            // Update existing experience
            const index = experiences.findIndex(e => e.id === parseInt(expId));
            if (index !== -1) {
                experiences[index] = { id: parseInt(expId), ...expData };
            }
        } else {
            // Add new experience
            const newId = Math.max(...experiences.map(e => e.id), 0) + 1;
            experiences.push({ id: newId, ...expData });
        }

        this.saveData('experience', experiences);
        this.closeModal('experience-modal');
        this.loadExperience();
        this.updateStats();
    }

    // Messages Management
    loadMessages() {
        const messages = this.getData('messages') || [];
        const container = document.getElementById('messages-container');
        
        if (container) {
            if (messages.length === 0) {
                container.innerHTML = '<p class="no-data">No messages received yet.</p>';
            } else {
                container.innerHTML = messages.map(msg => `
                    <div class="message-card ${msg.read ? 'read' : 'unread'}">
                        <div class="message-header">
                            <h3>${msg.name}</h3>
                            <span class="message-date">${new Date(msg.date).toLocaleDateString()}</span>
                        </div>
                        <p class="message-email">${msg.email}</p>
                        <h4 class="message-subject">${msg.subject}</h4>
                        <p class="message-content">${msg.message}</p>
                        <div class="message-actions">
                            <button class="action-btn ${msg.read ? 'mark-unread' : 'mark-read'}" onclick="adminDashboard.toggleMessageRead(${msg.id})">
                                <i class="fas fa-${msg.read ? 'envelope' : 'envelope-open'}"></i>
                                ${msg.read ? 'Mark Unread' : 'Mark Read'}
                            </button>
                            <button class="action-btn delete" onclick="adminDashboard.deleteMessage(${msg.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    toggleMessageRead(msgId) {
        let messages = this.getData('messages') || [];
        const index = messages.findIndex(m => m.id === msgId);
        if (index !== -1) {
            messages[index].read = !messages[index].read;
            this.saveData('messages', messages);
            this.loadMessages();
            this.updateStats();
        }
    }

    deleteMessage(msgId) {
        if (confirm('Are you sure you want to delete this message?')) {
            let messages = this.getData('messages') || [];
            messages = messages.filter(m => m.id !== msgId);
            this.saveData('messages', messages);
            this.loadMessages();
            this.updateStats();
        }
    }

    // Utility Methods
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
        }
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('admin_logged_in');
            window.location.href = 'login.html';
        }
    }

    exportData() {
        const data = {
            personal_info: this.getData('personal_info'),
            projects: this.getData('projects'),
            skills: this.getData('skills'),
            experience: this.getData('experience'),
            messages: this.getData('messages')
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'portfolio-data.json';
        link.click();
        URL.revokeObjectURL(url);
        this.showNotification('Data exported successfully!', 'success');
    }

    // Load all stored data on initialization
    loadStoredData() {
        this.loadProfile();
        this.loadProjects();
        this.loadSkills();
        this.loadExperience();
        this.loadMessages();
    }

    // Update dashboard statistics
    updateStats() {
        const projects = this.getData('projects') || [];
        const skills = this.getData('skills') || [];
        const experiences = this.getData('experience') || [];
        const messages = this.getData('messages') || [];
        const unreadMessages = messages.filter(m => !m.read);

        // Update stat cards
        const statElements = {
            projects: document.querySelector('.stat-card:nth-child(1) .stat-number'),
            skills: document.querySelector('.stat-card:nth-child(2) .stat-number'),
            experience: document.querySelector('.stat-card:nth-child(3) .stat-number'),
            messages: document.querySelector('.stat-card:nth-child(4) .stat-number')
        };

        if (statElements.projects) statElements.projects.textContent = projects.length;
        if (statElements.skills) statElements.skills.textContent = skills.length;
        if (statElements.experience) statElements.experience.textContent = experiences.length;
        if (statElements.messages) statElements.messages.textContent = unreadMessages.length;
    }

    // Show notification
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

        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Global functions for modal and UI interactions
function openSkillModal() {
    if (window.adminDashboard) {
        window.adminDashboard.openSkillModal();
    }
}

function openProjectModal() {
    if (window.adminDashboard) {
        window.adminDashboard.openProjectModal();
    }
}

function openExperienceModal() {
    if (window.adminDashboard) {
        window.adminDashboard.openExperienceModal();
    }
}

function toggleUserMenu() {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

function exportData() {
    if (window.adminDashboard) {
        window.adminDashboard.exportData();
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (!localStorage.getItem('admin_logged_in')) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize dashboard
    window.adminDashboard = new AdminDashboard();
});
