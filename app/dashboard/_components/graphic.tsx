'use client';

import { useState, useEffect, useRef } from 'react';
import { imageFormSchema, type ImageFormData } from '@/lib/validation/image';
import { useRouter } from 'next/navigation';
import UploadWidget from './upload';
import toast from 'react-hot-toast';


interface GraphicItem {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    createdAt: string;
    public_id: string;
}

function GraphicList() {
    const [graphics, setGraphics] = useState<GraphicItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    
    const fetchGraphics = async () => {
        try {
            const response = await fetch('/api/graphic');
            if (!response.ok) {
                throw new Error('Failed to fetch graphics');
            }
            const data = await response.json();
            setGraphics(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string , public_id: string) => {
        if (!confirm('Are you sure you want to delete this graphic?')) {
            return;
        }

        const toastId = toast.loading('Deleting graphic...');

        try {
            const response = await fetch(`/api/graphic?id=${id}&public_id=${public_id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete graphic');
            }

            // Remove the deleted graphic from the state
            setGraphics(prev => prev.filter(g => g._id !== id));
            toast.success('Graphic deleted successfully', {
                id: toastId,
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while deleting';
            toast.error(errorMessage, {
                id: toastId,
            });
        }
    };

    useEffect(() => {
        fetchGraphics();
    }, []);

    if (loading) {
        return (
            <div className="mt-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-8 p-4 bg-red-500/20 border border-red-500/50 rounded-md">
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    if (graphics.length === 0) {
        return (
            <div className="mt-8 p-4 bg-gray-500/20  rounded-md">
                <p className="text-gray-400 text-center">No graphics uploaded yet</p>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold text-white mb-4">Uploaded Graphics</h3>
            <div className="grid grid-cols-1 gap-6">
                {graphics.map((graphic) => (
                    <div
                        key={graphic._id}
                        className="bg-[#333333] rounded-lg overflow-hidden border border-[#444444] hover:border-blue-500 transition-colors"
                    >
                        <div className="flex flex-col md:flex-row">
                            {/* Image Section */}
                            <div className="relative w-full md:w-1/2 h-64 md:h-auto">
                                <img
                                    src={graphic.imageUrl}
                                    alt={graphic.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button
                                        onClick={() => handleDelete(graphic._id, graphic.public_id)}
                                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                        title="Delete graphic"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Information Section */}
                            <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
                                <div>
                                    <h4 className="text-xl font-medium text-white mb-3">{graphic.title}</h4>
                                    <p className="text-gray-400 mb-4">{graphic.description}</p>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>Uploaded on {new Date(graphic.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Graphic() {
    const [formData, setFormData] = useState<Partial<ImageFormData>>({
        title: '',
        description: '',
        imageUrl: '',
        public_id: '',
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<Partial<Record<keyof ImageFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [graphics, setGraphics] = useState<GraphicItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollPositionRef = useRef<number>(0);

    // Save scroll position before unmounting
    useEffect(() => {
        return () => {
            if (containerRef.current) {
                scrollPositionRef.current = containerRef.current.scrollTop;
            }
        };
    }, []);

    // Restore scroll position after mounting
    useEffect(() => {
        if (containerRef.current && scrollPositionRef.current > 0) {
            containerRef.current.scrollTop = scrollPositionRef.current;
        }
    }, [graphics]); // Re-run when graphics update

    const fetchGraphics = async () => {
        try {
            const response = await fetch('/api/graphic');
            if (!response.ok) {
                throw new Error('Failed to fetch graphics');
            }
            const data = await response.json();
            setGraphics(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, public_id: string) => {
        if (!confirm('Are you sure you want to delete this graphic?')) {
            return;
        }

        const toastId = toast.loading('Deleting graphic...');

        try {
            const response = await fetch(`/api/graphic?id=${id}&public_id=${public_id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete graphic');
            }

            setGraphics(prev => prev.filter(g => g._id !== id));
            toast.success('Graphic deleted successfully', {
                id: toastId,
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while deleting';
            toast.error(errorMessage, {
                id: toastId,
            });
        }
    };

    useEffect(() => {
        fetchGraphics();
    }, []);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    useEffect(() => {
        if (submitError) {
            const timer = setTimeout(() => {
                setSubmitError(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [submitError]);

    useEffect(() => {
        if (uploadError) {
            const timer = setTimeout(() => {
                setUploadError(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [uploadError]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof ImageFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            if (errors.imageUrl) {
                setErrors(prev => ({ ...prev, imageUrl: undefined }));
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            imageUrl: '',
            public_id: '',
        });
        setImagePreview(null);
        setErrors({});
        setSuccessMessage(null);
        setSubmitError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            const result = imageFormSchema.safeParse(formData);
            
            if (!result.success) {
               
                const formattedErrors: Partial<Record<keyof ImageFormData, string>> = {};
                result.error.errors.forEach((error) => {
                    const path = error.path[0] as keyof ImageFormData;
                    formattedErrors[path] = error.message;
                });
                setErrors(formattedErrors);
                return;
            }

            const response = await fetch('/api/graphic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(result.data),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || data.error || response.statusText);
            }

            toast.success(data.message);
            
            setTimeout(() => {
                resetForm();
            }, 2000);
            
        } catch (error) {
            console.error('Form submission error:', error);
            toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUploadSuccess = (result: any) => {
        setUploadError(null);
        setFormData(prev => {
            const newFormData = {
                ...prev,
                imageUrl: result.secure_url,
                public_id: result.public_id
            };
                        return newFormData;
        });
        setImagePreview(result.secure_url);
        if (errors.imageUrl) {
            setErrors(prev => ({ ...prev, imageUrl: undefined }));
        }
    };

    const handleUploadError = (error: any) => {
        const errorMessage = error?.message || error?.error?.message || 'An unexpected upload error occurred';
                toast.error(errorMessage);
        setErrors(prev => ({
            ...prev,
            imageUrl: errorMessage
        }));
        setFormData(prev => ({ ...prev, imageUrl: '' }));
        setImagePreview(null);
    };

    return (
        <>
            <div className="max-w-4xl mx-auto" ref={containerRef}>
                {/* Upload Form Section */}
                <div className="bg-gradient-to-br from-[#252525] to-[#1a1a1a] p-8 rounded-2xl border border-[#333333] shadow-xl mb-8">
                    <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6">
                        Upload New Image
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title Input */}
                        <div className="space-y-2">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 bg-[#333333]/50 backdrop-blur-sm border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                                    errors.title ? 'border-red-500' : 'border-[#444444]'
                                }`}
                                placeholder="Enter image title"
                            />
                            {errors.title && (
                                <p className="text-sm text-red-400">{errors.title}</p>
                            )}
                        </div>

                        {/* Description Input */}
                        <div className="space-y-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className={`w-full px-4 py-3 bg-[#333333]/50 backdrop-blur-sm border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                                    errors.description ? 'border-red-500' : 'border-[#444444]'
                                }`}
                                placeholder="Enter image description"
                            />
                            {errors.description && (
                                <p className="text-sm text-red-400">{errors.description}</p>
                            )}
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">
                                Image
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg border-[#444444] hover:border-blue-500/50 transition-all duration-300 bg-[#333333]/30 backdrop-blur-sm">
                                <div className="space-y-4 text-center">
                                    {imagePreview ? (
                                        <div className="relative w-full h-48 mb-4 group">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-contain rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImagePreview(null);
                                                    setFormData(prev => ({ ...prev, imageUrl: undefined }));
                                                }}
                                                className="absolute top-2 right-2 p-2 bg-red-500/90 text-white rounded-full hover:bg-red-600 transition-all duration-300 opacity-0 group-hover:opacity-100"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="mx-auto w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                                <svg
                                                    className="w-6 h-6 text-blue-500"
                                                    stroke="currentColor"
                                                    fill="none"
                                                    viewBox="0 0 48 48"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </div>
                                            <UploadWidget 
                                                onUploadSuccess={handleUploadSuccess}
                                                onUploadError={handleUploadError}
                                            />
                                            <p className="text-sm text-gray-400">
                                                PNG, JPG, WEBP up to 5MB
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {errors.imageUrl && (
                                <p className="text-sm text-red-400">{errors.imageUrl}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-blue-500/20"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    'Save Graphic'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Graphics List Section */}
                <div className="bg-gradient-to-br from-[#252525] to-[#1a1a1a] p-8 rounded-2xl border border-[#333333] shadow-xl">
                    <h3 className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6">
                        Uploaded Graphics
                    </h3>
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-md">
                            <p className="text-red-400">{error}</p>
                        </div>
                    ) : graphics.length === 0 ? (
                        <div className="p-4 bg-gray-500/20 rounded-md">
                            <p className="text-gray-400 text-center">No graphics uploaded yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {graphics.map((graphic) => (
                                <div
                                    key={graphic._id}
                                    className="bg-[#333333]/50 backdrop-blur-sm rounded-xl overflow-hidden border border-[#444444] hover:border-blue-500/50 transition-all duration-300 group"
                                >
                                    <div className="flex flex-col md:flex-row">
                                        {/* Image Section */}
                                        <div className="relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
                                            <img
                                                src={graphic.imageUrl}
                                                alt={graphic.title}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <button
                                                    onClick={() => handleDelete(graphic._id, graphic.public_id)}
                                                    className="p-2 bg-red-500/90 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-lg"
                                                    title="Delete graphic"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* Information Section */}
                                        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
                                            <div>
                                                <h4 className="text-xl font-medium text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
                                                    {graphic.title}
                                                </h4>
                                                <p className="text-gray-400 mb-4 line-clamp-3">{graphic.description}</p>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">
                                                    Uploaded on {new Date(graphic.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
