"use client"

import axiosInstance from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useState, useEffect } from 'react'

interface Project {
    _id: number
    id?: number // Added to match data structure
    title: string
    description: string
    imageUrl: string
}

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    project: Project | null
    projects: Project[]
    onNavigate: (direction: 'prev' | 'next') => void
    static?: boolean // Added static prop definition
}

const ImageModal = ({ isOpen, onClose, project, projects, onNavigate, static: isStatic }: ModalProps) => {
    if (!isOpen || !project) return null

    const currentIndex = projects.findIndex(p => p._id === project._id)
    const hasPrev = currentIndex > 0
    const hasNext = currentIndex < projects.length - 1

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' && hasPrev) {
                onNavigate('prev')
            } else if (e.key === 'ArrowRight' && hasNext) {
                onNavigate('next')
            } else if (e.key === 'Escape') {
                onClose()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [hasPrev, hasNext, onNavigate, onClose])

    return (
        <div 
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md ${isStatic ? '' : 'animate-fadeIn'}`}
            onClick={onClose}
        >
            <div 
                className={`relative w-[95vw] h-[95vh] max-w-8xl ${isStatic ? '' : 'animate-scaleIn'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute -top-4 right-0 text-white/80 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-110 z-10 bg-black/50 rounded-full p-2"
                    aria-label="Close modal"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="relative w-full h-full">
                    <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        sizes="95vw"
                        className="object-contain transition-opacity duration-500 ease-in-out animate-fadeIn"
                        priority
                        quality={100}
                    />
                </div>

                {/* Navigation Arrows - Moved below the image */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 md:hidden">
                    {hasPrev && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onNavigate('prev')
                            }}
                            className="bg-black/50 hover:bg-black/70 text-white/80 hover:text-white p-3 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 z-10 backdrop-blur-sm"
                            aria-label="Previous image"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                    {hasNext && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onNavigate('next')
                            }}
                            className="bg-black/50 hover:bg-black/70 text-white/80 hover:text-white p-3 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 z-10 backdrop-blur-sm"
                            aria-label="Next image"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Desktop Navigation Arrows */}
                <div className="hidden md:block">
                    {hasPrev && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onNavigate('prev')
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white/80 hover:text-white p-3 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 z-10 backdrop-blur-sm"
                            aria-label="Previous image"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                    {hasNext && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onNavigate('next')
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white/80 hover:text-white p-3 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 z-10 backdrop-blur-sm"
                            aria-label="Next image"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

const getData = async (): Promise<Project[]> => {
    const res = await axiosInstance.get("/graphic")
    return res.data
}

export default function Images() {
    const { isPending, isError, data } = useQuery<Project[]>({
        queryKey: ['images'],
        queryFn: getData,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: false
    })

    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [visibleCount, setVisibleCount] = useState(6) // Number of initially visible images

    const handleImageLoad = (id: number) => {
        setLoadedImages(prev => new Set(prev).add(id))
    }

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 6) // Load 6 more images when clicked
    }

    const handleNavigate = (direction: 'prev' | 'next') => {
        if (!selectedProject || !data) return

        const currentIndex = data.findIndex(p => p._id === selectedProject._id)
        if (direction === 'prev' && currentIndex > 0) {
            setSelectedProject(data[currentIndex - 1])
        } else if (direction === 'next' && currentIndex < data.length - 1) {
            setSelectedProject(data[currentIndex + 1])
        }
    }

    if (isPending) {
        return (
            <section className="py-12 bg-gray-900 border-t-1 border-gray-700 border-b-0 border-l-0 border-r-0 min-h-screen">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
                    </div>
                </div>
            </section>
        )
    }

    if (isError) {
        return (
            <section className="py-12 bg-gray-900 border-t-1 border-gray-700 border-b-0 border-l-0 border-r-0 min-h-screen">
                <div className="container mx-auto px-6">
                    <div className="text-red-500 text-center">
                        An error occurred while fetching the data
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16 bg-gradient-to-b from-gray-900 to-dark-darker min-h-screen border-y-1">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Graphic Collection
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Explore our curated collection of stunning visuals and creative designs
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data?.slice(0, visibleCount).map((project: Project) => (
                        <div 
                            key={project._id} 
                            className="group bg-dark-lighter rounded-2xl shadow-xl overflow-hidden transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-accent/20 border-2 border-dark-darker hover:border-accent/30 cursor-pointer"
                            onClick={() => setSelectedProject(project)}
                        >
                            {/* Image Container */}
                            <div 
                                className="relative aspect-[4/3] w-full overflow-hidden"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br from-dark to-dark-lighter animate-pulse ${
                                    loadedImages.has(project._id) ? 'hidden' : 'block'
                                }`} />
                                <Image
                                    src={project.imageUrl}
                                    alt={project.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                                        loadedImages.has(project._id) ? 'opacity-100' : 'opacity-0'
                                    }`}
                                    onLoad={() => handleImageLoad(project._id)}
                                    priority={project._id <= 3}
                                />
                            </div>
                            
                            {/* Text Container */}
                            <div className="p-6 border-t border-dark-darker">
                                <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                                <p className="text-gray-300 text-sm line-clamp-2">{project.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                {data && visibleCount < data.length && (
                    <div className="flex justify-center mt-12">
                        <button
                            onClick={handleLoadMore}
                            className="px-8 py-4 bg-accent hover:bg-accent-light text-white rounded-xl transition-all duration-300 ease-out transform hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/20 font-semibold"
                        >
                            Load More Projects
                        </button>
                    </div>
                )}
            </div>

            <ImageModal 
                isOpen={!!selectedProject} 
                onClose={() => setSelectedProject(null)} 
                project={selectedProject}
                projects={data || []}
                onNavigate={handleNavigate}
                static
            />
        </section>
    )
}
