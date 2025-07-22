import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Play, Settings, Wand2 } from 'lucide-react';
import axios from 'axios';

const TextToVideo = () => {
  const [script, setScript] = useState('');
  const [model, setModel] = useState('runway');
  const [style, setStyle] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [convertedVideo, setConvertedVideo] = useState(null);
  const [error, setError] = useState('');

  const handleConvert = async () => {
    if (!script.trim()) {
      setError('Please enter a script');
      return;
    }

    setIsConverting(true);
    setError('');
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/convert/text-to-video`, {
        script,
        model,
        style: style || null
      });

      if (response.data.success) {
        setConvertedVideo(response.data);
      } else {
        setError('Conversion failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Conversion error:', err);
    } finally {
      setIsConverting(false);
    }
  };

  const models = [
    { id: 'runway', name: 'Runway ML', description: 'Best for narrative videos' },
    { id: 'kling', name: 'Kling AI', description: 'Advanced script processing' },
    { id: 'veo3', name: 'Veo 3', description: 'High-quality conversions' },
    { id: 'sora', name: 'OpenAI Sora', description: 'Cinematic storytelling' }
  ];

  const styles = ['', 'cinematic', 'documentary', 'animated', 'minimalist', 'dramatic'];

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
              <FileText className="w-6 h-6 text-green-400" />
              <span className="text-xl font-orbitron font-bold">Script to Video</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-6">
              <span className="bg-gradient-to-r from-green-400 to-teal-600 bg-clip-text text-transparent">
                Script to Video
              </span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Transform your written scripts into engaging videos with AI-powered conversion
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Conversion Panel */}
            <div className="glass p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Settings className="w-6 h-6 mr-2" />
                Conversion Settings
              </h2>

              {/* Script Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Script</label>
                <textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder="Enter your script here. Include dialogue, scene descriptions, and any specific instructions..."
                  className="form-input w-full h-40 px-4 py-3 rounded-lg text-white placeholder-gray-400 resize-none"
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

              {/* Style Selection */}
              <div className="mb-8">
                <label className="block text-sm font-semibold mb-2">Video Style (Optional)</label>
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

              {/* Convert Button */}
              <button
                onClick={handleConvert}
                disabled={isConverting}
                className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
              >
                {isConverting ? (
                  <>
                    <div className="loading-spinner" />
                    <span>Converting Script...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Convert to Video</span>
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
              <h2 className="text-2xl font-bold mb-6">Converted Video</h2>
              
              {convertedVideo ? (
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4 min-h-64 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Script converted successfully!</p>
                      <p className="text-sm mt-2">Model: {convertedVideo.model_used}</p>
                      <p className="text-sm">Conversion ID: {convertedVideo.conversion_id}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-8 min-h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Your converted video will appear here</p>
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

export default TextToVideo;