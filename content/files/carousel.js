document.addEventListener('DOMContentLoaded', () => {
    // Initialize all carousels on the page
    const carousels = document.querySelectorAll('.media-gallery');
    carousels.forEach(initializeCarousel);
    
    // Create fullscreen overlay (once for the entire page)
    const fullscreenOverlay = document.createElement('div');
    fullscreenOverlay.className = 'fullscreen-overlay';
    fullscreenOverlay.innerHTML = `
        <div class="fullscreen-container">
            <img class="fullscreen-image" src="" alt="Fullscreen image">
            <button class="fullscreen-close">&times;</button>
            <button class="fullscreen-nav fullscreen-prev">&lsaquo;</button>
            <button class="fullscreen-nav fullscreen-next">&rsaquo;</button>
        </div>
    `;
    document.body.appendChild(fullscreenOverlay);
    
    // Set up fullscreen event handlers
    const fullscreenImage = fullscreenOverlay.querySelector('.fullscreen-image');
    const closeBtn = fullscreenOverlay.querySelector('.fullscreen-close');
    const prevBtn = fullscreenOverlay.querySelector('.fullscreen-prev');
    const nextBtn = fullscreenOverlay.querySelector('.fullscreen-next');
    
    let currentGallery = null;
    let currentImageIndex = 0;
    let galleryImages = [];
    
    // Close fullscreen when clicking the close button or outside the image
    closeBtn.addEventListener('click', closeFullscreen);
    fullscreenOverlay.addEventListener('click', (e) => {
        if (e.target === fullscreenOverlay) {
            closeFullscreen();
        }
    });
    
    // Navigate through images in fullscreen mode
    prevBtn.addEventListener('click', () => {
        if (galleryImages.length <= 1) return;
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        fullscreenImage.src = galleryImages[currentImageIndex].src;
        fullscreenImage.alt = galleryImages[currentImageIndex].alt;
    });
    
    nextBtn.addEventListener('click', () => {
        if (galleryImages.length <= 1) return;
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        fullscreenImage.src = galleryImages[currentImageIndex].src;
        fullscreenImage.alt = galleryImages[currentImageIndex].alt;
    });
    
    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!fullscreenOverlay.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeFullscreen();
        } else if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    });
    
    function openFullscreen(gallery, imageIndex) {
        currentGallery = gallery;
        currentImageIndex = imageIndex;
        galleryImages = Array.from(gallery.querySelectorAll('.carousel-item img'));
        
        fullscreenImage.src = galleryImages[imageIndex].src;
        fullscreenImage.alt = galleryImages[imageIndex].alt;
        fullscreenOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    function closeFullscreen() {
        fullscreenOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Restore navigation buttons visibility
        const prevBtn = fullscreenOverlay.querySelector('.fullscreen-prev');
        const nextBtn = fullscreenOverlay.querySelector('.fullscreen-next');
        prevBtn.style.display = '';
        nextBtn.style.display = '';
    }
    
    // Export these functions to make them accessible
    window.carouselFullscreen = {
        open: openFullscreen,
        close: closeFullscreen
    };

    // Function to initialize fullscreen for stage3 media items
    const stage3MediaItems = document.querySelectorAll('.student-stage .stage3-header + .stage-content .media-item img');
    
    stage3MediaItems.forEach(img => {
        // Add fullscreen cursor style
        img.style.cursor = 'pointer';
        
        // Add a small fullscreen icon overlay
        const container = img.parentElement;
        const fullscreenIcon = document.createElement('div');
        fullscreenIcon.className = 'fullscreen-icon';
        fullscreenIcon.innerHTML = '⤢';
        fullscreenIcon.title = 'Προβολή σε πλήρη οθόνη';
        container.style.position = 'relative';
        container.appendChild(fullscreenIcon);
        
        // Add click event for both the image and icon
        img.addEventListener('click', () => openSingleImageFullscreen(img));
        fullscreenIcon.addEventListener('click', () => openSingleImageFullscreen(img));
    });
    
    // Function to open a single image in fullscreen
    function openSingleImageFullscreen(img) {
        const fullscreenOverlay = document.querySelector('.fullscreen-overlay');
        const fullscreenImage = fullscreenOverlay.querySelector('.fullscreen-image');
        
        // If fullscreen overlay doesn't exist yet (it should from the carousel code, but just in case)
        if (!fullscreenOverlay) {
            console.error("Fullscreen overlay not found. Make sure carousel.js loads correctly.");
            return;
        }
        
        // Update fullscreen image
        fullscreenImage.src = img.src;
        fullscreenImage.alt = img.alt;
        
        // Show the overlay
        fullscreenOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Hide navigation buttons since this is a single image
        const prevBtn = fullscreenOverlay.querySelector('.fullscreen-prev');
        const nextBtn = fullscreenOverlay.querySelector('.fullscreen-next');
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    }
});

function initializeCarousel(galleryElement) {
    // Get all images in the gallery
    const images = galleryElement.querySelectorAll('img');
    if (images.length === 0) return;
    
    // Clear the gallery content
    galleryElement.innerHTML = '';
    
    // Create carousel structure
    const carousel = document.createElement('div');
    carousel.className = 'carousel';
    
    // Create carousel items with images
    images.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'carousel-item';
        
        // Clone the image to preserve attributes
        const clonedImg = image.cloneNode(true);
        
        // Add click event for fullscreen
        clonedImg.addEventListener('click', () => {
            window.carouselFullscreen.open(galleryElement, index);
        });
        clonedImg.style.cursor = 'pointer';
        
        item.appendChild(clonedImg);
        carousel.appendChild(item);
    });
    
    // Add carousel to gallery
    galleryElement.appendChild(carousel);
    
    // Add navigation buttons
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-btn prev';
    prevBtn.innerHTML = '&lsaquo;';
    prevBtn.setAttribute('aria-label', 'Previous slide');
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-btn next';
    nextBtn.innerHTML = '&rsaquo;';
    nextBtn.setAttribute('aria-label', 'Next slide');
    
    galleryElement.appendChild(prevBtn);
    galleryElement.appendChild(nextBtn);
    
    // Add counter
    const counter = document.createElement('div');
    counter.className = 'carousel-counter';
    counter.textContent = `1/${images.length}`;
    galleryElement.appendChild(counter);
    
    // Add navigation dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-nav';
    
    for (let i = 0; i < images.length; i++) {
        const dot = document.createElement('div');
        dot.className = i === 0 ? 'carousel-dot active' : 'carousel-dot';
        dot.setAttribute('data-index', i);
        dotsContainer.appendChild(dot);
    }
    
    galleryElement.appendChild(dotsContainer);
    
    // Carousel state
    let currentIndex = 0;
    
    // Event listeners
    prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
    });
    
    nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
    });
    
    dotsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('carousel-dot')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            goToSlide(index);
        }
    });
    
    // Add touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX + swipeThreshold < touchStartX) {
            // Swipe left
            goToSlide(currentIndex + 1);
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right
            goToSlide(currentIndex - 1);
        }
    }
    
    // Slide navigation function
    function goToSlide(index) {
        // Handle wrap-around
        if (index < 0) {
            index = images.length - 1;
        } else if (index >= images.length) {
            index = 0;
        }
        
        currentIndex = index;
        
        // Update carousel position
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update counter
        counter.textContent = `${currentIndex + 1}/${images.length}`;
        
        // Update active dot
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    // Auto-advance slides (optional)
    let intervalId = setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 5000);
    
    // Pause auto-advance on hover
    galleryElement.addEventListener('mouseenter', () => {
        clearInterval(intervalId);
    });
    
    galleryElement.addEventListener('mouseleave', () => {
        intervalId = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
    });
} 