'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import UploadWidget from './upload';
import toast from 'react-hot-toast';

const reelFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  videoUrl: z.string().min(1, 'Video is required'),
  public_id: z.string().min(1, 'Public ID is required'),
});

type ReelFormData = z.infer<typeof reelFormSchema>;

type Reel = {
  _id: string;
  title: string;
  videoUrl: string;
  public_id: string;
  createdAt: string;
};

function ReelList() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReels = async () => {
    try {
      const response = await fetch('/api/reel');
      if (!response.ok) {
        throw new Error('Failed to fetch reels');
      }
      const data = await response.json();
      setReels(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, public_id: string) => {
    if (!confirm('Are you sure you want to delete this reel?')) {
      return;
    }

    const toastId = toast.loading('Deleting reel...');

    try {
      const response = await fetch(`/api/reel?id=${id}&public_id=${public_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete reel');
      }

      setReels(prev => prev.filter(r => r._id !== id));
      toast.success('Reel deleted successfully', {
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
    fetchReels();
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

  if (reels.length === 0) {
    return (
      <div className="mt-8 p-4 bg-gray-500/20 rounded-md">
        <p className="text-gray-400 text-center">No reels uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-white mb-4">Uploaded Reels</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reels.map((reel) => (
          <div
            key={reel._id}
            className="bg-[#252525] rounded-lg border border-[#333333] overflow-hidden hover:border-blue-500 transition-colors"
          >
            <div className="aspect-video relative">
              <video
                src={reel.videoUrl}
                className="w-full h-full object-cover"
                controls
              />
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => handleDelete(reel._id, reel.public_id)}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  title="Delete reel"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4">
              <h4 className="text-lg font-medium text-white mb-2">{reel.title}</h4>
              <p className="text-gray-500 text-xs">
                {new Date(reel.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Reel() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<ReelFormData>>({
    title: '',
    videoUrl: '',
    public_id: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ReelFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ReelFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      videoUrl: '',
      public_id: '',
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = reelFormSchema.safeParse(formData);
      
      if (!result.success) {
        const formattedErrors: Partial<Record<keyof ReelFormData, string>> = {};
        result.error.errors.forEach((error) => {
          const path = error.path[0] as keyof ReelFormData;
          formattedErrors[path] = error.message;
        });
        setErrors(formattedErrors);
        return;
      }

            const response = await fetch('/api/reel', {
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
      resetForm();
      router.refresh();
      
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadSuccess = (result: any) => {
        // Validate required fields
    if (!result.secure_url || !result.public_id) {
      const errorMessage = 'Upload response missing required fields';
      console.error(errorMessage, result);
      toast.error(errorMessage);
      setErrors(prev => ({
        ...prev,
        videoUrl: errorMessage
      }));
      setFormData(prev => ({ ...prev, videoUrl: '', public_id: '' }));
      return;
    }

    setFormData(prev => {
      const newFormData = {
        ...prev,
        videoUrl: result.secure_url,
        public_id: result.public_id
      };
            return newFormData;
    });

    if (errors.videoUrl) {
      setErrors(prev => ({ ...prev, videoUrl: undefined }));
    }
  };

  const handleUploadError = (error: any) => {
    const errorMessage = error?.message || error?.error?.message || 'An unexpected upload error occurred';
    toast.error(errorMessage);
    setErrors(prev => ({
      ...prev,
      videoUrl: errorMessage
    }));
    setFormData(prev => ({ ...prev, videoUrl: '', public_id: '' }));
  };

  return (
    <div className="space-y-8">
      <div className="max-w-2xl mx-auto p-6 bg-[#252525] rounded-lg border border-[#333333]">
        <h2 className="text-2xl font-semibold text-white mb-6">
          Upload New Reel
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 bg-[#333333] border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.title ? 'border-red-500' : 'border-[#444444]'
              }`}
              placeholder="Enter reel title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Video
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-[#444444] hover:border-blue-500 transition-colors">
              <div className="space-y-1 text-center">
                {formData.videoUrl ? (
                  <div className="relative w-full">
                    <video
                      src={formData.videoUrl}
                      controls
                      className="w-full rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, videoUrl: '', public_id: '' }));
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
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
                    <UploadWidget 
                      onUploadSuccess={handleUploadSuccess}
                      onUploadError={handleUploadError}
                      resourceType="video"
                    />
                    <p className="text-xs text-gray-400">
                      MP4, MOV up to 100MB
                    </p>
                  </div>
                )}
              </div>
            </div>
            {errors.videoUrl && (
              <p className="mt-1 text-sm text-red-500">{errors.videoUrl}</p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                'Save Reel'
              )}
            </button>
          </div>
        </form>
      </div>

      <ReelList />
    </div>
  );
}
