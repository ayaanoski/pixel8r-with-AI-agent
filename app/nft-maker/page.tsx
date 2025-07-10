'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Bot, RefreshCw, Upload, ImageIcon } from 'lucide-react';
import BackgroundCollage from '../components/BackgroundCollage';

const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export default function NFTMaker() {
  // State variables
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [aiError, setAiError] = useState(null);

  // Load image from URL params if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const imageFromParams = searchParams.get('image');
      if (imageFromParams) {
        const decodedImage = decodeURIComponent(imageFromParams);
        setImage(decodedImage);
        setImagePreview(decodedImage);
      }
    }
  }, []);

  // Handle image upload and preview
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.onerror = () => {
        alert('Error reading file');
      };
      reader.readAsDataURL(file);
    }
  };

  // Convert image to base64 for API
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Generate AI suggestions based on image using the actual API
  const generateAISuggestions = async () => {
    if (!image) {
      alert('Please upload an image first!');
      return;
    }

    setIsGeneratingSuggestions(true);
    setAiError(null);
    
    try {
      let imageData;
      
      // Convert image to base64 if it's a file
      if (image instanceof File) {
        imageData = await convertImageToBase64(image);
      } else {
        // If it's already a URL or base64 string
        imageData = image;
      }

      console.log('Making API request to /api/ai-suggestions');
      
      // Make the actual API request
      const response = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: imageData
        }),
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API request failed with status ${response.status}`);
      }

      const suggestions = await response.json();
      console.log('Received AI suggestions:', suggestions);
      
      // Validate the response structure
      if (!suggestions || typeof suggestions !== 'object') {
        throw new Error('Invalid response format from AI API');
      }

      // Set the AI suggestions
      setAiSuggestions({
        name: suggestions.name || 'AI Generated NFT',
        description: suggestions.description || 'A unique digital artwork',
        price: suggestions.price || 1.0
      });

      // Optionally auto-fill the form with suggestions if fields are empty
      if (suggestions.name && !name.trim()) {
        setName(suggestions.name);
      }
      if (suggestions.description && !description.trim()) {
        setDescription(suggestions.description);
      }
      if (suggestions.price && !price.trim()) {
        setPrice(suggestions.price.toString());
      }
      
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      setAiError(error.message || 'Failed to generate AI suggestions');
      
      // Don't show alert, just set error state
      setAiSuggestions(null);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  // Apply AI suggestions to form
  const applySuggestion = (field, value) => {
    switch (field) {
      case 'name':
        setName(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'price':
        setPrice(value.toString());
        break;
    }
  };

  // Clear AI error when starting new generation
  const handleGenerateClick = () => {
    setAiError(null);
    generateAISuggestions();
  };

  // NFT deployment function
  const deployNFT = async () => {
    if (!name || !description || !price || !image) {
      alert('Please fill in all fields and upload an image before deploying.');
      return;
    }

    if (isNaN(price) || parseFloat(price) <= 0) {
      alert('Please enter a valid price');
      return;
    }

    setIsDeploying(true);
    setDeploymentStatus('Preparing deployment...');

    // Simulate deployment process with more realistic steps
    const steps = [
      'Uploading image to IPFS...',
      'Creating metadata...',
      'Deploying to blockchain...',
      'Finalizing transaction...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setDeploymentStatus(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Simulate final result
    setIsDeploying(false);
    setDeploymentStatus('Error deploying NFT: Not enough TLOS');
  };

  return (
    <div className="min-h-screen relative ">
      <BackgroundCollage />

      {/* Container with proper padding and max-width */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="text-center mb-8 lg:mb-12 mt-40">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold pixel-font bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent mb-4">
            Create Your NFT
            <Sparkles className="inline-block ml-4 text-purple-400" size={40} />
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto pixel-font">
            Transform your digital art into unique NFTs with AI-powered suggestions
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          
          {/* Left Column - Image Upload and Preview */}
          <div className="space-y-6">
            {/* Image Upload Section */}
            <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <h2 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2 pixel-font">
                <ImageIcon size={24} />
                Upload Your Art
              </h2>
              
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-purple-500/30 rounded-lg cursor-pointer hover:border-purple-500/50 transition-colors bg-black/20"
                  >
                    <Upload className="text-purple-400 mb-2" size={32} />
                    <span className="text-purple-400 font-medium pixel-font">Click to upload image</span>
                    <span className="text-gray-500 text-sm mt-1 pixel-font">PNG, JPG, GIF up to 5MB</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
                <h3 className="text-xl font-bold text-purple-400 mb-4 pixel-font">Preview</h3>
                <div className="relative aspect-square bg-black/50 rounded-lg overflow-hidden border border-purple-500/30 hover:scale-105 transition-transform duration-300">
                  <img
                    src={imagePreview}
                    alt="NFT Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* AI Suggestions Button */}
                <button
                  onClick={handleGenerateClick}
                  disabled={isGeneratingSuggestions}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed pixel-font"
                >
                  {isGeneratingSuggestions ? (
                    <>
                      <RefreshCw className="animate-spin" size={20} />
                      Analyzing Image...
                    </>
                  ) : (
                    <>
                      <Bot size={20} />
                      Get AI Suggestions
                    </>
                  )}
                </button>
              </div>
            )}

            {/* AI Error Display */}
            {aiError && (
              <div className="bg-red-500/20 backdrop-blur-lg rounded-2xl p-6 border border-red-500/30">
                <h3 className="text-xl font-bold text-red-400 mb-2 pixel-font">Error</h3>
                <p className="text-red-300 pixel-font">{aiError}</p>
                <button
                  onClick={handleGenerateClick}
                  className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors pixel-font"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* AI Suggestions Display */}
            {aiSuggestions && (
              <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/20">
                <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2 pixel-font">
                  <Bot size={24} />
                  AI Suggestions
                </h3>
                
                <div className="space-y-4">
                  {aiSuggestions.name && (
                    <div>
                      <p className="text-sm text-purple-400 mb-2 pixel-font">Suggested Name:</p>
                      <button
                        onClick={() => applySuggestion('name', aiSuggestions.name)}
                        className="w-full text-left p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg text-white hover:bg-blue-600/30 transition-colors pixel-font"
                      >
                        {aiSuggestions.name}
                      </button>
                    </div>
                  )}
                  
                  {aiSuggestions.description && (
                    <div>
                      <p className="text-sm text-purple-400 mb-2 pixel-font">Suggested Description:</p>
                      <button
                        onClick={() => applySuggestion('description', aiSuggestions.description)}
                        className="w-full text-left p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg text-white hover:bg-blue-600/30 transition-colors text-sm pixel-font"
                      >
                        {aiSuggestions.description}
                      </button>
                    </div>
                  )}
                  
                  {aiSuggestions.price && (
                    <div>
                      <p className="text-sm text-purple-400 mb-2 pixel-font">Estimated Price:</p>
                      <button
                        onClick={() => applySuggestion('price', aiSuggestions.price)}
                        className="w-full text-left p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg text-white hover:bg-blue-600/30 transition-colors pixel-font"
                      >
                        {aiSuggestions.price} TLOS
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Form */}
          <div className="space-y-6">
            <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <h2 className="text-2xl font-bold text-purple-400 mb-6 pixel-font">NFT Details</h2>
              
              <div className="space-y-6">
                {/* Name input */}
                <div>
                  <label className="block mb-2 text-purple-400 font-medium pixel-font">Name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-black/50 border border-purple-500/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 text-white transition-all duration-300 focus:outline-none pixel-font"
                    placeholder="Enter NFT name"
                  />
                </div>

                {/* Description input */}
                <div>
                  <label className="block mb-2 text-purple-400 font-medium pixel-font">Description:</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-black/50 border border-purple-500/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 text-white transition-all duration-300 h-32 resize-none focus:outline-none pixel-font"
                    placeholder="Describe your NFT"
                  />
                </div>

                {/* Price input */}
                <div>
                  <label className="block mb-2 text-purple-400 font-medium pixel-font">Price (TLOS):</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-black/50 border border-purple-500/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 text-white transition-all duration-300 focus:outline-none pixel-font"
                    placeholder="Enter NFT price"
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Deploy button */}
                <button
                  onClick={deployNFT}
                  disabled={isDeploying}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 pixel-font"
                >
                  {isDeploying ? 'Deploying...' : 'Deploy NFT'}
                </button>

                {/* Deployment status */}
                {deploymentStatus && (
                  <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 font-medium pixel-font">{deploymentStatus}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}