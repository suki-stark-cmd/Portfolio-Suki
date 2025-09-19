// Firebase Database Initialization Script
import { firebaseService } from './firebase-config.js';

class FirebaseDatabaseInitializer {
    constructor() {
        this.firebase = firebaseService;
        this.initializeData();
    }

    async initializeData() {
        console.log('🔥 Initializing Firebase database with portfolio data...');
        
        try {
            // Initialize Personal Information
            await this.initializePersonalInfo();
            
            // Initialize About Information
            await this.initializeAboutInfo();
            
            // Initialize Projects
            await this.initializeProjects();
            
            // Initialize Skills
            await this.initializeSkills();
            
            // Initialize Experience
            await this.initializeExperience();
            
            console.log('✅ Firebase database initialized successfully!');
            
        } catch (error) {
            console.error('❌ Error initializing Firebase database:', error);
        }
    }

    async initializePersonalInfo() {
        const personalInfo = {
            name: "Suki S",
            title: "AI Developer & Machine Learning Engineer",
            bio: "Passionate AI developer with expertise in machine learning, deep learning, and full-stack development. I create intelligent solutions that bridge the gap between cutting-edge AI research and practical applications.",
            email: "suki.stark@example.com",
            phone: "+1 (555) 123-4567",
            location: "San Francisco, CA",
            github: "https://github.com/suki-stark-cmd",
            linkedin: "https://linkedin.com/in/suki-s",
            twitter: "https://twitter.com/suki_stark"
        };

        const result = await this.firebase.addDocument('personalInfo', personalInfo, 'main');
        if (result.success) {
            console.log('✅ Personal information initialized');
        } else {
            console.error('❌ Failed to initialize personal information:', result.error);
        }
    }

    async initializeAboutInfo() {
        const aboutInfo = {
            description: "I'm a passionate AI developer with a strong background in machine learning, deep learning, and full-stack development. My journey in tech started with a fascination for how machines can learn and adapt, leading me to specialize in creating intelligent solutions that solve real-world problems.",
            stats: {
                projects: "50+",
                experience: "5+",
                technologies: "25+",
                satisfaction: "99%"
            },
            skillCategories: {
                ai_ml: {
                    title: "AI & Machine Learning",
                    tags: ["TensorFlow", "PyTorch", "Scikit-learn", "OpenCV", "NLTK"]
                },
                programming: {
                    title: "Programming Languages",
                    tags: ["Python", "JavaScript", "TypeScript", "Java", "C++"]
                },
                web: {
                    title: "Web Development",
                    tags: ["React", "Node.js", "Express", "MongoDB", "PostgreSQL"]
                },
                cloud: {
                    title: "Cloud & DevOps",
                    tags: ["AWS", "Google Cloud", "Docker", "Kubernetes", "CI/CD"]
                }
            },
            resume: {
                link: "https://drive.google.com/file/d/your-resume-id/view",
                text: "Download Resume"
            }
        };

        const result = await this.firebase.addDocument('aboutInfo', aboutInfo, 'main');
        if (result.success) {
            console.log('✅ About information initialized');
        } else {
            console.error('❌ Failed to initialize about information:', result.error);
        }
    }

    async initializeProjects() {
        const projects = [
            {
                title: "AI-Powered Chatbot",
                description: "Developed an intelligent chatbot using natural language processing and machine learning algorithms for customer service automation.",
                category: "ai",
                technologies: "Python, TensorFlow, NLTK, Flask, React",
                image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&h=400&fit=crop",
                demo_url: "https://ai-chatbot-demo.herokuapp.com",
                github_url: "https://github.com/suki-stark-cmd/ai-chatbot",
                createdAt: new Date().toISOString()
            },
            {
                title: "Computer Vision App",
                description: "Built a real-time object detection and classification system using deep learning and computer vision techniques.",
                category: "ai",
                technologies: "Python, OpenCV, PyTorch, FastAPI, Vue.js",
                image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop",
                demo_url: "https://cv-detection-app.netlify.app",
                github_url: "https://github.com/suki-stark-cmd/computer-vision-app",
                createdAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
                title: "E-Commerce Platform",
                description: "Full-stack e-commerce solution with modern UI, payment integration, and advanced features like recommendation systems.",
                category: "web",
                technologies: "React, Node.js, MongoDB, Stripe, Redux",
                image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
                demo_url: "https://modern-ecommerce-demo.vercel.app",
                github_url: "https://github.com/suki-stark-cmd/ecommerce-platform",
                createdAt: new Date(Date.now() - 172800000).toISOString()
            },
            {
                title: "Data Visualization Dashboard",
                description: "Interactive dashboard for data analysis and visualization with real-time updates and advanced charting capabilities.",
                category: "data",
                technologies: "D3.js, React, Python, PostgreSQL, Docker",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
                demo_url: "https://data-viz-dashboard.github.io",
                github_url: "https://github.com/suki-stark-cmd/data-dashboard",
                createdAt: new Date(Date.now() - 259200000).toISOString()
            },
            {
                title: "Mobile Finance App",
                description: "Cross-platform mobile application for personal finance management with AI-powered spending insights.",
                category: "mobile",
                technologies: "React Native, Firebase, TensorFlow Lite, Chart.js",
                image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
                demo_url: "https://finance-app-demo.expo.dev",
                github_url: "https://github.com/suki-stark-cmd/finance-mobile-app",
                createdAt: new Date(Date.now() - 345600000).toISOString()
            },
            {
                title: "Cloud Infrastructure",
                description: "Scalable cloud infrastructure setup with microservices architecture, automated deployment, and monitoring.",
                category: "devops",
                technologies: "AWS, Kubernetes, Docker, Terraform, Prometheus",
                image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
                demo_url: "https://cloud-infrastructure-docs.gitbook.io",
                github_url: "https://github.com/suki-stark-cmd/cloud-infrastructure",
                createdAt: new Date(Date.now() - 432000000).toISOString()
            }
        ];

        for (const project of projects) {
            const result = await this.firebase.addDocument('projects', project);
            if (result.success) {
                console.log(`✅ Project "${project.title}" added`);
            } else {
                console.error(`❌ Failed to add project "${project.title}":`, result.error);
            }
        }
    }

    async initializeSkills() {
        const skills = [
            {
                name: "Machine Learning",
                category: "ai",
                description: "Expert in supervised and unsupervised learning algorithms, model optimization, and deployment.",
                proficiency: 95,
                icon: "fas fa-brain"
            },
            {
                name: "Deep Learning",
                category: "ai",
                description: "Specialized in neural networks, CNN, RNN, and transformer architectures for various applications.",
                proficiency: 90,
                icon: "fas fa-robot"
            },
            {
                name: "Python",
                category: "programming",
                description: "Advanced Python development with focus on data science, AI, and backend development.",
                proficiency: 95,
                icon: "fab fa-python"
            },
            {
                name: "JavaScript",
                category: "programming",
                description: "Full-stack JavaScript development including ES6+, Node.js, and modern frameworks.",
                proficiency: 90,
                icon: "fab fa-js-square"
            },
            {
                name: "React",
                category: "frontend",
                description: "Expert in building responsive and interactive user interfaces with React ecosystem.",
                proficiency: 88,
                icon: "fab fa-react"
            },
            {
                name: "Node.js",
                category: "backend",
                description: "Backend development with Node.js, Express, and various database integrations.",
                proficiency: 85,
                icon: "fab fa-node-js"
            },
            {
                name: "TensorFlow",
                category: "ai",
                description: "Building and deploying machine learning models using TensorFlow and Keras.",
                proficiency: 88,
                icon: "fas fa-brain"
            },
            {
                name: "AWS",
                category: "cloud",
                description: "Cloud infrastructure management, serverless computing, and scalable deployments.",
                proficiency: 82,
                icon: "fab fa-aws"
            },
            {
                name: "Docker",
                category: "devops",
                description: "Containerization, orchestration, and deployment automation with Docker and Kubernetes.",
                proficiency: 80,
                icon: "fab fa-docker"
            },
            {
                name: "PostgreSQL",
                category: "database",
                description: "Database design, optimization, and management for complex applications.",
                proficiency: 85,
                icon: "fas fa-database"
            },
            {
                name: "Git",
                category: "tools",
                description: "Version control, collaborative development, and CI/CD pipeline management.",
                proficiency: 92,
                icon: "fab fa-git-alt"
            },
            {
                name: "TypeScript",
                category: "programming",
                description: "Type-safe development for large-scale applications and better code maintainability.",
                proficiency: 87,
                icon: "fab fa-js-square"
            }
        ];

        for (const skill of skills) {
            const result = await this.firebase.addDocument('skills', skill);
            if (result.success) {
                console.log(`✅ Skill "${skill.name}" added`);
            } else {
                console.error(`❌ Failed to add skill "${skill.name}":`, result.error);
            }
        }
    }

    async initializeExperience() {
        const experiences = [
            {
                position: "Senior AI Developer",
                company: "TechFlow AI",
                start_date: "2022-01",
                end_date: null,
                description: "Leading AI initiatives and machine learning projects. Developed computer vision systems for automated quality control and NLP solutions for customer support automation.",
                technologies: "Python, TensorFlow, PyTorch, AWS, Docker, Kubernetes",
                location: "San Francisco, CA"
            },
            {
                position: "Machine Learning Engineer",
                company: "DataScope Inc.",
                start_date: "2020-03",
                end_date: "2021-12",
                description: "Built and deployed ML models for predictive analytics and recommendation systems. Improved model performance by 40% and reduced inference time by 60%.",
                technologies: "Python, Scikit-learn, Apache Spark, MongoDB, Flask",
                location: "Remote"
            },
            {
                position: "Full Stack Developer",
                company: "WebCraft Solutions",
                start_date: "2019-06",
                end_date: "2020-02",
                description: "Developed responsive web applications and RESTful APIs. Collaborated with cross-functional teams to deliver high-quality software solutions.",
                technologies: "React, Node.js, Express, PostgreSQL, Redux, Material-UI",
                location: "Boston, MA"
            },
            {
                position: "Software Developer Intern",
                company: "StartupHub",
                start_date: "2018-09",
                end_date: "2019-05",
                description: "Contributed to various projects including mobile app development and API integrations. Gained experience in agile development methodologies.",
                technologies: "React Native, Firebase, JavaScript, Git, Jira",
                location: "Austin, TX"
            }
        ];

        for (const experience of experiences) {
            const result = await this.firebase.addDocument('experience', experience);
            if (result.success) {
                console.log(`✅ Experience "${experience.position}" added`);
            } else {
                console.error(`❌ Failed to add experience "${experience.position}":`, result.error);
            }
        }
    }
}

// Initialize the database when this script is run
console.log('🚀 Starting Firebase database initialization...');
const initializer = new FirebaseDatabaseInitializer();