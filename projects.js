// Projects Page JavaScript

// Global variables
let currentFilter = 'all';
let currentSort = 'newest';
let projectsData = [];
let displayedProjects = 6;
const projectsPerLoad = 3;

// DOM Elements
const filterBtns = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sort-projects');
const projectsGrid = document.querySelector('.projects-grid');
const loadMoreBtn = document.getElementById('load-more-btn');
const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-content');
const modalClose = document.querySelector('.modal-close');

// Project data for detailed information
const projectDetails = {
    chatbot: {
        title: "AI-Powered Customer Support Chatbot",
        fullDescription: "This advanced conversational AI system revolutionizes customer support by providing intelligent, context-aware responses. The chatbot utilizes state-of-the-art natural language processing models to understand customer queries and provide accurate, helpful responses.",
        challenges: [
            "Handling complex multi-intent conversations",
            "Maintaining context across long conversations",
            "Integrating with existing CRM systems",
            "Supporting multiple languages with cultural nuances"
        ],
        solutions: [
            "Implemented transformer-based architecture for better context understanding",
            "Created a sophisticated dialogue management system",
            "Developed custom APIs for seamless CRM integration",
            "Used multilingual BERT models for cross-language support"
        ],
        timeline: "6 months",
        teamSize: "5 developers",
        gallery: [
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop",
            "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=500&fit=crop",
            "https://images.unsplash.com/photo-1526378800651-c32d6fd60263?w=800&h=500&fit=crop"
        ]
    },
    vision: {
        title: "Real-time Object Detection System",
        fullDescription: "A cutting-edge computer vision system designed for real-time object detection and tracking in surveillance applications. The system processes multiple video streams simultaneously and provides instant alerts for security threats.",
        challenges: [
            "Processing multiple high-resolution video streams in real-time",
            "Minimizing false positive alerts",
            "Handling varying lighting conditions",
            "Scaling across multiple camera locations"
        ],
        solutions: [
            "Optimized YOLOv8 architecture with custom training pipeline",
            "Implemented advanced post-processing algorithms",
            "Created adaptive preprocessing for different environments",
            "Designed distributed processing architecture with Kubernetes"
        ],
        timeline: "8 months",
        teamSize: "4 developers",
        gallery: [
            "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=500&fit=crop",
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=500&fit=crop",
            "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&h=500&fit=crop"
        ]
    },
    dashboard: {
        title: "Machine Learning Analytics Dashboard",
        fullDescription: "An interactive web-based dashboard that provides real-time insights into machine learning model performance, data quality metrics, and business KPIs. The platform enables data scientists and business stakeholders to monitor and optimize AI systems.",
        challenges: [
            "Handling real-time data streams from multiple sources",
            "Creating intuitive visualizations for complex ML metrics",
            "Ensuring fast loading times with large datasets",
            "Providing collaborative features for team workflows"
        ],
        solutions: [
            "Implemented WebSocket connections for real-time updates",
            "Used D3.js for custom, interactive visualizations",
            "Optimized database queries and implemented caching strategies",
            "Built collaborative annotation and sharing features"
        ],
        timeline: "5 months",
        teamSize: "6 developers",
        gallery: [
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
            "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=500&fit=crop"
        ]
    },
    health: {
        title: "AI-Powered Health Monitoring App",
        fullDescription: "A comprehensive mobile health application that uses artificial intelligence to provide personalized health insights, symptom analysis, and wellness recommendations. The app integrates with various health devices and provides predictive health analytics.",
        challenges: [
            "Ensuring medical accuracy and regulatory compliance",
            "Integrating with multiple health device APIs",
            "Providing offline functionality for remote areas",
            "Maintaining user privacy and data security"
        ],
        solutions: [
            "Collaborated with medical professionals for validation",
            "Created unified API layer for device integration",
            "Implemented local ML models with TensorFlow Lite",
            "Used end-to-end encryption and HIPAA compliance measures"
        ],
        timeline: "10 months",
        teamSize: "8 developers",
        gallery: [
            "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=500&fit=crop",
            "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=500&fit=crop",
            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=500&fit=crop"
        ]
    },
    analytics: {
        title: "Business Intelligence & Predictive Analytics",
        fullDescription: "An enterprise-grade analytics engine that processes large volumes of business data to provide actionable insights, forecasting, and predictive modeling capabilities. The system helps businesses make data-driven decisions and optimize operations.",
        challenges: [
            "Processing terabytes of data efficiently",
            "Creating accurate predictive models across different business domains",
            "Providing real-time insights for time-sensitive decisions",
            "Ensuring scalability across different client sizes"
        ],
        solutions: [
            "Implemented distributed computing with Apache Spark",
            "Developed domain-specific ML pipelines with automated feature engineering",
            "Created streaming analytics with Apache Kafka",
            "Built containerized microservices architecture"
        ],
        timeline: "12 months",
        teamSize: "10 developers",
        gallery: [
            "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=500&fit=crop",
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop"
        ]
    },
    ecommerce: {
        title: "AI-Enhanced E-commerce Platform",
        fullDescription: "A full-stack e-commerce solution that leverages artificial intelligence to provide personalized shopping experiences, intelligent product recommendations, and automated inventory management. The platform serves millions of users with high performance and reliability.",
        challenges: [
            "Handling high traffic loads during peak shopping periods",
            "Providing real-time personalized recommendations",
            "Managing complex inventory across multiple warehouses",
            "Ensuring secure payment processing and fraud detection"
        ],
        solutions: [
            "Implemented microservices architecture with auto-scaling",
            "Developed real-time recommendation engine using collaborative filtering",
            "Created intelligent inventory management system with predictive restocking",
            "Integrated advanced fraud detection with ML-based risk scoring"
        ],
        timeline: "14 months",
        teamSize: "12 developers",
        gallery: [
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
            "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop",
            "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=500&fit=crop"
        ]
    }
};

// Initialize projects data
function initializeProjectsData() {
    const projectCards = document.querySelectorAll('.project-card-detailed');
    projectsData = Array.from(projectCards).map((card, index) => ({
        element: card,
        category: card.getAttribute('data-category'),
        date: new Date(card.getAttribute('data-date')),
        title: card.querySelector('.project-title').textContent,
        index: index
    }));
}

// Filter projects
function filterProjects(category) {
    currentFilter = category;
    
    // Update active filter button
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === category) {
            btn.classList.add('active');
        }
    });
    
    // Filter and display projects
    displayProjects();
}

// Sort projects
function sortProjects() {
    const sortValue = sortSelect.value;
    currentSort = sortValue;
    
    projectsData.sort((a, b) => {
        switch (sortValue) {
            case 'newest':
                return b.date - a.date;
            case 'oldest':
                return a.date - b.date;
            case 'name':
                return a.title.localeCompare(b.title);
            default:
                return 0;
        }
    });
    
    displayProjects();
}

// Display projects based on current filter and sort
function displayProjects() {
    let filteredProjects = projectsData;
    
    // Apply filter
    if (currentFilter !== 'all') {
        filteredProjects = projectsData.filter(project => 
            project.category === currentFilter
        );
    }
    
    // Hide all projects first
    projectsData.forEach(project => {
        project.element.style.display = 'none';
        project.element.style.opacity = '0';
        project.element.style.transform = 'translateY(20px)';
    });
    
    // Show filtered projects with animation
    filteredProjects.slice(0, displayedProjects).forEach((project, index) => {
        setTimeout(() => {
            project.element.style.display = 'block';
            setTimeout(() => {
                project.element.style.opacity = '1';
                project.element.style.transform = 'translateY(0)';
            }, 50);
        }, index * 100);
    });
    
    // Update load more button visibility
    if (filteredProjects.length > displayedProjects) {
        loadMoreBtn.style.display = 'block';
    } else {
        loadMoreBtn.style.display = 'none';
    }
    
    // Update results count
    updateResultsCount(filteredProjects.length);
}

// Update results count
function updateResultsCount(count) {
    let countElement = document.querySelector('.results-count');
    if (!countElement) {
        countElement = document.createElement('div');
        countElement.className = 'results-count';
        countElement.style.cssText = `
            text-align: center;
            color: #8892b0;
            margin-bottom: 2rem;
            font-size: 1rem;
        `;
        projectsGrid.parentNode.insertBefore(countElement, projectsGrid);
    }
    
    const filterText = currentFilter === 'all' ? 'all categories' : currentFilter;
    countElement.textContent = `Showing ${Math.min(displayedProjects, count)} of ${count} projects in ${filterText}`;
}

// Load more projects
function loadMoreProjects() {
    displayedProjects += projectsPerLoad;
    displayProjects();
    
    // Add loading animation
    loadMoreBtn.textContent = 'Loading...';
    loadMoreBtn.disabled = true;
    
    setTimeout(() => {
        loadMoreBtn.textContent = 'Load More Projects';
        loadMoreBtn.disabled = false;
    }, 1000);
}

// Open project modal
function openProjectModal(projectKey) {
    const project = projectDetails[projectKey];
    if (!project) return;
    
    modalTitle.textContent = project.title;
    
    modalContent.innerHTML = `
        <div class="modal-project-content">
            <div class="modal-description">
                <h3>Project Overview</h3>
                <p>${project.fullDescription}</p>
            </div>
            
            <div class="modal-gallery">
                <h3>Project Gallery</h3>
                <div class="gallery-grid">
                    ${project.gallery.map(img => `
                        <img src="${img}" alt="Project Image" class="gallery-image">
                    `).join('')}
                </div>
            </div>
            
            <div class="modal-details">
                <div class="detail-section">
                    <h3>Challenges</h3>
                    <ul>
                        ${project.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h3>Solutions</h3>
                    <ul>
                        ${project.solutions.map(solution => `<li>${solution}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="project-info">
                    <div class="info-item">
                        <strong>Timeline:</strong> ${project.timeline}
                    </div>
                    <div class="info-item">
                        <strong>Team Size:</strong> ${project.teamSize}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .modal-project-content {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }
        
        .modal-description h3,
        .detail-section h3 {
            color: #64ffda;
            margin-bottom: 1rem;
            font-size: 1.2rem;
        }
        
        .modal-description p {
            color: #8892b0;
            line-height: 1.7;
        }
        
        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
        }
        
        .gallery-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: transform 0.3s ease;
            cursor: pointer;
        }
        
        .gallery-image:hover {
            transform: scale(1.05);
        }
        
        .modal-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
        }
        
        .detail-section ul {
            list-style: none;
            padding: 0;
        }
        
        .detail-section li {
            color: #8892b0;
            padding: 0.5rem 0;
            padding-left: 1.5rem;
            position: relative;
        }
        
        .detail-section li::before {
            content: '•';
            color: #64ffda;
            position: absolute;
            left: 0;
        }
        
        .project-info {
            grid-column: 1 / -1;
            display: flex;
            gap: 2rem;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            margin-top: 1rem;
        }
        
        .info-item {
            color: #e4e6ea;
        }
        
        .info-item strong {
            color: #64ffda;
        }
        
        @media (max-width: 768px) {
            .modal-details {
                grid-template-columns: 1fr;
            }
            
            .project-info {
                flex-direction: column;
                gap: 1rem;
            }
        }
    `;
    
    if (!document.head.querySelector('#modal-styles')) {
        style.id = 'modal-styles';
        document.head.appendChild(style);
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add click handlers for gallery images
    setTimeout(() => {
        const galleryImages = modal.querySelectorAll('.gallery-image');
        galleryImages.forEach(img => {
            img.addEventListener('click', () => openImageModal(img.src));
        });
    }, 100);
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Open image modal for gallery
function openImageModal(imageSrc) {
    const imageModal = document.createElement('div');
    imageModal.className = 'image-modal';
    imageModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 20000;
        backdrop-filter: blur(5px);
    `;
    
    imageModal.innerHTML = `
        <div class="image-modal-content">
            <img src="${imageSrc}" alt="Project Image" style="
                max-width: 90vw;
                max-height: 90vh;
                object-fit: contain;
                border-radius: 12px;
            ">
            <button class="image-modal-close" style="
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                font-size: 20px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            ">&times;</button>
        </div>
    `;
    
    document.body.appendChild(imageModal);
    
    // Close handlers
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            document.body.removeChild(imageModal);
        }
    });
    
    imageModal.querySelector('.image-modal-close').addEventListener('click', () => {
        document.body.removeChild(imageModal);
    });
}

// Search functionality
function createSearchBox() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.style.cssText = `
        position: relative;
        margin-bottom: 2rem;
    `;
    
    searchContainer.innerHTML = `
        <input type="text" id="project-search" placeholder="Search projects..." style="
            width: 100%;
            padding: 1rem 1rem 1rem 3rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 25px;
            color: #e4e6ea;
            font-family: inherit;
            font-size: 1rem;
            transition: all 0.3s ease;
        ">
        <i class="fas fa-search" style="
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: #8892b0;
            font-size: 1rem;
        "></i>
    `;
    
    const filtersSection = document.querySelector('.projects-filter-section .container');
    filtersSection.insertBefore(searchContainer, filtersSection.firstChild);
    
    // Search functionality
    const searchInput = document.getElementById('project-search');
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    searchInput.addEventListener('focus', function() {
        this.style.borderColor = '#64ffda';
        this.style.background = 'rgba(255, 255, 255, 0.08)';
    });
    
    searchInput.addEventListener('blur', function() {
        this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        this.style.background = 'rgba(255, 255, 255, 0.05)';
    });
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    projectsData.forEach(project => {
        const title = project.title.toLowerCase();
        const description = project.element.querySelector('.project-description').textContent.toLowerCase();
        const techTags = Array.from(project.element.querySelectorAll('.tech-tag'))
            .map(tag => tag.textContent.toLowerCase()).join(' ');
        
        const isMatch = title.includes(searchTerm) || 
                       description.includes(searchTerm) || 
                       techTags.includes(searchTerm);
        
        if (isMatch) {
            project.element.style.display = 'block';
            setTimeout(() => {
                project.element.style.opacity = '1';
                project.element.style.transform = 'translateY(0)';
            }, 50);
        } else {
            project.element.style.opacity = '0';
            project.element.style.transform = 'translateY(20px)';
            setTimeout(() => {
                project.element.style.display = 'none';
            }, 300);
        }
    });
}

// Debounce function
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

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeProjectsData();
    createSearchBox();
    displayProjects();
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-filter');
            filterProjects(category);
        });
    });
    
    // Sort select
    if (sortSelect) {
        sortSelect.addEventListener('change', sortProjects);
    }
    
    // Load more button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreProjects);
    }
    
    // Modal close handlers
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe project cards
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card-detailed');
    projectCards.forEach(card => observer.observe(card));
});

// Smooth scroll to top functionality
function addScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: #64ffda;
        color: #0a192f;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(100, 255, 218, 0.3);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top on click
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top
addScrollToTop();

// Performance monitoring
function trackPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }
}

trackPerformance();
