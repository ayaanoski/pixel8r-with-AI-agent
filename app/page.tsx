'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useMotionValue, useSpring, useTransform, useAnimationControls, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'


const WelcomeAnimation = ({ onComplete }) => {
  const controls = useAnimationControls();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    const animate = async () => {
      await controls.start("logoEmergence");
      await controls.start("pixelExplosion");
      await controls.start("exit");
      onComplete?.();
    };

    animate();
  }, [controls, onComplete]);

  // Generate fixed positions for particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    offset: i * (100 / 20), // Evenly space particles
    delay: i * 0.1,
  }));

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black z-50"
      initial={{ opacity: 1 }}
    >
      {/* Background particles */}
      {isMounted && (
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-purple-500"
              initial={{ 
                x: `${particle.offset}%`,
                y: -10,
                opacity: 0
              }}
              animate={{
                y: ['0%', '100%'],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                delay: particle.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Main logo container */}
      <motion.div
        className="relative w-64 h-64"
        variants={{
          logoEmergence: {
            scale: [0, 1.2, 1],
            rotateY: [0, 720],
            opacity: 1,
            transition: {
              duration: 2,
              ease: "easeOut"
            }
          },
          pixelExplosion: {
            scale: 1
          },
          exit: {
            scale: [1, 1.5],
            opacity: 0,
            transition: {
              duration: 0.8,
              ease: "easeInOut"
            }
          }
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={controls}
      >
        {/* Geometric shapes */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`shape-${i}`}
            className="absolute inset-0"
            style={{
              border: '2px solid',
              borderColor: i === 0 ? 'rgba(168,85,247,0.3)' : 
                         i === 1 ? 'rgba(236,72,153,0.3)' : 
                         'rgba(139,92,246,0.3)',
              borderRadius: '20%',
            }}
            animate={{
              rotate: [i * 30, (i + 1) * 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}

        {/* Pixel scatter elements */}
        {isMounted && Array.from({ length: 40 }, (_, i) => (
          <motion.div
            key={`pixel-${i}`}
            className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400"
            style={{
              left: '50%',
              top: '50%',
              borderRadius: (i % 2) === 0 ? '50%' : '0%',
            }}
            animate={{
              x: [(i % 2 === 0 ? -1 : 1) * (100 + (i % 5) * 50),
                  0,
                  (i % 2 === 0 ? 1 : -1) * (100 + (i % 5) * 50)],
              y: [(i % 3 === 0 ? -1 : 1) * (100 + (i % 4) * 50),
                  0,
                  (i % 3 === 0 ? 1 : -1) * (100 + (i % 4) * 50)],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + (i % 3),
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.05,
            }}
          />
        ))}

        {/* Main logo with glow */}
        <motion.div className="relative w-full h-full" style={{ perspective: "1000px" }}>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          
          <Image
            src="/assets/pixel-logo.png"
            alt="Pixel8r Logo"
            fill
            className="object-contain drop-shadow-[0_0_25px_rgba(168,85,247,0.7)]"
            priority
          />
        </motion.div>

        {/* Orbital particles */}
        {isMounted && Array.from({ length: 12 }, (_, i) => (
          <motion.div
            key={`orbital-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
            style={{
              left: '50%',
              top: '50%',
              transform: `rotate(${i * 30}deg) translateX(80px)`,
            }}
            animate={{
              rotate: [i * 30, i * 30 + 360],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.1,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

// Typewriter Text Component
const TypewriterText = ({ text }) => {
  const [displayText, setDisplayText] = useState('')
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + text[index])
        setIndex((prev) => prev + 1)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setDisplayText('')
        setIndex(0)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [index, text])

  return (
    <span className="inline-block min-h-[3em]">
      {displayText}
      <span className="animate-blink">|</span>
    </span>
  )
}

// Particle Effect Component
const ParticleEffect = () => {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    setParticles(
      [...Array(5)].map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        offsetX: Math.random() * 100 - 50,
        offsetY: Math.random() * 100 - 50,
      }))
    )
  }, [])

  return (
    <>
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-purple-500/30 rounded-full"
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{
            x: particle.offsetX,
            y: particle.offsetY,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
        />
      ))}
    </>
  )
}

// Card3D Component
const Card3D = ({ step, index, description }) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 + index * 0.2 }}
      className="relative w-72 h-72"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full relative group cursor-pointer"
      >
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl backdrop-blur-sm border border-purple-500/30 
                     transform transition-all duration-300 group-hover:border-purple-500/60"
          style={{
            transform: "translateZ(0px)",
          }}
        />
        
        <div
          className="relative h-full w-full p-8 flex flex-col items-center justify-center"
          style={{
            transform: "translateZ(50px)",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center 
                        bg-gradient-to-r from-purple-500/30 to-pink-500/30 shadow-lg">
            <p className="pixel-font text-lg text-purple-300">{index + 1}</p>
          </div>

          <h3 className="text-3xl font-bold mb-6 pixel-font text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            {step}
          </h3>

          <p className="pixel-font text-sm text-gray-300 text-center mb-4">
            {description}
          </p>

          <motion.div
            className="mt-4 text-purple-400 text-4xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
            style={{ transform: "translateZ(75px)" }}
          >
            {index === 0 && "📸"}
            {index === 1 && "🎨"}
            {index === 2 && "🌟"}
          </motion.div>
        </div>

        <div className="absolute inset-0 overflow-hidden">
          <ParticleEffect />
        </div>
      </motion.div>
    </motion.div>
  )
}

// Background Collage Component
const BackgroundCollage = () => {
  const [images, setImages] = useState([])

  useEffect(() => {
    setImages(Array.from({ length: 12 }, (_, i) => i + 1))
  }, [])
  
  return (
    <div className="fixed inset-0 overflow-hidden">
      {[0, 1, 2].map((row) => (
        <motion.div 
          key={`row-${row}`}
          className={`absolute w-[120%] h-[40%] flex justify-around
                     ${row === 0 ? 'top-[-10%] left-[-10%]' : 
                       row === 1 ? 'top-[30%] left-[-5%] w-[110%]' : 
                                 'top-[70%] left-[-10%]'}`}
          initial={{ opacity: 0, x: row % 2 === 0 ? -50 : 50 }}
          animate={{ opacity: row === 0 ? 0.3 : row === 1 ? 0.9 : 1, x: 0 }}
          transition={{ duration: 1.5, delay: row * 0.2 }}
        >
          {images.slice(row * 4, (row + 1) * 4).map((num) => (
            <motion.div
              key={`image-${num}`}
              className="relative w-64 h-64"
              whileHover={{ scale: 1.1, rotate: 0 }}
              initial={{ rotate: row % 2 === 0 ? -5 : 5 }}
            >
              <Image
                src={`/assets/nft/${num}.png`}
                alt={`NFT ${num}`}
                fill
                className="object-cover rounded-lg"
              />
            </motion.div>
          ))}
        </motion.div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/90" />
      
      <div className="absolute inset-0 opacity-20 mix-blend-overlay animate-grain" />
    </div>
  )
}

// Main Home Component
export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const handleAnimationComplete = () => {
    setShowWelcome(false);
    setShowContent(true);
  };

return (
    <>
      {showWelcome && <WelcomeAnimation onComplete={handleAnimationComplete} />}
      
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen text-center relative overflow-hidden bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <BackgroundCollage />
        
        <motion.div
          className="relative z-10 mt-20"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : -50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl mt-36 font-bold mb-2 pixel-font text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
            whileHover={{ scale: 1.05 }}
          >
            Welcome to Pixel8r
          </motion.h1>

          <motion.div
            className="text-lg md:text-xl mb-12 pixel-font text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <TypewriterText text="Transform your photos into awesome 8-bit pixelated art!" />
          </motion.div>
        </motion.div>

        <div className="space-y-6 relative z-10">
          <Link href="/pixelate">
            <motion.button
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-full pixel-font 
                       shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-300"
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(168,85,247,0.7)" }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </Link>
        </div>

        {/* Feature Buttons */}
        <motion.div
          className="mt-12 relative z-10 w-full px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-center gap-6 max-w-4xl mx-auto">
            {/* Deploy NFT with AI Button */}
            <Link href="/nft-maker">
              <motion.div
                className="bg-gradient-to-br from-blue-600 to-cyan-500 p-6 rounded-xl shadow-lg hover:shadow-xl 
                         transition-all duration-300 cursor-pointer group border border-cyan-400/20 backdrop-blur-sm"
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-white/10 rounded-full">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 pixel-font">Deploy NFT with AI </h3>
                <p className="text-cyan-100 text-sm pixel-font leading-relaxed">
                  Create and deploy your NFT collection with io.net powered AI smart description and estimated price
                </p>
                <div className="mt-4 flex items-center justify-center text-cyan-200 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium pixel-font">Launch Creator Studio</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>
            </Link>

            {/* ASK NFT-AI Button */}
            <Link href="/nft-ai">
              <motion.div
                className="bg-gradient-to-br from-emerald-600 to-teal-500 p-6 rounded-xl shadow-lg hover:shadow-xl 
                         transition-all duration-300 cursor-pointer group border border-teal-400/20 backdrop-blur-sm"
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-white/10 rounded-full">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 pixel-font">ASK NFT-AI</h3>
                <p className="text-teal-100 text-sm pixel-font leading-relaxed">
                  Powered by io.net intelligence - Get expert insights and answers about NFTs, blockchain, and crypto
                </p>
                <div className="mt-4 flex items-center justify-center text-teal-200 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium pixel-font">Start Conversation</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  </div>
              </motion.div>
            </Link>
          </div>
        </motion.div>
        
        <motion.div
          className="mt-16 mb-16 relative z-10 w-full px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          
        </motion.div>

        <motion.div
          className="mt-16 relative z-10 w-full px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-12 pixel-font text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            How It Works
          </h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-20">
            {[
              { step: 'Upload', desc: 'Choose your image to begin the transformation' },
              { step: 'Pixelate', desc: 'Watch your image transform into stunning pixel art' },
              { step: 'Mint NFT', desc: 'Create your unique digital collectible' }
            ].map((item, index) => (
              <Card3D
                key={item.step}
                step={item.step}
                index={index}
                description={item.desc}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}
