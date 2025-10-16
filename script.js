// Theme toggle functionality
const codeToggle = document.getElementById('codeToggle');
const hintArrow = document.getElementById('hintArrow');

codeToggle.addEventListener('change', function() {
    if (this.checked) {
        document.body.classList.add('code-mode');
    } else {
        document.body.classList.remove('code-mode');
    }
    
    // Hide hint arrow when toggle is used
    hideHintArrow();
});

// Mobile menu functionality
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

mobileMenuBtn.addEventListener('click', function() {
    const isOpen = mobileNav.classList.toggle('open');
    const icon = this.querySelector('i');
    
    // Update aria-expanded attribute
    this.setAttribute('aria-expanded', isOpen);
    
    if (isOpen) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    if (!mobileMenuBtn.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Smooth scroll behavior for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        // Close mobile menu if open
        if (mobileNav.classList.contains('open')) {
            mobileNav.classList.remove('open');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active link highlighting and navbar scroll effect
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    // Navbar scroll effect
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Show/hide scroll to top button
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }

    // Hide hint arrow when user scrolls
    if (window.scrollY > 50) {
        hideHintArrow();
    }

    // Active link highlighting
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Scroll to top functionality
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Form validation and submission
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('form-status');

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    field.classList.add('error');
    errorElement.textContent = message;
}

function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    field.classList.remove('error');
    errorElement.textContent = '';
}

function clearAllErrors() {
    ['name', 'email', 'subject', 'message'].forEach(clearError);
}

function validateForm(formData) {
    let isValid = true;
    clearAllErrors();
    
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const subject = formData.get('subject').trim();
    const message = formData.get('message').trim();
    const honeypot = formData.get('honeypot');
    
    // Check honeypot (spam prevention)
    if (honeypot) {
        return false;
    }
    
    if (!name || name.length < 2) {
        showError('name', 'Please enter a valid name (at least 2 characters)');
        isValid = false;
    }
    
    if (!email || !validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!subject || subject.length < 3) {
        showError('subject', 'Please enter a subject (at least 3 characters)');
        isValid = false;
    }
    
    if (!message || message.length < 10) {
        showError('message', 'Please enter a message (at least 10 characters)');
        isValid = false;
    }
    
    return isValid;
}

function showFormStatus(type, message) {
    formStatus.className = type;
    formStatus.textContent = message;
    
    // Auto-hide success message after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            formStatus.className = '';
            formStatus.textContent = '';
        }, 5000);
    }
}

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        
        // Validate form
        if (!validateForm(formData)) {
            showFormStatus('error', 'Please correct the errors above.');
            return;
        }
        
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const subject = formData.get('subject').trim();
        const message = formData.get('message').trim();
        
        // Disable submit button during processing
        const submitBtn = this.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
        
        try {
            // Create mailto link as fallback
            const mailtoLink = `mailto:Mudit.Jain@utdallas.edu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            showFormStatus('success', 'Thank you for your message! Your email client should open now.');
            
            // Reset form
            this.reset();
            clearAllErrors();
        } catch (error) {
            showFormStatus('error', 'There was an error sending your message. Please try again.');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane" aria-hidden="true"></i> Send Message';
        }
    });
    
    // Real-time validation
    ['name', 'email', 'subject', 'message'].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', function() {
                const formData = new FormData();
                formData.append(fieldId, this.value);
                
                // Only validate the current field
                if (fieldId === 'name' && this.value.trim().length > 0 && this.value.trim().length < 2) {
                    showError(fieldId, 'Please enter a valid name (at least 2 characters)');
                } else if (fieldId === 'email' && this.value.trim().length > 0 && !validateEmail(this.value.trim())) {
                    showError(fieldId, 'Please enter a valid email address');
                } else if (fieldId === 'subject' && this.value.trim().length > 0 && this.value.trim().length < 3) {
                    showError(fieldId, 'Please enter a subject (at least 3 characters)');
                } else if (fieldId === 'message' && this.value.trim().length > 0 && this.value.trim().length < 10) {
                    showError(fieldId, 'Please enter a message (at least 10 characters)');
                } else if (this.value.trim().length > 0) {
                    clearError(fieldId);
                }
            });
        }
    });
}

// Add some interactive hover effects
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
    });
    
    tag.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Programming language syntax rotation
const codeSyntaxes = [
    {
        before: 'const ',
        after: ' = "Software Engineer";',
        beforeColor: '#ff6b6b',
        afterColor: '#4ecdc4',
        language: 'JavaScript'
    },
    {
        before: 'let ',
        after: ': string = "Software Engineer";',
        beforeColor: '#61dafb',
        afterColor: '#f7df1e',
        language: 'TypeScript'
    },
    {
        before: 'String ',
        after: ' = "Software Engineer";',
        beforeColor: '#f89820',
        afterColor: '#5382a1',
        language: 'Java'
    },
    {
        before: '',
        after: ' = "Software Engineer"',
        beforeColor: '#3776ab',
        afterColor: '#ffd43b',
        language: 'Python'
    },
    {
        before: 'auto ',
        after: ' = "Software Engineer";',
        beforeColor: '#00599c',
        afterColor: '#659ad2',
        language: 'C++'
    },
    {
        before: 'var ',
        after: ' = "Software Engineer";',
        beforeColor: '#239120',
        afterColor: '#68217a',
        language: 'C#'
    },
    {
        before: 'final ',
        after: ' = "Software Engineer";',
        beforeColor: '#ff5722',
        afterColor: '#42a5f5',
        language: 'Dart'
    },
    {
        before: 'let ',
        after: ' = "Software Engineer"',
        beforeColor: '#fa7343',
        afterColor: '#8cc84b',
        language: 'Rust'
    }
];

let currentSyntaxIndex = 0;

function rotateSyntax() {
    const beforeElement = document.getElementById('codeBefore');
    const afterElement = document.getElementById('codeAfter');
    
    if (!beforeElement || !afterElement) return;

    // Fade out current syntax
    beforeElement.classList.add('fade-out');
    afterElement.classList.add('fade-out');

    setTimeout(() => {
        // Update to next syntax
        currentSyntaxIndex = (currentSyntaxIndex + 1) % codeSyntaxes.length;
        const currentSyntax = codeSyntaxes[currentSyntaxIndex];

        beforeElement.textContent = currentSyntax.before;
        beforeElement.style.color = currentSyntax.beforeColor;
        afterElement.textContent = currentSyntax.after;
        afterElement.style.color = currentSyntax.afterColor;

        // Fade in new syntax
        beforeElement.classList.remove('fade-out');
        afterElement.classList.remove('fade-out');
        beforeElement.classList.add('fade-in');
        afterElement.classList.add('fade-in');

        setTimeout(() => {
            beforeElement.classList.remove('fade-in');
            afterElement.classList.remove('fade-in');
        }, 500);
    }, 250);
}

// Initialize typing effect and syntax rotation on page load
window.addEventListener('load', () => {
    const nameElement = document.querySelector('.header-content h1');
    if (nameElement) {
        // Get just the name text (excluding the syntax spans)
        const nameTextNode = nameElement.childNodes[1]; // "Mudit Jain" text node
        const originalText = nameTextNode.textContent.trim();
        
        // Clear the name initially
        nameTextNode.textContent = '';
        
        // Type the name once
        setTimeout(() => {
            typeWriter(nameTextNode, originalText, 150);
        }, 1000);
        
        // Start syntax rotation after name is typed
        setTimeout(() => {
            setInterval(rotateSyntax, 3000); // Change every 3 seconds
        }, 3500); // Start after name typing is complete
    }
});

// Modified typeWriter for text nodes
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

// Hint arrow functionality
function hideHintArrow() {
    if (hintArrow) {
        hintArrow.classList.add('hidden');
    }
}

// Particle System
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        
        // Code snippets and tech symbols to display
        this.codeSnippets = [
            'const', 'function', 'return', 'import', 'export',
            '{...}', '() =>', '[]', '<>', '</>', '&&', '||',
            'git', 'npm', 'yarn', 'node', 'react', 'js', 'ts',
            'docker', 'aws', 'api', 'sql', 'json', 'html',
            'css', 'sass', 'vue', 'angular', 'python', 'java'
        ];
        
        this.colors = [
            '#22d3ee', '#4f46e5', '#6366f1', '#8b5cf6',
            '#a855f7', '#ec4899', '#f59e0b', '#10b981'
        ];
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => this.resize());
        
        // Mouse tracking for interaction
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const particleCount = Math.min(50, Math.floor(window.innerWidth * window.innerHeight / 15000));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                text: this.codeSnippets[Math.floor(Math.random() * this.codeSnippets.length)],
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                fontSize: Math.random() * 8 + 10,
                opacity: Math.random() * 0.5 + 0.1,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.01
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Mouse repulsion effect
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx -= dx * force * 0.001;
                particle.vy -= dy * force * 0.001;
            }
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.rotation += particle.rotationSpeed;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }
            
            // Draw particle
            this.ctx.save();
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation);
            this.ctx.font = `${particle.fontSize}px 'Fira Code', monospace`;
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(particle.text, 0, 0);
            this.ctx.restore();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Home Section Particle System
class HomeParticleSystem {
    constructor() {
        this.canvas = document.getElementById('homeParticleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        
        // More focused code snippets for home section
        this.heroSnippets = [
            'Hello World!', 'console.log()', 'const dev =', 'function()',
            'import *', 'export default', '=> {}', 'async/await',
            'new Promise()', '.then()', 'useState()', 'useEffect()',
            'git commit', 'npm start', 'docker run', 'aws deploy',
            '<Component/>', 'API', 'JSON', 'REST', 'GraphQL',
            'ML', 'AI', 'IoT', 'Cloud', 'Fullstack'
        ];
        
        // Brighter colors for home section
        this.colors = [
            '#22d3ee', '#4f46e5', '#6366f1', '#8b5cf6',
            '#a855f7', '#ec4899', '#f59e0b', '#10b981',
            '#ffffff', '#e2e8f0'
        ];
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => this.resize());
        
        // Mouse tracking for interaction
        document.addEventListener('mousemove', (e) => {
            const homeSection = document.getElementById('home');
            const rect = homeSection.getBoundingClientRect();
            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY - rect.top;
            }
        });
    }
    
    resize() {
        const homeSection = document.getElementById('home');
        this.canvas.width = homeSection.offsetWidth;
        this.canvas.height = homeSection.offsetHeight;
    }
    
    createParticles() {
        const particleCount = Math.min(30, Math.floor(this.canvas.width * this.canvas.height / 20000));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                text: this.heroSnippets[Math.floor(Math.random() * this.heroSnippets.length)],
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                fontSize: Math.random() * 10 + 12,
                opacity: Math.random() * 0.4 + 0.2,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.015,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                pulseOffset: Math.random() * Math.PI * 2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            // Mouse attraction effect (opposite of repulsion)
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150 * 0.0005;
                particle.vx += dx * force;
                particle.vy += dy * force;
            }
            
            // Update position with slight gravity toward center
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.rotation += particle.rotationSpeed;
            
            // Gentle drift toward center
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            particle.vx += (centerX - particle.x) * 0.00001;
            particle.vy += (centerY - particle.y) * 0.00001;
            
            // Bounce off edges with damping
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -0.8;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -0.8;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }
            
            // Velocity damping
            particle.vx *= 0.999;
            particle.vy *= 0.999;
            
            // Pulsing opacity effect
            const pulse = Math.sin(Date.now() * particle.pulseSpeed + particle.pulseOffset) * 0.1 + 0.9;
            
            // Draw particle with glow effect
            this.ctx.save();
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation);
            
            // Glow effect
            this.ctx.shadowColor = particle.color;
            this.ctx.shadowBlur = 10;
            
            this.ctx.font = `${particle.fontSize}px 'Fira Code', monospace`;
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity * pulse;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(particle.text, 0, 0);
            this.ctx.restore();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Mouse Trail System
class MouseTrail {
    constructor() {
        this.canvas = document.getElementById('trailCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.trail = [];
        this.maxTrailLength = 20;
        
        this.init();
    }
    
    init() {
        this.resize();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        
        document.addEventListener('mousemove', (e) => {
            this.addTrailPoint(e.clientX, e.clientY);
        });
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    addTrailPoint(x, y) {
        this.trail.push({
            x: x,
            y: y,
            life: 1.0,
            size: Math.random() * 3 + 2
        });
        
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = 0; i < this.trail.length; i++) {
            const point = this.trail[i];
            const gradient = this.ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, point.size * 2);
            
            gradient.addColorStop(0, `rgba(34, 211, 238, ${point.life * 0.6})`);
            gradient.addColorStop(0.5, `rgba(99, 102, 241, ${point.life * 0.4})`);
            gradient.addColorStop(1, `rgba(168, 85, 247, 0)`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, point.size * point.life, 0, Math.PI * 2);
            this.ctx.fill();
            
            point.life -= 0.05;
            point.size *= 0.98;
        }
        
        // Remove dead trail points
        this.trail = this.trail.filter(point => point.life > 0);
        
        requestAnimationFrame(() => this.animate());
    }
}

// Matrix Rain Effect
class MatrixRain {
    constructor() {
        this.canvas = document.getElementById('matrixCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.drops = [];
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]<>?/|\\~`';
        this.fontSize = 14;
        this.columns = 0;
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createDrops();
        this.animate();
        
        window.addEventListener('resize', () => {
            this.resize();
            this.createDrops();
        });
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
    }
    
    createDrops() {
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = {
                y: Math.random() * -500,
                speed: Math.random() * 3 + 2
            };
        }
    }
    
    animate() {
        this.ctx.fillStyle = 'rgba(17, 24, 39, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#22d3ee';
        this.ctx.font = `${this.fontSize}px 'Fira Code', monospace`;
        
        for (let i = 0; i < this.drops.length; i++) {
            const char = this.chars[Math.floor(Math.random() * this.chars.length)];
            const x = i * this.fontSize;
            const y = this.drops[i].y;
            
            // Gradient effect for falling characters
            const gradient = this.ctx.createLinearGradient(x, y - 100, x, y + 20);
            gradient.addColorStop(0, 'rgba(34, 211, 238, 0)');
            gradient.addColorStop(0.5, 'rgba(34, 211, 238, 0.8)');
            gradient.addColorStop(1, 'rgba(34, 211, 238, 0.3)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillText(char, x, y);
            
            this.drops[i].y += this.drops[i].speed;
            
            if (this.drops[i].y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i].y = Math.random() * -200;
                this.drops[i].speed = Math.random() * 3 + 2;
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Parallax scroll effect
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxBg = document.querySelector('.parallax-bg');
        const homeSection = document.getElementById('home');
        
        if (parallaxBg && homeSection) {
            const homeRect = homeSection.getBoundingClientRect();
            if (homeRect.bottom > 0 && homeRect.top < window.innerHeight) {
                const speed = scrolled * 0.5;
                parallaxBg.style.transform = `translateZ(-2px) scale(1.2) translate(-2%, ${speed * 0.1}px)`;
            }
        }
        
        // Parallax for other sections
        const sections = document.querySelectorAll('.content-section:not(#home)');
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
                const speed = (scrolled - section.offsetTop) * 0.1;
                section.style.transform = `translateY(${speed}px)`;
            }
        });
    });
}


// GitHub Activity Feed System
class GitHubActivityFeed {
    constructor() {
        this.username = 'muditjains';
        this.apiBase = 'https://api.github.com';
        this.activityFeed = document.getElementById('activityFeed');
        this.statusIndicator = document.getElementById('activityStatus');
        this.refreshBtn = document.getElementById('refreshActivity');
        this.statsElements = {
            totalRepos: document.getElementById('totalRepos'),
            totalCommits: document.getElementById('totalCommits'),
            activeRepos: document.getElementById('activeRepos')
        };
        this.retryCount = 0;
        this.maxRetries = 3;
        this.cacheTimeout = 300000; // 5 minutes
        this.cachedData = null;
        this.cacheTimestamp = null;
        
        this.init();
    }
    
    init() {
        if (!this.activityFeed || !this.statusIndicator || !this.refreshBtn) {
            console.warn('GitHub activity elements not found');
            return;
        }
        
        this.loadActivity();
        
        // Refresh button functionality
        this.refreshBtn.addEventListener('click', () => {
            this.loadActivity(true); // Force refresh
        });
        
        // Auto-refresh every 5 minutes
        setInterval(() => {
            this.loadActivity();
        }, this.cacheTimeout);
    }
    
    async loadActivity(forceRefresh = false) {
        // Check cache first
        if (!forceRefresh && this.cachedData && this.cacheTimestamp) {
            const cacheAge = Date.now() - this.cacheTimestamp;
            if (cacheAge < this.cacheTimeout) {
                this.renderCachedData();
                return;
            }
        }
        
        this.setStatus('loading', 'Fetching latest activity...');
        this.refreshBtn.classList.add('loading');
        
        // Update aria-busy attribute
        if (this.activityFeed) {
            this.activityFeed.setAttribute('aria-busy', 'true');
        }
        
        try {
            // Fetch user data and repositories
            const [userResponse, reposResponse, eventsResponse] = await Promise.all([
                fetch(`${this.apiBase}/users/${this.username}`, {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }),
                fetch(`${this.apiBase}/users/${this.username}/repos?sort=updated&per_page=10`, {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }),
                fetch(`${this.apiBase}/users/${this.username}/events/public?per_page=15`, {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json'
                    }
                })
            ]);
            
            // Check for rate limiting
            if (userResponse.status === 403 || reposResponse.status === 403 || eventsResponse.status === 403) {
                throw new Error('GitHub API rate limit exceeded');
            }
            
            if (!userResponse.ok || !reposResponse.ok || !eventsResponse.ok) {
                throw new Error('GitHub API request failed');
            }
            
            const userData = await userResponse.json();
            const reposData = await reposResponse.json();
            const eventsData = await eventsResponse.json();
            
            // Cache the data
            this.cachedData = { userData, reposData, eventsData };
            this.cacheTimestamp = Date.now();
            this.retryCount = 0;
            
            this.updateStats(userData, reposData, eventsData);
            this.renderActivity(eventsData, reposData);
            this.setStatus('success', `Last updated: ${new Date().toLocaleTimeString()}`);
            
        } catch (error) {
            console.error('GitHub API Error:', error);
            
            // Try retry logic
            if (this.retryCount < this.maxRetries) {
                this.retryCount++;
                setTimeout(() => {
                    this.loadActivity(forceRefresh);
                }, 2000 * this.retryCount); // Exponential backoff
            } else {
                this.handleError(error.message);
            }
        } finally {
            this.refreshBtn.classList.remove('loading');
            if (this.activityFeed) {
                this.activityFeed.setAttribute('aria-busy', 'false');
            }
        }
    }
    
    renderCachedData() {
        if (!this.cachedData) return;
        
        const { userData, reposData, eventsData } = this.cachedData;
        this.updateStats(userData, reposData, eventsData);
        this.renderActivity(eventsData, reposData);
        this.setStatus('success', `Showing cached data from ${new Date(this.cacheTimestamp).toLocaleTimeString()}`);
    }
    
    updateStats(userData, reposData, eventsData) {
        // Total repositories
        this.statsElements.totalRepos.textContent = userData.public_repos;
        
        // Recent commits count (from events)
        const commitEvents = eventsData.filter(event => event.type === 'PushEvent');
        const totalCommits = commitEvents.reduce((sum, event) => sum + (event.payload.commits?.length || 0), 0);
        this.statsElements.totalCommits.textContent = totalCommits;
        
        // Active repositories this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const activeRepos = reposData.filter(repo => new Date(repo.updated_at) > oneWeekAgo).length;
        this.statsElements.activeRepos.textContent = activeRepos;
    }
    
    renderActivity(eventsData, reposData) {
        this.activityFeed.innerHTML = '';
        
        if (eventsData.length === 0) {
            this.activityFeed.innerHTML = `
                <div class="activity-loading">
                    <p>No recent activity found.</p>
                </div>
            `;
            return;
        }
        
        eventsData.slice(0, 10).forEach(event => {
            const activityItem = this.createActivityItem(event);
            if (activityItem) {
                this.activityFeed.appendChild(activityItem);
            }
        });
    }
    
    createActivityItem(event) {
        const item = document.createElement('div');
        item.className = 'activity-item';
        
        const timeAgo = this.formatTimeAgo(new Date(event.created_at));
        const repoName = event.repo.name.split('/')[1];
        const repoUrl = `https://github.com/${event.repo.name}`;
        
        let icon = '📝';
        let title = '';
        let description = '';
        let iconClass = '';
        
        switch (event.type) {
            case 'PushEvent':
                icon = '🔧';
                iconClass = 'commit';
                const commitCount = event.payload.commits?.length || 0;
                title = `Pushed ${commitCount} commit${commitCount !== 1 ? 's' : ''} to ${repoName}`;
                if (event.payload.commits && event.payload.commits.length > 0) {
                    const lastCommit = event.payload.commits[event.payload.commits.length - 1];
                    description = lastCommit.message.length > 80 
                        ? lastCommit.message.substring(0, 80) + '...'
                        : lastCommit.message;
                }
                break;
                
            case 'CreateEvent':
                icon = '🆕';
                iconClass = 'repo';
                if (event.payload.ref_type === 'repository') {
                    title = `Created repository ${repoName}`;
                    description = event.payload.description || 'New repository created';
                } else {
                    title = `Created ${event.payload.ref_type} ${event.payload.ref} in ${repoName}`;
                }
                break;
                
            case 'WatchEvent':
                icon = '⭐';
                iconClass = 'star';
                title = `Starred ${repoName}`;
                break;
                
            case 'IssuesEvent':
                icon = '🐛';
                iconClass = 'repo';
                title = `${event.payload.action} issue in ${repoName}`;
                description = event.payload.issue?.title || '';
                break;
                
            case 'PullRequestEvent':
                icon = '🔀';
                iconClass = 'repo';
                title = `${event.payload.action} pull request in ${repoName}`;
                description = event.payload.pull_request?.title || '';
                break;
                
            case 'ForkEvent':
                icon = '🍴';
                iconClass = 'repo';
                title = `Forked ${repoName}`;
                break;
                
            default:
                return null; // Skip unsupported event types
        }
        
        item.innerHTML = `
            <div class="activity-icon ${iconClass}">
                ${icon}
            </div>
            <div class="activity-content">
                <div class="activity-title">${title}</div>
                ${description ? `<div class="activity-description">${description}</div>` : ''}
                <div class="activity-meta">
                    <a href="${repoUrl}" class="repo-link" target="_blank">${event.repo.name}</a>
                    <span>${timeAgo}</span>
                </div>
            </div>
        `;
        
        return item;
    }
    
    formatTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return `${Math.floor(diffInSeconds / 604800)}w ago`;
    }
    
    setStatus(type, message) {
        const statusDot = this.statusIndicator.querySelector('.status-dot');
        const statusText = this.statusIndicator.querySelector('.status-text');
        
        statusDot.className = `status-dot ${type}`;
        statusText.textContent = message;
    }
    
    handleError(message = 'Failed to load GitHub activity') {
        this.setStatus('error', message);
        
        if (this.activityFeed) {
            this.activityFeed.innerHTML = `
                <div class="activity-loading">
                    <p>Unable to load GitHub activity. Please try again later.</p>
                    <p style="font-size: 0.8rem; margin-top: 10px; opacity: 0.7;">
                        ${message.includes('rate limit') 
                            ? 'GitHub API rate limit exceeded. Please try again in a few minutes.' 
                            : 'This might be due to API rate limits or network issues.'}
                    </p>
                    <button onclick="location.reload()" style="margin-top: 15px; padding: 8px 16px; background: var(--primary); border: none; border-radius: 8px; color: white; cursor: pointer;">
                        Retry
                    </button>
                </div>
            `;
        }
        
        // Reset stats only if no cached data
        if (!this.cachedData) {
            Object.values(this.statsElements).forEach(element => {
                if (element) element.textContent = '-';
            });
        }
    }
}

// Performance optimization: Use requestIdleCallback for non-critical animations
function initializeEffects() {
    // Critical: Initialize immediately
    initParallax();
    new GitHubActivityFeed();
    
    // Non-critical: Defer until browser is idle
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            new ParticleSystem();
            new HomeParticleSystem();
            new MouseTrail();
            new MatrixRain();
        }, { timeout: 2000 });
    } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
            new ParticleSystem();
            new HomeParticleSystem();
            new MouseTrail();
            new MatrixRain();
        }, 1000);
    }
}

// Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
        if (document.hidden) {
            canvas.style.display = 'none';
        } else {
            canvas.style.display = 'block';
        }
    });
});

// Initialize all systems when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEffects);
} else {
    initializeEffects();
}
