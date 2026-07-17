document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('page-transition-enter')) {
        const clearPageTransition = () => {
            document.body.classList.remove('page-transition-enter');
        };

        document.body.addEventListener('animationend', clearPageTransition, { once: true });
        setTimeout(clearPageTransition, 1000);
    }
    
    // Direction-aware navbar animation
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    let navTicking = false;

    const updateNavbarState = () => {
        if (!navbar) return;

        const currentScrollY = window.scrollY;
        const scrollingDown = currentScrollY > lastScrollY;
        const mobileMenuOpen = document.querySelector('.nav-links.active');

        navbar.classList.toggle('sticky', currentScrollY > 50);

        if (currentScrollY <= 80 || mobileMenuOpen) {
            navbar.classList.remove('nav-hidden');
            navbar.classList.add('nav-visible');
        } else if (scrollingDown && currentScrollY > 140) {
            navbar.classList.add('nav-hidden');
            navbar.classList.remove('nav-visible');
        } else if (!scrollingDown) {
            navbar.classList.remove('nav-hidden');
            navbar.classList.add('nav-visible');
        }

        lastScrollY = Math.max(currentScrollY, 0);
        navTicking = false;
    };

    window.addEventListener('scroll', () => {
        if (!navTicking) {
            window.requestAnimationFrame(updateNavbarState);
            navTicking = true;
        }
    }, { passive: true });

    updateNavbarState();

    // Floating action buttons
    const floatingActions = document.createElement('div');
    floatingActions.className = 'floating-actions';
    document.body.appendChild(floatingActions);

    const whatsappButton = document.querySelector('.whatsapp-btn') || document.createElement('a');
    whatsappButton.href = 'https://wa.me/919609052659';
    whatsappButton.className = 'floating-btn whatsapp-btn';
    whatsappButton.target = '_blank';
    whatsappButton.rel = 'noopener noreferrer';
    whatsappButton.setAttribute('aria-label', 'Chat on WhatsApp');
    whatsappButton.innerHTML = '<i class="fab fa-whatsapp"></i>';
    floatingActions.appendChild(whatsappButton);

    const goTopButton = document.createElement('button');
    goTopButton.className = 'go-top-btn';
    goTopButton.type = 'button';
    goTopButton.setAttribute('aria-label', 'Go to top');
    goTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    floatingActions.appendChild(goTopButton);

    const toggleGoTopButton = () => {
        if (window.scrollY > 350) {
            goTopButton.classList.add('show');
        } else {
            goTopButton.classList.remove('show');
        }
    };

    window.addEventListener('scroll', toggleGoTopButton);
    toggleGoTopButton();

    goTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = menuToggle.querySelector('i');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navbar.classList.remove('nav-hidden');
            navbar.classList.add('nav-visible');
            if (navLinks.classList.contains('active')) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-times');
            } else {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            });
        });
    }

    // Advanced Scroll Animation (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Stat Counter Animation Logic
                if(entry.target.classList.contains('stats-container')) {
                    startCounters();
                }

                observer.unobserve(entry.target); 
            }
        });
    };

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Stat Counter Animation
    const counters = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    function startCounters() {
        if(countersStarted) return;
        countersStarted = true;

        counters.forEach(counter => {
            counter.innerText = '0';
            const updateCounter = () => {
                const target = +counter.getAttribute('data-target');
                const c = +counter.innerText;
                const increment = target / 50; // Speed of counting

                if (c < target) {
                    counter.innerText = `${Math.ceil(c + increment)}`;
                    setTimeout(updateCounter, 30);
                } else {
                    counter.innerText = target + (target > 50 ? '+' : '');
                }
            };
            updateCounter();
        });
    }

    // FAQ Accordion Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isActive = header.classList.contains('active');

            // Close all other accordions
            document.querySelectorAll('.accordion-header').forEach(h => {
                h.classList.remove('active');
                h.nextElementSibling.style.maxHeight = null;
            });

            // Toggle current accordion
            if (!isActive) {
                header.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // Dynamic Active Link highlighting based on current URL path
    const currentPath = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.nav-links a');
    
    if (currentPath !== '') {
        navItems.forEach(item => {
            if (item.getAttribute('href') === currentPath) {
                navItems.forEach(n => n.classList.remove('active'));
                item.classList.add('active');
            }
        });
    }
    
    // Hover effect to logo
    const logo = document.querySelector('.logo img');
    if (logo) {
        logo.addEventListener('mouseover', () => {
            logo.style.transform = 'scale(1.1) rotate(2deg)';
        });
        logo.addEventListener('mouseout', () => {
            logo.style.transform = 'scale(1) rotate(0deg)';
        });
    }
});
