// Carousel Functionality
class Carousel {
  constructor() {
    this.slides = document.querySelectorAll('.carousel-slide');
    this.dots = document.querySelectorAll('.carousel-dot');
    this.prevBtn = document.querySelector('.carousel-arrow.prev');
    this.nextBtn = document.querySelector('.carousel-arrow.next');
    this.currentSlide = 0;
    this.autoPlayInterval = null;
    
    this.init();
  }

  init() {
    // Show first slide
    this.showSlide(0);
    
    // Event listeners
    this.prevBtn.addEventListener('click', () => this.previousSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());
    
    // Dots navigation
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    // Auto play
    this.startAutoPlay();

    // Pause on hover
    const carousel = document.querySelector('.carousel-container');
    carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
    carousel.addEventListener('mouseleave', () => this.startAutoPlay());
  }

  showSlide(index) {
    // Remove active class from all slides and dots
    this.slides.forEach(slide => slide.classList.remove('active'));
    this.dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current slide and dot
    this.slides[index].classList.add('active');
    this.dots[index].classList.add('active');
    
    this.currentSlide = index;
  }

  nextSlide() {
    let next = this.currentSlide + 1;
    if (next >= this.slides.length) {
      next = 0;
    }
    this.showSlide(next);
  }

  previousSlide() {
    let prev = this.currentSlide - 1;
    if (prev < 0) {
      prev = this.slides.length - 1;
    }
    this.showSlide(prev);
  }

  goToSlide(index) {
    this.showSlide(index);
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Carousel();
});
