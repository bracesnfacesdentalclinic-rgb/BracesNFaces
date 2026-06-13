// ═══════════════════════════════════════════════
//   BRACES N FACES — Premium JS
// ═══════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {

  // ── Mobile Menu ──
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  function openMenu() {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu)  hamburger.addEventListener('click', openMenu);
  if (mobileClose && mobileMenu) mobileClose.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close menu on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) closeMenu();
  });

  // ── Navbar Scroll ──
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleNavScroll = () => {
      if (window.scrollY > 20) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    };
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();
  }

  // ── Scroll Reveal ──
  const revealSels = ['.reveal', '.reveal-left', '.reveal-right'];
  const allReveal = document.querySelectorAll(revealSels.join(','));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

  allReveal.forEach(el => revealObserver.observe(el));

  // ── Counter Animation ──
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    let counted = false;
    const countObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counted) {
          counted = true;
          const counters = statsSection.querySelectorAll('.counter');
          counters.forEach(counter => {
            const target   = parseFloat(counter.dataset.target);
            const suffix   = counter.dataset.suffix || '';
            const duration = 1800;
            const isDecimal = target % 1 !== 0;
            const startTime = performance.now();

            function update(now) {
              const elapsed  = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeOut  = 1 - Math.pow(1 - progress, 3);
              const current  = target * easeOut;
              counter.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
              if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
          });
        }
      });
    }, { threshold: 0.3 });
    countObserver.observe(statsSection);
  }

  // ── Gallery Lightbox ──
  const galleryItems  = document.querySelectorAll('.gallery-item');
  const lightbox      = document.querySelector('.lightbox');
  const lightboxImg   = document.querySelector('.lightbox img');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (lightbox && lightboxImg) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });
  }

  // ── Gallery Filter ──
  const filterBtns    = document.querySelectorAll('.filter-btn');
  const galleryGrid   = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      galleryGrid.forEach(item => {
        item.classList.toggle('hidden', !(filter === 'all' || item.dataset.category === filter));
      });
    });
  });

  // ── Contact Form ──
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      submitBtn.innerText = "Sending...";
      submitBtn.disabled = true;

      fetch("https://formsubmit.co/ajax/bracesnfacesdentalclinic@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
      })
      .then(response => response.json())
      .then(data => {
          submitBtn.innerText = originalText;
          submitBtn.disabled = false;
          contactForm.style.display = 'none';
          if (formSuccess) {
            formSuccess.style.display = 'block';
            setTimeout(() => {
              formSuccess.style.display = 'none';
              contactForm.style.display = 'block';
              contactForm.reset();
            }, 6000);
          }
      })
      .catch(error => {
          submitBtn.innerText = originalText;
          submitBtn.disabled = false;
          alert("Sorry, there was an error sending your enquiry. Please try again.");
      });
    });
  }

  // ── Smooth Hover on Service Cards ──
  const serviceCards = document.querySelectorAll('.service-card, .service-full-card');
  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.willChange = 'transform, box-shadow';
    });
    card.addEventListener('mouseleave', () => {
      card.style.willChange = 'auto';
    });
  });

});
