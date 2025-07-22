import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Link as LinkIcon, Settings, Wand2, Youtube, Music, Smartphone, Instagram, Zap } from 'lucide-react';

const FreeTools = () => {
  const [activeTab, setActiveTab] = useState('youtube');
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('mp4');
  const [quality, setQuality] = useState('720p');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const tools = [
    {
      id: 'youtube',
      name: 'YouTube Downloader',
      icon: <Youtube className="w-6 h-6" />,
      gradient: 'from-red-500 to-red-600',
      description: 'Download YouTube videos in various formats'
    },
    {
      id: 'youtube-mp4',
      name: 'YouTube to MP4',
      icon: <Download className="w-6 h-6" />,
      gradient: 'from-blue-500 to-blue-600',
      description: 'Convert YouTube videos to MP4'
    },
    {
      id: 'youtube-shorts',
      name: 'YouTube Shorts',
      icon: <Smartphone className="w-6 h-6" />,
      gradient: 'from-purple-500 to-purple-600',
      description: 'Download YouTube Shorts videos'
    },
    {
      id: 'youtube-mp3',
      name: 'YouTube to MP3',
      icon: <Music className="w-6 h-6" />,
      gradient: 'from-green-500 to-green-600',
      description: 'Extract audio from YouTube videos'
    },
    {
      id: 'tiktok',
      name: 'TikTok Downloader',
      icon: <Smartphone className="w-6 h-6" />,
      gradient: 'from-pink-500 to-pink-600',
      description: 'Download TikTok videos without watermark'
    },
    {
      id: 'instagram',
      name: 'Instagram Reels',
      icon: <Instagram className="w-6 h-6" />,
      gradient: 'from-orange-500 to-pink-500',
      description: 'Download Instagram Reels and posts'
    },
    {
      id: 'compressor',
      name: 'Video Compressor',
      icon: <Zap className="w-6 h-6" />,
      gradient: 'from-cyan-500 to-blue-600',
      description: 'Compress videos to reduce file size'
    }
  ];

  const handleProcess = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setIsProcessing(true);
    setError('');
    setResult(null);

    // Simulate processing
    setTimeout(() => {
      setResult({
        originalUrl: url,
        format: format,
        quality: quality,
        downloadUrl: 'placeholder_download_url',
        filename: 'downloaded_video.mp4',
        size: '25.6 MB'
      });
      setIsProcessing(false);
    }, 3000);
  };

  const activeTool = tools.find(tool => tool.id === activeTab);

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
              <Download className="w-6 h-6 text-green-400" />
              <span className="text-xl font-orbitron font-bold">Free Tools</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-6">
              <span className="bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">
                Free Tools
              </span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Powerful utilities for downloading and processing videos from various platforms
            </p>
          </div>

          {/* Tool Tabs */}
          <div className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTab(tool.id)}
                  className={`p-4 rounded-lg transition-all duration-300 ${
                    activeTab === tool.id 
                      ? `bg-gradient-to-r ${tool.gradient} text-white` 
                      : 'glass hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    {tool.icon}
                    <span className="text-xs font-medium text-center">{tool.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <div className="glass p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                {activeTool?.icon}
                <span className="ml-2">{activeTool?.name}</span>
              </h2>
              
              <p className="text-gray-300 mb-6">{activeTool?.description}</p>

              {/* URL Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste the URL here..."
                    className="form-input w-full pl-12 pr-4 py-3 rounded-lg text-white placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Format Selection */}
              {activeTab !== 'compressor' && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="form-input w-full px-4 py-3 rounded-lg text-white"
                  >
                    <option value="mp4">MP4 (Video)</option>
                    {activeTab === 'youtube-mp3' ? (
                      <option value="mp3">MP3 (Audio)</option>
                    ) : (
                      <>
                        <option value="webm">WebM</option>
                        <option value="avi">AVI</option>
                      </>
                    )}
                  </select>
                </div>
              )}

              {/* Quality Selection */}
              <div className="mb-8">
                <label className="block text-sm font-semibold mb-2">
                  {activeTab === 'compressor' ? 'Compression Level' : 'Quality'}
                </label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="form-input w-full px-4 py-3 rounded-lg text-white"
                >
                  {activeTab === 'compressor' ? (
                    <>
                      <option value="low">Low Compression</option>
                      <option value="medium">Medium Compression</option>
                      <option value="high">High Compression</option>
                    </>
                  ) : (
                    <>
                      <option value="1080p">1080p (Full HD)</option>
                      <option value="720p">720p (HD)</option>
                      <option value="480p">480p</option>
                      <option value="360p">360p</option>
                    </>
                  )}
                </select>
              </div>

              {/* Process Button */}
              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className={`w-full bg-gradient-to-r ${activeTool?.gradient} py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105`}
              >
                {isProcessing ? (
                  <>
                    <div className="loading-spinner" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>
                      {activeTab === 'compressor' ? 'Compress' : 'Download'}
                    </span>
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
              <h2 className="text-2xl font-bold mb-6">Result</h2>
              
              {result ? (
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="font-semibold mb-4 text-green-400">
                      {activeTab === 'compressor' ? 'Compression Complete!' : 'Download Ready!'}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p><strong>Format:</strong> {result.format.toUpperCase()}</p>
                      <p><strong>Quality:</strong> {result.quality}</p>
                      <p><strong>File Size:</strong> {result.size}</p>
                      <p><strong>Filename:</strong> {result.filename}</p>
                    </div>
                  </div>
                  
                  <button className="w-full btn-primary py-3 rounded-lg font-semibold flex items-center justify-center space-x-2">
                    <Download className="w-5 h-5" />
                    <span>Download File</span>
                  </button>
                  
                  <div className="text-xs text-gray-400 text-center">
                    <p>File will be available for 24 hours</p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-8 min-h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Download className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Your processed file will appear here</p>
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

export default FreeTools;