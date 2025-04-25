import Image from 'next/image';

const About = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-gray-900 relative">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute h-40 w-40 rounded-full bg-blue-500/5 blur-3xl top-20 right-1/4 animate-pulse"></div>
        <div className="absolute h-32 w-32 rounded-full bg-purple-500/5 blur-3xl bottom-20 left-1/4 animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16 relative z-10">
        <div className="md:w-1/2">
          <div className="space-y-8">
            <div className="inline-block">
              <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                About Sumit Walia
              </h2>
              <div className="h-1 w-1/2 bg-gradient-to-r from-blue-400 to-purple-500 mt-2 rounded-full"></div>
            </div>
            
            <div className="space-y-6">
              <p className="text-gray-300 leading-relaxed text-lg font-roboto">
                A creative visionary with over 5 years of experience in digital design and visual storytelling. I specialize in:
              </p>
              
              <div className="grid grid-cols-2 gap-6 py-4">
                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 backdrop-blur-sm group">
                  <h3 className="text-white font-semibold mb-2 group-hover:text-blue-400">UI/UX Design</h3>
                  <p className="text-gray-400 font-roboto">Figma, Adobe XD</p>
                </div>
                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 backdrop-blur-sm group">
                  <h3 className="text-white font-semibold mb-2 group-hover:text-purple-400">Motion Graphics</h3>
                  <p className="text-gray-400 font-roboto">After Effects, Cinema 4D</p>
                </div>
                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-cyan-500 transition-all duration-300 backdrop-blur-sm group">
                  <h3 className="text-white font-semibold mb-2 group-hover:text-cyan-400">Video Editing</h3>
                  <p className="text-gray-400 font-roboto">Premiere Pro, DaVinci</p>
                </div>
                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-emerald-500 transition-all duration-300 backdrop-blur-sm group">
                  <h3 className="text-white font-semibold mb-2 group-hover:text-emerald-400">Graphic Design</h3>
                  <p className="text-gray-400 font-roboto">Photoshop, Illustrator</p>
                </div>
              </div>

              <p className="text-gray-400 leading-relaxed font-roboto">
                My approach combines creative innovation with strategic thinking to deliver impactful visual solutions that engage audiences and drive results.
              </p>
            </div>

            <button className="group relative px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-all duration-300 overflow-hidden">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400/20 to-purple-500/20 blur group-hover:animate-pulse"></span>
              <span className="relative">View Portfolio</span>
            </button>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full aspect-[3/4] max-w-lg">
            {/* Subtle glow behind image */}
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full transform scale-75"></div>
            
            <Image
              src="/images/man.png"
              alt="Sumit Walia - Creative Professional"
              fill
              className="rounded-2xl object-cover shadow-2xl relative"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-6 left-6 right-6 p-6 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-xl font-bold">SW</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold font-helvetica">Sumit Walia</h3>
                  <p className="text-sm text-gray-300 font-roboto">Digital Creative Director</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;