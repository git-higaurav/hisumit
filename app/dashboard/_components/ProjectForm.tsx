'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  link: string;
  image: File | null;
}

export default function ProjectForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    category: '',
    link: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.image) {
        throw new Error('Please select an image');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('file', formData.image);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('link', formData.link);

      const response = await fetch('/api/projects', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to save project');
      }

      // Reset form and refresh the page
      setFormData({
        title: '',
        description: '',
        category: '',
        link: '',
        image: null,
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#252525] p-6 rounded-lg border border-[#333333]">
      <h3 className="text-xl font-semibold text-white mb-4">Add New Project</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 bg-[#333333] border border-[#444444] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={3}
            className="w-full px-4 py-2 bg-[#333333] border border-[#444444] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 bg-[#333333] border border-[#444444] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            <option value="Branding">Branding</option>
            <option value="Motion">Motion</option>
            <option value="Social Media">Social Media</option>
            <option value="UI/UX">UI/UX</option>
            <option value="Design">Design</option>
            <option value="Video">Video</option>
          </select>
        </div>

        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-300 mb-1">
            Project Link
          </label>
          <input
            type="url"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 bg-[#333333] border border-[#444444] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-1">
            Project Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="w-full px-4 py-2 bg-[#333333] border border-[#444444] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Add Project'}
        </button>
      </form>
    </div>
  );
} 