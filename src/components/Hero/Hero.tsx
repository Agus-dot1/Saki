import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, Star, Users, Volume2, VolumeX } from 'lucide-react';
import { KitBuilderButton } from '../KitBuilder';

const Hero: React.FC = () => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openKitBuilder = () => {
    document.dispatchEvent(new CustomEvent('openKitBuilder'));
  };

  return (
    <section id="home" className="relative min-h-screen px-4 mx-auto overflow-hidden max-w-7xl lg:px-6 lg:py-24">
      {/* Background elements - adjusted for mobile */}
      <div className="absolute w-48 h-48 rounded-full left-4 top-16 lg:left-10 lg:top-20 lg:w-72 lg:h-72 blur-3xl animate-pulse bg-emerald-200/20"></div>
      <div className="absolute w-64 h-64 delay-1000 rounded-full right-4 bottom-16 lg:right-10 lg:bottom-20 lg:w-96 lg:h-96 blur-3xl animate-pulse bg-sage-300/20"></div>

      <div className="grid grid-cols-1 gap-8 center lg:grid-cols-2 lg:gap-12">
      {/* Left Content - Improved mobile spacing */}
      <motion.div 
        className="flex items-center justify-center px-2 py-8 lg:justify-start lg:px-12 lg:py-16"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-xl space-y-6 text-center lg:space-y-8 lg:text-left">
        {/* Trust Indicators - Better mobile layout */}
        <div className="flex items-center justify-center gap-2 text-supporting lg:justify-start">
          <Star className="fill-accent text-accent" size={18} />
          <span className="text-sm font-medium text-primary lg:text-base">4.9</span>
          <Users className="text-content" size={18} />
          <span className="text-sm text-content lg:text-base">+20 Confían</span>
        </div>
        
        {/* Main Heading - Responsive typography */}
        <div>
          <h1 className="mb-4 space-y-2 text-4xl leading-tight sm:text-5xl lg:text-6xl xl:text-7xl text-stone-900">
          Con Saki,
          <br />
          <span className="text-primary">tu piel</span>{' '}
          <span className="flex items-center justify-center italic text-transparent bg-clip-text bg-gradient-to-r via-emerald-200 to-emerald-300 from-primary lg:justify-start">
            brilla. <Sparkles size={32} className="ml-2 lg:ml-0" color='#7dc5a2' />
          </span>
          </h1>
          <p className="max-w-md mx-auto text-base leading-relaxed lg:mx-0 lg:text-lg text-content">
          Pureza que se siente. Resultados que se ven. 
          El cuidado de la piel como debería ser.
          </p>
        </div>
        
        {/* CTA Buttons - Better mobile layout */}
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
          <motion.button 
            onClick={scrollToProducts}
            className="px-6 py-3 text-base font-medium text-white transition-all transform rounded-full lg:px-8 lg:py-4 lg:text-lg bg-accent hover:bg-supporting hover:-translate-y-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver Productos
          </motion.button>
          
          <KitBuilderButton 
            onClick={openKitBuilder}
            className="lg:w-auto"
          />
        </div>
        </div>
      </motion.div>

      {/* Right Content - Better mobile layout */}
      <motion.div className="flex items-center justify-center p-4 lg:p-6">
        <VideoPackagingShowcase />
      </motion.div>
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
      thumbnail: "https://res.cloudinary.com/do17gdc0b/image/upload/v1749864099/KitSami_1_cz5xwg.webp",
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
      className="w-full max-w-md"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Video Player - Responsive aspect ratio */}
      <motion.div 
        className="relative mb-4 lg:mb-6"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <motion.div 
          className="relative overflow-hidden shadow-xl aspect-square bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl lg:rounded-3xl group lg:shadow-2xl"
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
          
          {/* Play/Pause Button - Responsive sizing */}
          {!isPlaying ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={handlePlayPause}
                className="flex items-center justify-center w-16 h-16 transition-all duration-300 rounded-full shadow-xl lg:w-20 lg:h-20 bg-white/90 group-hover:bg-white group-hover:scale-110"
              >
                <Play className="w-6 h-6 ml-1 lg:w-8 lg:h-8 text-primary" />
              </button>
            </div>
          ) : (
            <div className="absolute z-10 transform -translate-x-1/2 bottom-4 left-1/2">
              <button
                onClick={handlePlayPause}
                className="flex items-center justify-center w-8 h-8 transition-all duration-300 rounded-full shadow lg:w-10 lg:h-10 bg-white/80 hover:bg-white"
                title="Pausar video"
              >
                <svg className="w-4 h-4 lg:w-6 lg:h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              </button>
            </div>
          )}

          {/* Video Controls - Responsive positioning */}
          <div className="absolute flex space-x-2 top-2 right-2 lg:top-4 lg:right-4">
            <button
              onClick={toggleMute}
              className="flex items-center justify-center w-8 h-8 text-white transition-colors rounded-full lg:w-10 lg:h-10 backdrop-blur-sm bg-black/30 hover:bg-black/50"
            >
              {isMuted ? <VolumeX className="w-4 h-4 lg:w-5 lg:h-5" /> : <Volume2 className="w-4 h-4 lg:w-5 lg:h-5" />}
            </button>
          </div>
          
          {/* Video Info Overlay - Responsive text */}
          <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 bg-gradient-to-t to-transparent from-black/60">
            <div className="text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-1 text-xs font-medium rounded-full lg:text-sm bg-primary">
                  {videos[currentVideo].category}
                </span>
                <span className="px-2 py-1 font-mono text-xs rounded lg:text-sm bg-black/30">
                  {videos[currentVideo].duration}
                </span>
              </div>
              <h3 className="mb-1 text-lg font-semibold lg:text-xl">{videos[currentVideo].title}</h3>
              <p className="text-sm text-white/80">{videos[currentVideo].description}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Video Thumbnails - Better mobile grid */}
      <div className="grid grid-cols-2 gap-2 lg:gap-6">
        {videos.map((video, index) => (
          <button
            key={video.id}
            onClick={() => handleThumbnailClick(index)}
            className={`relative aspect-video rounded-lg lg:rounded-xl overflow-hidden transition-all duration-300 ${
              index === currentVideo 
                ? 'ring-2 lg:ring-3 ring-primary ring-offset-1 lg:ring-offset-2 ring-offset-white scale-105' 
                : 'hover:scale-105 hover:shadow-lg'
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
            
            {/* Mini Play Button - Responsive sizing */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center transition-all ${
                index === currentVideo 
                  ? 'bg-accent text-white' 
                  : 'bg-white/80 text-primary'
              }`}>
                <Play className="w-2 h-2 lg:w-3 lg:h-3 ml-0.5" />
              </div>
            </div>
            
            {/* Video Duration - Responsive text */}
            <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1 py-0.5 lg:px-1.5 lg:py-0.5 rounded">
              {video.duration}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default Hero;