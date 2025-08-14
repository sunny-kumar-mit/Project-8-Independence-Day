function createFireworks() {
    const container = document.getElementById('fireworks');
    const colors = [
        '#FF9933', // Saffron
        '#138808', // Green
        '#000080', // Navy Blue
        '#FFD700', // Gold
        '#FF0000', // Red
        '#FFFFFF', // White
        '#00BFFF', // Sky Blue
        '#800080'  // Purple
    ];

    // Clear existing fireworks
    container.innerHTML = '';

    // Helper to create a single firecracker
    function createFirecracker(x, y, color, shape) {
        const firework = document.createElement('div');
        firework.className = 'firework classic-firework ' + shape;
        firework.style.setProperty('--x', x + 'px');
        firework.style.setProperty('--y', y + 'px');
        firework.style.background = color;
        firework.style.boxShadow = `0 0 18px 8px ${color}`;
        firework.style.animation = `explode ${1.5 + Math.random()}s ease-out ${Math.random()}s forwards`;
        container.appendChild(firework);

        setTimeout(() => {
            firework.remove();
        }, 2500);
    }

    // Create more fireworks with different shapes
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const x = (Math.random() - 0.5) * 400;
            const y = (Math.random() - 0.5) * 250;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const shapes = ['circle', 'star', 'line'];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            createFirecracker(x, y, color, shape);
        }, i * 80);
    }
}

// Initialize fireworks
window.onload = function() {
    createFireworks();
    setInterval(createFireworks, 4000);
};