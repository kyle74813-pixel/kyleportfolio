// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor Logic
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    if (cursor && follower) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        function animateCursor() {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;

            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';

            requestAnimationFrame(animateCursor);
        }
        animateCursor();
    }

    // Interactive Hover Elements
    function handleMouseEnter() {
        if (follower) follower.classList.add('active');
    }
    function handleMouseLeave() {
        if (follower) follower.classList.remove('active');
    }

    function updateInteractiveElements() {
        const interactiveElements = document.querySelectorAll('a, button, .nav-item, .filter-pill, .work-row');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });
    }
    updateInteractiveElements();

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Prevent scrolling when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when a link is clicked
        const navLinks = navMenu.querySelectorAll('.nav-item');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Project Filtering Logic for works.html
    const filterPills = document.querySelectorAll('.filter-pill:not(.reset-btn)');
    const projectCards = document.querySelectorAll('.project-card');
    const resetBtn = document.getElementById('reset-filter');

    if (filterPills.length > 0 && projectCards.length > 0) {
        let activeFilters = new Set(['all']);

        const updateFilters = () => {
            const isAllActive = activeFilters.has('all');

            // Show/Hide Reset Button
            if (resetBtn) {
                resetBtn.style.display = (activeFilters.size > 0 && !isAllActive) ? 'inline-block' : 'none';
            }

            // Update projects
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                if (isAllActive) {
                    card.classList.remove('hidden');
                } else {
                    // Show if project matches ANY of the active filters
                    const isMatch = Array.from(activeFilters).some(filter => categories.includes(filter));
                    card.classList.toggle('hidden', !isMatch);
                }
            });
        };

        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                const filter = pill.getAttribute('data-filter');

                if (filter === 'all') {
                    activeFilters.clear();
                    activeFilters.add('all');
                    filterPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-filter') === 'all'));
                } else {
                    // Remove 'all' if it was active
                    if (activeFilters.has('all')) {
                        activeFilters.delete('all');
                        document.querySelector('.filter-pill[data-filter="all"]').classList.remove('active');
                    }

                    // Toggle current filter
                    if (activeFilters.has(filter)) {
                        activeFilters.delete(filter);
                        pill.classList.remove('active');
                    } else {
                        activeFilters.add(filter);
                        pill.classList.add('active');
                    }

                    // If no filters left, default back to 'all'
                    if (activeFilters.size === 0) {
                        activeFilters.add('all');
                        document.querySelector('.filter-pill[data-filter="all"]').classList.add('active');
                    }
                }
                updateFilters();
            });
        });

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                activeFilters.clear();
                activeFilters.add('all');
                filterPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-filter') === 'all'));
                updateFilters();
            });
        }
    }

    // Scroll Reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('h1, h2, p, .hero-sub, .featured-card, .work-row').forEach(el => {
        el.classList.add('reveal-text');
        observer.observe(el);
    });

    // Project Hover Effects (index.html)
    const projectItems = document.querySelectorAll('.work-row');
    const projectPreview = document.getElementById('project-preview');

    projectItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const imagePath = item.getAttribute('data-image');
            if (imagePath && projectPreview) {
                projectPreview.style.backgroundImage = `url("${imagePath}")`;
                projectPreview.classList.add('visible');
            }
        });

        item.addEventListener('mousemove', (e) => {
            if (projectPreview && projectPreview.classList.contains('visible')) {
                projectPreview.style.left = e.clientX + 'px';
                projectPreview.style.top = e.clientY + 'px';
            }
        });

        item.addEventListener('mouseleave', () => {
            if (projectPreview) {
                projectPreview.classList.remove('visible');
                projectPreview.style.backgroundImage = '';
            }
        });
    });

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Sync theme from documentElement (set in head) to body
    if (document.documentElement.classList.contains('dark-mode')) {
        body.classList.add('dark-mode');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = body.classList.toggle('dark-mode');
            document.documentElement.classList.toggle('dark-mode', isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // Image Modal & Carousel Logic
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalClose = document.querySelector('.modal-close');
    const prevBtn = document.getElementById('modal-prev');
    const nextBtn = document.getElementById('modal-next');
    const currentIndexLabel = document.getElementById('current-index');
    const totalCountLabel = document.getElementById('total-count');

    let currentSectionImages = [];
    let currentIndex = 0;

    if (modal) {
        // Collect all potential project sections
        const sections = document.querySelectorAll('.project-problem-section, .project-gallery');

        sections.forEach(section => {
            // Find all interactive images in this section
            const images = section.querySelectorAll('.section-image-full, .section-image-half, .img-placeholder-gallery');

            images.forEach((img, index) => {
                img.addEventListener('click', () => {
                    currentSectionImages = Array.from(images);
                    currentIndex = index;
                    openModal();
                });
            });
        });

        const openModal = () => {
            updateModalImage();
            modal.classList.add('visible');
            body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            modal.classList.remove('visible');
            setTimeout(() => {
                body.style.overflow = '';
                modalImg.src = '';
            }, 300);
        };

        const updateModalImage = () => {
            const target = currentSectionImages[currentIndex];
            let src = '';

            if (target.tagName === 'IMG') {
                src = target.src;
            } else {
                const bg = window.getComputedStyle(target).backgroundImage;
                src = bg.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
                if (src === 'none' || src === '') {
                    src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80';
                }
            }

            if (modal.classList.contains('visible')) {
                modalImg.style.opacity = '0';
                setTimeout(() => {
                    modalImg.src = src;
                    modalImg.style.opacity = '1';
                }, 100);
            } else {
                modalImg.src = src;
                // No wait, let CSS handle the entry opacity
            }

            if (currentIndexLabel) currentIndexLabel.textContent = currentIndex + 1;
            if (totalCountLabel) totalCountLabel.textContent = currentSectionImages.length;
        };

        if (modalClose) modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Background Preload
        const preloadImages = () => {
            const allImages = document.querySelectorAll('.section-image-full, .section-image-half, .img-placeholder-gallery');
            allImages.forEach(target => {
                let src = '';
                if (target.tagName === 'IMG') {
                    src = target.src;
                } else {
                    const bg = window.getComputedStyle(target).backgroundImage;
                    src = bg.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
                }
                if (src && src !== 'none') {
                    const img = new Image();
                    img.src = src;
                }
            });
        };
        window.addEventListener('load', preloadImages);

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex - 1 + currentSectionImages.length) % currentSectionImages.length;
                updateModalImage();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex + 1) % currentSectionImages.length;
                updateModalImage();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('visible')) return;
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
            if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
        });
    }

    // Remove preload class after a short delay to allow initial render without transitions
    window.addEventListener('load', () => {
        setTimeout(() => {
            body.classList.remove('preload');
        }, 100);
    });
});
