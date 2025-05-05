"use client"
import { useState, useRef, useEffect } from 'react';

interface Reel {
    _id: string;
    title: string;
    videoUrl: string;
    createdAt: string;
}

export default function Reel() {
    const [activeVideo, setActiveVideo] = useState<string | null>(null);
    const [visibleReels, setVisibleReels] = useState(4);
    const [reels, setReels] = useState<Reel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

    useEffect(() => {
        fetchReels();
    }, []);

    const fetchReels = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch('/api/reel');
            if (!response.ok) {
                throw new Error('Failed to fetch reels');
            }
            const data = await response.json();
            setReels(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while fetching reels');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadMore = () => {
        setVisibleReels(prev => prev + 4);
    };

    const handlePlay = async (id: string) => {
        try {
            // Stop all other videos
            reels.forEach((reel) => {
                if (reel._id !== id && videoRefs.current[reel._id]) {
                    videoRefs.current[reel._id]?.pause();
                }
            });

            // Play the selected video
            const video = videoRefs.current[id];
            if (video) {
                video.currentTime = 0;
                await video.play();
                setActiveVideo(id);
            }
        } catch (error) {
            console.error('Error playing video:', error);
        }
    };

    const handlePause = (id: string) => {
        const video = videoRefs.current[id];
        if (video) {
            video.pause();
            setActiveVideo(null);
        }
    };

    const handleVideoClick = (id: string) => {
        const isPlaying = activeVideo === id;
        if (isPlaying) {
            handlePause(id);
        } else {
            handlePlay(id);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-[var(--services-bg)] py-6">
                <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
                    <div className="text-center py-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Error Loading Reels</h1>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={fetchReels}
                            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-300 font-medium"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--services-bg)] py-6">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
                <div className="text-left py-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Reel Collection
                    </h1>
                </div>
            </div>

            {/* Video Grid Section */}
            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 pb-12">
                {isLoading ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-center'>
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="w-full max-w-[300px] aspect-[9/16] bg-gray-200 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-center'>
                            {reels.slice(0, visibleReels).map((data) => {
                                const isPlaying = activeVideo === data._id;
                                return (
                                    <div 
                                        key={data._id} 
                                        className="relative group cursor-pointer bg-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden w-full max-w-[300px]"
                                        onClick={() => handleVideoClick(data._id)}
                                    >
                                        <video 
                                            ref={(el) => {
                                                videoRefs.current[data._id] = el;
                                            }}
                                            playsInline
                                            preload="metadata"
                                            className='aspect-[9/16] w-full object-cover'
                                            onLoadedData={(e) => {
                                                const video = e.target as HTMLVideoElement;
                                                video.currentTime = video.duration / 2;
                                            }}
                                            
                                            onEnded={() => setActiveVideo(null)}
                                            onPlay={() => setActiveVideo(data._id)}
                                            onPause={() => {
                                                if (activeVideo === data._id) {
                                                    setActiveVideo(null);
                                                }
                                            }}
                                        >
                                            <source src={data.videoUrl} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                        
                                        {/* Title Overlay */}
                                        <div className={`absolute ${isPlaying ? 'bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3' : 'inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40'} transition-all duration-300`}>
                                            <h3 className="text-white text-sm font-semibold text-center drop-shadow-lg">{data.title}</h3>
                                        </div>

                                        {/* Play/Pause Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                            <div className="bg-black/60 p-4 rounded-full backdrop-blur-sm">
                                                {isPlaying ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Load More Button */}
                        {visibleReels < reels.length && (
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={handleLoadMore}
                                    className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-300 font-medium"
                                >
                                    Load More
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
