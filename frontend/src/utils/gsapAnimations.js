import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { SplitText } from "gsap/SplitText";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { CustomEase } from "gsap/CustomEase";

// Register GSAP plugins
gsap.registerPlugin(useGSAP, ScrollTrigger, TextPlugin, SplitText, ScrollSmoother, CustomEase);

// Custom eases
CustomEase.create("lotayaBounce", "M0,0 C0.14,0 0.42,0.48 0.57,0.59 0.8,0.83 0.95,0.95 1,1");
CustomEase.create("lotayaSmooth", "M0,0 C0.25,0.1 0.25,1 1,1");

export const GSAPAnimations = {
  // PAGE TRANSITIONS
  pageEnter: (element) => {
    if (!element) return gsap.timeline();
    return gsap.fromTo(element, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );
  },

  // HERO ANIMATIONS
  heroEntrance: (elements) => {
    const tl = gsap.timeline();
    
    if (elements.title) {
      tl.fromTo(elements.title,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "lotayaBounce" }
      );
    }
    
    if (elements.subtitle) {
      tl.fromTo(elements.subtitle,
        { y: 50, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power2.out" }, "-=0.8"
      );
    }
    
    if (elements.description) {
      tl.fromTo(elements.description,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.6"
      );
    }
    
    if (elements.buttons && elements.buttons.length > 0) {
      tl.fromTo(elements.buttons,
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)", stagger: 0.2 }, "-=0.4"
      );
    }
    
    return tl;
  },

  // CARD ANIMATIONS
  cardEnter: (cards, trigger = null) => {
    if (!cards || cards.length === 0) return gsap.timeline();
    
    const animation = gsap.fromTo(cards,
      { y: 80, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15
      }
    );

    if (trigger) {
      ScrollTrigger.create({
        trigger: trigger,
        start: "top 80%",
        animation: animation,
        toggleActions: "play none none reverse"
      });
    }

    return animation;
  },

  // BUTTON INTERACTIONS
  buttonHover: (button) => {
    if (!button) return;
    
    button.addEventListener('mouseenter', () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    });
  },

  // CARD 3D HOVER
  card3D: (card) => {
    if (!card) return;

    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -10,
        scale: 1.02,
        duration: 0.4,
        ease: "power2.out",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)"
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.08)"
      });
    });
  },

  // SCROLL SMOOTHER
  initSmoother: () => {
    if (document.querySelector("#smooth-wrapper")) {
      return ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.5,
        effects: true
      });
    }
  },

  // CLEANUP
  cleanup: () => {
    ScrollTrigger.getAll().forEach(st => st.kill());
  }
};

export { gsap, useGSAP };
export default GSAPAnimations;