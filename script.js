 
// Configuration
const starsConfig = {
count: 400,       // Number of stars
sizes: [1, 2, 3], // Possible sizes in pixels
colors: [
        '#ffffff',    // White
        '#fffafa',    // Snow
        '#f8f8ff',    // GhostWhite
        '#f0f8ff',    // AliceBlue
        '#f5f5f5'     // WhiteSmoke
        ],
minSpeed: 0.1,    // Minimum speed
maxSpeed: 0.5,    // Maximum speed
twinkleFrequency: 0.01, // Frequency of twinkling (0-1)
randomMovement: true    // Enable random movement
};

// People data
const peopleData = {
    "people": [
        { "name": "Shambhavi Dogra Ma'am" },
        { "name": "Aarthi Reddy Ma'am" },
        { "name": "Sarthak Sood Sir" },
        { "name": "Kartikey Saini Sir" },
        { "name": "Adarsh Pal Sir" },
        { "name": "Aditya Maurya Sir" },
        { "name": "Rehan Khan Sir" },
        { "name": "Yash Pandey Sir" },
        { "name": "Ravideep Singh Sir" },
        { "name": "Tasman Walid Lyon Sir" },
        { "name": "Ashutosh Soni Sir" },
        { "name": "Aman Ranaut Sir" },
        { "name": "Srijan Sharma Sir" },
        { "name": "Asmanya Sharma Sir" },
        { "name": "Akshun Kuthiala Sir" },
        { "name": "Shinjini Dutta Ma'am" },
        { "name": "Ridhi Sharma Ma'am" }
        ]
    };

// DOM Elements
const starsContainer = document.getElementById('stars-container');
const personName = document.getElementById('person-name');

// Initialize stars
function createStars() {
// Clear existing stars
starsContainer.innerHTML = '';
            
// Get container dimensions
const containerWidth = window.innerWidth;
const containerHeight = window.innerHeight;
            
// Create stars
for (let i = 0; i < starsConfig.count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
                
// Random position
const x = Math.random() * containerWidth;
const y = Math.random() * containerHeight;
                
// Random size from config
const size = starsConfig.sizes[Math.floor(Math.random() * starsConfig.sizes.length)];
                
// Random color from config
const color = starsConfig.colors[Math.floor(Math.random() * starsConfig.colors.length)];
                
// Random opacity for twinkling effect (0.5-1.0)
const opacity = Math.random() * 0.5 + 0.5;
                
// Random speed
const speed = Math.random() * (starsConfig.maxSpeed - starsConfig.minSpeed) + starsConfig.minSpeed;
                
// Random direction angle (in radians)
const angle = Math.random() * Math.PI * 2;
                
// Apply styles
star.style.width = `${size}px`;
star.style.height = `${size}px`;
star.style.left = `${x}px`;
star.style.top = `${y}px`;
star.style.backgroundColor = color;
star.style.opacity = opacity;
                
// Store properties for animation
star.dataset.speed = speed;
star.dataset.posX = x;
star.dataset.posY = y;
star.dataset.angle = angle; // Direction angle
star.dataset.twinkle = Math.random() < 0.5 ? 'true' : 'false'; // Only some stars twinkle
                
// Occasionally change direction
star.dataset.dirChangeTime = Math.random() * 200 + 100; // Frames until direction change
star.dataset.dirCounter = 0; // Counter for direction changes
                
starsContainer.appendChild(star);
}
}

// Animate stars
function animateStars() {
    const stars = document.querySelectorAll('.star');
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
            
    stars.forEach(star => {
        const speed = parseFloat(star.dataset.speed);
        let posX = parseFloat(star.dataset.posX);
        let posY = parseFloat(star.dataset.posY);
        let angle = parseFloat(star.dataset.angle);
        let dirCounter = parseInt(star.dataset.dirCounter);
        const dirChangeTime = parseInt(star.dataset.dirChangeTime);
                
        // Check if it's time to change direction
        dirCounter++;
        if (dirCounter >= dirChangeTime) {
            // Slightly change the angle (not completely random to make movement smoother)
            angle = angle + (Math.random() * 0.5 - 0.25);
            star.dataset.angle = angle;
            star.dataset.dirCounter = 0;
            star.dataset.dirChangeTime = Math.random() * 200 + 100; // New random time until next change
            } else {
                star.dataset.dirCounter = dirCounter;
            }
                
            // Calculate new position based on angle and speed
            posX += Math.cos(angle) * speed;
            posY += Math.sin(angle) * speed;
                
            // Reset position if star goes off screen
            if (posX < -10) posX = containerWidth + 10;
            if (posX > containerWidth + 10) posX = -10;
            if (posY < -10) posY = containerHeight + 10;
            if (posY > containerHeight + 10) posY = -10;
                
            // Update position
            star.style.left = `${posX}px`;
            star.style.top = `${posY}px`;
            star.dataset.posX = posX;
            star.dataset.posY = posY;
                
            // Twinkle effect for stars that twinkle
            if (star.dataset.twinkle === 'true' && Math.random() < starsConfig.twinkleFrequency) {
                star.style.opacity = Math.random() * 0.5 + 0.5;
            }
        });
            
        requestAnimationFrame(animateStars);
        }

// Handle window resize
function handleResize() {
createStars();
        }

// Cycle through names
function cycleNames() {
    let currentIndex = 0;
    const people = peopleData.people;
            
    // Function to update the name with fade effect
    function updateName() {
    personName.classList.remove('fade-in-out');
                
    // Trigger reflow to restart animation
    void personName.offsetWidth;
                
    personName.textContent = people[currentIndex].name;
    personName.classList.add('fade-in-out');
                
    // Move to next person, loop back to start if at end
    currentIndex = (currentIndex + 1) % people.length;
                
    // Continue the cycle after 3 seconds
    setTimeout(updateName, 3000);
}
            
    // Start the cycle
        updateName();
    }

// Initialize
window.addEventListener('load', () => {
createStars();
animateStars();
cycleNames();
            
// Add event listeners
window.addEventListener('resize', handleResize);
 });