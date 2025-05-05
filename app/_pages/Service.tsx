"use client"

import Image from 'next/image';

const Service = () => {
  const services = [
    {
      title: 'Graphic Design',
      subtitle: 'Transform your brand with stunning visuals',
      description: [
        '1 Revision included',
        'High quality PSD/AI/EPS files', 
        'Print-ready formats',
        'Social media kit',
        'Brand style guide',
        'Custom illustrations'
      ],
      image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg',
      icon: '🎨'
    },
    {
      title: 'Motion Graphics',
      subtitle: 'Bring your story to life with animation',
      description: [
        'Full HD 1080p delivery',
        'Custom sound design',
        '2D/3D animations', 
        'Animated logos',
        'Social media animations',
        'Video transitions'
      ],
      image: 'https://images.pexels.com/photos/2544554/pexels-photo-2544554.jpeg',
      icon: '🎬'
    },
    {
      title: 'Video Editing',
      subtitle: 'Professional post-production excellence',
      description: [
        'Color grading & correction',
        'Audio mixing & mastering',
        'Custom transitions',
        'Motion tracking',
        'Green screen removal',
        'Format optimization'
      ],
      image: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg',
      icon: '🎥'
    }
  ];

  return (
    <section id="services" className="py-24 bg-[var(--services-bg)] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute h-64 w-64 rounded-full bg-blue-500/5 blur-3xl top-1/4 left-1/4 animate-pulse"></div>
        <div className="absolute h-48 w-48 rounded-full bg-purple-500/5 blur-3xl bottom-1/4 right-1/4 animate-pulse delay-1000"></div>
        <div className="absolute h-32 w-32 rounded-full bg-cyan-500/5 blur-3xl top-1/2 right-1/3 animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">
            Services I Offer
          </h2>
          <p className="text-gray-400 text-lg">Comprehensive creative solutions tailored to your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group relative bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/30 hover:border-gray-600/50 transition-all duration-500"
            >
              <div className="relative h-48 overflow-hidden">
                <Image 
                  src={service.image} 
                  alt={service.title}
                  fill
                  className="object-cover transform transition duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gray-800/80 backdrop-blur-sm flex items-center justify-center text-2xl">
                  {service.icon}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-blue-400 font-medium">
                    {service.subtitle}
                  </p>
                </div>

                <ul className="space-y-2">
                  {service.description.map((point, i) => (
                    <li key={i} className="flex items-center text-gray-300 text-sm">
                      <svg className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {point}
                    </li>
                  ))}
                </ul>

                <button className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center group">
                  <span className="relative flex items-center">
                    Get Started
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Service;
