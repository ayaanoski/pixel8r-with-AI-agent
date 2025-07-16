'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Github, Star, Sparkles } from 'lucide-react'
import Image from 'next/image'
import logo from '../../public/assets/pixel-logo.png'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const menuItems = [
    { href: '/pixelate', label: 'Pixelate', icon: '🎨' },
    { href: '/marketplace', label: 'Marketplace', icon: '🛍️' },
    { href: '/my-collection', label: 'My Collection', icon: '💎' },
    { href: '/nft-maker', label: 'Deploy NFT', icon: '🚀' },
    { href: '/profile', label: 'Profile', icon: '👤' },
    { href: '/nft-ai', label: 'NFT-AI', icon: '🤖' },
  ]

  return (
    <header 
      className={`
        fixed w-full top-0 z-50 transition-all duration-300
        ${scrolled 
          ? 'bg-black/80 backdrop-blur-md shadow-xl border-b border-purple-500/30' 
          : 'bg-black/95 backdrop-blur-sm border-b-2 border-purple-500/50'
        }
        shadow-[0_0_20px_rgba(139,92,246,0.3)]
      `}
    >
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="group flex items-center space-x-2">
            <div className="relative">
              <Image
                src={logo}
                alt="Pixel8r Logo"
                width={180}
                height={70}
                className="transition-all duration-300 group-hover:scale-105 drop-shadow-lg"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 hover:scale-105"
              >
                <span className="text-lg group-hover:animate-pulse">{item.icon}</span>
                <span className="pixel-font text-sm font-medium text-gray-200 group-hover:text-white">
                  {item.label}
                </span>
                <div className="absolute inset-0 rounded-lg border border-transparent group-hover:border-purple-500/30 transition-all duration-300" />
              </Link>
            ))}
            
            {/* Separator */}
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-purple-500/50 to-transparent mx-3" />
            
            {/* GitHub Link */}
            <a
              href="https://github.com/ayaanoski/pixel8r"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/30 hover:from-purple-600/20 hover:to-pink-600/20 hover:border-purple-400/50 transition-all duration-300 hover:scale-105"
            >
              <Github size={18} className="text-purple-400 group-hover:text-purple-300" />
              <span className="pixel-font text-sm font-medium text-gray-200 group-hover:text-white">
                GitHub
              </span>
              <Star size={16} className="text-yellow-400 group-hover:text-yellow-300 group-hover:animate-pulse" />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden relative p-2 rounded-lg border border-purple-500/30 hover:border-purple-400/50 hover:bg-purple-600/10 transition-all duration-300"
            onClick={toggleMenu}
          >
            <div className="relative">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`
        lg:hidden absolute top-full left-0 right-0 transition-all duration-300
        ${isMenuOpen 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 -translate-y-2 pointer-events-none'
        }
      `}>
        <div className="bg-black/95 backdrop-blur-md border-b border-purple-500/30 shadow-xl">
          <div className="container mx-auto px-4 py-4">
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 transition-all duration-300"
                  onClick={toggleMenu}
                >
                  <span className="text-xl group-hover:animate-pulse">{item.icon}</span>
                  <span className="pixel-font text-gray-200 group-hover:text-white font-medium">
                    {item.label}
                  </span>
                </Link>
              ))}
              
              {/* Mobile GitHub Link */}
              <div className="pt-2 border-t border-purple-500/20">
                <a
                  href="https://github.com/ayaanoski/pixel8r-with-AI-agent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/30 hover:from-purple-600/20 hover:to-pink-600/20 hover:border-purple-400/50 transition-all duration-300"
                  onClick={toggleMenu}
                >
                  <Github size={20} className="text-purple-400 group-hover:text-purple-300" />
                  <span className="pixel-font text-gray-200 group-hover:text-white font-medium">
                    GitHub Repo
                  </span>
                  <Star size={16} className="text-yellow-400 group-hover:text-yellow-300 ml-auto" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}