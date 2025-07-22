import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Video, 
  Image as ImageIcon, 
  Zap, 
  Play, 
  Download,
  ArrowRight,
  Stars,
  Bot,
  Wand2
} from 'lucide-react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const heroRef = useRef(null);
  const productsRef = useRef(null);
  const modelsRef = useRef(null);
  const effectsRef = useRef(null);
  const toolsRef = useRef(null);

  useEffect(() => {
    // Hero section animations
    const heroTl = gsap.timeline();
    
    heroTl
      .fromTo(heroRef.current.querySelector('.hero-title'), 
        { y: 100, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" })
      .fromTo(heroRef.current.querySelector('.hero-subtitle'), 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.8")
      .fromTo(heroRef.current.querySelector('.hero-description'), 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
      .fromTo(heroRef.current.querySelectorAll('.hero-btn'), 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.2 }, "-=0.4");

    // Products section scroll animation
    gsap.fromTo(productsRef.current.querySelectorAll('.product-card'),
      { y: 50, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: productsRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Models section animation
    gsap.fromTo(modelsRef.current.querySelectorAll('.model-card'),
      { x: -50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: modelsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // 3D rotation effect for product cards
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        gsap.to(card, {
          duration: 0.3,
          rotationX: rotateX,
          rotationY: rotateY,
          transformPerspective: 1000,
          transformOrigin: "center center"
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          duration: 0.3,
          rotationX: 0,
          rotationY: 0
        });
      });
    });

    // Floating animation for hero elements
    gsap.to('.float-element', {
      y: -20,
      duration: 3,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const products = [
    {
      title: "Script to Video",
      description: "Convert scripts into engaging videos",
      icon: <Video className="w-8 h-8" />,
      gradient: "from-blue-500 to-purple-600",
      link: "/text-to-video"
    },
    {
      title: "Text to Video",
      description: "Generate videos from text prompts",
      icon: <Play className="w-8 h-8" />,
      gradient: "from-purple-500 to-pink-600",
      link: "/video-generator"
    },
    {
      title: "Image to Video",
      description: "Transform images into dynamic videos",
      icon: <Sparkles className="w-8 h-8" />,
      gradient: "from-pink-500 to-red-600",
      link: "/video-generator"
    },
    {
      title: "AI Image Generator",
      description: "Generate stunning images with AI",
      icon: <ImageIcon className="w-8 h-8" />,
      gradient: "from-cyan-500 to-blue-600",
      link: "/image-generator"
    },
    {
      title: "AI Video Caption",
      description: "Generate captions for videos",
      icon: <Bot className="w-8 h-8" />,
      gradient: "from-green-500 to-teal-600",
      link: "/video-generator"
    },
    {
      title: "AI Video Clip",
      description: "Create short video clips using AI",
      icon: <Zap className="w-8 h-8" />,
      gradient: "from-orange-500 to-red-600",
      link: "/video-generator"
    }
  ];

  const models = [
    { name: "Runway", specialty: "Video Generation" },
    { name: "Kling AI", specialty: "Advanced Video" },
    { name: "Veo 3", specialty: "High-Quality Video" },
    { name: "Sora", specialty: "Cinematic Video" },
    { name: "Seedance", specialty: "Creative Video" },
    { name: "Hailuo AI", specialty: "Fast Generation" }
  ];

  const effects = [
    "AI Hug", "AI Kissing", "French Kiss", "Decapitate", "Eye-pop", "Face Swap"
  ];

  const freeTools = [
    "YouTube Video Downloader", "YouTube to MP4", "YouTube Shorts Downloader",
    "YouTube to MP3", "TikTok Video Downloader", "Instagram Reels Downloader", "Video Compressor"
  ];

  return (
    <div className="min-h-screen text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 nav-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Wand2 className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-orbitron font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                LotayaAI
              </span>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#products" className="hover:text-blue-400 transition-colors">Products</a>
              <a href="#models" className="hover:text-purple-400 transition-colors">Models</a>
              <a href="#tools" className="hover:text-pink-400 transition-colors">Free Tools</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4">
        {/* Animated particles background */}
        <div className="particles-bg">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${Math.random() * 20 + 10}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="float-element">
            <Stars className="w-16 h-16 mx-auto mb-8 text-blue-400 opacity-60" />
          </div>
          
          <h1 className="hero-title text-6xl md:text-8xl font-orbitron font-bold mb-6">
            LotayaAI
          </h1>
          
          <p className="hero-subtitle text-2xl md:text-4xl font-semibold mb-8">
            AI-Powered Creative Revolution
          </p>
          
          <p className="hero-description text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your creative vision into reality with cutting-edge AI tools for video and image generation. 
            Experience the future of content creation with dynamic 3D interfaces and advanced AI models.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/image-generator" className="hero-btn btn-primary inline-flex items-center space-x-2 neon-glow">
              <span>Start Creating</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/free-tools" className="hero-btn btn-secondary inline-flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Free Tools</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" ref={productsRef} className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-center mb-4">
            Our <span className="hero-title">Products</span>
          </h2>
          <p className="text-center text-gray-300 text-lg mb-16">
            Comprehensive AI-powered tools for all your creative needs
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <Link 
                key={index} 
                to={product.link}
                className="product-card p-8 rounded-2xl hover-lift transform-3d"
              >
                <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${product.gradient} mb-6`}>
                  {product.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{product.title}</h3>
                <p className="text-gray-300 leading-relaxed">{product.description}</p>
                <div className="mt-6 flex items-center text-blue-400 font-semibold">
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Models Section */}
      <section id="models" ref={modelsRef} className="py-20 px-4 bg-black bg-opacity-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-center mb-4">
            AI <span className="hero-subtitle">Models</span>
          </h2>
          <p className="text-center text-gray-300 text-lg mb-16">
            Powered by the most advanced AI models in the industry
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((model, index) => (
              <div key={index} className="model-card glass p-6 rounded-xl">
                <h3 className="text-lg font-bold text-blue-400 mb-2">{model.name}</h3>
                <p className="text-gray-300">{model.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Effects Section */}
      <section ref={effectsRef} className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-center mb-16">
            Special <span className="hero-title">Effects</span>
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4">
            {effects.map((effect, index) => (
              <div key={index} className="glass px-6 py-3 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-300">
                {effect}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Tools Section */}
      <section id="tools" ref={toolsRef} className="py-20 px-4 bg-black bg-opacity-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-center mb-4">
            Free <span className="hero-subtitle">Tools</span>
          </h2>
          <p className="text-center text-gray-300 text-lg mb-16">
            Powerful utilities available at no cost
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freeTools.map((tool, index) => (
              <Link 
                key={index} 
                to="/free-tools"
                className="glass p-6 rounded-xl hover:bg-white hover:bg-opacity-10 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{tool}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white border-opacity-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Wand2 className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-orbitron font-bold">LotayaAI</span>
          </div>
          <p className="text-gray-400">
            © 2025 LotayaAI. Transforming creativity with advanced AI technology.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;