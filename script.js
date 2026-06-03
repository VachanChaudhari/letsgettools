document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    /* --- Theme Toggle Functionality --- */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Load initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const activeTheme = savedTheme || systemTheme;
    htmlElement.setAttribute('data-theme', activeTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    /* --- Navigation Scroll Style --- */
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* --- Mobile Menu Drawer --- */
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerLinks = document.querySelectorAll('.mobile-nav-link');
    
    function toggleDrawer() {
        const isOpen = mobileDrawer.classList.toggle('open');
        mobileToggle.querySelector('.menu-open').style.display = isOpen ? 'none' : 'block';
        mobileToggle.querySelector('.menu-close').style.display = isOpen ? 'block' : 'none';
        
        // Prevent scroll when menu is open
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    mobileToggle.addEventListener('click', toggleDrawer);

    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileDrawer.classList.contains('open')) {
                toggleDrawer();
            }
        });
    });

    // Close drawer when resizing to desktop sizes
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileDrawer.classList.contains('open')) {
            toggleDrawer();
        }
    });

    /* --- Product Filtering and Search --- */
    const searchInput = document.getElementById('product-search');
    const clearSearchBtn = document.getElementById('clear-search');
    const filterTabs = document.querySelectorAll('.filter-tab');
    const productGrid = document.getElementById('product-grid');
    const productCards = document.querySelectorAll('.product-card');

    let currentFilter = 'all';
    let searchQuery = '';

    // Handle search input
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        
        if (searchQuery.length > 0) {
            clearSearchBtn.classList.add('active');
        } else {
            clearSearchBtn.classList.remove('active');
        }
        
        applyFilterAndSearch();
    });

    // Handle clear search
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.classList.remove('active');
        applyFilterAndSearch();
        searchInput.focus();
    });

    // Handle tab filters
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.getAttribute('data-category');
            applyFilterAndSearch();
        });
    });

    function applyFilterAndSearch() {
        let visibleCount = 0;
        
        productCards.forEach(card => {
            const productCategory = card.getAttribute('data-category');
            const productTitle = card.querySelector('.product-title').textContent.toLowerCase();
            const productFeatures = Array.from(card.querySelectorAll('.product-features span'))
                .map(span => span.textContent.toLowerCase())
                .join(' ');
            
            const matchesCategory = currentFilter === 'all' || productCategory === currentFilter;
            const matchesSearch = productTitle.includes(searchQuery) || productFeatures.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                visibleCount++;
                // Trigger tiny animation refresh
                card.style.animation = 'none';
                card.offsetHeight; /* trigger reflow */
                card.style.animation = null;
            } else {
                card.style.display = 'none';
            }
        });

        // Show "no products found" message if grid is empty
        const existingNoResults = document.getElementById('no-results-msg');
        if (visibleCount === 0) {
            if (!existingNoResults) {
                const noResultsMsg = document.createElement('div');
                noResultsMsg.id = 'no-results-msg';
                noResultsMsg.style.gridColumn = '1 / -1';
                noResultsMsg.style.textAlign = 'center';
                noResultsMsg.style.padding = '40px 0';
                noResultsMsg.style.color = 'var(--text-secondary)';
                noResultsMsg.innerHTML = `
                    <i data-lucide="info" style="width: 48px; height: 48px; margin: 0 auto 16px; display: block; color: var(--color-primary)"></i>
                    <h3 style="margin-bottom: 8px;">No tools match your criteria</h3>
                    <p>Try searching for a different subscription or clear the query filter.</p>
                `;
                productGrid.appendChild(noResultsMsg);
                lucide.createIcons();
            }
        } else if (existingNoResults) {
            existingNoResults.remove();
        }
    }

    /* --- FAQ Accordion --- */
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const isOpen = faqItem.classList.contains('open');

            // Close all other FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('open');
                item.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isOpen) {
                faqItem.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    /* --- Scroll Reveal Animation --- */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.9;
        
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('reveal');
            }
        });
    };

    // Run once on load and attach to scroll event
    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);

    // Active navigation state highlight based on sections
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section, header');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPos = window.scrollY + 120; // offset header height

        sections.forEach(sec => {
            if (sec.id && scrollPos >= sec.offsetTop && scrollPos < (sec.offsetTop + sec.offsetHeight)) {
                currentSectionId = sec.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}` || 
                (currentSectionId === 'hero' && link.getAttribute('href') === '#')) {
                link.classList.add('active');
            }
        });
    });
});
