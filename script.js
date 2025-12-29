class AsciiBackground {
    constructor() {
        this.canvas = document.getElementById('ascii-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // Configuration
        this.fontSize = 16;
        this.columns = Math.floor(this.width / this.fontSize);
        this.rows = Math.floor(this.height / this.fontSize);

        // Characters sorted by density (though we'll use a subset for style)
        this.chars = ' .:-=+*#%@'; // Density map

        // State
        this.grid = [];
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        this.glitchActive = false;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });


        // Initialize grid
        for (let y = 0; y < this.rows; y++) {
            let row = [];
            for (let x = 0; x < this.columns; x++) {
                row.push({
                    char: this.getRandomChar(),
                    offset: Math.random() * 100
                });
            }
            this.grid.push(row);
        }

        this.animate();
    }

    getRandomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.columns = Math.floor(this.width / this.fontSize);
        this.rows = Math.floor(this.height / this.fontSize);
        this.ctx.font = `${this.fontSize}px 'Space Mono'`;
    }

    animate() {
        if (!this.canvas) return;
        const computedStyle = getComputedStyle(document.body);
        const bgColor = computedStyle.getPropertyValue('--bg-color').trim() || '#050505';
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.fillStyle = '#333'; // Base text color
        this.time += 0.05;

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                const cell = this.grid[y]?.[x];
                if (!cell) continue;

                // Calculate distance to mouse
                const px = x * this.fontSize;
                const py = y * this.fontSize;
                const dx = px - this.mouse.x;
                const dy = py - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Interaction radius
                const maxDist = 300;
                let intensity = 0;

                if (dist < maxDist) {
                    intensity = 1 - (dist / maxDist);
                    // Highlight color near mouse - uses CSS brand color
                    const brandColorRgb = computedStyle.getPropertyValue('--brand-color-rgb').trim() || '0, 80, 252';
                    this.ctx.fillStyle = `rgba(${brandColorRgb}, ${intensity})`;
                } else {
                    this.ctx.fillStyle = '#1a1a1a'; // Dim background
                }

                // Draw character
                const charToShow = dist < maxDist
                    ? this.chars[Math.floor(intensity * (this.chars.length - 1))]
                    : (Math.random() > 0.98 ? '.' : ''); // Random twinkling background

                if (charToShow) {
                    this.ctx.fillText(charToShow, px, py);
                }
            }
        }

        requestAnimationFrame(() => this.animate());
    }

    setCharset(type) {
        if (type === 'BINARY') this.chars = '01';
        else if (type === 'HEX') this.chars = '0123456789ABCDEF';
        else if (type === 'WAVES') this.chars = ' ▂▃▄▅▆▇█';
        else this.chars = ' .:-=+*#%@'; // Default
    }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    // Canvas Background
    const canvas = document.getElementById('ascii-canvas');
    if (canvas) {
        window.asciiBg = new AsciiBackground();
    }

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
            const type = item.getAttribute('data-ascii');
            const imagePath = item.getAttribute('data-image');
            if (window.asciiBg) window.asciiBg.setCharset(type);
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
            if (window.asciiBg) window.asciiBg.setCharset('DEFAULT');
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
    if (document.documentElement.classList.contains('light-mode')) {
        body.classList.add('light-mode');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = body.classList.toggle('light-mode');
            document.documentElement.classList.toggle('light-mode', isLight);
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }

    // Remove preload class after a short delay to allow initial render without transitions
    window.addEventListener('load', () => {
        setTimeout(() => {
            body.classList.remove('preload');
        }, 100);
    });
});
