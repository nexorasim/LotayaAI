import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { CustomEase } from "gsap/CustomEase";
// CustomBounce requires CustomEase
import { CustomBounce } from "gsap/CustomBounce";
// CustomWiggle requires CustomEase
import { CustomWiggle } from "gsap/CustomWiggle";
import { RoughEase, ExpoScaleEase, SlowMo } from "gsap/EasePack";
    
import { Draggable } from "gsap/Draggable";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { EaselPlugin } from "gsap/EaselPlugin";
import { Flip } from "gsap/Flip";
import { GSDevTools } from "gsap/GSDevTools";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { MotionPathHelper } from "gsap/MotionPathHelper";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { Observer } from "gsap/Observer";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import { PhysicsPropsPlugin } from "gsap/PhysicsPropsPlugin";
import { PixiPlugin } from "gsap/PixiPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// ScrollSmoother requires ScrollTrigger
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { TextPlugin } from "gsap/TextPlugin";

// Register all GSAP plugins
gsap.registerPlugin(
  useGSAP,
  Draggable,
  DrawSVGPlugin,
  EaselPlugin,
  Flip,
  GSDevTools,
  InertiaPlugin,
  MotionPathHelper,
  MotionPathPlugin,
  MorphSVGPlugin,
  Observer,
  Physics2DPlugin,
  PhysicsPropsPlugin,
  PixiPlugin,
  ScrambleTextPlugin,
  ScrollTrigger,
  ScrollSmoother,
  ScrollToPlugin,
  SplitText,
  TextPlugin,
  RoughEase,
  ExpoScaleEase,
  SlowMo,
  CustomEase,
  CustomBounce,
  CustomWiggle
);

// Custom eases for LotayaAI
CustomEase.create("lotayaBounce", "M0,0,C0,0,0.056,0.445,0.175,0.685,0.282,0.913,0.35,1.312,0.422,1.347,0.494,1.382,0.538,1.171,0.614,1.078,0.693,0.982,0.722,0.83,0.795,0.83,0.867,0.83,0.889,0.982,0.944,1.078,1,1.174,1,1,1,1");
CustomEase.create("lotayaSmooth", "M0,0 C0.25,0.1 0.25,1 1,1");
CustomEase.create("lotayaElastic", "M0,0,C0.05,0,0.133,0.619,0.166,0.818,0.208,1.069,0.467,1.056,0.5,0.818,0.538,0.526,0.698,0.478,0.767,0.818,0.814,1.069,0.896,1.056,0.933,0.818,0.971,0.526,1,0.525,1,1");

// Create custom animations for LotayaAI
export const LotayaAnimations = {
  // Hero entrance with physics
  heroEntrance: (elements) => {
    const tl = gsap.timeline();
    
    tl.set(elements.title, { y: 100, opacity: 0, rotationX: -90 })
      .set(elements.subtitle, { y: 50, opacity: 0, scale: 0.8 })
      .set(elements.description, { y: 30, opacity: 0 })
      .set(elements.buttons, { y: 20, opacity: 0, scale: 0.9 });
    
    tl.to(elements.title, {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 1.5,
        ease: "lotayaBounce"
      })
      .to(elements.subtitle, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "lotayaElastic"
      }, "-=1")
      .to(elements.description, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "lotayaSmooth"
      }, "-=0.8")
      .to(elements.buttons, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: 0.2
      }, "-=0.6");
    
    return tl;
  },
  
  // Text scramble effect
  scrambleText: (element, newText) => {
    return gsap.to(element, {
      duration: 1.5,
      scrambleText: {
        text: newText,
        chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+",
        revealDelay: 0.5,
        tweenLength: false
      },
      ease: "none"
    });
  },
  
  // Morphing loader
  morphLoader: (svgElement) => {
    return gsap.to(svgElement, {
      duration: 2,
      morphSVG: "M12,2 L22,12 L12,22 L2,12 Z",
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true
    });
  },
  
  // Physics-based card interactions
  physicsCards: (cards) => {
    cards.forEach(card => {
      gsap.set(card, {
        transformOrigin: "center center",
        physics2D: {
          velocity: 0,
          angle: Math.random() * 360,
          gravity: 500
        }
      });
    });
  },
  
  // Smooth scroll with momentum
  initSmoothScroll: () => {
    ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 2,
      effects: true,
      smoothTouch: 0.1
    });
  },
  
  // Advanced 3D transforms
  card3D: (card) => {
    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 8;
      const rotateY = (centerX - x) / 8;
      
      gsap.to(card, {
        duration: 0.6,
        rotationX: rotateX,
        rotationY: rotateY,
        transformPerspective: 1000,
        z: 50,
        ease: "power2.out"
      });
    };
    
    const handleMouseLeave = () => {
      gsap.to(card, {
        duration: 0.6,
        rotationX: 0,
        rotationY: 0,
        z: 0,
        ease: "power2.out"
      });
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
  },
  
  // Loading sequence with draw SVG
  loadingSequence: (svgPaths) => {
    const tl = gsap.timeline();
    
    svgPaths.forEach((path, i) => {
      tl.fromTo(path, 
        { drawSVG: "0%" },
        { 
          drawSVG: "100%", 
          duration: 1.5,
          ease: "power2.inOut"
        }, i * 0.2
      );
    });
    
    return tl;
  }
};

// Initialize GSAP defaults
gsap.defaults({
  ease: "power2.out",
  duration: 0.8
});

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, CustomEase };