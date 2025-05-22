"use client"
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

interface VideoItem {
    _id: string;
    title: string;
    videoUrl: string;
    createdAt: string;
}

const getData = async (): Promise<VideoItem[]> => {
    const res = await axiosInstance.get("/video")
    return res.data
}

export default function Video() {
    const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
    const [visibleVideos, setVisibleVideos] = useState(6); // Increased initial visible count
    const [loadedVideos, setLoadedVideos] = useState<Set<string>>(new Set());

    const { isPending, isError, data: videos } = useQuery<VideoItem[]>({
        queryKey: ['videos'],
        queryFn: getData,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: false
    });

    const handleVideoLoad = (id: string) => {
        setLoadedVideos(prev => new Set(prev).add(id));
    };

    const loadMore = () => {
        setVisibleVideos(prev => prev + 6);
    };

    if (isPending) {
        return (
            <section className="py-12 bg-gray-900 min-h-screen">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="py-12 bg-gray-900 min-h-screen">
                <div className="container mx-auto px-6">
                    <div className="text-red-500 text-center">
                        An error occurred while fetching videos
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-gradient-to-b from-gray-900 to-black min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Video Collection
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Explore our curated collection of professional video productions
                    </p>
                </div>

                {selectedVideo && (
                    <div 
                        className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <div 
                            className="bg-gray-800/80 backdrop-blur-sm rounded-2xl relative max-w-[90%] max-h-[90vh] w-[1200px] overflow-hidden border-2 border-gray-700/50 shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300"
                            onClick={e => e.stopPropagation()}
                        >
                            <button 
                                className="absolute top-4 right-4 z-10 bg-black/50 rounded-full p-2 text-white hover:bg-black/70 transition-all duration-300"
                                onClick={() => setSelectedVideo(null)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="relative aspect-video">
                                <video 
                                    controls 
                                    className="w-full h-full"
                                    src={selectedVideo.videoUrl}
                                    autoPlay
                                    playsInline
                                />
                            </div>

                            <div className="p-6 bg-gray-800/80 backdrop-blur-sm">
                                <h2 className="text-2xl font-bold text-white mb-2">{selectedVideo.title}</h2>
                                <p className="text-gray-400 text-sm">
                                    {new Date(selectedVideo.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos?.slice(0, visibleVideos).map((video) => (
                        <div 
                            key={video._id} 
                            className="group bg-gray-800/30 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer border-2 border-gray-700/30 hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] relative before:absolute before:inset-0 before:border-2 before:border-transparent before:rounded-2xl before:transition-all before:duration-500 hover:before:scale-105 hover:before:border-blue-500/20"
                            onClick={() => setSelectedVideo(video)}
                        >
                            <div className="relative aspect-video">
                                <div className={`absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 animate-pulse ${
                                    loadedVideos.has(video._id) ? 'hidden' : 'block'
                                }`} />
                                <video 
                                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                                        loadedVideos.has(video._id) ? 'opacity-100' : 'opacity-0'
                                    }`}
                                    src={video.videoUrl}
                                    preload="metadata"
                                    onLoadedData={() => handleVideoLoad(video._id)}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <div className="bg-black/60 p-4 rounded-full backdrop-blur-sm transform scale-75 group-hover:scale-100 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                    {video.title}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    {new Date(video.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {videos && visibleVideos < videos.length && (
                    <div className="flex justify-center mt-12">
                        <button
                            onClick={loadMore}
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20 font-semibold flex items-center gap-2 border-2 border-blue-500/30 hover:border-blue-400/50"
                        >
                            <span>Load More</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
