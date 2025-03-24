document.addEventListener('DOMContentLoaded', function() {
    createStars();
    setupScrolling();
    applyRandomRotations();
    startNameRotation();
});

// Create stars for background
function createStars() {
    const starsContainer = document.getElementById('stars-container');
    const starCount = 400;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const size = Math.random() * 2.5 + 0.5;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        star.style.left = `${posX}%`;
        star.style.top = `${posY}%`;
        
        const duration = Math.random() * 50 + 10;
        star.style.animation = `twinkle ${duration}s infinite`;
        
        starsContainer.appendChild(star);
        animateStar(star);
    }
}

// Animate stars
function animateStar(star) {
    const speed = Math.random() * 0.3 + 0.05;
    const direction = Math.random() * 360;
    let posX = parseFloat(star.style.left);
    let posY = parseFloat(star.style.top);
    
    function moveStep() {
        posX += Math.cos(direction) * speed * 0.1;
        posY += Math.sin(direction) * speed * 0.1;
        
        if (posX > 100) posX = 0;
        if (posX < 0) posX = 100;
        if (posY > 100) posY = 0;
        if (posY < 0) posY = 100;
        
        star.style.left = `${posX}%`;
        star.style.top = `${posY}%`;
        
        requestAnimationFrame(moveStep);
    }
    
    moveStep();
}

// Setup scrolling and navigation
function setupScrolling() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const mainContainer = document.querySelector('.main-container');

    // Update active section
    function updateActiveSection() {
        const scrollPosition = mainContainer.scrollTop;
        const windowHeight = window.innerHeight;

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop - windowHeight/2 && 
                scrollPosition < sectionBottom - windowHeight/2) {
                navLinks.forEach(link => link.classList.remove('active'));
                
                navLinks[index].classList.add('active');
            }
        });
    }

    // Smooth scroll to section
    function scrollToSection(sectionId) {
        const section = document.querySelector(sectionId);
        mainContainer.scrollTo({
            top: section.offsetTop,
            behavior: 'smooth'
        });
    }

    // Event listeners
    mainContainer.addEventListener('scroll', updateActiveSection);

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href');
            scrollToSection(sectionId);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const currentSection = Array.from(sections).findIndex(section => {
            const rect = section.getBoundingClientRect();
            return rect.top <= 0 && rect.bottom > 0;
        });

        if (e.key === 'ArrowDown' && currentSection < sections.length - 1) {
            scrollToSection(`#${sections[currentSection + 1].id}`);
        } else if (e.key === 'ArrowUp' && currentSection > 0) {
            scrollToSection(`#${sections[currentSection - 1].id}`);
        }
    });
}

// Apply random rotations to gallery images
function applyRandomRotations() {
    const frames = document.querySelectorAll('.photo-frame');
    frames.forEach(frame => {
        const rotation = (Math.random() * 10 - 5);
        frame.style.setProperty('--rotation', `${rotation}deg`);
    });
}

function startNameRotation() {
    const namesData = {
        "people": [
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

    const rotatingNameElement = document.getElementById('rotatingName');
    rotatingNameElement.classList.add('active'); // Ensure the active class is added
    let currentIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const delayBetweenNames = 2000;

    function typeWriterEffect() {
        const currentName = namesData.people[currentIndex].name;
        if (isDeleting) {
            rotatingNameElement.textContent = currentName.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                currentIndex = (currentIndex + 1) % namesData.people.length;
                setTimeout(typeWriterEffect, typingSpeed);
            } else {
                setTimeout(typeWriterEffect, deletingSpeed);
            }
        } else {
            rotatingNameElement.textContent = currentName.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentName.length) {
                isDeleting = true;
                setTimeout(typeWriterEffect, delayBetweenNames);
            } else {
                setTimeout(typeWriterEffect, typingSpeed);
            }
        }
    }

    typeWriterEffect();
}
