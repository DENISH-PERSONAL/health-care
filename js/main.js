document.addEventListener('DOMContentLoaded', function() {
    // Form submission handling
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Form validation
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const mobile = document.getElementById('mobile').value.trim();
        const product = document.getElementById('product').value;
        const message = document.getElementById('message').value.trim();

        // Basic validation
        if (!name || !email || !mobile || !product || !message) {
            showMessage('Please fill in all fields', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }

        // Mobile number validation
        const mobileRegex = /^\+?[\d\s-]{10,}$/;
        if (!mobileRegex.test(mobile)) {
            showMessage('Please enter a valid mobile number', 'error');
            return;
        }

        try {
            // Prepare form data
            const formData = {
                name,
                email,
                mobile,
                product,
                message
            };

            // Send data to backend
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                showMessage('Thank you for your message! We will get back to you soon.', 'success');
                contactForm.reset();
            } else {
                throw new Error('Failed to submit form');
            }
        } catch (error) {
            showMessage('Sorry, there was an error submitting your message. Please try again later.', 'error');
            console.error('Form submission error:', error);
        }
    });

    // Function to show form messages
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = 'form-message ' + type;
        formMessage.style.display = 'block';

        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu functionality
    const createMobileMenu = () => {
        const header = document.querySelector('header');
        const nav = document.querySelector('nav');
        
        // Create mobile menu button with spans for animation
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        
        // Add elements to DOM
        header.insertBefore(mobileMenuBtn, nav);
        document.body.appendChild(overlay);
        
        // Toggle menu and overlay
        const toggleMenu = () => {
            nav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        };
        
        // Event listeners
        mobileMenuBtn.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);
        
        // Close menu when clicking a link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    };

    // Initialize mobile menu if screen width is small
    if (window.innerWidth <= 768) {
        createMobileMenu();
    }

    // Handle window resize
    let mobileMenuInitialized = false;
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768 && !mobileMenuInitialized) {
            createMobileMenu();
            mobileMenuInitialized = true;
        } else if (window.innerWidth > 768 && mobileMenuInitialized) {
            // Remove mobile menu elements when switching to desktop
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            const overlay = document.querySelector('.menu-overlay');
            if (mobileMenuBtn) mobileMenuBtn.remove();
            if (overlay) overlay.remove();
            mobileMenuInitialized = false;
        }
    });
}); 