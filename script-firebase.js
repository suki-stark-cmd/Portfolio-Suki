// Firebase-powered Portfolio Data Manager
import { firebaseService } from './firebase-config.js';

class FirebasePortfolioDataManager {
    constructor() {
        this.firebase = firebaseService;
        this.collections = {
            personalInfo: 'personalInfo',
            projects: 'projects',
            skills: 'skills',
            experience: 'experience',
            aboutInfo: 'aboutInfo',
            messages: 'messages'
        };
        
        this.setupRealtimeListeners();
        this.loadPortfolioData();
    }

    // Setup real-time listeners for instant updates
    setupRealtimeListeners() {
        // Listen to personal info changes
        this.firebase.subscribeToDocument(this.collections.personalInfo, 'main', (result) => {
            if (result.success && result.data) {
                this.updatePersonalInfo(result.data);
            }
        });

        // Listen to about info changes
        this.firebase.subscribeToDocument(this.collections.aboutInfo, 'main', (result) => {
            if (result.success && result.data) {
                this.updateAboutInfo(result.data);
            }
        });

        // Listen to projects changes
        this.firebase.subscribeToCollection(this.collections.projects, (result) => {
            if (result.success) {
                this.updateProjects(result.data);
            }
        });

        // Listen to skills changes
        this.firebase.subscribeToCollection(this.collections.skills, (result) => {
            if (result.success) {
                this.updateSkills(result.data);
            }
        });

        // Listen to experience changes
        this.firebase.subscribeToCollection(this.collections.experience, (result) => {
            if (result.success) {
                this.updateExperience(result.data);
            }
        });
    }

    // Load initial portfolio data from Firebase
    async loadPortfolioData() {
        try {
            // Load personal info
            const personalInfo = await this.firebase.getDocument(this.collections.personalInfo, 'main');
            if (personalInfo.success && personalInfo.data) {
                this.updatePersonalInfo(personalInfo.data);
            }

            // Load about info
            const aboutInfo = await this.firebase.getDocument(this.collections.aboutInfo, 'main');
            if (aboutInfo.success && aboutInfo.data) {
                this.updateAboutInfo(aboutInfo.data);
            }

            // Load projects
            const projects = await this.firebase.getCollection(this.collections.projects);
            if (projects.success) {
                this.updateProjects(projects.data);
            }

            // Load skills
            const skills = await this.firebase.getCollection(this.collections.skills);
            if (skills.success) {
                this.updateSkills(skills.data);
            }

            // Load experience
            const experience = await this.firebase.getCollection(this.collections.experience);
            if (experience.success) {
                this.updateExperience(experience.data);
            }

        } catch (error) {
            console.error('Error loading portfolio data:', error);
            // Fallback to default content if Firebase fails
            this.loadDefaultContent();
        }
    }

    // Update personal information
    updatePersonalInfo(info) {
        // Update hero section
        const heroTitle = document.querySelector('.hero-title .highlight');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroDescription = document.querySelector('.hero-description');
        
        if (heroTitle && info.name) {
            heroTitle.textContent = info.name;
        }
        if (heroSubtitle && info.title) {
            heroSubtitle.textContent = info.title;
        }
        if (heroDescription && info.bio) {
            heroDescription.textContent = info.bio;
        }

        // Update contact information
        const emailElement = document.querySelector('.contact-card:nth-child(1) p');
        const phoneElement = document.querySelector('.contact-card:nth-child(2) p');
        const locationElement = document.querySelector('.contact-card:nth-child(3) p');

        if (emailElement && info.email) {
            emailElement.textContent = info.email;
        }
        if (phoneElement && info.phone) {
            phoneElement.textContent = info.phone;
        }
        if (locationElement && info.location) {
            locationElement.textContent = info.location;
        }

        // Update social links
        if (info.github) {
            const githubLink = document.querySelector('a[href*="github"]');
            if (githubLink) githubLink.href = info.github;
        }
        if (info.linkedin) {
            const linkedinLink = document.querySelector('a[href*="linkedin"]');
            if (linkedinLink) linkedinLink.href = info.linkedin;
        }
        if (info.twitter) {
            const twitterLink = document.querySelector('a[href*="twitter"]');
            if (twitterLink) twitterLink.href = info.twitter;
        }

        // Update footer
        const footerName = document.querySelector('.admin-link');
        if (footerName && info.name) {
            footerName.textContent = `© 2025 ${info.name}. All rights reserved.`;
        }
    }

    // Update projects section
    updateProjects(projects) {
        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid || projects.length === 0) return;

        // Clear existing projects
        projectsGrid.innerHTML = '';

        // Sort projects by creation date (newest first)
        projects.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

        // Add new projects
        projects.forEach(project => {
            const projectCard = this.createProjectCard(project);
            projectsGrid.appendChild(projectCard);
        });

        // Re-initialize project filtering
        this.initializeProjectFiltering();
    }

    // Create project card HTML
    createProjectCard(project) {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.setAttribute('data-category', project.category || 'web');

        const defaultImage = 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&h=400&fit=crop';
        
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="${project.image || defaultImage}" alt="${project.title}" loading="lazy">
                <div class="project-overlay">
                    <div class="project-links">
                        ${project.demo_url ? `<a href="${project.demo_url}" class="project-link" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i></a>` : ''}
                        ${project.github_url ? `<a href="${project.github_url}" class="project-link" target="_blank" rel="noopener"><i class="fab fa-github"></i></a>` : ''}
                    </div>
                </div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies ? project.technologies.split(',').map(tech => `<span class="tech-tag">${tech.trim()}</span>`).join('') : ''}
                </div>
            </div>
        `;

        return projectCard;
    }

    // Update skills section
    updateSkills(skills) {
        const skillsGrid = document.querySelector('.skills-grid');
        if (!skillsGrid || skills.length === 0) return;

        // Clear existing skills
        skillsGrid.innerHTML = '';

        // Sort skills by proficiency (highest first)
        skills.sort((a, b) => (b.proficiency || 0) - (a.proficiency || 0));

        // Add new skills
        skills.forEach(skill => {
            const skillCard = this.createSkillCard(skill);
            skillsGrid.appendChild(skillCard);
        });

        // Re-observe elements for animations
        const newSkillCards = skillsGrid.querySelectorAll('.skill-card');
        if (window.observer) {
            newSkillCards.forEach(card => window.observer.observe(card));
        }
    }

    // Create skill card HTML
    createSkillCard(skill) {
        const skillCard = document.createElement('div');
        skillCard.className = 'skill-card';

        // Map skill categories to icons
        const iconMap = {
            'machine learning': 'fas fa-brain',
            'deep learning': 'fas fa-robot',
            'python': 'fab fa-python',
            'data science': 'fas fa-database',
            'cloud computing': 'fas fa-cloud',
            'web development': 'fas fa-code',
            'full stack': 'fas fa-code',
            'javascript': 'fab fa-js-square',
            'react': 'fab fa-react',
            'node.js': 'fab fa-node-js',
            'ai/ml': 'fas fa-brain',
            'backend': 'fas fa-server',
            'frontend': 'fas fa-desktop',
            'devops': 'fas fa-cogs',
            'mobile': 'fas fa-mobile-alt'
        };

        const iconClass = skill.icon || iconMap[skill.name.toLowerCase()] || iconMap[skill.category?.toLowerCase()] || 'fas fa-cog';

        skillCard.innerHTML = `
            <div class="skill-icon">
                <i class="${iconClass}"></i>
            </div>
            <h3>${skill.name}</h3>
            <p>${skill.description || 'Professional expertise in ' + skill.name}</p>
            <div class="skill-progress">
                <div class="progress-bar" style="width: ${skill.proficiency || 75}%"></div>
            </div>
            <span class="skill-percentage">${skill.proficiency || 75}%</span>
        `;

        return skillCard;
    }

    // Update experience section
    updateExperience(experiences) {
        const timeline = document.querySelector('.timeline');
        if (!timeline || experiences.length === 0) return;

        // Clear existing timeline items
        timeline.innerHTML = '';

        // Sort experiences by start date (newest first)
        experiences.sort((a, b) => new Date(b.start_date || 0) - new Date(a.start_date || 0));

        // Add new experience items
        experiences.forEach(exp => {
            const timelineItem = this.createTimelineItem(exp);
            timeline.appendChild(timelineItem);
        });

        // Re-observe elements for animations
        const newTimelineItems = timeline.querySelectorAll('.timeline-item');
        if (window.observer) {
            newTimelineItems.forEach(item => window.observer.observe(item));
        }
    }

    // Create timeline item HTML
    createTimelineItem(experience) {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';

        timelineItem.innerHTML = `
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <div class="timeline-header">
                    <h3>${experience.position}</h3>
                    <span class="timeline-date">${experience.start_date} - ${experience.end_date || 'Present'}</span>
                </div>
                <p class="timeline-company">${experience.company}</p>
                <p class="timeline-description">${experience.description}</p>
                ${experience.technologies ? `<div class="timeline-tech">${experience.technologies.split(',').map(tech => `<span class="tech-tag">${tech.trim()}</span>`).join('')}</div>` : ''}
            </div>
        `;

        return timelineItem;
    }

    // Update about information
    updateAboutInfo(aboutInfo) {
        // Update about description
        const aboutDescription = document.querySelector('.about-description');
        if (aboutDescription && aboutInfo.description) {
            aboutDescription.textContent = aboutInfo.description;
        }

        // Update stats if available
        if (aboutInfo.stats) {
            const statItems = document.querySelectorAll('.stat-item');
            const statsData = [
                aboutInfo.stats.projects,
                aboutInfo.stats.experience,
                aboutInfo.stats.technologies,
                aboutInfo.stats.satisfaction
            ];

            statsData.forEach((statValue, index) => {
                if (statItems[index] && statValue) {
                    const statNumber = statItems[index].querySelector('.stat-number');
                    if (statNumber) {
                        statNumber.textContent = statValue;
                    }
                }
            });
        }

        // Update skill categories preview
        if (aboutInfo.skillCategories) {
            this.updateSkillCategoriesPreview(aboutInfo.skillCategories);
        }

        // Update resume button
        if (aboutInfo.resume) {
            const resumeBtn = document.querySelector('.about-cta .btn');
            if (resumeBtn) {
                if (aboutInfo.resume.link) {
                    resumeBtn.href = aboutInfo.resume.link;
                    resumeBtn.target = '_blank';
                    resumeBtn.rel = 'noopener';
                }
                if (aboutInfo.resume.text) {
                    resumeBtn.innerHTML = `<i class="fas fa-download"></i> ${aboutInfo.resume.text}`;
                }
            }
        }
    }

    // Update skill categories preview in about section
    updateSkillCategoriesPreview(skillCategories) {
        const skillPreviewContainer = document.querySelector('.about-skills-preview');
        if (!skillPreviewContainer) return;

        // Clear existing categories
        skillPreviewContainer.innerHTML = '';

        // Add updated categories
        Object.values(skillCategories).forEach(category => {
            if (category.title && category.tags && category.tags.length > 0) {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'skill-category';
                
                categoryDiv.innerHTML = `
                    <h4>${category.title}</h4>
                    <div class="tech-tags">
                        ${category.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
                    </div>
                `;
                
                skillPreviewContainer.appendChild(categoryDiv);
            }
        });
    }

    // Re-initialize project filtering after updating projects
    initializeProjectFiltering() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Handle contact form submission to Firebase
    async handleContactFormSubmission(formData) {
        try {
            const messageData = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                read: false,
                createdAt: new Date().toISOString()
            };

            const result = await this.firebase.addDocument(this.collections.messages, messageData);
            
            if (result.success) {
                return { success: true, message: 'Message sent successfully!' };
            } else {
                return { success: false, message: 'Failed to send message. Please try again.' };
            }
        } catch (error) {
            console.error('Error sending message:', error);
            return { success: false, message: 'An error occurred. Please try again.' };
        }
    }

    // Load default content if Firebase fails
    loadDefaultContent() {
        console.log('Loading default portfolio content...');
        // The existing HTML content serves as fallback
    }

    // Initialize Firebase connection status indicator
    initializeConnectionStatus() {
        const statusIndicator = document.createElement('div');
        statusIndicator.id = 'firebase-status';
        statusIndicator.className = 'firebase-status hidden';
        statusIndicator.innerHTML = `
            <i class="fas fa-wifi"></i>
            <span>Connected to Firebase</span>
        `;
        document.body.appendChild(statusIndicator);

        // Show connection status briefly on load
        setTimeout(() => {
            statusIndicator.classList.remove('hidden');
            setTimeout(() => {
                statusIndicator.classList.add('hidden');
            }, 3000);
        }, 1000);
    }
}

// Admin Navigation Function (keep existing functionality)
function goToAdmin() {
    const adminLink = document.querySelector('.admin-link');
    if (adminLink) {
        adminLink.style.transform = 'scale(0.95)';
        adminLink.style.opacity = '0.7';
    }
    
    setTimeout(() => {
        window.location.href = 'admin/login.html';
    }, 150);
}

// Initialize Firebase Portfolio Data Manager
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Firebase portfolio manager
    window.portfolioDataManager = new FirebasePortfolioDataManager();
    
    // Update contact form to use Firebase
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('.btn');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                const result = await window.portfolioDataManager.handleContactFormSubmission(formData);
                
                if (result.success) {
                    // Show success message
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    submitBtn.classList.add('success');
                    contactForm.reset();
                    
                    // Reset button after delay
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('success');
                    }, 3000);
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                // Show error message
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
                submitBtn.classList.add('error');
                
                console.error('Contact form error:', error);
                
                // Reset button after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('error');
                }, 3000);
            }
        });
    }
});