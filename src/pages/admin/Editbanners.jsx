import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, ArrowLeft, CheckCircle, XCircle, AlertCircle, Image } from 'lucide-react';

const EditBanners = () => {
    const [banners, setBanners] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [showMessage, setShowMessage] = useState(false);
    const navigate = useNavigate();

    const showNotification = (msg, type = 'success') => {
        setMessage(msg);
        setMessageType(type);
        setShowMessage(true);
    };

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/banners');
            const data = await response.json();
            setBanners(data);
        } catch (error) {
            console.error("Failed to fetch banners:", error);
            showNotification('Failed to load banners.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
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

    const handleAddBanner = async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('adminToken');

        if (!token) {
            showNotification("You are not logged in.", 'error');
            navigate('/');
            return;
        }

        if (!imageUrl || !description) {
            showNotification('Both fields are required.', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/banners', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ imageUrl, description })
            });

            if (response.status === 401) {
                showNotification("Your session has expired. Please log in again.", 'error');
                localStorage.removeItem('adminToken');
                navigate('/');
                return;
            }
            if (!response.ok) throw new Error('Failed to add banner.');
            
            showNotification('Banner added successfully!', 'success');
            setImageUrl('');
            setDescription('');
            fetchBanners();
        } catch (error) {
            showNotification(error.message, 'error');
        }
    };

    const handleDeleteBanner = async (id) => {
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
            showNotification("You are not logged in.", 'error');
            navigate('/');
            return;
        }

        if (!window.confirm('Are you sure you want to delete this banner?')) return;

        try {
            const response = await fetch(`http://localhost:5000/api/banners/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                showNotification("Your session has expired. Please log in again.", 'error');
                localStorage.removeItem('adminToken');
                navigate('/');
                return;
            }
            if (!response.ok) throw new Error('Failed to delete banner.');

            showNotification('Banner deleted successfully!', 'success');
            setBanners(banners.filter(banner => banner._id !== id));
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={() => navigate('/admin')} 
                    className="flex items-center gap-2 text-gray-400 hover:text-green-400 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>

                <h1 className="text-3xl font-bold text-white mb-2">Manage Banners</h1>
                <p className="text-gray-400 mb-8">Add and manage homepage banner images and descriptions</p>

                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                        <PlusCircle size={24} />
                        Add New Banner
                    </h2>
                    <form onSubmit={handleAddBanner} className="space-y-6">
                        <div>
                            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-2">
                                Banner Image URL *
                            </label>
                            <input
                                type="text"
                                id="imageUrl"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                required
                                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                placeholder="https://example.com/banner-image.jpg"
                            />
                            {imageUrl && (
                                <div className="mt-2">
                                    <p className="text-xs text-gray-400 mb-1">Image Preview:</p>
                                    <img 
                                        src={imageUrl} 
                                        alt="Banner preview" 
                                        className="h-32 rounded border border-gray-600 object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                                Banner Description *
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                rows="3"
                                placeholder="Enter an engaging description for this banner..."
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-lg"
                        >
                            Add Banner
                        </button>
                    </form>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-gray-300 mb-4 flex items-center gap-2">
                        <Image size={24} />
                        Existing Banners
                    </h2>
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                        </div>
                    ) : banners.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <Image className="mx-auto mb-3 opacity-50" size={48} />
                            <p>No banners found</p>
                            <p className="text-sm">Add your first banner using the form above</p>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {banners.map(banner => (
                                <li key={banner._id} className="flex items-center justify-between bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="flex-shrink-0">
                                            {banner.imageUrl ? (
                                                <img 
                                                    src={banner.imageUrl} 
                                                    alt={banner.description}
                                                    className="h-16 w-24 rounded object-cover border border-gray-600"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className="h-16 w-24 rounded bg-gray-700 flex items-center justify-center border border-gray-600">
                                                    <Image size={24} className="text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-medium line-clamp-2" title={banner.description}>
                                                {banner.description}
                                            </p>
                                            <p className="text-gray-400 text-sm mt-1 truncate">
                                                {banner.imageUrl}
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteBanner(banner._id)} 
                                        className="text-red-400 hover:text-red-300 hover:bg-red-900/30 p-2 rounded-lg transition-colors ml-4 flex-shrink-0"
                                        title="Delete banner"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </li>
                            ))}
                        </ul>
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

export default EditBanners;