import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, Star, Users, Volume2, VolumeX, ArrowDown } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-gradient-to-tr from-secondary via-secondary to-emerald-200/30">
      {/* Mobile-first background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-32 h-32 rounded-full -top-8 -left-8 sm:w-48 sm:h-48 sm:-top-12 sm:-left-12 lg:w-72 lg:h-72 lg:top-20 lg:left-10 blur-2xl animate-pulse bg-emerald-200/30"></div>
        <div className="absolute w-40 h-40 rounded-full -bottom-10 -right-10 sm:w-56 sm:h-56 sm:-bottom-14 sm:-right-14 lg:w-96 lg:h-96 lg:bottom-20 lg:right-10 blur-3xl animate-pulse bg-sage-300/20 animation-delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Mobile-optimized layout */}
        <div className="flex flex-col flex-1 lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
          
          {/* Content Section - Mobile First */}
          <motion.div 
            className="flex flex-col justify-center text-center lg:text-left lg:pt-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Trust Indicators - Mobile optimized */}
            <div className="flex items-center justify-center gap-3 mb-6 lg:justify-start">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="text-sm font-semibold text-primary">4.9</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-content/30"></div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-content" />
                <span className="text-sm text-content">+50 Clientes</span>
              </div>
            </div>
            
            {/* Main Heading - Mobile optimized typography */}
            <div className="mb-6">
              <h1 className="mb-4 text-3xl font-light leading-tight text-stone-900 sm:text-4xl lg:text-5xl xl:text-6xl">
                Con Saki,
                <br />
                <span className="font-medium text-primary">tu piel</span>{' '}
                <span className="relative inline-flex items-center text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-200 to-emerald-300">
                  brilla
                  <Sparkles size={20} className="ml-2 text-emerald-300 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                </span>
              </h1>
              <p className="max-w-lg mx-auto text-base leading-relaxed sm:text-lg lg:mx-0 lg:text-xl text-content">
                Pureza que se siente. Resultados que se ven. 
                El cuidado de la piel como debería ser.
              </p>
            </div>
            
            {/* CTA Button - Mobile optimized */}
            <div className="flex mb-20 flex-col items-center gap-4 lg:items-start">
              <motion.button 
                onClick={scrollToProducts}
                className="w-full max-w-xs px-8 py-4 text-lg font-semibold text-white transition-all transform rounded-2xl sm:w-auto bg-accent hover:bg-supporting hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ver Productos
              </motion.button>
              
              {/* Scroll indicator for mobile */}
              <motion.div 
                className="flex flex-col items-center mt-4 lg:hidden"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-xs text-content">Deslizá para ver más</span>
                <ArrowDown size={16} className="mt-1 text-accent" />
              </motion.div>
            </div>
          </motion.div>

          {/* Video Section - Mobile optimized */}
          <motion.div 
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <VideoPackagingShowcase />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const VideoPackagingShowcase = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videos = [
    {
      id: 1,
      title: "Kit Sami",
      description: "Descubre el cuidado en cada detalle",
      thumbnail: "https://res.cloudinary.com/do17gdc0b/image/upload/v1750901904/kit_sami_1_p3xqxg.webp",
      videoUrl: "https://res.cloudinary.com/do17gdc0b/video/upload/v1750303450/Kit_Sami_wbalgt.mp4",
      duration: "0:51",
      category: "Packaging"
    },
    {
      id: 2,
      title: "Kit Paki",
      description: "Cada kit hecho con amor",
      thumbnail: "https://res.cloudinary.com/do17gdc0b/image/upload/v1749864084/KitPaki_1_ujvfwq.webp",
      videoUrl: "https://res.cloudinary.com/do17gdc0b/video/upload/v1750303438/Kit_Paki_ysyqkb.mp4",
      duration: "1:07",
      category: "Packaging"
    }
  ];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, currentVideo, isMuted]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPlaying) {
        setCurrentVideo((prev) => (prev + 1) % videos.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, videos.length]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentVideo(index);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <motion.div 
      className="w-full max-w-sm mx-auto sm:max-w-md lg:max-w-lg"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Video Player - Mobile optimized */}
      <motion.div 
        className="relative mb-4"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <motion.div 
          className="relative overflow-hidden shadow-xl aspect-square bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-3xl group"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <video
            ref={videoRef}
            src={videos[currentVideo].videoUrl}
            className="object-cover object-bottom w-full h-full transition-all duration-700 scale-110 cursor-pointer brightness-75"
            muted={isMuted}
            controls={false}
            onClick={isPlaying ? handlePlayPause : undefined}
            onEnded={() => setIsPlaying(false)}
            playsInline
            preload="metadata"
          />
          
          {/* Overlay thumbnail when not playing */}
          {!isPlaying && (
            <img 
              src={videos[currentVideo].thumbnail}
              alt={videos[currentVideo].title}
              className="absolute inset-0 object-contain w-full h-full transition-all duration-700 scale-[1.8] pointer-events-none group-hover:scale-[1.9]"
              draggable={false}
            />
          )}

          {/* Video Overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 transition-all duration-300 bg-black/20 group-hover:bg-black/30"></div>
          )}
          
          {/* Play/Pause Button - Mobile optimized */}
          {!isPlaying ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={handlePlayPause}
                className="flex items-center justify-center w-16 h-16 transition-all duration-300 rounded-full shadow-xl sm:w-20 sm:h-20 bg-white/90 group-hover:bg-white group-hover:scale-110 active:scale-95"
              >
                <Play className="w-6 h-6 ml-1 sm:w-8 sm:h-8 text-primary" />
              </button>
            </div>
          ) : (
            <div className="absolute z-10 transform -translate-x-1/2 bottom-4 left-1/2">
              <button
                onClick={handlePlayPause}
                className="flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-full shadow bg-white/80 hover:bg-white active:scale-95"
                title="Pausar video"
              >
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              </button>
            </div>
          )}

          {/* Video Controls - Mobile optimized */}
          <div className="absolute flex space-x-2 top-3 right-3">
            <button
              onClick={toggleMute}
              className="flex items-center justify-center w-8 h-8 text-white transition-colors rounded-full backdrop-blur-sm bg-black/30 hover:bg-black/50 active:scale-95"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
          
          {/* Video Info Overlay - Mobile optimized */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t to-transparent from-black/60">
            <div className="text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary">
                  {videos[currentVideo].category}
                </span>
                <span className="px-2 py-1 font-mono text-xs rounded bg-black/30">
                  {videos[currentVideo].duration}
                </span>
              </div>
              <h3 className="mb-1 text-base font-semibold sm:text-lg">{videos[currentVideo].title}</h3>
              <p className="text-sm text-white/80">{videos[currentVideo].description}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Video Thumbnails - Mobile optimized grid */}
      <div className="grid grid-cols-2 gap-3">
        {videos.map((video, index) => (
          <button
            key={video.id}
            onClick={() => handleThumbnailClick(index)}
            className={`relative aspect-video rounded-xl overflow-hidden transition-all duration-300 ${
              index === currentVideo 
                ? 'ring-2 ring-primary ring-offset-2 ring-offset-white scale-105' 
                : 'hover:scale-105 hover:shadow-lg active:scale-95'
            }`}
          >
            <img 
              src={video.thumbnail}
              alt={video.title}
              className="object-contain w-full h-full scale-[2.4]"
            />
            <div className={`absolute inset-0 transition-all duration-300 ${
              index === currentVideo 
                ? 'text-primary' 
                : 'bg-black/20 hover:bg-black/10'
            }`}></div>
            
            {/* Mini Play Button - Mobile optimized */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                index === currentVideo 
                  ? 'bg-accent text-white' 
                  : 'bg-white/80 text-primary'
              }`}>
                <Play className="w-3 h-3 ml-0.5" />
              </div>
            </div>
            
            {/* Video Duration - Mobile optimized */}
            <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
              {video.duration}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default Hero;