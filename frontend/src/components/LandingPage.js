import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';
import GSAPAnimations from '../utils/gsapAnimations';
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

const LandingPage = () => {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const productsRef = useRef(null);
  const modelsRef = useRef(null);

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

  useGSAP(() => {
    // Initialize ScrollSmoother
    GSAPAnimations.initSmoother();

    // Hero entrance animation
    const heroElements = {
      title: heroRef.current?.querySelector('.hero-title'),
      subtitle: heroRef.current?.querySelector('.hero-subtitle'),
      description: heroRef.current?.querySelector('.hero-description'),
      buttons: heroRef.current?.querySelectorAll('.hero-btn')
    };

    GSAPAnimations.heroEntrance(heroElements);

    // Product cards animation
    const productCards = productsRef.current?.querySelectorAll('.product-card');
    if (productCards && productCards.length > 0) {
      GSAPAnimations.cardEnter(productCards, productsRef.current);
      
      // Add hover effects to cards
      productCards.forEach(card => {
        GSAPAnimations.card3D(card);
      });
    }

    // Model cards animation
    const modelCards = modelsRef.current?.querySelectorAll('.model-card');
    if (modelCards && modelCards.length > 0) {
      GSAPAnimations.cardEnter(modelCards, modelsRef.current);
    }

    // Button hover effects
    const buttons = containerRef.current?.querySelectorAll('.animated-btn');
    buttons?.forEach(btn => {
      GSAPAnimations.buttonHover(btn);
    });

    // Cleanup function
    return () => {
      GSAPAnimations.cleanup();
    };

  }, []);

  return (
    <div id="smooth-wrapper" ref={containerRef} className="min-h-screen text-white overflow-hidden">
      <div id="smooth-content">
        {/* Navigation */}
        <nav className="nav-glass fixed top-0 w-full z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <Wand2 className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-orbitron font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                  LotayaAI
                </span>
              </div>
              <div className="hidden md:flex space-x-6">
                <a href="#products" className="nav-link hover:text-blue-400 transition-colors">Products</a>
                <a href="#models" className="nav-link hover:text-purple-400 transition-colors">Models</a>
                <a href="#tools" className="nav-link hover:text-pink-400 transition-colors">Free Tools</a>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section ref={heroRef} className="hero-background relative min-h-screen flex items-center justify-center px-4">
          {/* Animated Particles */}
          <div className="particles-bg absolute inset-0 z-0">
            {[...Array(50)].map((_, i) => (
              <div 
                key={i}
                className="animated-particle absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  background: `hsl(${200 + Math.random() * 100}, 70%, 60%)`,
                  borderRadius: '50%',
                  opacity: Math.random() * 0.6 + 0.3,
                }}
              />
            ))}
          </div>

          <div className="max-w-6xl mx-auto text-center relative z-10">
            <div className="mb-8">
              <Stars className="w-16 h-16 mx-auto text-blue-400 opacity-60" />
            </div>
            
            <h1 className="hero-title text-6xl md:text-8xl font-orbitron font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              LotayaAI
            </h1>
            
            <p className="hero-subtitle text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              AI-Powered Creative Revolution
            </p>
            
            <p className="hero-description text-lg md:text-xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed">
              Transform your creative vision into reality with cutting-edge AI tools for video and image generation. 
              Experience the future of content creation with dynamic interfaces and advanced AI models.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <Link 
                to="/image-generator" 
                className="hero-btn animated-btn btn-primary inline-flex items-center space-x-3 text-lg px-10 py-4 rounded-xl transform-gpu"
              >
                <Sparkles className="w-6 h-6" />
                <span>Start Creating</span>
                <ArrowRight className="w-6 h-6" />
              </Link>
              <Link 
                to="/free-tools" 
                className="hero-btn animated-btn btn-secondary inline-flex items-center space-x-3 text-lg px-10 py-4 rounded-xl transform-gpu"
              >
                <Download className="w-6 h-6" />
                <span>Free Tools</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" ref={productsRef} className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-6">
                Our <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Products</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Comprehensive AI-powered tools for all your creative needs
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <Link 
                  key={index} 
                  to={product.link}
                  className="product-card group p-8 rounded-2xl transform-gpu"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${product.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {product.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {product.description}
                  </p>
                  <div className="flex items-center text-blue-400 font-semibold group-hover:text-purple-400 transition-colors">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Models Section */}
        <section id="models" ref={modelsRef} className="py-20 px-4 bg-black bg-opacity-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-6">
                AI <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">Models</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Powered by the most advanced AI models in the industry
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map((model, index) => (
                <div 
                  key={index} 
                  className="model-card p-6 rounded-xl transform-gpu"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}
                >
                  <h3 className="text-lg font-bold text-blue-400 mb-2">{model.name}</h3>
                  <p className="text-gray-300">{model.specialty}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Effects Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-orbitron font-bold text-center mb-16">
              Special <span className="bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">Effects</span>
            </h2>
            
            <div className="flex flex-wrap justify-center gap-4">
              {effects.map((effect, index) => (
                <div 
                  key={index} 
                  className="effect-tag px-6 py-3 rounded-full font-semibold hover:bg-white hover:bg-opacity-20 transition-all duration-300 transform-gpu cursor-pointer"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {effect}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Free Tools Section */}
        <section id="tools" className="py-20 px-4 bg-black bg-opacity-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-6">
                Free <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">Tools</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Powerful utilities available at no cost
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {freeTools.map((tool, index) => (
                <Link 
                  key={index} 
                  to="/free-tools"
                  className="tool-card group p-6 rounded-xl hover:bg-white hover:bg-opacity-10 transition-all duration-300 transform-gpu"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{tool}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
              <span className="text-xl font-orbitron font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                LotayaAI
              </span>
            </div>
            <p className="text-gray-400">
              © 2025 LotayaAI. Transforming creativity with advanced AI technology.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;