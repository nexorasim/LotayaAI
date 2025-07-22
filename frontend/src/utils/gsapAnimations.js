import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { SplitText } from "gsap/SplitText";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { CustomEase } from "gsap/CustomEase";
import { Flip } from "gsap/Flip";

// Register all GSAP plugins
gsap.registerPlugin(
  useGSAP, 
  ScrollTrigger, 
  TextPlugin, 
  MorphSVGPlugin, 
  DrawSVGPlugin, 
  SplitText, 
  ScrollSmoother, 
  CustomEase, 
  Flip
);

// Custom eases for LotayaAI
CustomEase.create("lotayaBouncyEnter", "M0,0 C0.14,0 0.27,0.37 0.42,0.48 0.57,0.59 0.65,0.72 0.8,0.83 0.9,0.9 0.95,0.95 1,1");
CustomEase.create("lotayaElasticOut", "M0,0 C0.05,0 0.133,0.619 0.166,0.818 0.208,1.069 0.467,1.056 0.5,0.818 0.538,0.526 0.698,0.478 0.767,0.818 0.814,1.069 0.896,1.056 0.933,0.818 0.971,0.526 1,0.525 1,1");
CustomEase.create("lotayaSmooth", "M0,0 C0.25,0.1 0.25,1 1,1");

export const GSAPAnimations = {
  // MASTER TIMELINE CONTROLLER
  masterTimeline: gsap.timeline(),

  // PAGE TRANSITIONS
  pageTransition: {
    enter: (element) => {
      return gsap.fromTo(element, 
        { 
          opacity: 0, 
          y: 50, 
          scale: 0.98,
          filter: "blur(10px)"
        },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          filter: "blur(0px)",
          duration: 1.2, 
          ease: "lotayaBouncyEnter",
          clearProps: "all"
        }
      );
    },
    exit: (element) => {
      return gsap.to(element, {
        opacity: 0,
        y: -30,
        scale: 1.02,
        filter: "blur(5px)",
        duration: 0.6,
        ease: "power2.in"
      });
    }
  },

  // BUTTON ANIMATIONS
  button: {
    init: (button) => {
      gsap.set(button, {
        scale: 1,
        rotationZ: 0,
        transformOrigin: "center center"
      });

      button.addEventListener('mouseenter', () => {
        gsap.to(button, {
          scale: 1.05,
          rotationZ: 1,
          duration: 0.3,
          ease: "power2.out",
          boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)"
        });
      });

      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          scale: 1,
          rotationZ: 0,
          duration: 0.3,
          ease: "power2.out",
          boxShadow: "0 5px 15px rgba(102, 126, 234, 0.1)"
        });
      });

      button.addEventListener('mousedown', () => {
        gsap.to(button, {
          scale: 0.98,
          duration: 0.1,
          ease: "power2.out"
        });
      });

      button.addEventListener('mouseup', () => {
        gsap.to(button, {
          scale: 1.05,
          duration: 0.1,
          ease: "power2.out"
        });
      });
    },

    click: (button, callback) => {
      const tl = gsap.timeline({
        onComplete: callback
      });
      
      tl.to(button, {
        scale: 0.95,
        rotationZ: -2,
        duration: 0.1,
        ease: "power2.out"
      })
      .to(button, {
        scale: 1.1,
        rotationZ: 2,
        duration: 0.2,
        ease: "back.out(1.7)"
      })
      .to(button, {
        scale: 1,
        rotationZ: 0,
        duration: 0.3,
        ease: "lotayaElasticOut"
      });

      return tl;
    }
  },

  // FORM ANIMATIONS
  form: {
    fieldFocus: (field) => {
      const tl = gsap.timeline();
      tl.to(field, {
        scale: 1.02,
        borderColor: "#667eea",
        boxShadow: "0 0 20px rgba(102, 126, 234, 0.3)",
        duration: 0.3,
        ease: "power2.out"
      });
      return tl;
    },

    fieldBlur: (field) => {
      const tl = gsap.timeline();
      tl.to(field, {
        scale: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
        boxShadow: "0 0 0px rgba(102, 126, 234, 0)",
        duration: 0.3,
        ease: "power2.out"
      });
      return tl;
    },

    submitLoading: (button) => {
      const tl = gsap.timeline();
      tl.to(button, {
        scale: 0.98,
        opacity: 0.8,
        duration: 0.2,
        ease: "power2.out"
      })
      .to(button.querySelector('.loading-spinner'), {
        rotation: 360,
        duration: 1,
        ease: "none",
        repeat: -1
      }, 0);
      return tl;
    },

    success: (element) => {
      const tl = gsap.timeline();
      tl.fromTo(element, 
        { scale: 0, opacity: 0, rotationZ: -180 },
        { scale: 1, opacity: 1, rotationZ: 0, duration: 0.6, ease: "back.out(1.7)" }
      );
      return tl;
    },

    error: (element) => {
      const tl = gsap.timeline();
      tl.to(element, {
        x: -10,
        duration: 0.1,
        ease: "power2.out"
      })
      .to(element, {
        x: 10,
        duration: 0.1,
        ease: "power2.out"
      })
      .to(element, {
        x: 0,
        duration: 0.1,
        ease: "power2.out"
      })
      .fromTo(element, 
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
      return tl;
    }
  },

  // CARD ANIMATIONS
  card: {
    enter: (card, index = 0) => {
      return gsap.fromTo(card,
        {
          y: 100,
          opacity: 0,
          scale: 0.8,
          rotationY: -15,
          transformOrigin: "center center"
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: index * 0.1
        }
      );
    },

    hover: (card) => {
      card.addEventListener('mouseenter', (e) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) / (rect.width / 2);
        const deltaY = (e.clientY - centerY) / (rect.height / 2);

        gsap.to(card, {
          rotationY: deltaX * 15,
          rotationX: -deltaY * 15,
          z: 50,
          scale: 1.05,
          duration: 0.6,
          ease: "power2.out",
          transformOrigin: "center center",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)"
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotationY: 0,
          rotationX: 0,
          z: 0,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)"
        });
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) / (rect.width / 2);
        const deltaY = (e.clientY - centerY) / (rect.height / 2);

        gsap.to(card, {
          rotationY: deltaX * 10,
          rotationX: -deltaY * 10,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    }
  },

  // TEXT ANIMATIONS
  text: {
    typewriter: (element, text, speed = 0.05) => {
      return gsap.to(element, {
        text: text,
        duration: text.length * speed,
        ease: "none"
      });
    },

    splitReveal: (element) => {
      const split = new SplitText(element, { type: "chars,words" });
      return gsap.fromTo(split.chars,
        {
          y: 100,
          opacity: 0,
          rotationX: -90
        },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 1.2,
          ease: "back.out(1.7)",
          stagger: 0.05
        }
      );
    },

    countUp: (element, target) => {
      let obj = { value: 0 };
      return gsap.to(obj, {
        value: target,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          element.textContent = Math.round(obj.value);
        }
      });
    }
  },

  // LOADING ANIMATIONS
  loading: {
    spinner: (element) => {
      return gsap.to(element, {
        rotation: 360,
        duration: 1,
        ease: "none",
        repeat: -1
      });
    },

    dots: (container) => {
      const dots = container.querySelectorAll('.dot');
      const tl = gsap.timeline({ repeat: -1 });
      
      dots.forEach((dot, i) => {
        tl.to(dot, {
          y: -20,
          duration: 0.6,
          ease: "power2.out",
          yoyo: true,
          repeat: 1
        }, i * 0.2);
      });
      
      return tl;
    },

    progress: (bar, progress) => {
      return gsap.to(bar, {
        scaleX: progress / 100,
        duration: 0.5,
        ease: "power2.out",
        transformOrigin: "left center"
      });
    }
  },

  // NAVIGATION ANIMATIONS
  nav: {
    slideIn: (nav) => {
      return gsap.fromTo(nav,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    },

    mobileToggle: (menu) => {
      const tl = gsap.timeline();
      tl.fromTo(menu,
        { x: 300, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
      );
      return tl;
    }
  },

  // HERO ANIMATIONS
  hero: {
    entrance: (elements) => {
      const tl = gsap.timeline();
      
      tl.fromTo(elements.background,
        { scale: 1.2, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2, ease: "power2.out" }
      )
      .fromTo(elements.title,
        { y: 100, opacity: 0, rotationX: -90 },
        { y: 0, opacity: 1, rotationX: 0, duration: 1.2, ease: "lotayaBouncyEnter" }, "-=1.5")
      .fromTo(elements.subtitle,
        { y: 50, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: "lotayaElasticOut" }, "-=1")
      .fromTo(elements.description,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.8")
      .fromTo(elements.buttons,
        { y: 20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)", stagger: 0.2 }, "-=0.6");

      return tl;
    }
  },

  // SCROLL ANIMATIONS
  scroll: {
    initSmoother: () => {
      return ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 2,
        effects: true,
        smoothTouch: 0.1
      });
    },

    fadeInUp: (elements, trigger) => {
      return gsap.fromTo(elements,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: trigger,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    },

    parallax: (element, speed = 0.5) => {
      return gsap.to(element, {
        yPercent: -50 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }
  },

  // UTILITY FUNCTIONS
  utils: {
    initElement: (element, type = 'default') => {
      switch(type) {
        case 'button':
          this.button.init(element);
          break;
        case 'card':
          this.card.hover(element);
          break;
        default:
          gsap.set(element, { clearProps: "all" });
      }
    },

    cleanup: () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
      this.masterTimeline.kill();
    }
  }
};

export { gsap, useGSAP, ScrollTrigger };
export default GSAPAnimations;