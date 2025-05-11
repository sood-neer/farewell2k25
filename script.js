document.addEventListener('DOMContentLoaded', function() {
    createStars();
    setupScrolling();
    applyRandomRotations();
    startNameRotation();
    loadHeroesData();
    loadGalleryImages();
    setupMenuToggle();
    setupVideoControls();
});

// Create stars for background
function createStars() {
    const starsContainer = document.getElementById('stars-container');
    const starCount = 200;
    
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

// Check if device is in landscape mode
function isLandscapeMode() {
    return window.innerHeight < 500 && window.innerWidth > window.innerHeight;
}

// Adjust UI for landscape mode
function optimizeForLandscape() {
    const isLandscape = isLandscapeMode();
    const heroCards = document.querySelectorAll('.hero-card');
    
    heroCards.forEach(card => {
        const imageContainer = card.querySelector('.hero-image-container');
        if (imageContainer) {
            // Use different aspect ratio in landscape mode
            imageContainer.style.aspectRatio = isLandscape ? '1.2/1' : '';
        }
        
        // Adjust padding in landscape mode
        card.style.padding = isLandscape ? '5px 0' : '';
    });
    
    // Adjust progress indicator position
    const progressIndicator = document.querySelector('.progress-indicator');
    if (progressIndicator) {
        progressIndicator.style.bottom = isLandscape ? '5px' : '';
    }
}

// Load heroes data and create carousel cards
async function loadHeroesData() {
    try {
        const response = await fetch('heroes.json');
        const heroes = await response.json();
        
        const carousel = document.querySelector('.hero-carousel');
        
        // Generate hero cards from JSON data
        heroes.forEach((hero, index) => {
            const heroCard = document.createElement('div');
            heroCard.className = `hero-card ${index === 0 ? 'active' : ''}`;
            
            const honorific = hero.name.includes('Shinjini') || hero.name.includes('Ridhi') ? "Ma'am" : "Sir";
            
            heroCard.innerHTML = `
                <div class="hero-content">
                    <div class="hero-image-container">
                        <img src="${hero.image}" alt="${hero.name}" class="hero-image ${hero.imageClass || ''}">
                    </div>
                    <div class="hero-text-container">
                        <h2 class="hero-name">${hero.name} ${honorific}</h2>
                        ${hero.title ? `<p class="hero-description"><span style='color: #add8e6'>${hero.title}</span></p>` : ''}
                        <div class="social-buttons">
                            <a href="${hero.insta}" class="social-button" target="_blank">
                                <i class="fab fa-instagram"></i>
                            </a>
                            <a href="${hero.linkedin}" class="social-button" target="_blank">
                                <i class="fab fa-linkedin-in"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
            
            carousel.appendChild(heroCard);
        });
        
        // Create progress indicators
        const progressIndicator = document.querySelector('.progress-indicator');
        heroes.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `progress-dot ${index === 0 ? 'active' : ''}`;
            progressIndicator.appendChild(dot);
        });
        
        // Initialize carousel after cards are created
        setupCarousel();
        
    } catch (error) {
        console.error('Error loading heroes data:', error);
        // Show fallback content or error message
        document.querySelector('.hero-carousel-container').innerHTML = `
            <div class="error-message">
                <h2>Oops! Something went wrong.</h2>
                <p>We couldn't load the hero data. Please try again later.</p>
            </div>
        `;
    }
}

// Setup carousel with improved navigation
function setupCarousel() {
    const carousel = document.querySelector('.hero-carousel');
    const cards = document.querySelectorAll('.hero-card');
    const dots = document.querySelectorAll('.progress-dot');
    const prevArrow = document.querySelector('.carousel-arrow.prev');
    const nextArrow = document.querySelector('.carousel-arrow.next');
    
    let activeIndex = 0;
    let position = 0;
    let isAnimating = false;
    
    // Function to update carousel position and active states
    function updateCarousel(newIndex, direction = 'forward') {
        if (isAnimating) return;
        isAnimating = true;
        
        // Store the current active card
        const oldActiveIndex = activeIndex;
        
        // Handle cycling from end to beginning (maintain forward motion)
        if (newIndex >= cards.length) {
            newIndex = 0; // Loop back to the first card
        } else if (newIndex < 0) {
            newIndex = cards.length - 1; // Loop to the last card
        }
        
        activeIndex = newIndex;
        
        // Calculate position to center the active card
        const cardWidth = cards[0].offsetWidth;
        const margin = parseInt(window.getComputedStyle(cards[0]).marginRight) + 
                      parseInt(window.getComputedStyle(cards[0]).marginLeft);
        
        position = -(activeIndex * (cardWidth + margin)) + 
                  (carousel.offsetWidth - cardWidth) / 2;
        
        // Special handling for the wrap-around case
        if (oldActiveIndex === cards.length - 1 && newIndex === 0 && direction === 'forward') {
            // For the transition from last to first, we need special handling
            
            // First, clone the first card and append it at the end for a smooth transition
            const firstCardClone = cards[0].cloneNode(true);
            firstCardClone.classList.add('clone');
            carousel.appendChild(firstCardClone);
            
            // Move to the clone (positioned after the last card)
            const tempPosition = -((cards.length) * (cardWidth + margin)) + 
                               (carousel.offsetWidth - cardWidth) / 2;
            
            carousel.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            carousel.style.transform = `translateX(${tempPosition}px)`;
            
            // After the transition completes, quickly reset to the real first card without animation
            setTimeout(() => {
                carousel.style.transition = 'none';
                carousel.style.transform = `translateX(${position}px)`;
                
                // Remove the clone
                carousel.removeChild(firstCardClone);
                
                // Update classes after the reset
                updateCardClasses();
                
                // Restore the transition for future movements
                setTimeout(() => {
                    carousel.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    isAnimating = false;
                }, 50);
            }, 800); // Match this to your transition duration
        } else {
            // Normal transition
            carousel.style.transform = `translateX(${position}px)`;
            
            // Update card classes
            updateCardClasses();
            
            // Allow new transitions after this one completes
            setTimeout(() => {
                isAnimating = false;
            }, 800); // Match this to your transition duration
        }
        
        // Update progress dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    }
    
    // Update card classes based on active index
    function updateCardClasses() {
        cards.forEach((card, index) => {
            card.classList.remove('active', 'prev', 'next', 'animate-scale');
            
            if (index === activeIndex) {
                card.classList.add('active', 'animate-scale');
            } else if (index === (activeIndex - 1 + cards.length) % cards.length) {
                card.classList.add('prev');
            } else if (index === (activeIndex + 1) % cards.length) {
                card.classList.add('next');
            }
        });
    }
    
    // Set up event listeners for arrows
    nextArrow.addEventListener('click', () => {
        updateCarousel(activeIndex + 1, 'forward');
    });
    
    prevArrow.addEventListener('click', () => {
        updateCarousel(activeIndex - 1, 'backward');
    });
    
    // Set up event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const direction = index > activeIndex ? 'forward' : 'backward';
            updateCarousel(index, direction);
        });
    });
    
    // Initialize carousel on first load
    updateCarousel(activeIndex);
    
    // Auto-cycling functionality
    function autoCycle() {
        updateCarousel(activeIndex + 1, 'forward');
    }
    
    // Set auto-cycling interval (every 5 seconds)
    let autoPlayInterval = setInterval(autoCycle, 5000);
    
    // Pause auto-cycling when user interacts with carousel
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });
    
    // Resume auto-cycling when user stops interacting
    carousel.addEventListener('mouseleave', () => {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(autoCycle, 5000);
    });
    
    // Handle touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(autoPlayInterval);
    }, {passive: true});
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        
        // Detect swipe direction
        if (touchEndX < touchStartX) {
            // Swipe left - go to next
            updateCarousel(activeIndex + 1, 'forward');
        } else if (touchEndX > touchStartX) {
            // Swipe right - go to previous
            updateCarousel(activeIndex - 1, 'backward');
        }
        
        // Resume auto cycling
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(autoCycle, 5000);
    }, {passive: true});
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Recalculate positions without animation
        const oldTransition = carousel.style.transition;
        carousel.style.transition = 'none';
        
        // Update carousel immediately
        const cardWidth = cards[0].offsetWidth;
        const margin = parseInt(window.getComputedStyle(cards[0]).marginRight) + 
                      parseInt(window.getComputedStyle(cards[0]).marginLeft);
        
        position = -(activeIndex * (cardWidth + margin)) + 
                  (carousel.offsetWidth - cardWidth) / 2;
                  
        carousel.style.transform = `translateX(${position}px)`;
        
        // Restore transition after position update
        setTimeout(() => {
            carousel.style.transition = oldTransition;
        }, 50);
        
        optimizeForLandscape();
    });
}

// Function to load and display images
async function loadGalleryImages() {
    try {
        const response = await fetch('image.json');
        const data = await response.json();
        const galleryContainer = document.querySelector('.gallery-container');
        
        // Clear existing content
        galleryContainer.innerHTML = '';
        
        // Create and append image frames
        data.images.forEach(image => {
            const frame = document.createElement('div');
            frame.className = 'photo-frame';
            frame.id = image.id;
            
            const img = document.createElement('img');
            img.src = image.src;
            img.alt = image.alt;
            
            frame.appendChild(img);
            galleryContainer.appendChild(frame);
            
            // Add random rotation to each frame
            const rotation = Math.random() * 10 - 5; // Random rotation between -5 and 5 degrees
            frame.style.setProperty('--rotation', `${rotation}deg`);
        });
    } catch (error) {
        console.error('Error loading gallery images:', error);
    }
}

// Navigation functionality
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');
    const mainContainer = document.querySelector('.main-container');

    // Function to handle navigation
    function handleNavigation(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            // Update active state
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');

            // Smooth scroll to section
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Add click event listeners to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Function to update active nav link based on scroll position
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 100; // Offset for navbar height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Add scroll event listener
    window.addEventListener('scroll', updateActiveNav);

    // Initial active state
    updateActiveNav();

    // Handle initial page load with hash in URL
    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection) {
            setTimeout(() => {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }

    // Prevent default scroll behavior for smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll reveal animation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-reveal');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });
});

// Menu Toggle Functionality
function setupMenuToggle() {
    const menuToggle = document.querySelector('.menu-toggle');
    const body = document.body;
    const dropdownMenu = document.querySelector('.dropdown-menu');

    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        body.classList.toggle('menu-open');
        
        // Prevent scrolling when menu is open
        if (body.classList.contains('menu-open')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });

    // Close menu when clicking menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            body.classList.remove('menu-open');
            body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (body.classList.contains('menu-open') && 
            !e.target.closest('.dropdown-menu') && 
            !e.target.closest('.menu-toggle')) {
            body.classList.remove('menu-open');
            body.style.overflow = '';
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && body.classList.contains('menu-open')) {
            body.classList.remove('menu-open');
            body.style.overflow = '';
        }
    });
}

// Video controls
function setupVideoControls() {
    const video = document.getElementById('farewellVideo');
    const videoFrame = document.querySelector('.video-frame');
    const playPauseBtn = document.querySelector('.play-pause-btn');
    const timeline = document.querySelector('.timeline');
    const timelineProgress = document.querySelector('.timeline-progress');
    const timeDisplay = document.querySelector('.time-display');
    const volumeBtn = document.querySelector('.volume-btn');
    const volumeSlider = document.querySelector('.volume-slider');
    const volumeLevel = document.querySelector('.volume-level');
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    const videoControls = document.querySelector('.video-controls');

    let controlsTimeout;
    const CONTROLS_TIMEOUT = 3000; // Hide controls after 3 seconds of inactivity

    // Show controls and set timeout to hide them
    function showControls() {
        videoControls.style.opacity = '1';
        videoControls.style.transform = 'translateY(0)';
        
        // Clear existing timeout
        if (controlsTimeout) {
            clearTimeout(controlsTimeout);
        }
        
        // Set new timeout
        controlsTimeout = setTimeout(() => {
            if (!video.paused) { // Only hide if video is playing
                videoControls.style.opacity = '0';
                videoControls.style.transform = 'translateY(100%)';
            }
        }, CONTROLS_TIMEOUT);
    }

    // Hide controls immediately
    function hideControls() {
        videoControls.style.opacity = '0';
        videoControls.style.transform = 'translateY(100%)';
    }

    // Initialize video volume
    video.volume = 1;
    volumeLevel.style.width = '100%';

    // Play/Pause functionality
    function togglePlay() {
        if (video.paused) {
            video.play().catch(error => {
                console.error('Error playing video:', error);
            });
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            // Hide controls after timeout when playing
            showControls();
        } else {
            video.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            // Keep controls visible when paused
            showControls();
        }
    }

    // Timeline functionality
    function updateTimeline() {
        if (video.duration) {
            const percent = (video.currentTime / video.duration) * 100;
            timelineProgress.style.width = `${percent}%`;
            timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
        }
    }

    function setTimelinePosition(e) {
        const rect = timeline.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        video.currentTime = percent * video.duration;
    }

    // Volume functionality
    function updateVolume(e) {
        const rect = volumeSlider.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        video.volume = percent;
        volumeLevel.style.width = `${percent * 100}%`;
        updateVolumeIcon(percent);
    }

    function updateVolumeIcon(volume) {
        if (volume === 0) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else if (volume < 0.5) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
        } else {
            volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }

    function toggleMute() {
        video.muted = !video.muted;
        if (video.muted) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            volumeLevel.style.width = '0%';
        } else {
            updateVolumeIcon(video.volume);
            volumeLevel.style.width = `${video.volume * 100}%`;
        }
    }

    // Fullscreen functionality
    function toggleFullscreen() {
        const videoFrame = document.querySelector('.video-frame');
        const video = document.getElementById('farewellVideo');
        
        if (!document.fullscreenElement) {
            // Enter fullscreen
            if (videoFrame.requestFullscreen) {
                videoFrame.requestFullscreen();
            } else if (videoFrame.webkitRequestFullscreen) {
                videoFrame.webkitRequestFullscreen();
            } else if (videoFrame.mozRequestFullScreen) {
                videoFrame.mozRequestFullScreen();
            } else if (videoFrame.msRequestFullscreen) {
                videoFrame.msRequestFullscreen();
            } else if (videoFrame.webkitEnterFullscreen) {
                // For iOS Safari
                video.webkitEnterFullscreen();
            }
            
            // Update button icon
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
            
            // Add landscape class for mobile
            if (window.innerWidth <= 768) {
                videoFrame.classList.add('landscape-fullscreen');
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            
            // Update button icon
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
            
            // Remove landscape class
            videoFrame.classList.remove('landscape-fullscreen');
        }
    }

    // Helper function to format time
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Event listeners
    playPauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
    });

    videoFrame.addEventListener('click', (e) => {
        e.stopPropagation();
        if (e.target === videoFrame || e.target === video) {
            togglePlay();
        }
    });

    videoFrame.addEventListener('mousemove', showControls);
    videoFrame.addEventListener('touchstart', showControls);

    // Hide controls when mouse leaves video frame
    videoFrame.addEventListener('mouseleave', () => {
        if (!video.paused) {
            hideControls();
        }
    });

    // Show controls when mouse enters video frame
    videoFrame.addEventListener('mouseenter', showControls);

    // Keep controls visible when interacting with them
    videoControls.addEventListener('mousemove', (e) => {
        e.stopPropagation();
        showControls();
    });

    videoControls.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        showControls();
    });

    video.addEventListener('timeupdate', updateTimeline);
    video.addEventListener('loadedmetadata', updateTimeline);
    video.addEventListener('ended', () => {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });

    timeline.addEventListener('click', (e) => {
        e.stopPropagation();
        setTimelinePosition(e);
    });

    volumeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMute();
    });

    volumeSlider.addEventListener('click', (e) => {
        e.stopPropagation();
        updateVolume(e);
    });

    fullscreenBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFullscreen();
    });

    // Handle fullscreen change
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    function handleFullscreenChange() {
        const videoFrame = document.querySelector('.video-frame');
        const fullscreenBtn = document.querySelector('.fullscreen-btn');
        
        if (!document.fullscreenElement && 
            !document.webkitFullscreenElement && 
            !document.mozFullScreenElement && 
            !document.msFullscreenElement) {
            // Exited fullscreen
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
            videoFrame.classList.remove('landscape-fullscreen');
        } else {
            // Entered fullscreen
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
            if (window.innerWidth <= 768) {
                videoFrame.classList.add('landscape-fullscreen');
            }
        }
    }

    // Initialize controls
    updateTimeline();
    updateVolumeIcon(video.volume);
    
    // Initially hide controls
    hideControls();
}

// Intersection Observer for section visibility
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});
