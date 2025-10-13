import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, PlusCircle, Edit, CheckCircle, XCircle, AlertCircle, FileText, Image } from 'lucide-react';

const EditBlogs = () => {
    const [activeTab, setActiveTab] = useState('add');
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [showMessage, setShowMessage] = useState(false);
    const navigate = useNavigate();

    const [selectedBlogId, setSelectedBlogId] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: '',
        fullContent: ''
    });

    const showNotification = (msg, type = 'success') => {
        setMessage(msg);
        setMessageType(type);
        setShowMessage(true);
    };

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/blogs');
            const data = await response.json();
            setBlogs(data);
        } catch (error) {
            showNotification('Failed to load blogs.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    // Auto-hide message after 4 seconds
    useEffect(() => {
        if (showMessage) {
            const timer = setTimeout(() => {
                setShowMessage(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [showMessage]);

    useEffect(() => {
        setSelectedBlogId('');
        setFormData({ title: '', content: '', image: '', fullContent: '' });
    }, [activeTab]);

    useEffect(() => {
        if (selectedBlogId) {
            const fetchFullBlog = async () => {
                const selectedBlogStub = blogs.find(b => b._id === selectedBlogId);
                if(selectedBlogStub) {
                    try {
                        const response = await fetch(`http://localhost:5000/api/blogs/${selectedBlogStub.slug}`);
                        const fullData = await response.json();
                        setFormData(fullData);
                    } catch (error) {
                        showNotification("Failed to fetch full blog content.", "error");
                    }
                }
            }
            fetchFullBlog();
        } else {
            setFormData({ title: '', content: '', image: '', fullContent: '' });
        }
    }, [selectedBlogId, blogs]);
    

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- API Handlers ---
    const handleAdd = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        try {
            const res = await fetch('http://localhost:5000/api/blogs', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error('Failed to add blog');
            
            showNotification('Blog post added successfully!', 'success');
            fetchBlogs();
            setFormData({ title: '', content: '', image: '', fullContent: '' });
        } catch (error) { 
            showNotification(error.message, 'error');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        try {
            const res = await fetch(`http://localhost:5000/api/blogs/${selectedBlogId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error('Failed to update blog');
            
            showNotification('Blog post updated successfully!', 'success');
            fetchBlogs();
        } catch (error) { 
            showNotification(error.message, 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this blog post?')) return;
        const token = localStorage.getItem('adminToken');
        try {
            const res = await fetch(`http://localhost:5000/api/blogs/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to delete blog');
            
            showNotification('Blog post deleted successfully!', 'success');
            setBlogs(blogs.filter(b => b._id !== id));
        } catch (error) { 
            showNotification(error.message, 'error');
        }
    };

    const getMessageIcon = () => {
        switch (messageType) {
            case 'success':
                return <CheckCircle size={20} className="text-green-400" />;
            case 'error':
                return <XCircle size={20} className="text-red-400" />;
            case 'info':
                return <AlertCircle size={20} className="text-blue-400" />;
            default:
                return <CheckCircle size={20} className="text-green-400" />;
        }
    };

    const getMessageStyles = () => {
        switch (messageType) {
            case 'success':
                return 'bg-green-900/30 border-green-700 text-green-300';
            case 'error':
                return 'bg-red-900/30 border-red-700 text-red-300';
            case 'info':
                return 'bg-blue-900/30 border-blue-700 text-blue-300';
            default:
                return 'bg-green-900/30 border-green-700 text-green-300';
        }
    };

    const renderForm = (handler, buttonText) => (
        <form onSubmit={handler} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Blog Title *</label>
                    <input 
                        name="title" 
                        value={formData.title} 
                        onChange={handleFormChange} 
                        required
                        className="w-full bg-gray-900 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Enter an engaging blog title"
                    />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Featured Image URL</label>
                        <input 
                            name="image" 
                            value={formData.image} 
                            onChange={handleFormChange} 
                            className="w-full bg-gray-900 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="https://example.com/blog-image.jpg"
                        />
                        {formData.image && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-400 mb-1">Image Preview:</p>
                                <img 
                                    src={formData.image} 
                                    alt="Blog preview" 
                                    className="h-32 rounded border border-gray-600 object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Summary Content *</label>
                        <textarea 
                            name="content" 
                            value={formData.content} 
                            onChange={handleFormChange} 
                            rows="4"
                            required
                            className="w-full bg-gray-900 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="Brief summary that appears on blog cards (2-3 sentences)"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            This appears on blog listing cards. Keep it concise.
                        </p>
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Blog Content *</label>
                    <textarea 
                        name="fullContent" 
                        value={formData.fullContent} 
                        onChange={handleFormChange} 
                        rows="12"
                        required
                        className="w-full bg-gray-900 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-mono text-sm"
                        placeholder="Write the full blog content here. You can use HTML formatting if needed."
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        This is the main content of your blog post. HTML tags are supported.
                    </p>
                </div>
            </div>
            
            <button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 font-bold py-3 px-6 rounded-lg transition-colors shadow-lg"
            >
                {buttonText}
            </button>
        </form>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
                <button 
                    onClick={() => navigate('/admin')} 
                    className="flex items-center gap-2 text-gray-400 hover:text-green-400 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>
                
                <h1 className="text-3xl font-bold text-white mb-2">Manage Blog Posts</h1>
                <p className="text-gray-400 mb-8">Create and manage your research blog posts and articles</p>

                <div className="flex border-b border-gray-700 mb-8 gap-8">
                    <button 
                        onClick={() => setActiveTab('add')} 
                        className={`flex items-center gap-2 py-3 px-4 font-medium transition-all ${
                            activeTab === 'add' 
                                ? 'border-b-2 border-green-500 text-green-400 font-semibold' 
                                : 'text-gray-400 hover:text-gray-300'
                        }`}
                    >
                        <PlusCircle size={18} />
                        Add Blog Post
                    </button>
                    <button 
                        onClick={() => setActiveTab('edit')} 
                        className={`flex items-center gap-2 py-3 px-4 font-medium transition-all ${
                            activeTab === 'edit' 
                                ? 'border-b-2 border-green-500 text-green-400 font-semibold' 
                                : 'text-gray-400 hover:text-gray-300'
                        }`}
                    >
                        <Edit size={18} />
                        Edit Blog Post
                    </button>
                    <button 
                        onClick={() => setActiveTab('delete')} 
                        className={`flex items-center gap-2 py-3 px-4 font-medium transition-all ${
                            activeTab === 'delete' 
                                ? 'border-b-2 border-green-500 text-green-400 font-semibold' 
                                : 'text-gray-400 hover:text-gray-300'
                        }`}
                    >
                        <Trash2 size={18} />
                        Delete Blog Post
                    </button>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'add' && (
                                <div>
                                    <h2 className="text-xl font-bold text-green-400 mb-6 flex items-center gap-2">
                                        <FileText size={24} />
                                        Write New Blog Post
                                    </h2>
                                    {renderForm(handleAdd, 'Publish Blog Post')}
                                </div>
                            )}
                            
                            {activeTab === 'edit' && (
                                <div>
                                    <h2 className="text-xl font-bold text-green-400 mb-6 flex items-center gap-2">
                                        <Edit size={24} />
                                        Edit Blog Post
                                    </h2>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Select Blog Post to Edit
                                    </label>
                                    <select 
                                        value={selectedBlogId} 
                                        onChange={(e) => setSelectedBlogId(e.target.value)} 
                                        className="w-full bg-gray-900 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all mb-6"
                                    >
                                        <option value="">-- Choose a blog post --</option>
                                        {blogs.map(b => (
                                            <option key={b._id} value={b._id}>{b.title}</option>
                                        ))}
                                    </select>
                                    {selectedBlogId ? (
                                        renderForm(handleUpdate, 'Update Blog Post')
                                    ) : (
                                        <div className="text-center py-8 text-gray-400">
                                            <Edit className="mx-auto mb-3 opacity-50" size={48} />
                                            <p>Select a blog post from the dropdown to start editing</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {activeTab === 'delete' && (
                                <div>
                                    <h2 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-2">
                                        <Trash2 size={24} />
                                        Delete Blog Posts
                                    </h2>
                                    <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6">
                                        <p className="text-red-300 text-sm">
                                            ⚠️ Warning: Deleting blog posts is permanent and cannot be undone.
                                        </p>
                                    </div>
                                    
                                    {blogs.length === 0 ? (
                                        <div className="text-center py-8 text-gray-400">
                                            <p>No blog posts found</p>
                                        </div>
                                    ) : (
                                        <ul className="space-y-4">
                                            {blogs.map(b => (
                                                <li key={b._id} className="flex items-center justify-between bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                                                    <div className="flex items-start gap-4 flex-1">
                                                        <div className="flex-shrink-0">
                                                            {b.image ? (
                                                                <img 
                                                                    src={b.image} 
                                                                    alt={b.title}
                                                                    className="h-16 w-16 rounded object-cover border border-gray-600"
                                                                />
                                                            ) : (
                                                                <div className="h-16 w-16 rounded bg-gray-700 flex items-center justify-center border border-gray-600">
                                                                    <FileText size={24} className="text-gray-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-white font-medium">{b.title}</p>
                                                            <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                                                                {b.content}
                                                            </p>
                                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                                <span>Slug: {b.slug}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleDelete(b._id)} 
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-900/30 p-2 rounded-lg transition-colors ml-4 flex-shrink-0"
                                                        title="Delete blog post"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Enhanced Message Notification */}
                {showMessage && (
                    <div className={`fixed bottom-5 right-5 py-3 px-4 rounded-lg border shadow-lg transition-all duration-300 transform ${
                        showMessage ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                    } ${getMessageStyles()}`}>
                        <div className="flex items-center gap-3">
                            {getMessageIcon()}
                            <span className="font-medium">{message}</span>
                            <button 
                                onClick={() => setShowMessage(false)} 
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <XCircle size={16} />
                            </button>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="w-full bg-gray-700 rounded-full h-1 mt-2 overflow-hidden">
                            <div 
                                className={`h-1 rounded-full transition-all duration-4000 ${
                                    messageType === 'success' ? 'bg-green-500' : 
                                    messageType === 'error' ? 'bg-red-500' : 'bg-blue-500'
                                }`}
                                style={{ 
                                    width: '100%',
                                    animation: 'shrink 4s linear forwards'
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Progress bar animation */}
            <style jsx>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
};

export default EditBlogs;