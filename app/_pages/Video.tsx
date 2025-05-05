"use client"
import { useState, useEffect } from 'react';

interface VideoItem {
    _id: string;
    title: string;
    videoUrl: string;
}

export default function Video() {
    const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
    const [visibleVideos, setVisibleVideos] = useState(3);
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch('/api/video');
                if (!response.ok) {
                    throw new Error('Failed to fetch videos');
                }
                const data = await response.json();
                setVideos(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred while fetching videos');
            } finally {
                setIsLoading(false);
            }
        };

        fetchVideos();
    }, []);

    const loadMore = () => {
        setVisibleVideos(prev => prev + 3);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen py-6 bg-gray-900 flex items-center justify-center">
                <div className="text-gray-100 text-xl">Loading videos...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen py-6 bg-gray-900 flex items-center justify-center">
                <div className="text-red-500 text-xl">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-6 bg-gray-900 border border-gray-700 border-t-0 border-l-0 border-r-0">
            {/* Header Section */}
            <div className="bg-gray-900 text-gray-100 px-6 gray-700">
                <div className="max-w-7xl mx-auto py-8">
                    <h1 className="text-3xl font-bold">Video Production Work</h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto bg-gray-900">
                {selectedVideo && (
                    <div 
                        className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <div 
                            className="bg-gray-800 rounded-xl relative max-w-[90%] max-h-[90vh] w-[1000px] overflow-hidden border border-gray-700"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button 
                                className="absolute top-4 right-4 z-10 bg-gray-700/50 rounded-full p-2 text-gray-100 hover:bg-gray-600 transition-colors"
                                onClick={() => setSelectedVideo(null)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Video Player */}
                            <div className="relative aspect-video">
                                <video 
                                    controls 
                                    className="w-full h-full"
                                    src={selectedVideo.videoUrl}
                                    autoPlay
                                />
                            </div>

                            {/* Video Info */}
                            <div className="p-4 bg-gray-800 text-gray-100">
                                <h2 className="text-xl font-bold">{selectedVideo.title}</h2>
                            </div>
                        </div>
                    </div>
                )}

                {videos.length === 0 ? (
                    <div className="text-center text-gray-100 py-12">
                        No videos available
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-3">
                            {videos.slice(0, visibleVideos).map((video) => (
                                <div 
                                    key={video._id} 
                                    className="group bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-700"
                                    onClick={() => setSelectedVideo(video)}
                                >
                                    <div className="relative aspect-video">
                                        <video 
                                            className="w-full h-full object-cover"
                                            src={video.videoUrl}
                                            preload="metadata"
                                        />
                                        {/* Play Button Overlay */}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-gray-700/90 rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-100">{video.title}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {visibleVideos < videos.length && (
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={loadMore}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2"
                                >
                                    <span>Load More</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
