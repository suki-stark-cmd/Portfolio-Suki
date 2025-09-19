// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');
const skillCards = document.querySelectorAll('.skill-card');
const projectCards = document.querySelectorAll('.project-card');
const filterBtns = document.querySelectorAll('.filter-btn');
const timelineItems = document.querySelectorAll('.timeline-item');
const contactForm = document.querySelector('.contact-form');

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    const bars = navToggle.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        if (navMenu.classList.contains('active')) {
            if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
            if (index === 1) bar.style.opacity = '0';
            if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        }
    });
});

// Close mobile menu when clicking nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        });
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerOffset = 70;
            const elementPosition = targetSection.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link highlighting
function updateActiveNavLink() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Navbar background on scroll
function updateNavbarBackground() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(26, 26, 46, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(26, 26, 46, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}

// Scroll event listener
window.addEventListener('scroll', () => {
    updateActiveNavLink();
    updateNavbarBackground();
    animateOnScroll();
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            
            // Animate skill progress bars
            if (entry.target.classList.contains('skill-card')) {
                const progressBar = entry.target.querySelector('.progress-bar');
                const percentage = progressBar.style.width;
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.width = percentage;
                }, 300);
            }
            
            // Animate stats counters
            if (entry.target.classList.contains('stat-item')) {
                animateCounter(entry.target);
            }
        }
    });
}, observerOptions);

// Observe elements for animation
const elementsToAnimate = document.querySelectorAll('.skill-card, .project-card, .timeline-item, .contact-card, .stat-item');
elementsToAnimate.forEach(el => observer.observe(el));

// Counter animation
function animateCounter(element) {
    const numberElement = element.querySelector('.stat-number');
    const targetNumber = parseInt(numberElement.textContent);
    const increment = targetNumber / 50;
    let currentNumber = 0;
    
    const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= targetNumber) {
            clearInterval(timer);
            numberElement.textContent = targetNumber + (numberElement.textContent.includes('+') ? '+' : numberElement.textContent.includes('%') ? '%' : '');
        } else {
            numberElement.textContent = Math.floor(currentNumber);
        }
    }, 30);
}

// Projects filtering
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
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

// Contact form handling
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Show success message
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        
        // Reset form
        contactForm.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#64ffda' : '#ff6b6b'};
        color: #0a192f;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }
    }, 5000);
}

// Typing animation for hero section
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    const originalText = heroTitle.textContent;
    typeWriter(heroTitle, originalText, 100);
});

// Parallax scrolling effect
function parallaxScroll() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero::before');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
}

window.addEventListener('scroll', parallaxScroll);

// Create floating particles
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random animation delay
        particle.style.animationDelay = Math.random() * 6 + 's';
        
        // Random size
        const size = Math.random() * 3 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        particlesContainer.appendChild(particle);
    }
}

// Initialize particles
createParticles();

// Smooth reveal animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.loading');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('loaded');
        }
    });
}

// Add loading class to elements
window.addEventListener('load', () => {
    const elementsToLoad = document.querySelectorAll('.skill-card, .project-card, .about-stats, .timeline-item');
    elementsToLoad.forEach(el => el.classList.add('loading'));
    
    setTimeout(animateOnScroll, 100);
});

// Theme toggle (optional feature)
function createThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #64ffda;
        color: #0a192f;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        z-index: 1000;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(100, 255, 218, 0.3);
    `;
    
    document.body.appendChild(themeToggle);
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const icon = themeToggle.querySelector('i');
        
        if (document.body.classList.contains('light-theme')) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    });
}

// Initialize theme toggle
// createThemeToggle(); // Uncomment to enable theme toggle

// Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
lazyLoadImages();

// Preloader
function showPreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="preloader-logo">Suki.S</div>
            <div class="preloader-spinner"></div>
        </div>
    `;
    
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    `;
    
    document.body.appendChild(preloader);
    
    // Hide preloader after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(preloader);
            }, 500);
        }, 1000);
    });
}

// Initialize preloader
// showPreloader(); // Uncomment to enable preloader

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        navMenu.classList.remove('active');
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        });
    }
});

// Print styles
window.addEventListener('beforeprint', () => {
    document.body.classList.add('printing');
});

window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing');
});

// Performance optimization - Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Use debounced scroll handler
const debouncedScrollHandler = debounce(() => {
    updateActiveNavLink();
    updateNavbarBackground();
    animateOnScroll();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Progressive Web App features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Analytics tracking (placeholder)
function trackEvent(eventName, eventData) {
    // Replace with actual analytics tracking
    console.log('Event tracked:', eventName, eventData);
}

// Track navigation clicks
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        trackEvent('navigation_click', {
            target: link.getAttribute('href')
        });
    });
});

// Track project views
projectCards.forEach(card => {
    card.addEventListener('click', () => {
        trackEvent('project_view', {
            project: card.querySelector('.project-title').textContent
        });
    });
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // Optional: Send error to logging service
});

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio initialized successfully!');
    
    // Add any initialization code here
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Admin Navigation Function
function goToAdmin() {
    // Add a subtle animation effect before redirecting
    const adminLink = document.querySelector('.admin-link');
    adminLink.style.transform = 'scale(0.95)';
    adminLink.style.opacity = '0.7';
    
    setTimeout(() => {
        window.location.href = 'admin/login.html';
    }, 150);
}

// Portfolio Data Management
class PortfolioDataManager {
    constructor() {
        this.storagePrefix = 'portfolio_';
        this.loadPortfolioData();
    }

    // Load data from localStorage and update the portfolio
    loadPortfolioData() {
        try {
            // Load and update personal info
            const personalInfo = this.getData('personal_info');
            if (personalInfo) {
                this.updatePersonalInfo(personalInfo);
            }

            // Load and update projects
            const projects = this.getData('projects');
            if (projects && projects.length > 0) {
                this.updateProjects(projects);
            }

            // Load and update skills
            const skills = this.getData('skills');
            if (skills && skills.length > 0) {
                this.updateSkills(skills);
            }

            // Load and update experience
            const experience = this.getData('experience');
            if (experience && experience.length > 0) {
                this.updateExperience(experience);
            }

            // Load and update about section
            const aboutInfo = this.getData('about_info');
            if (aboutInfo) {
                this.updateAboutInfo(aboutInfo);
            }

        } catch (error) {
            console.error('Error loading portfolio data:', error);
        }
    }

    // Get data from localStorage
    getData(key) {
        try {
            const data = localStorage.getItem(this.storagePrefix + key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting data for key:', key, error);
            return null;
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

        // Update footer
        const footerName = document.querySelector('.admin-link');
        if (footerName && info.name) {
            footerName.textContent = info.name;
        }
    }

    // Update projects section
    updateProjects(projects) {
        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid || projects.length === 0) return;

        // Clear existing projects
        projectsGrid.innerHTML = '';

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
        projectCard.setAttribute('data-category', project.category || 'all');

        projectCard.innerHTML = `
            <div class="project-image">
                <img src="${project.image || 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&h=400&fit=crop'}" alt="${project.title}">
                <div class="project-overlay">
                    <div class="project-links">
                        ${project.demo_url ? `<a href="${project.demo_url}" class="project-link" target="_blank"><i class="fas fa-external-link-alt"></i></a>` : ''}
                        ${project.github_url ? `<a href="${project.github_url}" class="project-link" target="_blank"><i class="fab fa-github"></i></a>` : ''}
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

        // Add new skills
        skills.forEach(skill => {
            const skillCard = this.createSkillCard(skill);
            skillsGrid.appendChild(skillCard);
        });

        // Re-observe elements for animations
        const newSkillCards = skillsGrid.querySelectorAll('.skill-card');
        newSkillCards.forEach(card => observer.observe(card));
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
            'node.js': 'fab fa-node-js'
        };

        const iconClass = iconMap[skill.name.toLowerCase()] || 'fas fa-cog';

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

        // Add new experience items
        experiences.forEach(exp => {
            const timelineItem = this.createTimelineItem(exp);
            timeline.appendChild(timelineItem);
        });

        // Re-observe elements for animations
        const newTimelineItems = timeline.querySelectorAll('.timeline-item');
        newTimelineItems.forEach(item => observer.observe(item));
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
                <div class="timeline-tech">
                    ${experience.technologies ? experience.technologies.split(',').map(tech => `<span class="tech-tag">${tech.trim()}</span>`).join('') : ''}
                </div>
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
                }
                if (aboutInfo.resume.text) {
                    resumeBtn.textContent = aboutInfo.resume.text;
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
}

// Initialize Portfolio Data Manager
const portfolioDataManager = new PortfolioDataManager();
