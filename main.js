function Slider(container, config = {}) {
  this.container = document.querySelector(container);
  this.slides = Array.from(this.container.getElementsByTagName('img'));
  this.interval = config.interval || 2000;
  this.showIndicators = config.showIndicators !== undefined ? config.showIndicators : true;
  this.autoPlay = config.autoPlay !== undefined ? config.autoPlay : true;
  this.currentSlide = 0;
  this.intervalId = null;
  this.init();
}

Slider.prototype.init = function() {
  this.slides.forEach((slide, i) => {
    slide.classList.remove('active');
    if (i === 0) slide.classList.add('active');
  });

  this.createControls();
  if (this.autoPlay) {
    this.startAutoScroll();
  }
  this.addEventListeners();
  this.addSwipeSupport();
};

Slider.prototype.createControls = function() {
  this.controlsContainer = document.createElement('div');
  this.controlsContainer.id = 'controls';

  const prevButton = document.createElement('button');
  prevButton.textContent = 'prev';
  prevButton.addEventListener('click', () => this.prevSlide());
  this.controlsContainer.appendChild(prevButton);

  const nextButton = document.createElement('button');
  nextButton.textContent = 'next';
  nextButton.addEventListener('click', () => this.nextSlide());
  this.controlsContainer.appendChild(nextButton);

  const pauseButton = document.createElement('button');
  pauseButton.textContent = 'pause';
  pauseButton.addEventListener('click', () => this.stopAutoScroll());
  this.controlsContainer.appendChild(pauseButton);

  const resumeButton = document.createElement('button');
  resumeButton.textContent = 'resume';
  resumeButton.addEventListener('click', () => this.startAutoScroll());
  this.controlsContainer.appendChild(resumeButton);

  document.body.appendChild(this.controlsContainer);

  if (this.showIndicators) {
    this.createIndicators();
  }
};

Slider.prototype.createIndicators = function() {
  this.indicatorsContainer = document.createElement('div');
  this.indicatorsContainer.id = 'indicators';

  this.slides.forEach((slide, i) => {
    const indicator = document.createElement('span');
    indicator.textContent = i + 1;
    indicator.style.cursor = 'pointer';
    indicator.addEventListener('click', () => this.goToSlide(i));
    this.indicatorsContainer.appendChild(indicator);
  });

  document.body.appendChild(this.indicatorsContainer);
};

Slider.prototype.goToSlide = function(index) {
  this.slides[this.currentSlide].classList.remove('active');
  this.slides[index].classList.add('active');
  this.currentSlide = index;
};

Slider.prototype.nextSlide = function() {
  const nextSlide = this.currentSlide === this.slides.length - 1 ? 0 : this.currentSlide + 1;
  this.goToSlide(nextSlide);
};

Slider.prototype.prevSlide = function() {
  const prevSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
  this.goToSlide(prevSlide);
};

Slider.prototype.startAutoScroll = function() {
  this.intervalId = setInterval(() => this.nextSlide(), this.interval);
};

Slider.prototype.stopAutoScroll = function() {
  clearInterval(this.intervalId);
};

Slider.prototype.addEventListeners = function() {
  this.controlsContainer.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', (event) => {
      if (event.target.id === 'next') this.nextSlide();
      if (event.target.id === 'prev') this.prevSlide();
      if (event.target.id === 'pause') this.stopAutoScroll();
      if (event.target.id === 'resume') this.startAutoScroll();
    });
  });
};

Slider.prototype.addSwipeSupport = function() {
  let startX = 0;
  let endX = 0;

  this.container.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
  });

  this.container.addEventListener('touchend', (event) => {
    endX = event.changedTouches[0].clientX;
    this.handleSwipe(startX, endX);
  });

  this.container.addEventListener('mousedown', (event) => {
    startX = event.clientX;
  });

  this.container.addEventListener('mouseup', (event) => {
    endX = event.clientX;
    this.handleSwipe(startX, endX);
  });
};

Slider.prototype.handleSwipe = function(startX, endX) {
  const swipeDistance = endX - startX;
  if (swipeDistance > 50) {
    this.prevSlide();
  } else if (swipeDistance < -50) {
    this.nextSlide();
  }
};

// Ініціалізація слайдера з конфігурацією
const slider = new Slider('#slider', {
  interval: 3000,
  showIndicators: true,
  autoPlay: true
});

