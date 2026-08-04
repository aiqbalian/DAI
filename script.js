/* =========================
   Mobile Navigation
========================= */
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');

if (menuBtn && navLinks) {
    menuBtn.setAttribute('aria-controls', 'nav-links');
    menuBtn.setAttribute('aria-expanded', 'false');

    menuBtn.addEventListener('click', () => {
        const isActive = navLinks.classList.toggle('active');
        menuBtn.setAttribute('aria-expanded', isActive);
        menuBtn.innerHTML = isActive
            ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
            : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    });

    // Close mobile menu after clicking a link
    document.querySelectorAll('.nav-links a').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && !e.target.closest('.navbar')) {
            navLinks.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
        }
    });
}

/* =========================
   Scroll Animation with Intersection Observer
========================= */
const animatedElements = document.querySelectorAll(
    'section, .card, .timeline-item, .publication, .education-item, .programme-item, .language-item, .achievement-item'
);

if (animatedElements.length) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    animatedElements.forEach((el) => {
        el.classList.add('hidden');
        observer.observe(el);
    });
}

/* =========================
   Smooth Active Navigation (with RAF throttling)
========================= */
const allSections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            let current = '';

            allSections.forEach((section) => {
                const sectionTop = section.offsetTop - 150;
                if (window.scrollY >= sectionTop) {
                    const id = section.getAttribute('id');
                    if (id) current = id;
                }
            });

            navItems.forEach((link) => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });

            ticking = false;
        });
        ticking = true;
    }
});

/* =========================
   Contact Form with Formspree
========================= */
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (form) {
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Clear previous status
        formStatus.className = '';
        formStatus.style.display = 'none';
        formStatus.textContent = '';

        // Get form fields
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');
        let isValid = true;

        // Validate each field
        [name, email, subject, message].forEach((field) => {
            field.classList.remove('error');
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            }
        });

        // Validate email format
        if (email.value.trim() && !isValidEmail(email.value.trim())) {
            email.classList.add('error');
            isValid = false;
        }

        if (!isValid) {
            formStatus.className = 'error';
            formStatus.style.display = 'block';
            formStatus.textContent = 'Please fill in all fields correctly.';
            const firstError = form.querySelector('.error');
            if (firstError) firstError.focus();
            return;
        }

        // Prepare form data
        const formData = new FormData(form);

        try {
            // Show sending status
            formStatus.className = '';
            formStatus.style.display = 'block';
            formStatus.textContent = '⏳ Sending your message...';

            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                formStatus.className = 'success';
                formStatus.textContent = '✅ Thank you! Your message was sent successfully.';
                form.reset();

                setTimeout(() => {
                    formStatus.className = '';
                    formStatus.style.display = 'none';
                    formStatus.textContent = '';
                }, 5000);
            } else {
                throw new Error('Server error');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            formStatus.className = 'error';
            formStatus.textContent = '❌ Oops! Something went wrong. Please try again or email me directly at amjadiqbalian@gmail.com';
        }
    });
}

// Email validation helper
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Real-time validation feedback
document.querySelectorAll('#contact-form input, #contact-form textarea').forEach((field) => {
    field.addEventListener('blur', function () {
        if (this.value.trim()) {
            this.classList.remove('error');
        }
    });

    field.addEventListener('input', function () {
        if (this.value.trim()) {
            this.classList.remove('error');
        }
    });
});

/* =========================
   Dynamic Footer Year
========================= */
const yearSpan = document.getElementById('current-year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

/* =========================
   Smooth Scroll for Anchor Links
========================= */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            const headerHeight = document.querySelector('header')?.offsetHeight || 80;
            const targetPosition = targetElement.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Update URL without jumping
            history.pushState(null, null, targetId);
        }
    });
});

/* =========================
   Console Info
========================= */
console.log('🚀 DAI - Dr. Amjad Iqbal Portfolio loaded successfully!');
console.log('📧 Contact: amjadiqbalian@gmail.com');
console.log('🔗 LinkedIn: https://www.linkedin.com/in/amjad-iqbal-phd-15072976/');
console.log('💬 WhatsApp: https://wa.me/923457449902');
