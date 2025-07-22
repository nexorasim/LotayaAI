import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Download, Settings, Wand2 } from 'lucide-react';
import axios from 'axios';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('groq');
  const [size, setSize] = useState('1024x1024');
  const [style, setStyle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError('');
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/generate/image`, {
        prompt,
        model,
        size,
        style: style || null
      });

      if (response.data.success) {
        setGeneratedImage(response.data);
      } else {
        setError('Generation failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const models = [
    { id: 'groq', name: 'GROQ AI', description: 'Fast and efficient generation' },
    { id: 'xai', name: 'XAI Grok', description: 'Advanced creative AI' },
    { id: 'gemini', name: 'Google Gemini', description: 'High-quality results' }
  ];

  const sizes = ['512x512', '1024x1024', '1024x768', '768x1024'];
  const styles = ['', 'photorealistic', 'artistic', 'cartoon', 'abstract', 'cinematic'];

  return (
    <div className="min-h-screen animated-bg text-white">
      {/* Navigation */}
      <nav className="nav-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Wand2 className="w-6 h-6 text-blue-400" />
              <span className="text-xl font-orbitron font-bold">AI Image Generator</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                AI Image Generator
              </span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Create stunning images from text descriptions using advanced AI models
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Generation Panel */}
            <div className="glass p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Settings className="w-6 h-6 mr-2" />
                Generation Settings
              </h2>

              {/* Prompt Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to generate..."
                  className="form-input w-full h-32 px-4 py-3 rounded-lg text-white placeholder-gray-400 resize-none"
                />
              </div>

              {/* Model Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">AI Model</label>
                <div className="grid grid-cols-1 gap-3">
                  {models.map((modelOption) => (
                    <label key={modelOption.id} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="model"
                        value={modelOption.id}
                        checked={model === modelOption.id}
                        onChange={(e) => setModel(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium">{modelOption.name}</div>
                        <div className="text-sm text-gray-400">{modelOption.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Image Size</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="form-input w-full px-4 py-3 rounded-lg text-white"
                >
                  {sizes.map((sizeOption) => (
                    <option key={sizeOption} value={sizeOption}>{sizeOption}</option>
                  ))}
                </select>
              </div>

              {/* Style Selection */}
              <div className="mb-8">
                <label className="block text-sm font-semibold mb-2">Style (Optional)</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="form-input w-full px-4 py-3 rounded-lg text-white"
                >
                  <option value="">Default</option>
                  {styles.slice(1).map((styleOption) => (
                    <option key={styleOption} value={styleOption}>
                      {styleOption.charAt(0).toUpperCase() + styleOption.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full btn-primary py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="loading-spinner" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Image</span>
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-200">
                  {error}
                </div>
              )}
            </div>

            {/* Result Panel */}
            <div className="glass p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6">Generated Image</h2>
              
              {generatedImage ? (
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4 min-h-64 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Image generated successfully!</p>
                      <p className="text-sm mt-2">Model: {generatedImage.model_used}</p>
                      <p className="text-sm">Generation ID: {generatedImage.generation_id}</p>
                    </div>
                  </div>
                  <button className="w-full btn-secondary py-3 rounded-lg font-semibold flex items-center justify-center space-x-2">
                    <Download className="w-5 h-5" />
                    <span>Download Image</span>
                  </button>
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-8 min-h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Your generated image will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;