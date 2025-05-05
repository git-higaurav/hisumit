"use client"

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Project {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  category: string;
  createdAt: string;
}

const Work = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        // Remove the check for data.projects since the API returns array directly
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (error) {
    return (
      <section id="work" className="py-24 bg-[var(--work-bg)]">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-400">{error}</div>
        </div>
      </section>
    );
  }

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

        {loading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
            <p className="mt-2 text-gray-400">Loading projects...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects && projects.length > 0 ? projects.map((project) => (
              <div 
                key={project._id} 
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
            )) : (
              <div className="col-span-full text-center text-gray-400">
                No projects found
              </div>
            )}
          </div>
        )}

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