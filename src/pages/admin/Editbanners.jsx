import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, ArrowLeft, CheckCircle, XCircle, AlertCircle, Image, Upload } from 'lucide-react';

const EditBanners = () => {
    const [banners, setBanners] = useState([]);
    const [imageUrl, setImageUrl] = useState(''); // This will now *only* be for the preview
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [showMessage, setShowMessage] = useState(false);
    const navigate = useNavigate();

    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const showNotification = (msg, type = 'success') => {
        setMessage(msg);
        setMessageType(type);
        setShowMessage(true);
    };

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/banners`);
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImageUrl(URL.createObjectURL(file)); 
        }
    };
   
    const handleAddBanner = async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('adminToken');
        if (!token) {
            showNotification("You are not logged in.", 'error');
            navigate('/');
            return;
        }

        if (!selectedFile || !description) {
            showNotification('Please select an image and add a description.', 'error');
            return;
        }

        setIsUploading(true);

        try {
            // 1. Upload Image
            const formData = new FormData();
            formData.append('image', selectedFile);

            const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (uploadRes.status === 401) {
                localStorage.removeItem('adminToken');
                showNotification("Session expired. Please log in.", 'error');
                navigate('/');
                return;
            }
            if (!uploadRes.ok) throw new Error('Image upload failed.');
            
            const uploadData = await uploadRes.json();
            const finalImageUrl = uploadData.imageUrl;

            // 2. Save Banner
            const bannerResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/banners`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ imageUrl: finalImageUrl, description })
            });

            if (bannerResponse.status === 401) {
                localStorage.removeItem('adminToken');
                showNotification("Session expired. Please log in.", 'error');
                navigate('/');
                return;
            }
            if (!bannerResponse.ok) throw new Error('Failed to add banner.');

            showNotification('Banner added successfully!', 'success');
            setImageUrl('');
            setDescription('');
            setSelectedFile(null);
            document.getElementById('imageUploadInput').value = null;
            fetchBanners();

        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            setIsUploading(false);
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/banners/${id}`, {
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
            case 'success': return <CheckCircle size={20} className="text-green-400" />;
            case 'error': return <XCircle size={20} className="text-red-400" />;
            case 'info': return <AlertCircle size={20} className="text-blue-400" />;
            default: return <CheckCircle size={20} className="text-green-400" />;
        }
    };

    const getMessageStyles = () => {
        switch (messageType) {
            case 'success': return 'bg-green-900/40 border-green-500/50 text-green-300';
            case 'error': return 'bg-red-900/40 border-red-500/50 text-red-300';
            case 'info': return 'bg-blue-900/40 border-blue-500/50 text-blue-300';
            default: return 'bg-green-900/40 border-green-500/50 text-green-300';
        }
    };

    return (
        // No solid background here, allowing the main Layout's background/image to show through
        <div className="p-4 sm:p-6 md:p-8 animate-in fade-in duration-500">
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

                {/* --- Add Banner Section (Glassmorphism) --- */}
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 sm:p-8 mb-8 shadow-xl">
                    <h2 className="text-xl font-bold text-green-400 mb-6 flex items-center gap-2">
                        <PlusCircle size={24} />
                        Add New Banner
                    </h2>
                    
                    <form onSubmit={handleAddBanner} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Banner Image *
                            </label>
                            
                            {/* Upload Area */}
                            <div className="relative border-2 border-dashed border-gray-600 bg-black/20 hover:bg-black/40 transition-colors rounded-lg p-8 flex flex-col items-center justify-center text-center group">
                                <input
                                    type="file"
                                    id="imageUploadInput"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <Upload size={32} className="text-gray-500 group-hover:text-green-400 transition-colors mb-2" />
                                <p className="text-sm text-gray-400 group-hover:text-gray-200">
                                    Click or drag to upload image
                                </p>
                            </div>
                            
                            {imageUrl && (
                                <div className="mt-4">
                                    <p className="text-xs text-gray-400 mb-2">Preview:</p>
                                    <img 
                                        src={imageUrl}
                                        alt="Banner preview" 
                                        className="h-40 rounded-lg border border-gray-600 object-cover shadow-lg"
                                        onError={(e) => { e.target.src = 'https://placehold.co/600x400/0f172a/34d399?text=Image+Error'; }}
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
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-gray-500"
                                rows="3"
                                placeholder="Enter an engaging description for this banner..."
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={isUploading}
                            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-green-900/30"
                        >
                            {isUploading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Processing...
                                </>
                            ) : (
                                'Add Banner'
                            )}
                        </button>
                    </form>
                </div>

                {/* --- Existing Banners Section (Glassmorphism) --- */}
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 sm:p-8 shadow-xl">
                    <h2 className="text-xl font-bold text-gray-200 mb-6 flex items-center gap-2">
                        <Image size={24} className="text-green-400" />
                        Existing Banners
                    </h2>
                    
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                        </div>
                    ) : banners.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Image className="mx-auto mb-3 opacity-30" size={48} />
                            <p className="text-lg">No banners found</p>
                            <p className="text-sm">Add your first banner using the form above</p>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {banners.map(banner => (
                                <li 
                                    key={banner._id} 
                                    className="flex items-center justify-between bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all duration-300 group"
                                >
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="flex-shrink-0">
                                            {banner.imageUrl ? (
                                                <img 
                                                    src={`${import.meta.env.VITE_API_URL}/uploads/${banner.imageUrl}`} 
                                                    alt={banner.description}
                                                    className="h-16 w-28 rounded-lg object-cover border border-gray-600 shadow-sm"
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            ) : (
                                                <div className="h-16 w-28 rounded-lg bg-gray-800 flex items-center justify-center border border-gray-700">
                                                    <Image size={24} className="text-gray-500" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-gray-200 font-medium line-clamp-2" title={banner.description}>
                                                {banner.description}
                                            </p>
                                            <p className="text-gray-500 text-xs mt-1 truncate font-mono">
                                                {banner.imageUrl}
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteBanner(banner._id)} 
                                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all ml-4 flex-shrink-0"
                                        title="Delete banner"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Notification Toast (Glass Style) */}
                {showMessage && (
                    <div className={`fixed bottom-5 right-5 py-3 px-5 rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-300 transform ${
                        showMessage ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                    } ${getMessageStyles()}`}>
                        <div className="flex items-center gap-3">
                            {getMessageIcon()}
                            <span className="font-medium">{message}</span>
                            <button 
                                onClick={() => setShowMessage(false)} 
                                className="text-white/50 hover:text-white transition-colors"
                            >
                                <XCircle size={18} />
                            </button>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="w-full bg-black/20 rounded-full h-1 mt-3 overflow-hidden">
                            <div 
                                className={`h-1 rounded-full transition-all duration-300 ${
                                    messageType === 'success' ? 'bg-green-400' : 
                                    messageType === 'error' ? 'bg-red-400' : 'bg-blue-400'
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

            <style>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
};

export default EditBanners;