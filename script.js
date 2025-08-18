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
    mobileNav.classList.toggle('open');
    const icon = this.querySelector('i');
    if (mobileNav.classList.contains('open')) {
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

// Form submission (you can integrate with a backend service)
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Create mailto link as fallback
    const mailtoLink = `mailto:Mudit.Jain@utdallas.edu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    alert('Thank you for your message! Your email client should open now.');
    
    // Reset form
    this.reset();
});

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
        hintArrow.classList.remove('visible');
        hintArrow.classList.add('hidden');
    }
}

function showHintArrow() {
    if (hintArrow) {
        hintArrow.classList.remove('hidden');
        hintArrow.classList.add('visible');
    }
}

// Show hint arrow initially with a delay
window.addEventListener('load', () => {
    setTimeout(() => {
        if (hintArrow && window.scrollY < 50 && !codeToggle.checked) {
            showHintArrow();
        }
    }, 3000); // Show after 3 seconds
});