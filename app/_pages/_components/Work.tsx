"use client"

import Image from 'next/image';

const Work = () => {
  const projects = [
    {
      title: 'Modern Brand Identity Design',
      description: 'Complete visual identity system including logo, color palette, and brand guidelines for a tech startup.',
      imageUrl: 'https://blog-frontend.envato.com/cdn-cgi/image/width=1200,quality=75,format=auto,fit=crop,height=630/uploads/sites/2/2023/02/Tuts_Roundup__Top_Graphic_Design_Courses.jpeg',
      link: 'https://example.com/brand-identity',
      category: 'Branding',
    },
    {
      title: 'Motion Graphics Animation', 
      description: 'Engaging 60-second explainer video combining 2D animation with dynamic typography.',
      imageUrl: 'https://images.pexels.com/photos/2544554/pexels-photo-2544554.jpeg',
      link: 'https://example.com/motion-graphics',
      category: 'Motion',
    },
    {
      title: 'Social Media Campaign',
      description: 'Series of eye-catching video content optimized for Instagram and TikTok engagement.',
      imageUrl: 'https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg',
      link: 'https://example.com/social-campaign',
      category: 'Social Media',
    },
    {
      title: 'Mobile App Interface Design',
      description: 'Clean and intuitive UI/UX design for a wellness tracking application.',
      imageUrl: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg',
      link: 'https://example.com/app-design',
      category: 'UI/UX',
    },
    {
      title: 'Corporate Presentation',
      description: 'Minimalist yet impactful slides designed for maximum visual impact and clarity.',
      imageUrl: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
      link: 'https://example.com/presentation',
      category: 'Design',
    },
    {
      title: 'Documentary Edit',
      description: 'Compelling narrative video editing for an environmental conservation project.',
      imageUrl: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg',
      link: 'https://example.com/documentary',
      category: 'Video',
    },
  ];

  return (
    <section id="work" className="py-24 bg-[var(--work-bg)] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute h-64 w-64 rounded-full bg-blue-500/5 blur-3xl top-1/4 left-1/4 animate-pulse"></div>
        <div className="absolute h-48 w-48 rounded-full bg-purple-500/5 blur-3xl bottom-1/4 right-1/4 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
            Featured Projects
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore my latest creative work and discover how I bring ideas to life through design and motion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className="group relative bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/30 hover:border-gray-600/50 transition-all duration-500"
            >
              <a href={project.link} className="block">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover transform transition duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-500/20 text-blue-400 rounded-full mb-2">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {project.description}
                    </p>
                    <div className="mt-4 flex items-center text-blue-400 text-sm font-medium">
                      View Project
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-medium transition-all duration-300 border border-gray-700 hover:border-gray-600">
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
};

export default Work;