import Image from 'next/image';

const LandingPage = () => {
  return (
    <div className="bg-[var(--hero-bg)] text-white flex flex-col relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute h-40 w-40 rounded-full bg-blue-500/10 blur-3xl top-20 left-1/4 animate-pulse"></div>
        <div className="absolute h-48 w-48 rounded-full bg-purple-500/10 blur-3xl top-1/3 right-1/4 animate-pulse delay-1000"></div>
        <div className="absolute h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl bottom-1/4 left-1/3 animate-pulse delay-500"></div>
        <div className="absolute h-24 w-24 rounded-full bg-emerald-500/10 blur-3xl bottom-1/2 right-1/3 animate-pulse delay-1500"></div>
      </div>

      <main className="max-w-[1400px] mx-auto px-4 w-full flex-grow relative z-10">
        {/* Hero Section */}
        <section id="home" className="flex flex-col md:flex-row items-center justify-between min-h-screen py-12 md:py-20">
          <div className="w-full md:w-1/2 space-y-6 md:pr-8">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              SUMIT WALIA
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 pb-2 font-medium">Graphic, Motion & Video Editor</p>
            
            {/* Social Links */}
            <div className="flex space-x-4 pt-4">
              <a href="#" className="w-10 sm:w-12 h-10 sm:h-12 border-2 border-dotted border-emerald-400 hover:border-emerald-300 hover:bg-emerald-400/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="w-10 sm:w-12 h-10 sm:h-12 border-2 border-dotted border-purple-400 hover:border-purple-300 hover:bg-purple-400/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="w-10 sm:w-12 h-10 sm:h-12 border-2 border-dotted border-cyan-400 hover:border-cyan-300 hover:bg-cyan-400/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                <span className="sr-only">Behance</span>
              </a>
            </div>

            {/* About Section */}
            <div className="pt-8">
              <h2 className="text-xl font-semibold mb-3 text-blue-400">ABOUT ME</h2>
              <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                Passionate visual storyteller specializing in creating compelling graphics, dynamic motion designs,
                and polished video edits. Bringing ideas to life through creative visual solutions.
              </p>
            </div>

            {/* Call to Action Buttons */}
            <div className="pt-10 flex flex-col sm:flex-row gap-4 sm:space-x-6">
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-all duration-300 relative group overflow-hidden">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400/20 to-transparent blur-sm group-hover:animate-pulse"></span>
                <span className="relative flex items-center justify-center">
                  View Portfolio
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </button>
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-medium transition-all duration-300 border border-gray-700 hover:border-gray-600">
                Get In Touch
              </button>
            </div>
          </div>

          {/* Image Section */}
          <div className="w-full md:w-1/2 mt-12 md:mt-0 flex justify-center relative">
            <div className="absolute bottom-0 w-48 h-48 bg-blue-500/5 blur-3xl rounded-full"></div>
            <div className="relative group">
              <Image
                src="/images/man.png"
                alt="Sumit Walia"
                width={500}
                height={700}
                className="rounded-lg object-cover shadow-lg relative  max-h-[70vh] w-auto"
                style={{ objectPosition: 'center bottom' }}
                priority
              />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-70"></div>
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 blur-sm"></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;