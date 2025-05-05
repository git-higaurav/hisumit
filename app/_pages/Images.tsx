"use client"

import Image from 'next/image'
import { useState, useEffect } from 'react'

interface Project {
    id: number
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
}

const ImageModal = ({ isOpen, onClose, project, projects, onNavigate }: ModalProps) => {
    if (!isOpen || !project) return null

    const currentIndex = projects.findIndex(p => p.id === project.id)
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-dark-darker/95 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div 
                className="relative w-[90vw] h-[90vh] max-w-7xl animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-white hover:text-accent-light transition-all duration-300 ease-in-out transform hover:scale-110 z-10"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Navigation Arrows */}
                {hasPrev && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onNavigate('prev')
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-dark-lighter/80 hover:bg-accent text-white p-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 z-10 animate-fadeIn"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-dark-lighter/80 hover:bg-accent text-white p-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 z-10 animate-fadeIn"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                )}

                <div className="relative w-full h-full">
                    <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        sizes="90vw"
                        className="object-contain transition-all duration-500 ease-in-out animate-fadeIn"
                        priority
                        quality={100}
                    />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-darker via-dark-lighter/50 to-transparent p-6 animate-slideUp">
                    <h3 className="text-2xl font-semibold text-white mb-2">{project.title}</h3>
                    <p className="text-base text-gray-200">{project.description}</p>
                </div>
            </div>
        </div>
    )
}

export default function Images() {
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/graphic')
                if (!response.ok) {
                    throw new Error('Failed to fetch projects')
                }
                const data = await response.json()
                setProjects(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setIsLoading(false)
            }
        }

        fetchProjects()
    }, [])

    const handleImageLoad = (id: number) => {
        setLoadedImages(prev => new Set(prev).add(id))
    }

    const handleNavigate = (direction: 'prev' | 'next') => {
        if (!selectedProject) return

        const currentIndex = projects.findIndex(p => p.id === selectedProject.id)
        if (direction === 'prev' && currentIndex > 0) {
            setSelectedProject(projects[currentIndex - 1])
        } else if (direction === 'next' && currentIndex < projects.length - 1) {
            setSelectedProject(projects[currentIndex + 1])
        }
    }

    if (isLoading) {
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

    if (error) {
        return (
            <section className="py-12 bg-gray-900 border-t-1 border-gray-700 border-b-0 border-l-0 border-r-0 min-h-screen">
                <div className="container mx-auto px-6">
                    <div className="text-red-500 text-center">
                        Error: {error}
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-12 bg-gray-900 border-t-1 border-gray-700 border-b-0 border-l-0 border-r-0 min-h-screen">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold mb-8 text-white">Graphic Collection</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project , index) => (
                        <div 
                            key={index} 
                            className="group relative bg-dark-lighter rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl cursor-pointer transform hover:-translate-y-1 hover:shadow-accent/20"
                            onClick={() => setSelectedProject(project)}
                        >
                            <div className="relative aspect-[4/3] w-full">
                                <div className={`absolute inset-0 bg-dark animate-pulse ${loadedImages.has(project.id) ? 'hidden' : 'block'}`} />
                                <Image
                                    src={project.imageUrl}
                                    alt={project.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className={`object-cover transition-all duration-500 ease-in-out group-hover:scale-105 ${
                                        loadedImages.has(project.id) ? 'opacity-100' : 'opacity-0'
                                    }`}
                                    onLoad={() => handleImageLoad(project.id)}
                                    priority={project.id <= 3}
                                />
                            </div>
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-in-out">
                                    <div className="absolute inset-0 bg-black/50 rounded-b-xl"></div>
                                    <div className="relative">
                                        <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
                                        <p className="text-xs text-gray-200">{project.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <ImageModal 
                isOpen={!!selectedProject} 
                onClose={() => setSelectedProject(null)} 
                project={selectedProject}
                projects={projects}
                onNavigate={handleNavigate}
            />
        </section>
    )
}
