// Ultra-modern DevOps Portfolio JavaScript - Fixed Version
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all animations and interactions
    initParticleSystem();
    initTypingAnimation();
    initScrollAnimations();
    initStatsAnimation();
    initSkillsAnimation();
    initNavigation();
    initContactForm();
    initFloatingCards();
    initGlobalScrollEffects();
    initSectionVisibility();
    initProjectCardEffects();
    initAwardAnimations();
    
    // Particle System - Enhanced
    function initParticleSystem() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;
        
        const particleCount = 30;
        
        function createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random starting position
            const startX = Math.random() * window.innerWidth;
            const startY = window.innerHeight + 10;
            
            particle.style.left = startX + 'px';
            particle.style.top = startY + 'px';
            particle.style.position = 'fixed';
            particle.style.pointerEvents = 'none';
            
            // Random animation duration and delay
            const duration = Math.random() * 4 + 6; // 6-10 seconds
            const delay = Math.random() * 2;
            
            particle.style.animationDuration = duration + 's';
            particle.style.animationDelay = delay + 's';
            
            // Random colors
            const colors = ['#00D9FF', '#39FF14', '#FF1493', '#FFD700'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.background = color;
            particle.style.boxShadow = `0 0 6px ${color}`;
            
            // Random sizes
            const size = Math.random() * 3 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.borderRadius = '50%';
            
            // Apply floating animation
            particle.style.animation = `floatUp ${duration}s linear forwards`;
            
            particlesContainer.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, (duration + delay) * 1000);
        }
        
        // Add CSS for particle animation
        if (!document.getElementById('particle-styles')) {
            const style = document.createElement('style');
            style.id = 'particle-styles';
            style.textContent = `
                @keyframes floatUp {
                    0% { 
                        transform: translateY(0px) translateX(0px) rotate(0deg);
                        opacity: 0;
                    }
                    10% { 
                        opacity: 1;
                    }
                    90% { 
                        opacity: 1;
                    }
                    100% { 
                        transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Create initial particles
        for (let i = 0; i < particleCount; i++) {
            setTimeout(createParticle, i * 200);
        }
        
        // Continuously create new particles
        setInterval(createParticle, 400);
    }
    
    // Typing Animation - Enhanced
    function initTypingAnimation() {
        const typingElement = document.getElementById('typingText');
        if (!typingElement) return;
        
        const titles = [
            'DevOps Engineer',
            'Cloud Architect', 
            'Infrastructure Automation Expert',
            'CI/CD Specialist',
            'Kubernetes Expert'
        ];
        
        let currentIndex = 0;
        let currentText = '';
        let isDeleting = false;
        
        function typeText() {
            const currentTitle = titles[currentIndex];
            
            if (!isDeleting) {
                currentText = currentTitle.substring(0, currentText.length + 1);
            } else {
                currentText = currentTitle.substring(0, currentText.length - 1);
            }
            
            typingElement.textContent = currentText;
            
            let delay = isDeleting ? 50 : 100;
            
            if (!isDeleting && currentText === currentTitle) {
                delay = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && currentText === '') {
                isDeleting = false;
                currentIndex = (currentIndex + 1) % titles.length;
                delay = 500; // Pause before next title
            }
            
            setTimeout(typeText, delay);
        }
        
        typeText();
    }
    
    // Fixed Navigation System
    function initNavigation() {
        const navbar = document.getElementById('navbar');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Navbar scroll effect
        function handleScroll() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        window.addEventListener('scroll', handleScroll);
        
        // Fixed smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Calculate offset position
                    const navHeight = navbar.offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight - 20;
                    
                    // Smooth scroll to target
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Add active class
                    navLinks.forEach(nl => nl.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
        
        // Update active link on scroll
        function updateActiveLink() {
            const sections = document.querySelectorAll('section');
            const scrollPos = window.scrollY + navbar.offsetHeight + 50;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                const sectionId = section.id;
                
                if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
        
        window.addEventListener('scroll', debounce(updateActiveLink, 10));
    }
    
    // Fixed Contact Form
    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        
        const inputs = form.querySelectorAll('.form-control');
        
        // Enhanced floating label effect
        inputs.forEach(input => {
            // Set placeholder attribute for CSS to work
            input.setAttribute('placeholder', ' ');
            
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (input.value.trim() === '') {
                    input.parentElement.classList.remove('focused');
                }
            });
            
            input.addEventListener('input', () => {
                if (input.value.trim() !== '') {
                    input.parentElement.classList.add('has-value');
                } else {
                    input.parentElement.classList.remove('has-value');
                }
            });
        });
        
        // Fixed form submission with proper animation
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            
            // Validation
            let isValid = true;
            inputs.forEach(input => {
                if (input.hasAttribute('required') && input.value.trim() === '') {
                    input.style.borderColor = '#FF1493';
                    isValid = false;
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                submitBtn.textContent = '❌ Please fill all fields';
                submitBtn.style.background = 'linear-gradient(45deg, #FF1493, #FF6B6B)';
                setTimeout(() => {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.style.background = '';
                }, 2000);
                return;
            }
            
            // Show loading state
            submitBtn.innerHTML = '<div style="display: flex; align-items: center; gap: 10px;"><div style="width: 16px; height: 16px; border: 2px solid #000; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>Sending...</div>';
            submitBtn.disabled = true;
            
            // Add spin animation
            if (!document.getElementById('form-spin-style')) {
                const spinStyle = document.createElement('style');
                spinStyle.id = 'form-spin-style';
                spinStyle.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
                document.head.appendChild(spinStyle);
            }
            
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success animation
            submitBtn.innerHTML = '✅ Message Sent Successfully!';
            submitBtn.style.background = 'linear-gradient(45deg, #39FF14, #00D9FF)';
            
            // Add success particle effect
            createSuccessParticles(submitBtn);
            
            // Reset form after delay
            setTimeout(() => {
                form.reset();
                inputs.forEach(input => {
                    input.parentElement.classList.remove('has-value', 'focused');
                });
                submitBtn.innerHTML = originalHTML;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        });
        
        function createSuccessParticles(element) {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            for (let i = 0; i < 12; i++) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    left: ${centerX}px;
                    top: ${centerY}px;
                    width: 6px;
                    height: 6px;
                    background: #39FF14;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1000;
                `;
                
                document.body.appendChild(particle);
                
                const angle = (360 / 12) * i;
                const velocity = 100;
                const radian = (angle * Math.PI) / 180;
                const vx = Math.cos(radian) * velocity;
                const vy = Math.sin(radian) * velocity;
                
                particle.animate([
                    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                    { transform: `translate(${vx}px, ${vy}px) scale(0)`, opacity: 0 }
                ], {
                    duration: 800,
                    easing: 'ease-out'
                }).addEventListener('finish', () => {
                    particle.remove();
                });
            }
        }
    }
    
    // Scroll Animations using Intersection Observer
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll(
            '.glass-card, .skill-category, .timeline-item, .project-card, .award-card'
        );
        
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            el.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(el);
        });
        
        // Add CSS for animate-in class
        if (!document.getElementById('animate-styles')) {
            const style = document.createElement('style');
            style.id = 'animate-styles';
            style.textContent = `
                .animate-in {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
                .nav-link.active {
                    color: #00D9FF !important;
                }
                .nav-link.active::after {
                    width: 100% !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Animated Statistics Counter
    function initStatsAnimation() {
        const stats = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        stats.forEach(stat => observer.observe(stat));
        
        function animateCounter(element) {
            const target = parseInt(element.dataset.target);
            const duration = 2000;
            const startTime = performance.now();
            
            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const currentValue = Math.floor(target * easeOutExpo);
                
                element.textContent = currentValue;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target;
                }
            }
            
            requestAnimationFrame(updateCounter);
        }
    }
    
    // Skills Animation
    function initSkillsAnimation() {
        const skillItems = document.querySelectorAll('.skill-item');
        const skillLevels = {
            'AWS': 90,
            'Azure': 75,
            'Cloud Computing': 85,
            'Docker': 95,
            'Kubernetes': 88,
            'Docker Swarm': 80,
            'Jenkins': 92,
            'GitHub Actions': 88,
            'Terraform': 85,
            'Ansible': 82,
            'Grafana': 87,
            'Prometheus': 85,
            'ELK Stack': 80
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkill(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        skillItems.forEach(skill => observer.observe(skill));
        
        function animateSkill(element) {
            const skillName = element.textContent.trim();
            const level = skillLevels[skillName] || 70;
            
            setTimeout(() => {
                element.style.setProperty('--skill-width', level + '%');
            }, Math.random() * 500);
        }
    }
    
    // Floating Cards Animation
    function initFloatingCards() {
        const cards = document.querySelectorAll('.skill-badge');
        
        cards.forEach((card, index) => {
            // Mouse interaction
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'scale(1.2) rotateY(20deg)';
                card.style.zIndex = '10';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.zIndex = '';
            });
            
            // Enhanced continuous floating animation
            setInterval(() => {
                if (!card.matches(':hover')) {
                    const randomX = (Math.random() - 0.5) * 30;
                    const randomY = (Math.random() - 0.5) * 30;
                    const randomRotation = (Math.random() - 0.5) * 15;
                    
                    card.style.transition = 'transform 2s ease-in-out';
                    card.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotation}deg)`;
                    
                    setTimeout(() => {
                        card.style.transform = '';
                    }, 2000);
                }
            }, 4000 + (index * 1000));
        });
    }
    
    // Global scroll animations
    function initGlobalScrollEffects() {
        let ticking = false;
        
        function updateScrollEffects() {
            const scrollY = window.scrollY;
            
            // Parallax effect for hero section
            const hero = document.querySelector('.hero-section');
            if (hero && scrollY < window.innerHeight) {
                const heroOffset = scrollY * 0.5;
                hero.style.transform = `translateY(${heroOffset}px)`;
            }
            
            ticking = false;
        }
        
        function requestScrollUpdate() {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestScrollUpdate);
    }
    
    // Section visibility tracking
    function initSectionVisibility() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px -100px 0px'
        });
        
        sections.forEach(section => observer.observe(section));
    }
    
    // Enhanced project card effects
    function initProjectCardEffects() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', function(e) {
                this.style.transform = 'translateY(-15px) rotateX(5deg)';
                this.style.boxShadow = '0 25px 60px rgba(0, 217, 255, 0.3)';
            });
            
            card.addEventListener('mouseleave', function(e) {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
            
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                this.style.transform = `translateY(-15px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
        });
    }
    
    // Award cards animation
    function initAwardAnimations() {
        const awardCards = document.querySelectorAll('.award-card');
        
        awardCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('.award-icon');
                if (icon) {
                    icon.style.animation = 'none';
                    setTimeout(() => {
                        icon.style.animation = 'bounce 0.6s ease-in-out';
                    }, 10);
                }
            });
        });
    }
    
    // Utility function for debouncing
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
});

// Global utility functions
window.scrollToSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    const navbar = document.getElementById('navbar');
    
    if (section && navbar) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = section.offsetTop - navHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
};

// Initialize loading screen
(function initLoadingScreen() {
    const loading = document.createElement('div');
    loading.id = 'loading-screen';
    loading.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #000000, #111111);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        transition: opacity 0.5s ease;
    `;
    
    loading.innerHTML = `
        <div style="width: 50px; height: 50px; border: 3px solid #333; border-top: 3px solid #00D9FF; border-radius: 50%; animation: loadingSpin 1s linear infinite;"></div>
        <p style="color: #00D9FF; margin-top: 20px; font-weight: 600; font-family: inherit;">Loading Portfolio...</p>
    `;
    
    const spinCSS = document.createElement('style');
    spinCSS.textContent = `
        @keyframes loadingSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(spinCSS);
    document.body.appendChild(loading);
    
    // Hide loading screen after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            loading.style.opacity = '0';
            setTimeout(() => {
                if (loading.parentNode) {
                    loading.parentNode.removeChild(loading);
                }
            }, 500);
        }, 1500);
    });
})();