import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, Star, Users, Volume2, VolumeX } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="overflow-hidden relative px-3 py-24 mx-auto max-w-7xl min-h-screen">
      <div className="absolute left-10 top-20 w-72 h-72 rounded-full blur-3xl animate-pulse bg-emerald-200/20"></div>
      <div className="absolute right-10 bottom-20 w-96 h-96 rounded-full blur-3xl delay-1000 animate-pulse bg-sage-300/20"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left Content */}
        <motion.div 
          className="flex items-center px-6 py-16 md:px-12"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-8 max-w-xl">
            {/* Trust Indicators */}
            <div className="flex gap-2 items-center text-supporting">
              <Star className="fill-accent text-accent" size={20} />
              <span className="font-medium text-primary">4.9</span>
              <Users className="text-content" size={20} />
              <span className="text-content">12K Confían</span>
            </div>
            
            {/* Main Heading */}
<div>
<h1 className="mb-4 text-5xl font-light md:text-6xl lg:text-7xl text-stone-900">
  Con Saki,
  <br />
  <span className="text-primary">tu piel</span> <span className="flex items-center italic text-transparent bg-clip-text bg-gradient-to-r via-emerald-200 to-emerald-300 from-primary">brilla. <Sparkles size={50} color='#7dc5a2' /></span>
</h1>
  <p className="max-w-md text-lg text-content">
    Pureza que se siente. Resultados que se ven. 
    El cuidado de la piel como debería ser.
  </p>
</div>
            
            {/* CTA Button */}
            <motion.button 
              onClick={scrollToProducts}
              className="px-8 py-4 text-lg text-white rounded-full transition-all transform bg-accent hover:bg-supporting hover:-translate-y-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Comprar Ahora
            </motion.button>
          
          </div>
        </motion.div>

        {/* Right Content */}

        <motion.div className="flex justify-center items-center p-6">
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
      title: "Unboxing Experience",
      description: "Descubre el cuidado en cada detalle",
      thumbnail: "https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=600",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Example video
      duration: "0:45",
      category: "Packaging"
    },
    {
      id: 2,
      title: "Proceso Artesanal",
      description: "Cada producto hecho con amor",
      thumbnail: "https://images.pexels.com/photos/6621462/pexels-photo-6621462.jpeg?auto=compress&cs=tinysrgb&w=600",
      videoUrl: "https://www.w3schools.com/html/movie.mp4", // Example video
      duration: "1:20",
      category: "Proceso"
    },
    {
      id: 3,
      title: "Ingredientes Naturales",
      description: "De la naturaleza a tu piel",
      thumbnail: "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=600",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Example video
      duration: "0:58",
      category: "Ingredientes"
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
      className="w-full max-w-2xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Video Player */}
      <motion.div 
        className="relative mb-6"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <motion.div 
          className="relative aspect-[4/3] bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-3xl overflow-hidden group shadow-2xl"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <video
            ref={videoRef}
            src={videos[currentVideo].videoUrl}
            className="object-cover w-full h-full brightness-75 transition-all duration-700 scale-105 cursor-pointer"
            muted={isMuted}
            controls={false}
            onClick={isPlaying ? handlePlayPause : undefined} // Pause on click if playing
            onEnded={() => setIsPlaying(false)}
          />
          {/* Overlay thumbnail when not playing */}
          {!isPlaying && (
            <img 
              src={videos[currentVideo].thumbnail}
              alt={videos[currentVideo].title}
              className="object-cover absolute inset-0 w-full h-full transition-all duration-700 pointer-events-none group-hover:scale-105"
              draggable={false}
            />
          )}

          {/* Video Overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 transition-all duration-300 bg-black/20 group-hover:bg-black/30"></div>
          )}
          
          {/* Play/Pause Button */}
          {!isPlaying ? (
            // Centered play button when not playing
            <div className="flex absolute inset-0 justify-center items-center">
              <button
                onClick={handlePlayPause}
                className="flex justify-center items-center w-20 h-20 rounded-full shadow-xl transition-all duration-300 bg-white/90 group-hover:bg-white group-hover:scale-110"
              >
                <Play className="ml-1 w-8 h-8 text-primary" />
              </button>
            </div>
          ) : (
            // Small pause button in bottom left when playing
            <div className="absolute bottom-4 left-1/2 z-10 transform -translate-x-1/2">
              <button
                onClick={handlePlayPause}
                className="flex justify-center items-center w-10 h-10 rounded-full shadow transition-all duration-300 bg-white/80 hover:bg-white"
                title="Pausar video"
              >
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              </button>
            </div>
          )}

          {/* Video Controls */}
          <div className="flex absolute top-4 right-4 space-x-2">
            <button
              onClick={toggleMute}
              className="flex justify-center items-center w-10 h-10 text-white rounded-full backdrop-blur-sm transition-colors bg-black/30 hover:bg-black/50"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Video Info Overlay */}
          <div className="absolute right-0 bottom-0 left-0 p-6 bg-gradient-to-t to-transparent from-black/60">
            <div className="text-white">
              <div className="flex justify-between items-center mb-2">
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-primary">
                  {videos[currentVideo].category}
                </span>
                <span className="px-2 py-1 font-mono text-sm rounded bg-black/30">
                  {videos[currentVideo].duration}
                </span>
              </div>
              <h3 className="mb-1 text-xl font-semibold">{videos[currentVideo].title}</h3>
              <p className="text-sm text-white/80">{videos[currentVideo].description}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Video Thumbnails */}
      <div className="grid grid-cols-3 gap-4">
        {videos.map((video, index) => (
          <button
            key={video.id}
            onClick={() => handleThumbnailClick(index)}
            className={`relative aspect-video rounded-xl overflow-hidden transition-all duration-300 ${
              index === currentVideo 
                ? 'ring-3 ring-primary ring-offset-2 ring-offset-white scale-105' 
                : 'hover:scale-105 hover:shadow-lg'
            }`}
          >
            <img 
              src={video.thumbnail}
              alt={video.title}
              className="object-cover w-full h-full"
            />
            <div className={`absolute inset-0 transition-all duration-300 ${
              index === currentVideo 
                ? 'text-primary' 
                : 'bg-black/20 hover:bg-black/10'
            }`}></div>
            
            {/* Mini Play Button */}
            <div className="flex absolute inset-0 justify-center items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                index === currentVideo 
                  ? 'bg-accent text-white' 
                  : 'bg-white/80 text-primary'
              }`}>
                <Play className="w-3 h-3 ml-0.5" />
              </div>
            </div>
            
            {/* Video Duration */}
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