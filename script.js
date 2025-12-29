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

    // Project Filtering Logic for works.html
    const filterPills = document.querySelectorAll('.filter-pill');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterPills.length > 0 && projectCards.length > 0) {
        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                const filter = pill.getAttribute('data-filter');
                filterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');

                projectCards.forEach(card => {
                    const categories = card.getAttribute('data-category').split(' ');
                    if (filter === 'all' || categories.includes(filter)) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
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

    // Remove preload class after a short delay to allow initial render without transitions
    window.addEventListener('load', () => {
        setTimeout(() => {
            body.classList.remove('preload');
        }, 100);
    });
});
