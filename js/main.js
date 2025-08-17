document.addEventListener('DOMContentLoaded', function() {
    // Initialize 3D Chakra
    const chakra = document.getElementById('chakra');
    chakra.classList.add('rotate-3d');
    
    // Flag hover fact
    const flag = document.getElementById('flag');
    flag.addEventListener('mouseenter', showFlagFact);
    flag.addEventListener('mouseleave', hideFlagFact);
    
    // Day/Night toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', toggleTheme);
    
    // Music toggle
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    musicToggle.addEventListener('click', toggleMusic);
    
    // Load timeline with GSAP animations
    fetch('data/timeline.json')
        .then(response => response.json())
        .then(data => {
            const timelineContainer = document.getElementById('timeline');
            data.forEach((item, index) => {
                const timelineItem = document.createElement('div');
                timelineItem.className = 'timeline-item';
                timelineItem.innerHTML = `
                    <div class="timeline-image-container">
                        <img class="timeline-image" src="${item.image || 'https://via.placeholder.com/120x80?text=No+Image'}" alt="${item.year}">
                    </div>
                    <div class="timeline-year">${item.year}</div>
                    <div class="timeline-event">${item.event}</div>
                `;
                timelineContainer.appendChild(timelineItem);

                // Animate with GSAP
                gsap.to(timelineItem, {
                    scrollTrigger: {
                        trigger: timelineItem,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: index * 0.1
                });
            });
        });
    
    // Pledge personalization
    const generatePledge = document.getElementById('generatePledge');
    const sharePledge = document.getElementById('sharePledge');
    const voicePledge = document.getElementById('voicePledge');
    const userName = document.getElementById('userName');
    const personalPledge = document.getElementById('personalPledge');
    
    generatePledge.addEventListener('click', generatePersonalPledge);
    sharePledge.addEventListener('click', sharePledgeHandler);
    
    // Poetry generator
    const generatePoem = document.getElementById('generatePoem');
    generatePoem.addEventListener('click', generatePatrioticPoem);
    
    // Social share
    document.getElementById('shareTwitter').addEventListener('click', shareOnTwitter);
    document.getElementById('shareWhatsApp').addEventListener('click', shareOnWhatsApp);
    
    // Initialize constellations for night mode
    initConstellations();
    
    // Initialize map (handled in map.js)
    initFreedomMap();
    
    // Try to play music automatically
    bgMusic.volume = 0.7;
    bgMusic.play().catch(() => {
        // If autoplay fails, play on first user interaction
        const startMusic = () => {
            bgMusic.play();
            document.removeEventListener('click', startMusic);
        };
        document.addEventListener('click', startMusic);
    });
    
    // Auto-scroll timeline container (loop back to start automatically)
    const timelineContainer = document.querySelector('.timeline-container');
    if (timelineContainer) {
        let autoScrollTimer = null;
        const pxPerTick = 5;      // ⬅️ faster speed (was 2)
        const tickMs = 20;        // interval ms
        const restartDelay = 1000; // wait 1s at end before restarting
        const shouldLoop = true;   // enable looping

        function startAutoScroll() {
            stopAutoScroll();
            autoScrollTimer = setInterval(() => {
                const atEnd = timelineContainer.scrollLeft + timelineContainer.clientWidth >= timelineContainer.scrollWidth - 1;
                if (atEnd) {
                    stopAutoScroll();
                    setTimeout(() => {
                        timelineContainer.scrollTo({ left: 0, behavior: 'smooth' });
                        startAutoScroll();
                    }, restartDelay);
                    return;
                }
                timelineContainer.scrollLeft += pxPerTick;
            }, tickMs);
        }

        function stopAutoScroll() {
            if (autoScrollTimer) {
                clearInterval(autoScrollTimer);
                autoScrollTimer = null;
            }
        }

        // Start auto-scroll
        startAutoScroll();

        // Pause on hover
        timelineContainer.addEventListener('mouseenter', stopAutoScroll);
        timelineContainer.addEventListener('mouseleave', startAutoScroll);

        // Keep scroll indicator in sync
        const updateIndicator = () => {
            const bar = document.querySelector('.timeline-scroll-bar');
            if (!bar) return;
            const percent = timelineContainer.scrollLeft / Math.max(1, timelineContainer.scrollWidth - timelineContainer.clientWidth);
            bar.style.width = (percent * 100) + '%';
        };
        timelineContainer.addEventListener('scroll', updateIndicator);
        updateIndicator();
    }
});

function showFlagFact() {
    const fact = this.getAttribute('data-fact');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = fact;
    this.appendChild(tooltip);
    
    setTimeout(() => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';
    }, 10);
}

function hideFlagFact() {
    const tooltip = this.querySelector('.tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(10px)';
        setTimeout(() => tooltip.remove(), 300);
    }
}

function toggleTheme() {
    document.body.classList.toggle('night-mode');
    const constellations = document.querySelector('.constellations');
    constellations.classList.toggle('hidden', !document.body.classList.contains('night-mode'));
    
    this.textContent = document.body.classList.contains('night-mode') 
        ? 'Switch to Day Mode' 
        : 'Switch to Night Mode';
}

function toggleMusic() {
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic.paused) {
        bgMusic.play();
        this.textContent = '🔊 Pause Music';
    } else {
        bgMusic.pause();
        this.textContent = '🔊 Play Music';
    }
}

function generatePersonalPledge() {
    const nameInput = document.getElementById('userName');
    const pledgeOutput = document.getElementById('personalPledge');
    const name = nameInput.value.trim();

    if (name) {
        pledgeOutput.innerHTML = `
            <span style="font-size:1.1em;">&#10024; <b>I, ${name},</b> solemnly pledge to uphold the values of freedom, unity, and peace.<br>
            I promise to respect my fellow citizens, cherish our diversity, and contribute to the progress of our beloved India.<br>
            <b>Jai Hind!</b> &#127470;&#127475;</span>
        `;
    } else {
        pledgeOutput.innerHTML = `
            <span style="font-size:1.1em;">"India is my country and all Indians are my brothers and sisters..."</span>
        `;
    }
}

function sharePledgeHandler() {
    const pledgeText = document.getElementById('personalPledge').textContent;
    const shareData = {
        title: 'My Independence Day Pledge',
        text: pledgeText,
        url: window.location.href
    };
    
    try {
        if (navigator.share) {
            navigator.share(shareData);
        } else {
            // Fallback for browsers without Web Share API
            alert('Pledge generated! Copy to share:\n\n' + pledgeText);
        }
    } catch (err) {
        console.error('Error sharing:', err);
    }
}

function generatePatrioticPoem() {
    const keywords = document.getElementById('poetryKeywords').value.trim();
    if (!keywords) {
        alert('Please enter some themes for your poem!');
        return;
    }
    
    // In a real implementation, this would call an API or use a more sophisticated generator
    const patrioticLines = [
        "Oh India, land of the free,",
        "Where diversity blooms in unity,",
        "From the Himalayas to the southern sea,",
        "Your spirit shines for all to see.",
        "",
        "Brave hearts fought for liberty,",
        "Their sacrifice our destiny,",
        "Now we stand tall, strong and free,",
        "Building a future of prosperity.",
        "",
        "The tricolor waves with pride,",
        "In every heart it does reside,",
        "With every dawn, a new sunrise,",
        "Of hope and dreams that never die."
    ];
    
    const poemResult = document.getElementById('poemResult');
    poemResult.innerHTML = patrioticLines.join('<br>');
    poemResult.style.display = 'block';
}

function initConstellations() {
    const constellations = document.querySelector('.constellations');
    const constellationsData = [
        { top: '15%', left: '20%', stars: 5, shape: 'circle' },
        { top: '25%', left: '70%', stars: 7, shape: 'chakra' },
        { top: '60%', left: '30%', stars: 6, shape: 'triangle' }
    ];
    
    constellationsData.forEach(constellation => {
        const constellationEl = document.createElement('div');
        constellationEl.className = 'constellation';
        constellationEl.style.top = constellation.top;
        constellationEl.style.left = constellation.left;
        
        for (let i = 0; i < constellation.stars; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.width = `${Math.random() * 3 + 2}px`;
            star.style.height = star.style.width;
            star.style.top = `${Math.random() * 50 - 25}px`;
            star.style.left = `${Math.random() * 50 - 25}px`;
            star.style.animationDelay = `${Math.random() * 2}s`;
            constellationEl.appendChild(star);
        }
        
        constellations.appendChild(constellationEl);
    });
}

function shareOnTwitter() {
    const text = encodeURIComponent("Celebrating India's Independence Day with this interactive tribute!");
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

function shareOnWhatsApp() {
    const text = encodeURIComponent("Check out this interactive Independence Day tribute: " + window.location.href);
    window.open(`https://wa.me/?text=${text}`, '_blank');
}
// Add to your main.js or timeline JS
document.querySelector('.timeline-container').addEventListener('scroll', function(e) {
    const container = e.target;
    const bar = document.querySelector('.timeline-scroll-bar');
    const percent = container.scrollLeft / (container.scrollWidth - container.clientWidth);
    bar.style.width = (percent * 100) + '%';
});