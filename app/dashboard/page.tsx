'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite';
import { RiUser3Line, RiServiceLine, RiProjectorLine, RiMessage2Line, RiMenuLine, RiCloseLine } from 'react-icons/ri';
import ProjectForm from './_components/ProjectForm';

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  link: string;
  imageUrl: string;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await account.get();
        setUser(user);
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (activeTab === 'messages') {
        setMessagesLoading(true);
        try {
          const response = await fetch('/api/messages');
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        } finally {
          setMessagesLoading(false);
        }
      }
    };

    fetchMessages();
  }, [activeTab]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (activeTab === 'projects') {
        try {
          const response = await fetch('/api/projects');
          const data = await response.json();
          setProjects(data);
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
      }
    };

    fetchProjects();
  }, [activeTab]);

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: RiUser3Line },
    { id: 'services', label: 'Services', icon: RiServiceLine },
    { id: 'projects', label: 'Projects', icon: RiProjectorLine },
    { id: 'messages', label: 'Messages', icon: RiMessage2Line },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#333333]">
            <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
            <p className="text-gray-300 mb-2">Name: {user?.name || 'User'}</p>
            <p className="text-gray-300">Email: {user?.email}</p>
          </div>
        );
      case 'services':
        return (
          <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#333333]">
            <h2 className="text-xl font-semibold text-white mb-4">Available Services</h2>
            <p className="text-gray-300">No services available yet.</p>
          </div>
        );
      case 'projects':
        return (
          <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#333333]">
            <h2 className="text-xl font-semibold text-white mb-4">Your Projects</h2>
            <ProjectForm />
            {projects.length === 0 ? (
              <p className="text-gray-300 mt-6">No projects found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {projects.map((project) => (
                  <div key={project._id} className="bg-[#252525] p-4 rounded-lg border border-[#333333]">
                    <div className="aspect-[4/3] relative mb-4">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="text-white font-medium">{project.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{project.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-gray-500 text-sm">{formatDate(project.createdAt)}</span>
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">View Project</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'messages':
        return (
          <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#333333]">
            <h2 className="text-xl font-semibold text-white mb-4">Messages</h2>
            {messagesLoading ? (
              <div className="text-gray-300">Loading messages...</div>
            ) : messages.length === 0 ? (
              <p className="text-gray-300">No messages yet.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message._id} className="bg-[#252525] p-4 rounded-lg border border-[#333333]">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white font-medium">{message.name}</p>
                        <p className="text-gray-400 text-sm">{message.email}</p>
                      </div>
                      <span className="text-gray-500 text-sm">{formatDate(message.createdAt)}</span>
                    </div>
                    <p className="text-gray-300 mt-2">{message.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* Sidebar for large screens */}
      <div className="hidden lg:block w-64 bg-[#1A1A1A] p-6 min-h-screen">
        <h2 className="text-xl font-bold text-white mb-8">Menu</h2>
        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#333333] text-white'
                  : 'text-gray-400 hover:bg-[#252525] hover:text-white'
              }`}
            >
              <tab.icon className="text-xl" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1">
        {/* Header */}
        <header className="bg-[#1A1A1A] p-4 flex items-center justify-between">
          <button
            onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
            className="text-white text-2xl lg:hidden"
          >
            <RiMenuLine />
          </button>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-3 py-1 text-sm rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </header>

        {/* Mobile Drawer Overlay */}
        {isMobileDrawerOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
        )}

        {/* Mobile Drawer */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-[#1A1A1A] p-6 transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
            isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white">Menu</h2>
            <button
              onClick={() => setIsMobileDrawerOpen(false)}
              className="text-white text-2xl"
            >
              <RiCloseLine />
            </button>
          </div>
          
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileDrawerOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#333333] text-white'
                    : 'text-gray-400 hover:bg-[#252525] hover:text-white'
                }`}
              >
                <tab.icon className="text-xl" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}