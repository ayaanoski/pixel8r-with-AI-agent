// components/Pixelate.jsx (or pages/pixelate.jsx if it's a page)
"use client";

import { useState, useRef, useEffect } from "react";
import BackgroundCollage from "../components/BackgroundCollage"; // Adjust path as needed
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import {
  Download,
  ImageIcon,
  Settings,
  Sparkles,
  Wand2,
  Lightbulb,
  Info, // Added Info icon for explanation
  XCircle, // Added XCircle for cancel upload
} from "lucide-react";
// Removed Tabs imports as they are no longer used
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";

export default function Pixelate() {
  const [originalImage, setOriginalImage] = useState(null);
  const [pixelatedImage, setPixelatedImage] = useState(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const canvasRef = useRef(null);

  const [pixelSize, setPixelSize] = useState(8);
  const [saturation, setSaturation] = useState(1.2);
  const [contrast, setContrast] = useState(1.1);
  const [smoothing, setSmoothing] = useState(true);

  const { toast } = useToast();

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const img = new window.Image();
          img.onload = () => {
            setImageDimensions({ width: img.width, height: img.height });
            setOriginalImage(img.src);
            setPixelatedImage(null); // Reset pixelated image on new upload
            // Reset settings to default or last used if needed,
            // or rely on AI suggestion to set them after upload.
            setPixelSize(8);
            setSaturation(1.2);
            setContrast(1.1);
            setSmoothing(true);
          };
          img.src = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelUpload = () => {
    setOriginalImage(null);
    setPixelatedImage(null);
    setImageDimensions({ width: 0, height: 0 });
    const fileInput = document.getElementById("imageUpload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSliderChange = (e) => {
    setSliderPosition(Number(e.target.value));
  };

  const pixelateImageTo8Bit = () => {
    if (!originalImage || !canvasRef.current) return;
    setIsProcessing(true);

    const img = new window.Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const pixelBlockSize = pixelSize;

      for (let y = 0; y < canvas.height; y += pixelBlockSize) {
        for (let x = 0; x < canvas.width; x += pixelBlockSize) {
          let r = 0,
            g = 0,
            b = 0,
            a = 0,
            count = 0;

          for (
            let py = 0;
            py < pixelBlockSize && y + py < canvas.height;
            py++
          ) {
            for (
              let px = 0;
              px < pixelBlockSize && x + px < canvas.width;
              px++
            ) {
              const i = ((y + py) * canvas.width + (x + px)) * 4;
              r += data[i];
              g += data[i + 1];
              b += data[i + 2];
              a += data[i + 3];
              count++;
            }
          }

          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);
          a = Math.round(a / count);

          const saturationFactor = saturation;
          const contrastFactor = contrast;

          r = ((r / 255 - 0.5) * contrastFactor + 0.5) * 255;
          g = ((g / 255 - 0.5) * contrastFactor + 0.5) * 255;
          b = ((b / 255 - 0.5) * contrastFactor + 0.5) * 255;

          const gray = (r + g + b) / 3;
          r = gray + (r - gray) * saturationFactor;
          g = gray + (g - gray) * saturationFactor;
          b = gray + (b - gray) * saturationFactor;

          r = Math.max(0, Math.min(255, Math.round(r)));
          g = Math.max(0, Math.min(255, Math.round(g)));
          b = Math.max(0, Math.min(255, Math.round(b)));

          ctx.fillStyle = `rgba(${r},${g},${b},${a / 255})`;
          ctx.fillRect(x, y, pixelBlockSize, pixelBlockSize);
        }
      }

      ctx.imageSmoothingEnabled = smoothing;
      ctx.imageSmoothingQuality = "high";

      setPixelatedImage(canvas.toDataURL());
      setShowConfetti(true);
      setIsProcessing(false);
      setTimeout(() => setShowConfetti(false), 5000);
    };

    img.src = originalImage;
  };

  const getResponsiveDimensions = () => {
    if (typeof window === "undefined") return { width: 0, height: 0 };

    const screenWidth = window.innerWidth;
    const padding = screenWidth < 640 ? 32 : 64;
    const maxWidth = Math.min(imageDimensions.width, screenWidth - padding);
    const aspectRatio = imageDimensions.height / imageDimensions.width;
    let height = maxWidth * aspectRatio;

    const maxHeight = window.innerHeight * 0.6;
    if (height > maxHeight) {
      height = maxHeight;
      return {
        width: maxHeight / aspectRatio,
        height: maxHeight,
      };
    }
    return { width: maxWidth, height };
  };

  const downloadPixelatedImage = () => {
    if (pixelatedImage) {
      const link = document.createElement("a");
      link.href = pixelatedImage;
      link.download = "pixelated_image.png";
      link.click();
    }
  };

  const getAISuggestions = async () => {
    if (!originalImage) {
      toast({
        title: "No Image Uploaded",
        description: "Please upload an image before getting AI suggestions.",
        variant: "destructive",
      });
      return;
    }

    setIsSuggesting(true);
    toast({
      title: "Getting AI Suggestions...",
      description: "Analyzing your image to find the best pixelation settings.",
    });

    try {
      const response = await fetch("/api/ai-pixelate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageData: originalImage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get AI suggestions");
      }

      const suggestions = await response.json();
      console.log("AI Suggestions:", suggestions);

      setPixelSize(Math.round(suggestions.pixelSize || pixelSize));
      setSaturation(suggestions.saturation || saturation);
      setContrast(suggestions.contrast || contrast);
      setSmoothing(
        suggestions.smoothing !== undefined ? suggestions.smoothing : smoothing
      );

      toast({
        title: "AI Suggestions Applied! ✨",
        description:
          "Review the settings and click 'Pixelate Image' to see the result.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
      toast({
        title: "Failed to Get AI Suggestions",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const features = [
    {
      icon: "🎨",
      text: "Upload HD quality images",
      color: "from-cyan-500 to-blue-500",
      description: "Support for high-resolution images up to 4K",
    },
    {
      icon: "🚀",
      text: "Perfect for NFT art",
      color: "from-purple-500 to-indigo-500",
      description: "Create unique digital collectibles",
    },
    {
      icon: "✨",
      text: "Maintain crisp edges",
      color: "from-yellow-400 to-orange-500",
      description: "Advanced pixel-perfect algorithms",
    },
    {
      icon: "🎮",
      text: "Add retro gaming vibes",
      color: "from-pink-500 to-rose-500",
      description: "8-bit style transformations",
    },
  ];

  const responsiveDimensions = getResponsiveDimensions();

  return (
    <div className="min-h-screen bg-gray-900 overflow-hidden">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
          colors={["#4ade80", "#60a5fa", "#f472b6", "#fbbf24"]}
        />
      )}

      <div className="relative flex flex-col items-center px-4 py-6 sm:p-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 z-0"
        >
          <BackgroundCollage />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full flex flex-col items-center"
        >
          <motion.h1
            className="text-3xl sm:text-4xl lg:text-5xl mt-36 font-bold mb-4 pixel-font text-center max-w-[90vw]"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Image Pixelator
            </span>
          </motion.h1>

          <motion.div
            className="w-full sm:w-auto mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="typewriter-text pixel-font text-base sm:text-xl lg:text-2xl text-green-400 text-center px-4 flex items-center justify-center">
              Transform your NFT masterpieces into 8-bit art
              <motion.span
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="ml-2"
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.span>
            </p>
          </motion.div>

          {/* Features Section - Keep as is, it's good */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 w-full max-w-2xl px-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, rotateY: 10 }}
              >
                <div
                  className={`
                  h-full p-6 rounded-xl
                  bg-gradient-to-br ${feature.color}
                  transform transition-all duration-300
                  group-hover:shadow-2xl group-hover:shadow-${
                    feature.color.split("-")[1]
                  }/50
                  relative z-10 backdrop-blur-sm bg-opacity-20
                  border border-white/20
                `}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <span className="text-3xl">{feature.icon}</span>
                    <h3 className="pixel-font text-white text-center">
                      {feature.text}
                    </h3>
                    <p className="text-sm text-white/80 text-center">
                      {feature.description}
                    </p>
                  </div>
                </div>

                <div
                  className={`
                  absolute inset-0 rounded-xl
                  bg-gradient-to-br ${feature.color}
                  transform translate-y-1 translate-x-1
                  -z-10 opacity-50 blur-sm
                  transition-transform duration-300
                  group-hover:translate-y-2 group-hover:translate-x-2
                `}
                />
              </motion.div>
            ))}
          </div>

          <TooltipProvider>
            <Card className="w-full max-w-2xl mb-8 bg-gray-800/50 backdrop-blur-sm border-white/10 p-6">
              {/* Conditional Rendering based on whether an image is uploaded */}
              {!originalImage ? (
                // --- Initial Upload State ---
                <motion.div
                  key="upload-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-600 rounded-lg text-gray-400">
                    <ImageIcon className="w-12 h-12 mb-4 text-gray-500" />
                    <Label
                      htmlFor="imageUpload"
                      className="block mb-3 pixel-font text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 text-lg cursor-pointer"
                    >
                      Click to Upload Your Image
                    </Label>
                    <p className="text-sm text-gray-500 mb-4">
                      (PNG, JPG, GIF up to 10MB)
                    </p>
                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden" // Hide the default file input
                    />
                    <Button
                      onClick={() => document.getElementById("imageUpload").click()}
                      className="pixel-font bg-green-500 hover:bg-green-600 text-gray-900 transition-all duration-300 hover:scale-[1.01]"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" /> Choose File
                    </Button>
                  </div>
                </motion.div>
              ) : (
                // --- After Image Uploaded: Show AI, Settings, and Pixelate Button ---
                <motion.div
                  key="controls-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  {/* Uploaded Image Preview & Cancel */}
                  <div className="relative w-full max-w-md mx-auto mb-6 flex flex-col items-center">
                    <img
                      src={originalImage}
                      alt="Uploaded"
                      className="max-w-full h-auto rounded-lg shadow-xl border border-gray-700/50"
                      style={{ maxHeight: '200px', objectFit: 'contain' }}
                    />
                    <Button
                      onClick={handleCancelUpload}
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 pixel-font rounded-full px-2 py-1 flex items-center text-xs"
                    >
                      <XCircle className="w-3 h-3 mr-1" />
                      Clear Image
                    </Button>
                    <p className="text-sm text-gray-400 pixel-font mt-2">
                      Original size: {imageDimensions.width} x {imageDimensions.height}
                    </p>
                  </div>

                  {/* AI Suggestions Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 bg-gradient-to-br from-indigo-800/30 to-purple-800/30 rounded-lg border border-indigo-700/50 shadow-lg space-y-3"
                  >
                    <div className="flex items-center gap-2 text-indigo-300 pixel-font text-sm">
                      <Lightbulb className="w-5 h-5" />
                      AI Pixelation Assistant
                    </div>
                    <p className="text-sm text-gray-300 mb-3">
                      Let our AI analyze your image and suggest optimal
                      settings for the best 8-bit aesthetic.
                    </p>
                    <Button
                      onClick={getAISuggestions}
                      disabled={isSuggesting}
                      className="w-full pixel-font bg-gradient-to-r from-teal-400 to-cyan-600 hover:from-cyan-600 hover:to-teal-400 transform transition-all duration-300 hover:scale-[1.01]"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      {isSuggesting ? "Analyzing..." : "Get Smart Suggestions"}
                    </Button>
                  </motion.div>

                  {/* Manual Adjustments Section */}
                  <div className="space-y-6 mt-6 pt-4 border-t border-gray-700/50">
                    <div className="flex items-center gap-2 text-green-300 pixel-font text-sm mb-4">
                      <Settings className="w-5 h-5" />
                      Manual Adjustments
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="pixel-font text-sm text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                          Pixel Size: {pixelSize}px
                        </Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Larger values create bigger pixels</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Slider
                        value={[pixelSize]}
                        onValueChange={(value) => setPixelSize(value[0])}
                        min={2}
                        max={32}
                        step={1}
                        className="pixel-slider"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="pixel-font text-sm text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                          Color Saturation: {(saturation * 100).toFixed(0)}%
                        </Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enhance color vibrancy</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Slider
                        value={[saturation * 100]}
                        onValueChange={(value) =>
                          setSaturation(value[0] / 100)
                        }
                        min={50}
                        max={200}
                        step={5}
                        className="pixel-slider"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="pixel-font text-sm text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                          Contrast: {(contrast * 100).toFixed(0)}%
                        </Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Adjust image contrast</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Slider
                        value={[contrast * 100]}
                        onValueChange={(value) =>
                          setContrast(value[0] / 100)
                        }
                        min={50}
                        max={150}
                        step={5}
                        className="pixel-slider"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="smoothing"
                          checked={smoothing}
                          onCheckedChange={setSmoothing}
                        />
                        <Label
                          htmlFor="smoothing"
                          className="pixel-font text-sm text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500"
                        >
                          Edge Smoothing
                        </Label>
                      </div>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Smooth pixel edges</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </motion.div>
              )}
            </Card>
          </TooltipProvider>

          {originalImage && ( // Show Pixelate button only if image is uploaded
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Button
                onClick={pixelateImageTo8Bit}
                disabled={isProcessing}
                size="lg"
                className="pixel-font bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400 transition-all duration-300 hover:scale-105"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                {isProcessing ? "Processing..." : "Pixelate Image"}
              </Button>
            </motion.div>
          )}

          {originalImage && pixelatedImage && (
            <motion.div
              className="w-full flex flex-col items-center space-y-4 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="comparison-slider relative overflow-hidden rounded-lg neon-border"
                style={{
                  width: `${responsiveDimensions.width}px`,
                  height: `${responsiveDimensions.height}px`,
                  maxWidth: "100%",
                }}
              >
                <div
                  className="absolute top-0 left-0 h-full"
                  style={{
                    width: `${sliderPosition}%`,
                    backgroundImage: `url(${originalImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "left",
                    borderRight: "2px solid #4ade80",
                  }}
                />
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage: `url(${pixelatedImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "left",
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={handleSliderChange}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-ew-resize"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pixel-font text-white bg-black bg-opacity-50 px-3 py-2 rounded text-sm backdrop-blur-sm">
                  Slide to Compare
                </div>
              </div>

              <div className="text-center text-sm text-gray-400 pixel-font">
                Original size: {imageDimensions.width} x{" "}
                {imageDimensions.height}
              </div>

              <Button
                onClick={downloadPixelatedImage}
                variant="outline"
                size="lg"
                className="pixel-font bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 border-0 transition-all duration-300 hover:scale-105"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Pixelated Image
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>

      <style jsx>{`
        .typewriter-text {
          overflow: hidden;
          border-right: 2px solid #4ade80;
          white-space: nowrap;
          margin: 0 auto;
          animation: typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite;
        }
        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
        @keyframes blink-caret {
          from,
          to {
            border-color: transparent;
          }
          50% {
            border-color: #4ade80;
          }
        }
        .comparison-slider {
          box-shadow: 0 0 20px rgba(74, 222, 128, 0.5);
          transition: box-shadow 0.3s ease;
        }
        .comparison-slider:hover {
          box-shadow: 0 0 30px rgba(74, 222, 128, 0.7);
        }
        @media (max-width: 640px) {
          .typewriter-text {
            white-space: normal;
            animation: none;
            border-right: none;
            text-align: center;
          }
        }
        .pixel-font {
          font-family: "Press Start 2P", monospace;
          letter-spacing: 0.05em;
        }
        .neon-border {
          box-shadow: 0 0 10px rgba(74, 222, 128, 0.3),
            0 0 20px rgba(74, 222, 128, 0.2),
            0 0 30px rgba(74, 222, 128, 0.1);
        }
        .pixel-slider [role="slider"] {
          width: 16px; /* Equivalent to w-4 */
          height: 16px; /* Equivalent to h-4 */
          border: 2px solid var(--primary); /* Assuming --primary is defined in your global CSS or theme */
        }
        .pixel-slider [role="slider"]:focus {
          outline: 2px solid var(--primary); /* Equivalent to ring-2 ring-primary */
          outline-offset: 2px; /* Equivalent to ring-offset-2 */
        }
      `}</style>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}