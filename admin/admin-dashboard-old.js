// Admin Dashboard JavaScript

// Sample data (in a real application, this would come from a database)
let portfolioData = {
    profile: {
        fullName: "Suki S",
        jobTitle: "AI Developer & Machine Learning Engineer",
        bio: "Passionate about creating intelligent solutions that make a difference. Specialized in Machine Learning, Deep Learning, and AI-powered applications.",
        email: "suki.ai.developer@gmail.com",
        phone: "+91 9080630925",
        location: "Coimbatore, India",
        profileImage: "../suki-s.jpeg"
    },
    skills: [
        { id: 1, name: "Machine Learning", category: "AI/ML", proficiency: 90, icon: "fas fa-brain", description: "Advanced ML algorithms and model optimization" },
        { id: 2, name: "Python", category: "Programming", proficiency: 95, icon: "fab fa-python", description: "Expert-level Python development" },
        { id: 3, name: "TensorFlow", category: "AI/ML", proficiency: 85, icon: "fas fa-project-diagram", description: "Deep learning framework expertise" },
        { id: 4, name: "React", category: "Web Development", proficiency: 80, icon: "fab fa-react", description: "Modern frontend development" },
        { id: 5, name: "AWS", category: "Cloud & DevOps", proficiency: 75, icon: "fab fa-aws", description: "Cloud infrastructure and deployment" },
        { id: 6, name: "Data Science", category: "Data Science", proficiency: 88, icon: "fas fa-chart-bar", description: "Data analysis and visualization" }
    ],
    projects: [
        {
            id: 1,
            title: "AI-Powered Chatbot",
            category: "ai",
            description: "Intelligent conversational AI built with advanced NLP techniques and machine learning algorithms.",
            image: "https://via.placeholder.com/400x250",
            demo: "https://demo-link.com",
            github: "https://github.com/username/ai-chatbot",
            technologies: ["Python", "TensorFlow", "NLP", "Flask"]
        },
        {
            id: 2,
            title: "Smart Recommendation System",
            category: "ai",
            description: "Machine learning-based recommendation engine for e-commerce platforms with real-time personalization.",
            image: "https://via.placeholder.com/400x250",
            demo: "https://demo-link.com",
            github: "https://github.com/username/recommendation-system",
            technologies: ["Python", "Scikit-learn", "Pandas", "MongoDB"]
        },
        {
            id: 3,
            title: "Portfolio Website",
            category: "web",
            description: "Modern, responsive portfolio website with dark theme and glassmorphism effects.",
            image: "https://via.placeholder.com/400x250",
            demo: "https://demo-link.com",
            github: "https://github.com/username/portfolio",
            technologies: ["HTML", "CSS", "JavaScript", "Responsive Design"]
        },
        {
            id: 4,
            title: "Data Visualization Dashboard",
            category: "data",
            description: "Interactive dashboard for complex data analysis with real-time charts and insights.",
            image: "https://via.placeholder.com/400x250",
            demo: "https://demo-link.com",
            github: "https://github.com/username/data-dashboard",
            technologies: ["React", "D3.js", "Python", "FastAPI"]
        },
        {
            id: 5,
            title: "Mobile AI Assistant",
            category: "mobile",
            description: "Cross-platform mobile application with AI-powered voice assistant capabilities.",
            image: "https://via.placeholder.com/400x250",
            demo: "https://demo-link.com",
            github: "https://github.com/username/mobile-ai",
            technologies: ["React Native", "TensorFlow Lite", "Voice API"]
        },
        {
            id: 6,
            title: "Predictive Analytics Platform",
            category: "ai",
            description: "Enterprise-grade platform for predictive analytics and business intelligence.",
            image: "https://via.placeholder.com/400x250",
            demo: "https://demo-link.com",
            github: "https://github.com/username/predictive-analytics",
            technologies: ["Python", "Machine Learning", "Docker", "PostgreSQL"]
        }
    ],
    experience: [
        {
            id: 1,
            title: "Senior AI Developer",
            company: "TechCorp Solutions",
            startDate: "2022-01",
            endDate: null,
            current: true,
            description: "Leading AI development projects, implementing machine learning solutions, and mentoring junior developers.",
            technologies: ["Python", "TensorFlow", "PyTorch", "AWS"]
        },
        {
            id: 2,
            title: "Machine Learning Engineer",
            company: "DataTech Inc",
            startDate: "2020-06",
            endDate: "2021-12",
            current: false,
            description: "Developed and deployed ML models for production systems, optimized algorithm performance.",
            technologies: ["Python", "Scikit-learn", "Docker", "Kubernetes"]
        },
        {
            id: 3,
            title: "Data Scientist",
            company: "Analytics Pro",
            startDate: "2019-03",
            endDate: "2020-05",
            current: false,
            description: "Analyzed complex datasets, built predictive models, and created data visualization dashboards.",
            technologies: ["Python", "R", "SQL", "Tableau"]
        },
        {
            id: 4,
            title: "Bachelor of Technology",
            company: "XYZ University",
            startDate: "2015-08",
            endDate: "2019-05",
            current: false,
            description: "Computer Science and Engineering with specialization in Artificial Intelligence.",
            technologies: ["Java", "C++", "Database Systems", "Algorithms"]
        }
    ],
    contact: {
        email: "suki.ai.developer@gmail.com",
        phone: "+91 9080630925",
        location: "Coimbatore, India",
        github: "https://github.com/username",
        linkedin: "https://linkedin.com/in/username",
        twitter: "https://twitter.com/username",
        resume: "https://resume-link.com"
    },
    messages: [
        {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            subject: "Project Inquiry",
            message: "Hi, I'm interested in discussing a potential project collaboration...",
            date: "2024-01-15",
            read: false
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane@company.com",
            subject: "Job Opportunity",
            message: "We have an exciting opportunity that matches your skills...",
            date: "2024-01-14",
            read: true
        },
        {
            id: 3,
            name: "Mike Johnson",
            email: "mike@startup.com",
            subject: "Technical Question",
            message: "Could you help me understand the ML approach you used in...",
            date: "2024-01-13",
            read: false
        }
    ]
};

// Navigation functionality
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.admin-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = item.dataset.section;

            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Show target section
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(`${targetSection}-section`).classList.add('active');
        });
    });
}

// User menu functionality
function toggleUserMenu() {
    const dropdown = document.getElementById('user-dropdown');
    dropdown.classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu')) {
        document.getElementById('user-dropdown').classList.remove('show');
    }
});

// Logout functionality
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'login.html';
    }
}

// Export data functionality
function exportData() {
    const dataStr = JSON.stringify(portfolioData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio-data.json';
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Data exported successfully!', 'success');
}

// Skills management
function loadSkills() {
    const tableBody = document.getElementById('skills-table-body');
    tableBody.innerHTML = '';

    portfolioData.skills.forEach(skill => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${skill.name}</td>
            <td>${skill.category}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div style="width: 100px; height: 6px; background: rgba(100, 255, 218, 0.2); border-radius: 3px;">
                        <div style="width: ${skill.proficiency}%; height: 100%; background: #64ffda; border-radius: 3px;"></div>
                    </div>
                    <span>${skill.proficiency}%</span>
                </div>
            </td>
            <td><i class="${skill.icon}"></i></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editSkill(${skill.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteSkill(${skill.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function openSkillModal(skillId = null) {
    const modal = document.getElementById('skill-modal');
    const form = document.getElementById('skill-modal-form');
    const title = document.getElementById('skill-modal-title');

    if (skillId) {
        const skill = portfolioData.skills.find(s => s.id === skillId);
        title.textContent = 'Edit Skill';
        form.skillId.value = skill.id;
        form.skillName.value = skill.name;
        form.skillCategory.value = skill.category;
        form.skillProficiency.value = skill.proficiency;
        form.skillIcon.value = skill.icon;
        form.skillDescription.value = skill.description;
        document.getElementById('proficiency-display').textContent = skill.proficiency + '%';
    } else {
        title.textContent = 'Add New Skill';
        form.reset();
        form.skillId.value = '';
        document.getElementById('proficiency-display').textContent = '80%';
    }

    modal.classList.add('show');
}

function editSkill(skillId) {
    openSkillModal(skillId);
}

function deleteSkill(skillId) {
    if (confirm('Are you sure you want to delete this skill?')) {
        portfolioData.skills = portfolioData.skills.filter(s => s.id !== skillId);
        loadSkills();
        updateStats();
        showNotification('Skill deleted successfully!', 'success');
    }
}

function saveSkill() {
    const form = document.getElementById('skill-modal-form');
    const formData = new FormData(form);
    const skillData = {
        name: formData.get('skillName'),
        category: formData.get('skillCategory'),
        proficiency: parseInt(formData.get('skillProficiency')),
        icon: formData.get('skillIcon'),
        description: formData.get('skillDescription')
    };

    const skillId = formData.get('skillId');
    if (skillId) {
        // Update existing skill
        const skillIndex = portfolioData.skills.findIndex(s => s.id === parseInt(skillId));
        portfolioData.skills[skillIndex] = { id: parseInt(skillId), ...skillData };
        showNotification('Skill updated successfully!', 'success');
    } else {
        // Add new skill
        const newId = Math.max(...portfolioData.skills.map(s => s.id), 0) + 1;
        portfolioData.skills.push({ id: newId, ...skillData });
        showNotification('Skill added successfully!', 'success');
    }

    closeModal('skill-modal');
    loadSkills();
    updateStats();
}

// Projects management
function loadProjects() {
    const container = document.getElementById('projects-container');
    container.innerHTML = '';

    portfolioData.projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card-admin';
        projectCard.innerHTML = `
            <div class="project-header">
                <h3 class="project-title">${project.title}</h3>
                <span class="project-category-tag">${project.category.toUpperCase()}</span>
            </div>
            <p class="project-description">${project.description}</p>
            <div class="project-technologies">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            <div class="project-actions">
                <div class="project-links">
                    ${project.demo ? `<a href="${project.demo}" target="_blank" class="project-link">Demo</a>` : ''}
                    ${project.github ? `<a href="${project.github}" target="_blank" class="project-link">GitHub</a>` : ''}
                </div>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editProject(${project.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteProject(${project.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(projectCard);
    });
}

function openProjectModal(projectId = null) {
    const modal = document.getElementById('project-modal');
    const form = document.getElementById('project-modal-form');
    const title = document.getElementById('project-modal-title');

    if (projectId) {
        const project = portfolioData.projects.find(p => p.id === projectId);
        title.textContent = 'Edit Project';
        form.projectId.value = project.id;
        form.projectTitle.value = project.title;
        form.projectCategory.value = project.category;
        form.projectDescription.value = project.description;
        form.projectImage.value = project.image;
        form.projectDemo.value = project.demo || '';
        form.projectGithub.value = project.github || '';
        form.projectTechnologies.value = project.technologies.join(', ');
    } else {
        title.textContent = 'Add New Project';
        form.reset();
        form.projectId.value = '';
    }

    modal.classList.add('show');
}

function editProject(projectId) {
    openProjectModal(projectId);
}

function deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
        portfolioData.projects = portfolioData.projects.filter(p => p.id !== projectId);
        loadProjects();
        updateStats();
        showNotification('Project deleted successfully!', 'success');
    }
}

function saveProject() {
    const form = document.getElementById('project-modal-form');
    const formData = new FormData(form);
    const projectData = {
        title: formData.get('projectTitle'),
        category: formData.get('projectCategory'),
        description: formData.get('projectDescription'),
        image: formData.get('projectImage'),
        demo: formData.get('projectDemo'),
        github: formData.get('projectGithub'),
        technologies: formData.get('projectTechnologies').split(',').map(tech => tech.trim())
    };

    const projectId = formData.get('projectId');
    if (projectId) {
        // Update existing project
        const projectIndex = portfolioData.projects.findIndex(p => p.id === parseInt(projectId));
        portfolioData.projects[projectIndex] = { id: parseInt(projectId), ...projectData };
        showNotification('Project updated successfully!', 'success');
    } else {
        // Add new project
        const newId = Math.max(...portfolioData.projects.map(p => p.id), 0) + 1;
        portfolioData.projects.push({ id: newId, ...projectData });
        showNotification('Project added successfully!', 'success');
    }

    closeModal('project-modal');
    loadProjects();
    updateStats();
}

// Experience management
function loadExperience() {
    const container = document.getElementById('experience-container');
    container.innerHTML = '';

    portfolioData.experience.forEach(exp => {
        const expItem = document.createElement('div');
        expItem.className = 'experience-item-admin';
        
        const startDate = new Date(exp.startDate + '-01');
        const endDate = exp.endDate ? new Date(exp.endDate + '-01') : null;
        const duration = exp.current ? 
            `${startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - Present` :
            `${startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;

        expItem.innerHTML = `
            <div class="experience-header">
                <div>
                    <h3 class="experience-title">${exp.title}</h3>
                    <p class="experience-company">${exp.company}</p>
                </div>
                <span class="experience-duration">${duration}</span>
            </div>
            <p class="experience-description">${exp.description}</p>
            ${exp.technologies ? `
                <div class="project-technologies">
                    ${exp.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            ` : ''}
            <div class="experience-actions">
                <button class="action-btn edit" onclick="editExperience(${exp.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteExperience(${exp.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(expItem);
    });
}

function openExperienceModal(experienceId = null) {
    const modal = document.getElementById('experience-modal');
    const form = document.getElementById('experience-modal-form');
    const title = document.getElementById('experience-modal-title');

    if (experienceId) {
        const exp = portfolioData.experience.find(e => e.id === experienceId);
        title.textContent = 'Edit Experience';
        form.experienceId.value = exp.id;
        form.experienceTitle.value = exp.title;
        form.experienceCompany.value = exp.company;
        form.experienceStart.value = exp.startDate;
        form.experienceEnd.value = exp.endDate || '';
        form.experienceDescription.value = exp.description;
        form.experienceTechnologies.value = exp.technologies ? exp.technologies.join(', ') : '';
        document.getElementById('experience-current').checked = exp.current;
    } else {
        title.textContent = 'Add New Experience';
        form.reset();
        form.experienceId.value = '';
    }

    modal.classList.add('show');
}

function editExperience(experienceId) {
    openExperienceModal(experienceId);
}

function deleteExperience(experienceId) {
    if (confirm('Are you sure you want to delete this experience?')) {
        portfolioData.experience = portfolioData.experience.filter(e => e.id !== experienceId);
        loadExperience();
        updateStats();
        showNotification('Experience deleted successfully!', 'success');
    }
}

function saveExperience() {
    const form = document.getElementById('experience-modal-form');
    const formData = new FormData(form);
    const isCurrent = document.getElementById('experience-current').checked;
    
    const experienceData = {
        title: formData.get('experienceTitle'),
        company: formData.get('experienceCompany'),
        startDate: formData.get('experienceStart'),
        endDate: isCurrent ? null : formData.get('experienceEnd'),
        current: isCurrent,
        description: formData.get('experienceDescription'),
        technologies: formData.get('experienceTechnologies') ? 
            formData.get('experienceTechnologies').split(',').map(tech => tech.trim()) : []
    };

    const experienceId = formData.get('experienceId');
    if (experienceId) {
        // Update existing experience
        const expIndex = portfolioData.experience.findIndex(e => e.id === parseInt(experienceId));
        portfolioData.experience[expIndex] = { id: parseInt(experienceId), ...experienceData };
        showNotification('Experience updated successfully!', 'success');
    } else {
        // Add new experience
        const newId = Math.max(...portfolioData.experience.map(e => e.id), 0) + 1;
        portfolioData.experience.push({ id: newId, ...experienceData });
        showNotification('Experience added successfully!', 'success');
    }

    closeModal('experience-modal');
    loadExperience();
    updateStats();
}

// Messages management
function loadMessages() {
    const container = document.getElementById('messages-list');
    container.innerHTML = '';

    portfolioData.messages.forEach(message => {
        const messageItem = document.createElement('div');
        messageItem.className = 'message-item';
        if (!message.read) {
            messageItem.style.borderColor = 'rgba(100, 255, 218, 0.5)';
        }

        messageItem.innerHTML = `
            <div class="message-header">
                <div>
                    <div class="message-sender">${message.name} ${!message.read ? '<span style="color: #64ffda;">●</span>' : ''}</div>
                    <div class="message-email">${message.email}</div>
                </div>
                <div class="message-date">${new Date(message.date).toLocaleDateString()}</div>
            </div>
            <div class="message-content">${message.message}</div>
            <div class="message-actions">
                <button class="btn btn-secondary" onclick="markAsRead(${message.id})">
                    ${message.read ? 'Mark Unread' : 'Mark Read'}
                </button>
                <button class="btn btn-danger" onclick="deleteMessage(${message.id})">
                    Delete
                </button>
            </div>
        `;
        container.appendChild(messageItem);
    });
}

function markAsRead(messageId) {
    const message = portfolioData.messages.find(m => m.id === messageId);
    message.read = !message.read;
    loadMessages();
    updateStats();
}

function deleteMessage(messageId) {
    if (confirm('Are you sure you want to delete this message?')) {
        portfolioData.messages = portfolioData.messages.filter(m => m.id !== messageId);
        loadMessages();
        updateStats();
        showNotification('Message deleted successfully!', 'success');
    }
}

// Modal management
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

// Form management
function resetForm(formId) {
    document.getElementById(formId).reset();
}

// Profile form submission
document.getElementById('profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    portfolioData.profile = {
        ...portfolioData.profile,
        fullName: formData.get('fullName'),
        jobTitle: formData.get('jobTitle'),
        bio: formData.get('bio'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        location: formData.get('location')
    };
    
    showNotification('Profile updated successfully!', 'success');
});

// Contact form submission
document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    portfolioData.contact = {
        email: formData.get('contactEmail'),
        phone: formData.get('contactPhone'),
        location: formData.get('contactLocation'),
        github: formData.get('githubUrl'),
        linkedin: formData.get('linkedinUrl'),
        twitter: formData.get('twitterUrl'),
        resume: formData.get('resumeUrl')
    };
    
    showNotification('Contact information updated successfully!', 'success');
});

// Settings form submission
document.getElementById('settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    showNotification('Settings saved successfully!', 'success');
});

// Proficiency slider update
document.getElementById('skill-proficiency').addEventListener('input', (e) => {
    document.getElementById('proficiency-display').textContent = e.target.value + '%';
});

// Current job checkbox handler
document.getElementById('experience-current').addEventListener('change', (e) => {
    const endDateInput = document.getElementById('experience-end');
    if (e.target.checked) {
        endDateInput.disabled = true;
        endDateInput.value = '';
    } else {
        endDateInput.disabled = false;
    }
});

// Update dashboard stats
function updateStats() {
    document.getElementById('total-projects').textContent = portfolioData.projects.length;
    document.getElementById('total-skills').textContent = portfolioData.skills.length;
    document.getElementById('total-experience').textContent = portfolioData.experience.length;
    document.getElementById('total-messages').textContent = portfolioData.messages.length;
    
    // Update badge for unread messages
    const unreadCount = portfolioData.messages.filter(m => !m.read).length;
    const badge = document.querySelector('.nav-item[data-section="messages"] .badge');
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.getElementById('admin-notification');
    const icon = document.getElementById('notification-icon');
    const text = document.getElementById('notification-text');
    
    // Set icon based on type
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    icon.className = icons[type] || icons.info;
    text.textContent = message;
    
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        hideNotification();
    }, 3000);
}

function hideNotification() {
    const notification = document.getElementById('admin-notification');
    notification.classList.remove('show');
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 300);
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    loadSkills();
    loadProjects();
    loadExperience();
    loadMessages();
    updateStats();
    
    // Load profile data into forms
    const profileForm = document.getElementById('profile-form');
    Object.keys(portfolioData.profile).forEach(key => {
        const input = profileForm.querySelector(`[name="${key}"]`);
        if (input && portfolioData.profile[key]) {
            input.value = portfolioData.profile[key];
        }
    });
    
    // Load contact data into form
    const contactForm = document.getElementById('contact-form');
    Object.keys(portfolioData.contact).forEach(key => {
        const input = contactForm.querySelector(`[name="contact${key.charAt(0).toUpperCase() + key.slice(1)}"], [name="${key}Url"]`);
        if (input && portfolioData.contact[key]) {
            input.value = portfolioData.contact[key];
        }
    });
});

// Auto-save functionality (optional)
setInterval(() => {
    localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
}, 30000); // Save every 30 seconds

// Load data from localStorage on startup
const savedData = localStorage.getItem('portfolioData');
if (savedData) {
    try {
        portfolioData = { ...portfolioData, ...JSON.parse(savedData) };
    } catch (e) {
        console.warn('Could not load saved data:', e);
    }
}
