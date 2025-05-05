'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite';
import { RiUser3Line, RiServiceLine, RiProjectorLine, RiMessage2Line, RiMenuLine, RiCloseLine, RiImageLine, RiVideoLine } from 'react-icons/ri';
import ProjectForm from './_components/ProjectForm';
import Graphic from './_components/graphic';
import Reel from './_components/reel';
import Video from './_components/video';

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
    { id: 'graphic', label: 'Graphic', icon: RiImageLine },
    { id: 'reel', label: 'Reel', icon: RiVideoLine },
    { id: 'video', label: 'Video', icon: RiVideoLine },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-[#1A1A1A]/50 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-xl">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6">Profile Information</h2>
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-gray-400 text-sm">Name</p>
                <p className="text-white text-lg font-medium">{user?.name || 'User'}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white text-lg font-medium">{user?.email}</p>
              </div>
            </div>
          </div>
        );
      case 'services':
        return (
          <div className="bg-[#1A1A1A]/50 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-xl">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6">Available Services</h2>
            <p className="text-gray-400">No services available yet.</p>
          </div>
        );
      case 'projects':
        return (
          <div className="bg-[#1A1A1A]/50 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-xl">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6">Your Projects</h2>
            <ProjectForm />
            {projects.length === 0 ? (
              <p className="text-gray-400 mt-6">No projects found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {projects.map((project) => (
                  <div key={project._id} className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="aspect-[4/3] relative">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-white text-xl font-medium mb-2">{project.title}</h3>
                      <p className="text-gray-400 mb-4">{project.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">{formatDate(project.createdAt)}</span>
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-300"
                        >
                          View Project
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'messages':
        return (
          <div className="bg-[#1A1A1A]/50 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-xl">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6">Messages</h2>
            {messagesLoading ? (
              <div className="text-gray-400">Loading messages...</div>
            ) : messages.length === 0 ? (
              <p className="text-gray-400">No messages yet.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message._id} className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-white text-lg font-medium">{message.name}</p>
                        <p className="text-gray-400">{message.email}</p>
                      </div>
                      <span className="text-gray-500 text-sm">{formatDate(message.createdAt)}</span>
                    </div>
                    <p className="text-gray-300">{message.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'graphic':
        return (
          <div className="p-8 rounded-2xl  shadow-xl scrollbar-y-auto">
            {/* <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6">Graphic Management</h2> */}
            <Graphic />
          </div>
        );
      case 'reel':
        return (
          <div className="bg-[#1A1A1A]/50 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-xl">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6">Reel Management</h2>
            <Reel />
          </div>
        );
      case 'video':
        return (
          <div className="bg-[#1A1A1A]/50 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-xl">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6">Video Management</h2>
            <Video />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] flex">
      {/* Sidebar for large screens */}
      <div className="hidden lg:block w-72 bg-[#1A1A1A]/50 backdrop-blur-lg p-8 min-h-screen border-r border-white/10">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-10">Dashboard</h2>
        <nav className="space-y-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-white/10 shadow-lg shadow-blue-500/10'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon className="text-xl" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[#1A1A1A]/50 backdrop-blur-lg p-6 flex items-center justify-between border-b border-white/10 ml-4 mr-4 mt-4 rounded-xl">
          <button
            onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
            className="text-white text-2xl lg:hidden hover:bg-white/5 p-2 rounded-lg transition-colors"
          >
            <RiMenuLine />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Welcome Back</h1>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-2 text-sm rounded-lg hover:from-red-500 hover:to-red-400 transition-all duration-300 shadow-lg shadow-red-500/20"
          >
            Logout
          </button>
        </header>

        {/* Mobile Drawer Overlay */}
        {isMobileDrawerOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
        )}

        {/* Mobile Drawer */}
        <div
          className={`fixed top-0 left-0 h-full w-72 bg-[#1A1A1A]/95 backdrop-blur-lg p-8 transform transition-all duration-300 ease-in-out z-50 lg:hidden ${
            isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Dashboard</h2>
            <button
              onClick={() => setIsMobileDrawerOpen(false)}
              className="text-white text-2xl hover:bg-white/5 p-2 rounded-lg transition-colors"
            >
              <RiCloseLine />
            </button>
          </div>
          
          <nav className="space-y-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileDrawerOpen(false);
                }}
                className={`w-full flex items-center space-x-4 px-6 py-4 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-white/10 shadow-lg shadow-blue-500/10'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <tab.icon className="text-xl" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <main className="p-8">
          <div className="max-w-5xl mx-auto">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}