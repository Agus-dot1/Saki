import React from 'react';
import { motion } from 'framer-motion';

const BentoGrid: React.FC = () => {
  const images = [
    'https://images.unsplash.com/photo-1552046122-03184de85e08?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.pexels.com/photos/6621462/pexels-photo-6621462.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.unsplash.com/photo-1556942040-df93bd3bdd19?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGJlYXV0eXxlbnwwfHwwfHx8MA%3D%3D',
    'https://images.unsplash.com/photo-1643185450492-6ba77dea00f6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YmVhdXR5fGVufDB8fDB8fHww'
  ];

  return (
    <div className="grid grid-cols-2 grid-rows-3 gap-6 w-full aspect-square">
      {/* First large image */}
      <motion.div
        className="relative overflow-hidden rounded-3xl bg-secondary row-span-2"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={images[0]}
          alt="Natural skincare 1"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </motion.div>
      
      {/* First small image */}
      <motion.div
        className="relative overflow-hidden rounded-3xl bg-secondary"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={images[1]}
          alt="Natural skincare 2"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </motion.div>
      
      {/* Second large image */}
      <motion.div
        className="relative overflow-hidden rounded-3xl bg-secondary row-span-2"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={images[2]}
          alt="Natural skincare 3"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </motion.div>
      
      {/* Second small image */}
      <motion.div
        className="relative overflow-hidden rounded-3xl bg-secondary"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={images[3]}
          alt="Natural skincare 4"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </motion.div>
    </div>
  );
};

export default BentoGrid;