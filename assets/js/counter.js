// Counter Animation when scrolling into view
document.addEventListener('DOMContentLoaded', function() {
  const statNumber = document.querySelector('.stat-number');
  let hasAnimated = false;

  // Function to animate the counter
  function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100; // Divide into 100 steps
    const duration = 2000; // 2 seconds
    const stepTime = duration / 100;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target.toLocaleString('pt-BR');
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current).toLocaleString('pt-BR');
      }
    }, stepTime);
  }

  // Intersection Observer to detect when element is in viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        animateCounter(entry.target, target);
        hasAnimated = true;
      }
    });
  }, {
    threshold: 0.5 // Trigger when 50% of the element is visible
  });

  // Observe the stat number element
  if (statNumber) {
    observer.observe(statNumber);
  }
});
