/* ═══════════════════════════════════════
   TRÚC LÊ PORTFOLIO — SCRIPT.JS
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── AUTOMATIC OFFLINE/LOCAL VIDEO SOURCE SWITCHER ────────────────
  // If running locally (via file:// protocol or localhost), dynamically
  // rewrite video sources to use the local VIDEO/ folder.
  const isLocal = window.location.protocol === 'file:' || 
                  window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1';
                  
  if (isLocal) {
    console.log("Running locally/offline. Switching all video sources to local VIDEO/ folder...");
    document.querySelectorAll('.portfolio-video').forEach(video => {
      const currentSrc = video.getAttribute('src');
      if (currentSrc && currentSrc.includes('dropbox.com/')) {
        let urlWithoutParams = currentSrc.split('?')[0];
        let filename = urlWithoutParams.substring(urlWithoutParams.lastIndexOf('/') + 1);
        if (filename.startsWith("SOCIAL-")) {
          filename = filename.replace("SOCIAL-", "SOCIAL ");
        }
        video.src = "VIDEO/" + filename;
        video.load();
      }
    });
  }

  // ─── CUSTOM CURSOR ───────────────────────────────
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover effect on interactive elements
  const hoverEls = document.querySelectorAll('a, button, .gallery-card, .uxui-panel, .video-card, .event-card, .contact-item, input, textarea');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });


  // ─── NAVBAR SCROLL & ACTIVE ─────────────────────
  const navbar  = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Scrolled style
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlight
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  });

  // Mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const navLinksEl = document.querySelector('.nav-links');
  navToggle.addEventListener('click', () => {
    navLinksEl.classList.toggle('open');
  });
  navLinksEl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinksEl.classList.remove('open'));
  });


  // ─── SMOOTH SCROLL ──────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 68, behavior: 'smooth' });
      }
    });
  });


  // ─── TAB SWITCHING ──────────────────────────────
  document.querySelectorAll('.tab-nav').forEach(tabNav => {
    const tabBtns = tabNav.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;

        // Deactivate all in this nav
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Find sibling tab contents (in same section)
        const section = tabNav.closest('.section');
        const contents = section.querySelectorAll('.tab-content');
        contents.forEach(c => {
          c.classList.remove('active');
          if (c.id === 'tab-content-' + tab) {
            c.classList.add('active');
          }
        });

        // Auto-center the clicked tab button in the scrollable tab navigation bar
        const containerWidth = tabNav.clientWidth;
        const btnWidth = btn.clientWidth;
        const btnLeft = btn.offsetLeft;
        const targetScrollLeft = btnLeft - (containerWidth / 2) + (btnWidth / 2);
        tabNav.scrollTo({
          left: targetScrollLeft,
          behavior: 'smooth'
        });
      });
    });
  });


  // ─── SCROLL REVEAL ──────────────────────────────
  const revealEls = document.querySelectorAll(
    '.section-header, .cv-container, .gallery-card, .uxui-panel, .video-card, .event-card, .event-stats-card, .contact-left, .contact-right, .event-intro'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 60 * (entry.target.dataset.revealDelay || 0));
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // Stagger cards
  document.querySelectorAll('.gallery-card, .uxui-panel, .video-card, .event-project-item').forEach((el, i) => {
    el.dataset.revealDelay = i % 4;
  });

  revealEls.forEach(el => revealObserver.observe(el));


  // ─── COUNTER ANIMATION ──────────────────────────
  const statNums = document.querySelectorAll('.stat-num[data-target]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
          current += step;
          if (current < target) {
            el.textContent = Math.floor(current);
            requestAnimationFrame(update);
          } else {
            el.textContent = target;
          }
        };
        requestAnimationFrame(update);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));


  // ─── SKILLS ENTRANCE ANIMATION ───────────────────
  const cvLayout = document.querySelector('.cv-layout');
  if (cvLayout) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.cv-skill-card').forEach((card, i) => {
            setTimeout(() => { card.classList.add('visible'); }, i * 60);
          });
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    skillObserver.observe(cvLayout);
  }


  // ─── GLITCH TRIGGER ON HOVER ────────────────────
  const heroName = document.getElementById('hero-name');
  if (heroName) {
    heroName.addEventListener('mouseenter', () => {
      heroName.querySelectorAll('.glitch').forEach(el => {
        el.style.animationPlayState = 'running';
      });
    });
  }


  // ─── CONTACT FORM ───────────────────────────────
  window.handleFormSubmit = function(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-send');
    const success = document.getElementById('form-success');
    const form = document.getElementById('contact-form');

    btn.textContent = 'ĐANG GỬI...';
    btn.style.opacity = '0.7';

    setTimeout(() => {
      btn.textContent = 'ĐÃ GỬI ✓';
      btn.style.background = '#00c896';
      success.classList.add('show');
      form.reset();
      setTimeout(() => {
        btn.textContent = 'GỬI TIN NHẮN →';
        btn.style.background = '';
        btn.style.opacity = '';
        success.classList.remove('show');
      }, 5000);
    }, 1200);
  };


  // ─── RANDOM GLITCH FLICKER ──────────────────────
  function randomGlitch() {
    const glitchEls = document.querySelectorAll('.glitch');
    if (glitchEls.length > 0) {
      const el = glitchEls[Math.floor(Math.random() * glitchEls.length)];
      el.style.opacity = '0.7';
      setTimeout(() => { el.style.opacity = '1'; }, 80);
      setTimeout(() => { el.style.opacity = '0.5'; }, 100);
      setTimeout(() => { el.style.opacity = '1'; }, 160);
    }
    setTimeout(randomGlitch, 3000 + Math.random() * 5000);
  }
  setTimeout(randomGlitch, 2000);


  // ─── SCAN BAR EFFECT ─────────────────────────────
  function createScanBar() {
    const bar = document.createElement('div');
    bar.style.cssText = `
      position: fixed;
      left: 0; right: 0;
      height: 2px;
      background: linear-gradient(to right, transparent, rgba(0,240,255,0.15), transparent);
      pointer-events: none;
      z-index: 9995;
      top: -2px;
      animation: scanbar 4s linear forwards;
    `;
    document.body.appendChild(bar);
    setTimeout(() => bar.remove(), 4000);
  }
  setInterval(createScanBar, 8000);
  setTimeout(createScanBar, 1000);


  // ─── PARALLAX HERO GRID ──────────────────────────
  const heroBg = document.querySelector('.hero-bg-grid');
  window.addEventListener('scroll', () => {
    if (heroBg) {
      const offset = window.scrollY * 0.15;
      heroBg.style.transform = `translateY(${offset}px)`;
    }
  });
  // ─── 3D TILT EFFECT ON BRAND CARD ────────────────
  const brandCard = document.querySelector('.brand-card');
  if (brandCard) {
    brandCard.addEventListener('mousemove', (e) => {
      const rect = brandCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (centerY - y) / 16;
      const rotateY = (x - centerX) / 16;

      brandCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.01)`;
    });

    brandCard.addEventListener('mouseleave', () => {
      brandCard.style.transform = '';
    });
  }

  // ─── 3D COVER FLOW CAROUSEL (STYLE 4) ────────────────
  const carouselTrack = document.getElementById('carousel-track-3d');
  const carouselCards = document.querySelectorAll('.carousel-card-3d');
  const prevBtn = document.getElementById('branding-carousel-prev');
  const nextBtn = document.getElementById('branding-carousel-next');
  const dotsContainer = document.getElementById('branding-carousel-dots');
  
  if (carouselTrack && carouselCards.length > 0) {
    let activeIndex = 2; // Brand6 (index 2, Featured Work) starts centered
    const totalCards = carouselCards.length;
    
    const updateDots = () => {
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === activeIndex);
        });
      }
    };

    const updateCarousel = () => {
      const windowWidth = window.innerWidth;
      let spacing = 234; // 180 * 1.3 = 234
      let centerShift = 78; // 60 * 1.3 = 78
      
      if (windowWidth < 1024) {
        spacing = 195; // 150 * 1.3 = 195
        centerShift = 65; // 50 * 1.3 = 65
      }
      if (windowWidth < 860) {
        spacing = 160; // Adjusted for smaller 360px card size to show adjacent cards
        centerShift = 10;
      }
      if (windowWidth < 600) {
        spacing = 120; // Adjusted for smaller 270px card size to show 10%-25% of adjacent cards
        centerShift = -5;
      }

      carouselCards.forEach((card, index) => {
        // Infinite loop circular distance positioning
        let d = index - activeIndex;
        if (d > totalCards / 2) {
          d -= totalCards;
        } else if (d < -totalCards / 2) {
          d += totalCards;
        }

        const absD = Math.abs(d);
        const sideOpacity = absD === 1 ? '0.9' : '0.68';
        card.classList.toggle('active', index === activeIndex);
        card.classList.toggle('side-left', d < 0);
        card.classList.toggle('side-right', d > 0);
        card.classList.toggle('side-outer', absD === 2);

        if (d === 0) {
          // Center Active Card
          card.style.transform = `translate3d(0, 0, 120px) rotateY(0deg) scale(1.05)`;
          card.style.zIndex = 15;
          card.style.opacity = '1';
          card.style.pointerEvents = 'auto';
        } else if (d > 0) {
          // Right side cards rotated inward (rotated left)
          const tx = d * spacing + centerShift;
          const tz = -absD * 120;
          const ry = -25;
          card.style.transform = `translate3d(${tx}px, 0, ${tz}px) rotateY(${ry}deg) scale(0.9)`;
          card.style.zIndex = 10 - Math.ceil(d);
          card.style.opacity = absD > 2 ? '0' : sideOpacity;
          card.style.pointerEvents = absD > 2 ? 'none' : 'auto';
        } else {
          // Left side cards rotated inward (rotated right)
          const tx = d * spacing - centerShift;
          const tz = -absD * 120;
          const ry = 25;
          card.style.transform = `translate3d(${tx}px, 0, ${tz}px) rotateY(${ry}deg) scale(0.9)`;
          card.style.zIndex = 10 - Math.ceil(absD);
          card.style.opacity = absD > 2 ? '0' : sideOpacity;
          card.style.pointerEvents = absD > 2 ? 'none' : 'auto';
        }
      });
      
      updateDots();
    };

    const nextSlide = () => { 
      activeIndex = (activeIndex + 1) % totalCards; 
      updateCarousel(); 
    };
    
    const prevSlide = () => { 
      activeIndex = (activeIndex - 1 + totalCards) % totalCards; 
      updateCarousel(); 
    };

    // Click navigation controls
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Clicking side cards shifts view to them
    let hoverFocusTimer = null;
    let hoverFocusArmed = true;
    let hoverFocusLockPoint = { x: 0, y: 0 };
    let hoverFocusLockedAt = 0;
    carouselCards.forEach((card, index) => {
      card.addEventListener('click', () => { 
        if (activeIndex !== index) { 
          activeIndex = index; 
          updateCarousel(); 
        } 
      });

      card.addEventListener('mouseenter', (e) => {
        if (
          activeIndex === index ||
          !hoverFocusArmed ||
          window.matchMedia('(pointer: coarse)').matches
        ) return;
        clearTimeout(hoverFocusTimer);
        hoverFocusTimer = setTimeout(() => {
          hoverFocusLockPoint = { x: e.clientX, y: e.clientY };
          hoverFocusLockedAt = Date.now();
          hoverFocusArmed = false;
          activeIndex = index;
          updateCarousel();
        }, 220);
      });

      card.addEventListener('mouseleave', () => {
        clearTimeout(hoverFocusTimer);
      });

      // Glare & 3D Tilt position updates on hover
      card.addEventListener('mousemove', (e) => {
        if (!card.classList.contains('active')) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);

        // Compute 3D Tilt rotations
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((centerY - y) / centerY) * 10; // Max 10 deg tilt
        const rotateY = ((x - centerX) / centerX) * 10; // Max 10 deg tilt

        // Apply interactive 3D rotation & push forward slightly in z-space
        card.style.transform = `translate3d(0, 0, 160px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.08)`;
      });

      card.addEventListener('mouseleave', () => {
        if (!card.classList.contains('active')) return;
        // Smoothly restore default center state
        card.style.transform = `translate3d(0, 0, 120px) rotateY(0deg) scale(1.05)`;
      });
    });

    // Dot indicators navigation
    if (dotsContainer) {
      dotsContainer.querySelectorAll('.carousel-dot').forEach((dot) => {
        dot.addEventListener('click', () => { 
          activeIndex = parseInt(dot.dataset.target); 
          updateCarousel(); 
        });
      });
    }

    // Drag / Touch Swipe gesture controller
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    
    const dragStart = (e) => { 
      isDragging = true; 
      startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX; 
    };
    
    const dragMove = (e) => {
      if (!isDragging) return;
      currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      const diffX = currentX - startX;
      
      if (Math.abs(diffX) > 60) {
        if (diffX > 0) {
          prevSlide(); 
        } else {
          nextSlide();
        }
        isDragging = false; // Trigger once per swipe gesture
      }
    };
    
    const dragEnd = () => { isDragging = false; };
    
    const viewport = document.getElementById('branding-carousel-viewport');
    if (viewport) {
      viewport.addEventListener('mousedown', dragStart); 
      viewport.addEventListener('mousemove', (e) => {
        dragMove(e);
        if (!hoverFocusArmed && Date.now() - hoverFocusLockedAt > 650) {
          const dx = e.clientX - hoverFocusLockPoint.x;
          const dy = e.clientY - hoverFocusLockPoint.y;
          if (Math.hypot(dx, dy) > 70) {
            hoverFocusArmed = true;
          }
        }
      });
      viewport.addEventListener('mouseup', dragEnd); 
      viewport.addEventListener('mouseleave', () => {
        dragEnd();
        hoverFocusArmed = true;
        clearTimeout(hoverFocusTimer);
      });
      viewport.addEventListener('touchstart', dragStart, { passive: true });
      viewport.addEventListener('touchmove', dragMove, { passive: true });
      viewport.addEventListener('touchend', dragEnd);
    }

    // Parallax interactive background movement
    const brandingSection = document.getElementById('tab-content-branding');
    const bgImage = document.querySelector('.carousel-bg-image, .carousel-bg-video');
    
    if (brandingSection && bgImage) {
      brandingSection.addEventListener('mousemove', (e) => {
        const rect = brandingSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate offset (move by max -15px to 15px in opposite direction)
        const moveX = ((rect.width / 2 - x) / (rect.width / 2)) * 15;
        const moveY = ((rect.height / 2 - y) / (rect.height / 2)) * 15;
        
        bgImage.style.setProperty('--bg-move-x', `${moveX}px`);
        bgImage.style.setProperty('--bg-move-y', `${moveY}px`);
      });
      
      brandingSection.addEventListener('mouseleave', () => {
        bgImage.style.setProperty('--bg-move-x', `0px`);
        bgImage.style.setProperty('--bg-move-y', `0px`);
      });
    }

    // Keyboard Arrow Keys support
    document.addEventListener('keydown', (e) => {
      const tab = document.getElementById('tab-content-branding');
      if (tab && tab.classList.contains('active')) {
        if (e.key === 'ArrowLeft') prevSlide(); 
        else if (e.key === 'ArrowRight') nextSlide();
      }
    });

    // Recalculate whenever the tab changes to Branding
    const tabBrandingBtn = document.getElementById('tab-branding');
    if (tabBrandingBtn) {
      tabBrandingBtn.addEventListener('click', () => {
        setTimeout(updateCarousel, 50);
      });
    }

    // Initialize layout positions
    updateCarousel();
    window.addEventListener('resize', updateCarousel);
  }

  // ─── NAVIGATE FROM DESIGN TO SOCIAL POST VIDEO ───
  const btnGotoVideoSocial = document.getElementById('btn-goto-video-social');
  if (btnGotoVideoSocial) {
    btnGotoVideoSocial.addEventListener('click', () => {
      // Find the Video section Social Post tab button
      const socialPostTabBtn = document.getElementById('tab-socialpost-v');
      if (socialPostTabBtn) {
        // Trigger a click to activate the Social Post tab
        socialPostTabBtn.click();
      }
    });
  }

  // ─── SOCIAL VIDEO PLAY CONTROLLER ────────────────
  window.toggleVideoPlay = function(card) {
    const video = card.querySelector('video');
    const isPlaying = card.classList.contains('playing');
    
    // Pause all other videos on the page so only one plays at a time
    document.querySelectorAll('.portfolio-video').forEach(otherVideo => {
      if (otherVideo !== video) {
        otherVideo.pause();
        otherVideo.controls = false;
        otherVideo.closest('.video-card').classList.remove('playing');
        
        // Seek other teaser videos back to their thumbnail scene
        if (otherVideo.closest('#tab-content-teaser')) {
          if (otherVideo.duration) {
            const targetTime = Math.max(0, otherVideo.duration - 1.5);
            otherVideo.currentTime = targetTime;
          }
        }
      }
    });
    
    if (isPlaying) {
      video.pause();
      video.controls = false;
      card.classList.remove('playing');
    } else {
      // For teaser videos: seek back to start if at the thumbnail frame or ended
      if (card.closest('#tab-content-teaser')) {
        if (video.currentTime >= video.duration - 2.5 || video.ended) {
          // Play only AFTER the seek back to 0 has fully completed to prevent end-frame flash
          const onSeeked = () => {
            video.removeEventListener('seeked', onSeeked);
            video.play().then(() => {
              video.controls = true;
              card.classList.add('playing');
            }).catch(err => {
              console.error("Play failed after seek: ", err);
            });
          };
          video.addEventListener('seeked', onSeeked);
          video.currentTime = 0;
          return;
        }
      }
      
      video.play().then(() => {
        video.controls = true;
        card.classList.add('playing');
      }).catch(err => {
        console.error("Play failed: ", err);
      });
    }
  };

  // ─── INITIALIZE TEASER VIDEO THUMBNAILS & END EVENTS ───────
  const initTeaserVideos = () => {
    document.querySelectorAll('#tab-content-teaser video').forEach(video => {
      // Double check loop is disabled programmatically
      video.removeAttribute('loop');
      video.loop = false;

      // Function to set the thumbnail to a high-quality final scene (1.5s before end)
      const setThumbnail = () => {
        if (video.duration) {
          const targetTime = Math.max(0, video.duration - 1.5);
          video.currentTime = targetTime;
        }
      };

      // Set thumbnail once metadata is available
      if (video.readyState >= 1) {
        setThumbnail();
      } else {
        video.addEventListener('loadedmetadata', setThumbnail);
      }

      // Restore overlay and thumbnail when video finishes playing
      video.addEventListener('ended', () => {
        video.controls = false;
        const card = video.closest('.video-card');
        if (card) {
          card.classList.remove('playing');
        }
        setThumbnail();
      });
    });
  };

  // ─── INITIALIZE SOCIAL POST VIDEOS (NO LOOP & END TRANSITION) ───
  const initSocialVideos = () => {
    document.querySelectorAll('#tab-content-socialpost-v video').forEach(video => {
      // Disable looping
      video.removeAttribute('loop');
      video.loop = false;

      // Handle end of playback
      video.addEventListener('ended', () => {
        video.controls = false;
        const card = video.closest('.video-card');
        if (card) {
          card.classList.remove('playing');
        }
        video.currentTime = 0;
      });
    });
  };

  // Run initializations
  initTeaserVideos();
  initSocialVideos();

  console.log('%c TRÚC LÊ PORTFOLIO ', 'background:#00f0ff;color:#000;font-family:monospace;font-size:14px;font-weight:bold;padding:8px 16px;');
  console.log('%c Creative Producer · Designer · Editor ', 'color:#00f0ff;font-family:monospace;');
});
