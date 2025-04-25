"use client"

import Image from 'next/image';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Jane Doe',
      title: 'Marketing Director, TechCorp',
      quote: 'Sumit\'s creativity and attention to detail were instrumental in our rebrand\'s success. The new visual identity perfectly captures our mission.',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    {
      name: 'John Smith',
      title: 'Founder, Startup Solutions',
      quote: 'The explainer video Sumit produced was exceptional. It simplified a complex concept beautifully and significantly boosted our lead generation.',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      name: 'Alice Brown',
      title: 'Social Media Manager, Fashion Hub',
      quote: 'Working with Sumit is always a pleasure. The video content consistently performs well above benchmarks and resonates with our audience.',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-[var(--testimonials-bg)] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute h-64 w-64 rounded-full bg-blue-500/5 blur-3xl top-1/4 left-1/4 animate-pulse"></div>
        <div className="absolute h-48 w-48 rounded-full bg-purple-500/5 blur-3xl bottom-1/4 right-1/4 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">
            Client Success Stories
          </h2>
          <p className="text-gray-400 text-lg">What our clients say about working with us</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="group relative bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/30 hover:border-gray-600/50 transition-all duration-500"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="flex flex-col items-center text-center">
                <div className="relative w-20 h-20 mb-6">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="rounded-full object-cover border-2 border-gray-700 group-hover:border-blue-500 transition-colors duration-300"
                  />
                </div>
                
                <p className="text-gray-300 mb-6 relative">
                  <span className="absolute -top-4 left-0 text-4xl text-blue-400/20">"</span>
                  {testimonial.quote}
                  <span className="absolute -bottom-4 right-0 text-4xl text-blue-400/20">"</span>
                </p>
                
                <div className="mt-auto">
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-400">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;