document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('fireworksButton');
    const canvas = document.getElementById('fireworksCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let fireworks = [];
    let particles = [];

    button.addEventListener('click', () => {
        // Hide the button after click
        button.style.display = 'none';
        launchFireworks();
        setTimeout(displayText, 2500); // Display text after fireworks animation
    });

    function launchFireworks() {
        const numFireworks = 5; // Number of fireworks to launch
        const launchDelay = 200; // Milliseconds between each firework launch

        for (let i = 0; i < numFireworks; i++) {
            setTimeout(() => {
                const x = Math.random() * canvas.width;
                const y = canvas.height;
                const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
                fireworks.push(new Firework(x, y, color));
            }, i * launchDelay);
        }
        animate();
    }

    function Firework(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocityY = -(Math.random() * 5 + 8); // Speed of firework going up
        this.exploded = false;
        this.life = 120; // Time before firework explodes (frames)

        this.update = function() {
            this.life--;
            if (this.life <= 0 && !this.exploded) {
                this.explode();
                this.exploded = true;
            } else if (!this.exploded) {
                this.y += this.velocityY;
                this.velocityY += 0.05; // Gravity effect
            }
        };

        this.draw = function() {
            if (!this.exploded) {
                ctx.beginPath();
                ctx.fillStyle = this.color;
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        };

        this.explode = function() {
            const particleCount = 100;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(this.x, this.y, this.color));
            }
        };
    }

    function Particle(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 2 + 1;
        this.alpha = 1;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 5 + 1;
        this.velocityX = Math.cos(this.angle) * this.speed;
        this.velocityY = Math.sin(this.angle) * this.speed;
        this.gravity = 0.05;
        this.decay = Math.random() * 0.01 + 0.015; // How fast particles fade

        this.update = function() {
            this.x += this.velocityX;
            this.y += this.velocityY;
            this.velocityY += this.gravity;
            this.alpha -= this.decay;
        };

        this.draw = function() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        };
    }

    function displayText() {
        ctx.fillStyle = 'black';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Kevin y Keila', canvas.width / 2, canvas.height / 2);
    }

    function animate() {
        ctx.fillStyle = 'rgba(240, 240, 240, 0.1)'; // Trail effect
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        fireworks.forEach((firework, index) => {
            firework.update();
            firework.draw();
            if (firework.exploded && particles.every(p => p.alpha <=0)) { // Check if associated particles are gone
                 //This logic for removing might be too simple if many fireworks explode at once
            }
        });

        // Remove fireworks that have exploded and their particles are gone
        // A more robust way would be to associate particles with their firework
        fireworks = fireworks.filter(f => !f.exploded || f.life > -200); // Keep exploded for a bit for particles to fade


        particles.forEach((particle, index) => {
            if (particle.alpha <= 0) {
                particles.splice(index, 1);
            } else {
                particle.update();
                particle.draw();
            }
        });

        if (fireworks.length > 0 || particles.length > 0) {
            requestAnimationFrame(animate);
        } else {
            // If no fireworks and no particles, and text has been shown, clear canvas for text
            // This logic might need adjustment if displayText is called at a fixed time
             if (button.style.display === 'none') { // ensure text is only redrawn if button was clicked
                ctx.clearRect(0,0, canvas.width, canvas.height); // Clear for text
                displayText(); // Redraw text on a clean canvas
             }
        }
    }

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // If text was already displayed, redraw it centered
        if (button.style.display === 'none' && fireworks.length === 0 && particles.length === 0) {
            ctx.clearRect(0,0, canvas.width, canvas.height);
            displayText();
        }
    });
});
