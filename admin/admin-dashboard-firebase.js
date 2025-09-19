// Firebase-powered Admin Dashboard
import { firebaseService } from '../firebase-config.js';

class FirebaseAdminDashboard {
    constructor() {
        this.currentView = 'dashboard';
        this.firebase = firebaseService;
        this.collections = {
            personalInfo: 'personalInfo',
            projects: 'projects',
            skills: 'skills',
            experience: 'experience',
            aboutInfo: 'aboutInfo',
            messages: 'messages'
        };
        
        this.initializeEventListeners();
        this.setupAuthListener();
        this.loadInitialData();
    }

    // Authentication state listener
    setupAuthListener() {
        this.firebase.onAuthStateChanged((user) => {
            if (user) {
                console.log('User authenticated:', user.email);
                this.loadInitialData();
                this.updateStats();
            } else {
                console.log('User not authenticated');
                window.location.href = 'login.html';
            }
        });
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

        // Form submissions
        this.initializeFormHandlers();
        
        // Modal handlers
        this.initializeModalHandlers();
    }

    initializeFormHandlers() {
        // Profile form
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.saveProfile();
            });
        }

        // About form
        const aboutForm = document.getElementById('about-form');
        if (aboutForm) {
            aboutForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.saveAboutInfo();
            });
        }

        // Skill modal form
        const skillForm = document.getElementById('skill-modal-form');
        if (skillForm) {
            skillForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.saveSkill();
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
            projectForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.saveProject();
            });
        }

        // Experience modal form
        const experienceForm = document.getElementById('experience-modal-form');
        if (experienceForm) {
            experienceForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.saveExperience();
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

    async loadViewData(view) {
        try {
            switch(view) {
                case 'dashboard':
                    await this.updateStats();
                    break;
                case 'profile':
                    await this.loadProfile();
                    break;
                case 'about':
                    await this.loadAboutInfo();
                    break;
                case 'projects':
                    await this.loadProjects();
                    break;
                case 'skills':
                    await this.loadSkills();
                    break;
                case 'experience':
                    await this.loadExperience();
                    break;
                case 'messages':
                    await this.loadMessages();
                    break;
            }
        } catch (error) {
            console.error('Error loading view data:', error);
            this.showNotification('Error loading data: ' + error.message, 'error');
        }
    }

    // Profile Management
    async saveProfile() {
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
            twitter: formData.get('twitter')
        };

        const result = await this.firebase.setDocument(this.collections.personalInfo, 'main', profileData);
        
        if (result.success) {
            this.showNotification('Profile saved successfully!', 'success');
        } else {
            this.showNotification('Error saving profile: ' + result.error, 'error');
        }
    }

    async loadProfile() {
        const result = await this.firebase.getDocument(this.collections.personalInfo, 'main');
        
        if (result.success && result.data) {
            const form = document.getElementById('profile-form');
            if (form) {
                const data = result.data;
                if (form.fullName) form.fullName.value = data.name || '';
                if (form.jobTitle) form.jobTitle.value = data.title || '';
                if (form.email) form.email.value = data.email || '';
                if (form.phone) form.phone.value = data.phone || '';
                if (form.location) form.location.value = data.location || '';
                if (form.bio) form.bio.value = data.bio || '';
                if (form.github) form.github.value = data.github || '';
                if (form.linkedin) form.linkedin.value = data.linkedin || '';
                if (form.twitter) form.twitter.value = data.twitter || '';
            }
        }
    }

    // About Info Management
    async saveAboutInfo() {
        const form = document.getElementById('about-form');
        const formData = new FormData(form);
        
        const aboutInfo = {
            description: formData.get('description'),
            stats: {
                projects: formData.get('projects_count') + '+',
                experience: formData.get('years_experience') + '+',
                technologies: formData.get('technologies_count') + '+',
                satisfaction: formData.get('satisfaction_rate') + '%'
            },
            skillCategories: {
                aiml: {
                    title: formData.get('aiml_title'),
                    tags: formData.get('aiml_tags').split(',').map(tag => tag.trim())
                },
                development: {
                    title: formData.get('dev_title'),
                    tags: formData.get('dev_tags').split(',').map(tag => tag.trim())
                },
                cloud: {
                    title: formData.get('cloud_title'),
                    tags: formData.get('cloud_tags').split(',').map(tag => tag.trim())
                }
            },
            resume: {
                link: formData.get('resume_link'),
                text: formData.get('resume_text')
            }
        };

        const result = await this.firebase.setDocument(this.collections.aboutInfo, 'main', aboutInfo);
        
        if (result.success) {
            this.showNotification('About info saved successfully!', 'success');
        } else {
            this.showNotification('Error saving about info: ' + result.error, 'error');
        }
    }

    async loadAboutInfo() {
        const result = await this.firebase.getDocument(this.collections.aboutInfo, 'main');
        
        if (result.success && result.data) {
            const form = document.getElementById('about-form');
            if (form) {
                const data = result.data;
                
                // Load description
                if (form.description) form.description.value = data.description || '';
                
                // Load stats
                if (data.stats) {
                    if (form.projects_count) form.projects_count.value = data.stats.projects ? data.stats.projects.replace('+', '') : '';
                    if (form.years_experience) form.years_experience.value = data.stats.experience ? data.stats.experience.replace('+', '') : '';
                    if (form.technologies_count) form.technologies_count.value = data.stats.technologies ? data.stats.technologies.replace('+', '') : '';
                    if (form.satisfaction_rate) form.satisfaction_rate.value = data.stats.satisfaction ? data.stats.satisfaction.replace('%', '') : '';
                }
                
                // Load skill categories
                if (data.skillCategories) {
                    if (form.aiml_title) form.aiml_title.value = data.skillCategories.aiml?.title || '';
                    if (form.aiml_tags) form.aiml_tags.value = data.skillCategories.aiml?.tags?.join(', ') || '';
                    if (form.dev_title) form.dev_title.value = data.skillCategories.development?.title || '';
                    if (form.dev_tags) form.dev_tags.value = data.skillCategories.development?.tags?.join(', ') || '';
                    if (form.cloud_title) form.cloud_title.value = data.skillCategories.cloud?.title || '';
                    if (form.cloud_tags) form.cloud_tags.value = data.skillCategories.cloud?.tags?.join(', ') || '';
                }
                
                // Load resume info
                if (data.resume) {
                    if (form.resume_link) form.resume_link.value = data.resume.link || '';
                    if (form.resume_text) form.resume_text.value = data.resume.text || '';
                }
            }
        }
    }

    // Skills Management
    async loadSkills() {
        const result = await this.firebase.getCollection(this.collections.skills);
        const skills = result.success ? result.data : [];
        
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
                                <button class="action-btn edit" onclick="adminDashboard.editSkill('${skill.id}')">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn delete" onclick="adminDashboard.deleteSkill('${skill.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('');
            }
        }
    }

    async saveSkill() {
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
        let result;

        if (skillId) {
            // Update existing skill
            result = await this.firebase.updateDocument(this.collections.skills, skillId, skillData);
        } else {
            // Add new skill
            result = await this.firebase.addDocument(this.collections.skills, skillData);
        }

        if (result.success) {
            this.showNotification('Skill saved successfully!', 'success');
            this.closeModal('skill-modal');
            await this.loadSkills();
        } else {
            this.showNotification('Error saving skill: ' + result.error, 'error');
        }
    }

    async deleteSkill(skillId) {
        if (confirm('Are you sure you want to delete this skill?')) {
            const result = await this.firebase.deleteDocument(this.collections.skills, skillId);
            
            if (result.success) {
                this.showNotification('Skill deleted successfully!', 'success');
                await this.loadSkills();
            } else {
                this.showNotification('Error deleting skill: ' + result.error, 'error');
            }
        }
    }

    // Projects Management
    async loadProjects() {
        const result = await this.firebase.getCollection(this.collections.projects);
        const projects = result.success ? result.data : [];
        
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
                                <button class="action-btn edit" onclick="adminDashboard.editProject('${project.id}')">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn delete" onclick="adminDashboard.deleteProject('${project.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    async saveProject() {
        const form = document.getElementById('project-modal-form');
        const formData = new FormData(form);
        
        const projectData = {
            title: formData.get('projectTitle'),
            category: formData.get('projectCategory'),
            description: formData.get('projectDescription'),
            image: formData.get('projectImage'),
            demo_url: formData.get('projectDemo'),
            github_url: formData.get('projectGithub'),
            technologies: formData.get('projectTechnologies')
        };

        const projectId = formData.get('projectId');
        let result;

        if (projectId) {
            // Update existing project
            result = await this.firebase.updateDocument(this.collections.projects, projectId, projectData);
        } else {
            // Add new project
            result = await this.firebase.addDocument(this.collections.projects, projectData);
        }

        if (result.success) {
            this.showNotification('Project saved successfully!', 'success');
            this.closeModal('project-modal');
            await this.loadProjects();
        } else {
            this.showNotification('Error saving project: ' + result.error, 'error');
        }
    }

    async deleteProject(projectId) {
        if (confirm('Are you sure you want to delete this project?')) {
            const result = await this.firebase.deleteDocument(this.collections.projects, projectId);
            
            if (result.success) {
                this.showNotification('Project deleted successfully!', 'success');
                await this.loadProjects();
            } else {
                this.showNotification('Error deleting project: ' + result.error, 'error');
            }
        }
    }

    // Experience Management
    async loadExperience() {
        const result = await this.firebase.getCollection(this.collections.experience);
        const experiences = result.success ? result.data : [];
        
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
                            <button class="action-btn edit" onclick="adminDashboard.editExperience('${exp.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete" onclick="adminDashboard.deleteExperience('${exp.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    async saveExperience() {
        const form = document.getElementById('experience-modal-form');
        const formData = new FormData(form);
        
        const expData = {
            position: formData.get('experienceTitle'),
            company: formData.get('experienceCompany'),
            description: formData.get('experienceDescription'),
            start_date: formData.get('experienceStart'),
            end_date: formData.get('experienceEnd'),
            technologies: formData.get('experienceTechnologies')
        };

        const expId = formData.get('experienceId');
        let result;

        if (expId) {
            // Update existing experience
            result = await this.firebase.updateDocument(this.collections.experience, expId, expData);
        } else {
            // Add new experience
            result = await this.firebase.addDocument(this.collections.experience, expData);
        }

        if (result.success) {
            this.showNotification('Experience saved successfully!', 'success');
            this.closeModal('experience-modal');
            await this.loadExperience();
        } else {
            this.showNotification('Error saving experience: ' + result.error, 'error');
        }
    }

    async deleteExperience(expId) {
        if (confirm('Are you sure you want to delete this experience?')) {
            const result = await this.firebase.deleteDocument(this.collections.experience, expId);
            
            if (result.success) {
                this.showNotification('Experience deleted successfully!', 'success');
                await this.loadExperience();
            } else {
                this.showNotification('Error deleting experience: ' + result.error, 'error');
            }
        }
    }

    // Messages Management
    async loadMessages() {
        const result = await this.firebase.getCollection(this.collections.messages);
        const messages = result.success ? result.data : [];
        
        const container = document.getElementById('messages-container');
        
        if (container) {
            if (messages.length === 0) {
                container.innerHTML = '<p class="no-data">No messages received yet.</p>';
            } else {
                container.innerHTML = messages.map(msg => `
                    <div class="message-card ${msg.read ? 'read' : 'unread'}">
                        <div class="message-header">
                            <h3>${msg.name}</h3>
                            <span class="message-date">${new Date(msg.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p class="message-email">${msg.email}</p>
                        <h4 class="message-subject">${msg.subject}</h4>
                        <p class="message-content">${msg.message}</p>
                        <div class="message-actions">
                            <button class="action-btn ${msg.read ? 'mark-unread' : 'mark-read'}" onclick="adminDashboard.toggleMessageRead('${msg.id}')">
                                <i class="fas fa-${msg.read ? 'envelope' : 'envelope-open'}"></i>
                                ${msg.read ? 'Mark Unread' : 'Mark Read'}
                            </button>
                            <button class="action-btn delete" onclick="adminDashboard.deleteMessage('${msg.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    async toggleMessageRead(msgId) {
        const result = await this.firebase.getDocument(this.collections.messages, msgId);
        
        if (result.success) {
            const updateResult = await this.firebase.updateDocument(this.collections.messages, msgId, {
                read: !result.data.read
            });
            
            if (updateResult.success) {
                await this.loadMessages();
            }
        }
    }

    async deleteMessage(msgId) {
        if (confirm('Are you sure you want to delete this message?')) {
            const result = await this.firebase.deleteDocument(this.collections.messages, msgId);
            
            if (result.success) {
                this.showNotification('Message deleted successfully!', 'success');
                await this.loadMessages();
            } else {
                this.showNotification('Error deleting message: ' + result.error, 'error');
            }
        }
    }

    // Utility Methods
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
        }
    }

    async logout() {
        if (confirm('Are you sure you want to logout?')) {
            const result = await this.firebase.signOut();
            
            if (result.success) {
                window.location.href = 'login.html';
            } else {
                this.showNotification('Error logging out: ' + result.error, 'error');
            }
        }
    }

    async exportData() {
        try {
            const collections = ['personalInfo', 'projects', 'skills', 'experience', 'aboutInfo', 'messages'];
            const exportData = {};
            
            for (const collection of collections) {
                const result = await this.firebase.getCollection(collection);
                exportData[collection] = result.success ? result.data : [];
            }

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'portfolio-data-firebase.json';
            link.click();
            URL.revokeObjectURL(url);
            this.showNotification('Data exported successfully!', 'success');
        } catch (error) {
            this.showNotification('Error exporting data: ' + error.message, 'error');
        }
    }

    // Load all data on initialization
    async loadInitialData() {
        try {
            await this.loadProfile();
            await this.loadAboutInfo();
            await this.loadProjects();
            await this.loadSkills();
            await this.loadExperience();
            await this.loadMessages();
            await this.updateStats();
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    }

    // Update dashboard statistics
    async updateStats() {
        try {
            const [projectsResult, skillsResult, experienceResult, messagesResult] = await Promise.all([
                this.firebase.getCollection(this.collections.projects),
                this.firebase.getCollection(this.collections.skills),
                this.firebase.getCollection(this.collections.experience),
                this.firebase.getCollection(this.collections.messages)
            ]);

            const projects = projectsResult.success ? projectsResult.data : [];
            const skills = skillsResult.success ? skillsResult.data : [];
            const experiences = experienceResult.success ? experienceResult.data : [];
            const messages = messagesResult.success ? messagesResult.data : [];
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
        } catch (error) {
            console.error('Error updating stats:', error);
        }
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

    // Modal helpers
    openSkillModal(skillId = null) {
        const modal = document.getElementById('skill-modal');
        const form = document.getElementById('skill-modal-form');
        const title = document.getElementById('skill-modal-title');

        if (skillId) {
            // Load skill data for editing
            this.firebase.getDocument(this.collections.skills, skillId).then(result => {
                if (result.success) {
                    const skill = result.data;
                    title.textContent = 'Edit Skill';
                    form.skillId.value = skillId;
                    form.skillName.value = skill.name;
                    form.skillCategory.value = skill.category;
                    form.skillProficiency.value = skill.proficiency;
                    form.skillIcon.value = skill.icon || '';
                    form.skillDescription.value = skill.description || '';
                    document.getElementById('proficiency-display').textContent = skill.proficiency + '%';
                }
            });
        } else {
            title.textContent = 'Add New Skill';
            form.reset();
            form.skillId.value = '';
            document.getElementById('proficiency-display').textContent = '80%';
        }

        modal.classList.add('show');
    }

    openProjectModal(projectId = null) {
        const modal = document.getElementById('project-modal');
        const form = document.getElementById('project-modal-form');
        const title = document.getElementById('project-modal-title');

        if (projectId) {
            // Load project data for editing
            this.firebase.getDocument(this.collections.projects, projectId).then(result => {
                if (result.success) {
                    const project = result.data;
                    title.textContent = 'Edit Project';
                    form.projectId.value = projectId;
                    form.projectTitle.value = project.title;
                    form.projectCategory.value = project.category;
                    form.projectDescription.value = project.description;
                    form.projectImage.value = project.image || '';
                    form.projectDemo.value = project.demo_url || '';
                    form.projectGithub.value = project.github_url || '';
                    form.projectTechnologies.value = project.technologies || '';
                }
            });
        } else {
            title.textContent = 'Add New Project';
            form.reset();
            form.projectId.value = '';
        }

        modal.classList.add('show');
    }

    openExperienceModal(expId = null) {
        const modal = document.getElementById('experience-modal');
        const form = document.getElementById('experience-modal-form');
        const title = document.getElementById('experience-modal-title');

        if (expId) {
            // Load experience data for editing
            this.firebase.getDocument(this.collections.experience, expId).then(result => {
                if (result.success) {
                    const exp = result.data;
                    title.textContent = 'Edit Experience';
                    form.experienceId.value = expId;
                    form.experienceTitle.value = exp.position;
                    form.experienceCompany.value = exp.company;
                    form.experienceDescription.value = exp.description;
                    form.experienceStart.value = exp.start_date;
                    form.experienceEnd.value = exp.end_date || '';
                    form.experienceTechnologies.value = exp.technologies || '';
                }
            });
        } else {
            title.textContent = 'Add New Experience';
            form.reset();
            form.experienceId.value = '';
        }

        modal.classList.add('show');
    }

    editSkill(skillId) {
        this.openSkillModal(skillId);
    }

    editProject(projectId) {
        this.openProjectModal(projectId);
    }

    editExperience(expId) {
        this.openExperienceModal(expId);
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

function logout() {
    if (window.adminDashboard) {
        window.adminDashboard.logout();
    }
}

function exportData() {
    if (window.adminDashboard) {
        window.adminDashboard.exportData();
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Firebase dashboard
    window.adminDashboard = new FirebaseAdminDashboard();
});