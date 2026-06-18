// Mapeo de items del portafolio a carpetas de imágenes
const projectMap = {
  'art-1': { title: 'Identidad Visual OMNI', folder: 'NuevoPortafolio/OMNI' },
  'art-2': { title: 'Identidad Visual Vortex', folder: 'NuevoPortafolio/Vortex' },
  'art-3': { title: 'DiFogo-made of me', folder: 'NuevoPortafolio/DiFogo' }
};

// Imágenes por carpeta
const images = {
  'NuevoPortafolio/OMNI': [
    'omni.png',
    'cap_omni.png',
    'pack_whi.png',
    'pack_bla.png',
    'ref_sheet.png',
    'shirt_whi.png',
    'shirt_whi_v.png',
    'hoodie_bla.png',
    'etiqueta.png',
    'bla_whi.png'
  ],
  'NuevoPortafolio/Vortex': [
    'kiber_white.png',
    'kiber_opacity.png',
    'kiber_vert.png',
    'kiber_default.png',
    'logo_p.png',
    'Mockup.png'
  ],
  'NuevoPortafolio/DiFogo': [
    'RoboPortada.png'
  ]
};

let currentSlide = 0;
let currentFolder = '';

// Cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animateCursor() {
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();
document.querySelectorAll('a, button, .portfolio-item').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('big'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));
// Trigger hero immediately
document.querySelectorAll('.hero .reveal').forEach(el => {
  setTimeout(() => el.classList.add('visible'), 100);
});

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Modal Carrusel
const modal = document.getElementById('carouselModal');
const closeBtn = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const carouselTrack = document.getElementById('carouselTrack');
const indicators = document.getElementById('indicators');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Abrir modal al hacer click en items del portafolio
document.querySelectorAll('.portfolio-item').forEach((item, index) => {
  const itemArt = item.querySelector('.item-art');
  let artClass = '';
  
  // Extraer la clase art-X
  if (itemArt) {
    for (let cls of itemArt.classList) {
      if (cls.startsWith('art-')) {
        artClass = cls;
        break;
      }
    }
  }
  
  if (artClass && projectMap[artClass]) {
    // Hacer clickeable todo el item
    item.style.cursor = 'pointer';
    item.addEventListener('click', (e) => {
      if (!e.target.closest('a')) {
        openCarousel(artClass);
      }
    });
    
    // También en el overlay-link
    const overlayLink = item.querySelector('.overlay-link');
    if (overlayLink) {
      overlayLink.addEventListener('click', (e) => {
        e.preventDefault();
        openCarousel(artClass);
      });
    }
  }
});

function openCarousel(artClass) {
  const project = projectMap[artClass];
  if (!project) return;
  
  currentFolder = project.folder;
  currentSlide = 0;
  modalTitle.textContent = project.title;
  
  loadCarouselImages(project.folder);
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function loadCarouselImages(folder) {
  const imageList = images[folder];
  if (!imageList) return;
  
  carouselTrack.innerHTML = '';
  indicators.innerHTML = '';
  
  imageList.forEach((img, index) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    const imgEl = document.createElement('img');
    imgEl.src = `${folder}/${img}`;
    imgEl.alt = img;
    slide.appendChild(imgEl);
    carouselTrack.appendChild(slide);
    
    const indicator = document.createElement('div');
    indicator.className = 'indicator' + (index === 0 ? ' active' : '');
    indicator.addEventListener('click', () => goToSlide(index));
    indicators.appendChild(indicator);
  });
  
  updateCarousel();
}

function updateCarousel() {
  const track = document.getElementById('carouselTrack');
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  
  document.querySelectorAll('.indicator').forEach((ind, i) => {
    ind.classList.toggle('active', i === currentSlide);
  });
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
}

function nextSlide() {
  const totalSlides = document.querySelectorAll('.carousel-slide').length;
  currentSlide = (currentSlide + 1) % totalSlides;
  updateCarousel();
}

function prevSlide() {
  const totalSlides = document.querySelectorAll('.carousel-slide').length;
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateCarousel();
}

// Event listeners
closeBtn.addEventListener('click', () => {
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
});

prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Navegación por teclado
document.addEventListener('keydown', (e) => {
  if (modal.classList.contains('active')) {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'Escape') {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }
});
