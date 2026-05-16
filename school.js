document.addEventListener('DOMContentLoaded', function() {
    
    // ===== INISIALISASI AOS ANIMATION =====
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50,
        disable: function() {
            // Disable AOS on mobile for better performance
            return window.innerWidth < 480;
        }
    });
    
    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    function handleNavbarScroll() {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll direction
        if (currentScroll > lastScroll && currentScroll > 300) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    }
    
    window.addEventListener('scroll', handleNavbarScroll);
    
    // ===== MOBILE NAVIGATION =====
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    // Create overlay element
    const navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);
    
    function toggleMenu() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }
    
    navToggle.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', toggleMenu);
    
    // Close menu when clicking a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    // ===== SMOOTH SCROLL & ACTIVE NAV LINK =====
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        const scrollPos = window.pageYOffset + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== ANIMATED COUNTER =====
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString('id-ID');
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString('id-ID') + '+';
            }
        };
        
        updateCounter();
    }
    
    function checkCounters() {
        if (countersStarted) return;
        
        const heroStats = document.querySelector('.hero-stats');
        if (!heroStats) return;
        
        const rect = heroStats.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            countersStarted = true;
            statNumbers.forEach((num, index) => {
                setTimeout(() => {
                    animateCounter(num);
                }, index * 200);
            });
        }
    }
    
    window.addEventListener('scroll', checkCounters);
    checkCounters(); // Check on load
    
    // ===== BACK TO TOP BUTTON =====
    const backToTop = document.getElementById('backToTop');
    
    function toggleBackToTop() {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }
    
    window.addEventListener('scroll', toggleBackToTop);
    
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ===== PPDB FORM VALIDATION & SUBMISSION =====
    const ppdbForm = document.getElementById('ppdbForm');
    
    if (ppdbForm) {
        ppdbForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(ppdbForm);
            const data = Object.fromEntries(formData.entries());
            
            // Basic validation
            let isValid = true;
            const requiredFields = ['nama', 'nisn', 'jenisKelamin', 'tempatLahir', 
                                    'tanggalLahir', 'asalSekolah', 'jurusan', 
                                    'alamat', 'noHp', 'email'];
            
            requiredFields.forEach(field => {
                const input = document.getElementById(field);
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ef4444';
                    input.style.boxShadow = '0 0 0 4px rgba(239, 68, 68, 0.1)';
                } else {
                    input.style.borderColor = '';
                    input.style.boxShadow = '';
                }
            });
            
            // NISN validation (10 digits)
            const nisnInput = document.getElementById('nisn');
            if (nisnInput.value && !/^\\d{10}$/.test(nisnInput.value)) {
                isValid = false;
                nisnInput.style.borderColor = '#ef4444';
                showNotification('NISN harus 10 digit angka!', 'error');
                return;
            }
            
            // Email validation
            const emailInput = document.getElementById('email');
            const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
            if (emailInput.value && !emailRegex.test(emailInput.value)) {
                isValid = false;
                emailInput.style.borderColor = '#ef4444';
                showNotification('Format email tidak valid!', 'error');
                return;
            }
            
            // Phone validation
            const noHpInput = document.getElementById('noHp');
            if (noHpInput.value && !/^08\\d{8,12}$/.test(noHpInput.value)) {
                isValid = false;
                noHpInput.value = '';
                noHpInput.style.borderColor = '#ef4444';
                showNotification('Nomor HP harus diawali 08 dan 10-14 digit!', 'error');
                return;
            }
            
            if (!isValid) {
                showNotification('Mohon lengkapi semua field yang wajib diisi!', 'error');
                return;
            }
            
            // Success - show confirmation
            showNotification(
                `Terima kasih ${data.nama}! Pendaftaran Anda berhasil dikirim. Kami akan menghubungi Anda melalui email ${data.email} atau WhatsApp ${data.noHp}.`,
                'success'
            );
            
            // Reset form
            ppdbForm.reset();
            
            // Log data (for demo purposes)
            console.log('Data Pendaftaran:', data);
        });
        
        // Real-time validation feedback
        const inputs = ppdbForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.style.borderColor = '';
                    this.style.boxShadow = '';
                }
            });
            
            input.addEventListener('blur', function() {
                if (!this.value.trim() && this.hasAttribute('required')) {
                    this.style.borderColor = '#ef4444';
                }
            });
        });
    }
    
    // ===== NEWSLETTER FORM =====
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                showNotification(
                    `Terima kasih telah berlangganan! Kami akan mengirimkan newsletter ke ${email}.`,
                    'success'
                );
                this.reset();
            }
        });
    }
    
    // ===== NOTIFICATION SYSTEM =====
    function showNotification(message, type = 'success') {
        // Remove existing notifications
        const existing = document.querySelector('.notification-toast');
        if (existing) existing.remove();
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification-toast notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add styles dynamically
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            max-width: 400px;
            padding: 16px 20px;
            background: ${type === 'success' ? '#22c55e' : '#ef4444'};
            color: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            z-index: 10000;
            animation: slideInRight 0.4s ease;
            font-family: 'Poppins', sans-serif;
        `;
        
        const content = notification.querySelector('.notification-content');
        content.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 0.9rem;
            line-height: 1.5;
        `;
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 1rem;
            padding: 4px;
            opacity: 0.8;
            transition: opacity 0.3s;
        `;
        
        closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
        closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.8');
        closeBtn.addEventListener('click', () => removeNotification(notification));
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => removeNotification(notification), 5000);
    }
    
    function removeNotification(notification) {
        notification.style.animation = 'slideOutRight 0.4s ease forwards';
        setTimeout(() => notification.remove(), 400);
    }
    
    // Add keyframe animations for notification
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
    `;
    document.head.appendChild(style);
    
    // ===== PARALLAX EFFECT ON HERO =====
    const hero = document.querySelector('.hero');
    
    function parallaxEffect() {
        if (window.innerWidth > 768) {
            const scrolled = window.pageYOffset;
            if (hero && scrolled < window.innerHeight) {
                hero.style.backgroundPositionY = (scrolled * 0.3) + 'px';
            }
        }
    }
    
    window.addEventListener('scroll', parallaxEffect);
    
    // ===== LAZY LOADING IMAGES =====
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // ===== CARD HOVER EFFECT ENHANCEMENT =====
    const cards = document.querySelectorAll('.academic-card, .info-card, .contact-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
    });
    
    // ===== NAVBAR TRANSITION =====
    navbar.style.transition = 'transform 0.4s ease, background 0.3s ease, padding 0.3s ease';
    
    // ===== SCROLL PROGRESS INDICATOR =====
    const progressBar = document.createElement('div');
    progressBar.id = 'scrollProgress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--primary), var(--secondary));
        z-index: 10001;
        transition: width 0.1s ease;
        width: 0%;
    `;
    document.body.appendChild(progressBar);
    
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
    }
    
    window.addEventListener('scroll', updateScrollProgress);
    
    // ===== TYPING EFFECT ON HERO TITLE (Optional Enhancement) =====
    // Uncomment below if you want typing effect
    /*
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        let i = 0;
        
        function typeWriter() {
            if (i < originalText.length) {
                heroTitle.innerHTML += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        setTimeout(typeWriter, 1000);
    }
    */
    
    // ===== CURRENT YEAR IN FOOTER =====
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(el => {
        el.textContent = new Date().getFullYear();
    });
    
    // ===== PRELOADER (Optional) =====
    /*
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--white);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        transition: opacity 0.5s ease, visibility 0.5s ease;
    `;
    preloader.innerHTML = `
        <div style="text-align: center;">
            <div style="width: 50px; height: 50px; border: 4px solid var(--light); 
                        border-top-color: var(--primary); border-radius: 50%; 
                        animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
            <p style="color: var(--gray); font-size: 0.9rem;">Memuat...</p>
        </div>
    `;
    document.body.appendChild(preloader);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            setTimeout(() => preloader.remove(), 500);
        }, 500);
    });
    */
    
    // ===== CONSOLE WELCOME MESSAGE =====
    console.log('%c SMKN 1 Contoh ', 'background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
    console.log('%cWebsite Sekolah Responsive dengan HTML, CSS & JavaScript', 'color: #64748b; font-size: 14px;');
    console.log('%cDibuat untuk pendidikan Indonesia', 'color: #2563eb; font-size: 12px;');
    
});

// ===== REVEAL ON SCROLL UTILITY =====
function revealOnScroll(elements, threshold = 0.1) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold });
    
    elements.forEach(el => observer.observe(el));
}

// ===== DEBOUNCE FUNCTION =====
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

// ===== THROTTLE FUNCTION =====
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}