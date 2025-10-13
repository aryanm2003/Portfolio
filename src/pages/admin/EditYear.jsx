import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, ArrowLeft, FileText, BookOpen, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const EditYear = () => {
    const [publications, setPublications] = useState([]);
    const [activeCategory, setActiveCategory] = useState('Journal');
    const [formData, setFormData] = useState({ title: '', year: '', category: 'Journal' });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [showMessage, setShowMessage] = useState(false);
    const navigate = useNavigate();

    const publicationCategories = [
        { id: 'Journal', label: 'Journal Publications', icon: FileText },
        { id: 'Review Paper', label: 'Review Papers', icon: BookOpen },
        { id: 'Conference Proceedings', label: 'Conference Proceedings', icon: Users }
    ];

    const showNotification = (msg, type = 'success') => {
        setMessage(msg);
        setMessageType(type);
        setShowMessage(true);
    };

    const fetchPublications = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/publications/yearwise');
            const data = await response.json();
            setPublications(data);
        } catch (error) {
            showNotification('Failed to load publications.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPublications();
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

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddPublication = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        if (!formData.title || !formData.year) {
            showNotification('Title and Year are required.', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/publications/yearwise', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) throw new Error('Failed to add publication.');
            
            showNotification('Publication added successfully!', 'success');
            setFormData({ title: '', year: '', category: 'Journal' });
            fetchPublications();
        } catch (error) {
            showNotification(error.message, 'error');
        }
    };

    const handleDeletePublication = async (id) => {
        if (!window.confirm('Are you sure you want to delete this publication?')) return;
        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch(`http://localhost:5000/api/publications/yearwise/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to delete publication.');
            
            showNotification('Publication deleted successfully!', 'success');
            setPublications(publications.filter(p => p._id !== id));
        } catch (error) {
            showNotification(error.message, 'error');
        }
    };

    // Filter publications by active category
    const filteredPublications = publications.filter(pub => pub.category === activeCategory);
    
    // Group publications by year
    const publicationsByYear = filteredPublications.reduce((groups, pub) => {
        const year = pub.year;
        if (!groups[year]) {
            groups[year] = [];
        }
        groups[year].push(pub);
        return groups;
    }, {});

    // Sort years in descending order
    const sortedYears = Object.keys(publicationsByYear).sort((a, b) => b - a);

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
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <button 
                    onClick={() => navigate('/admin')} 
                    className="flex items-center gap-2 text-gray-400 hover:text-green-400 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>

                <h1 className="text-3xl font-bold text-white mb-2">Manage Year-wise Publications</h1>
                <p className="text-gray-400 mb-8">Add and manage your academic publications by category</p>

                {/* Add Publication Section */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                        <PlusCircle size={24} />
                        Add New Publication
                    </h2>
                    <form onSubmit={handleAddPublication} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                                    Publication Title *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleFormChange}
                                    required
                                    className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder="Enter publication title"
                                />
                            </div>
                            <div>
                                <label htmlFor="year" className="block text-sm font-medium text-gray-300 mb-2">
                                    Publication Year *
                                </label>
                                <input
                                    type="number"
                                    id="year"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleFormChange}
                                    required
                                    min="1900"
                                    max="2030"
                                    className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder="2024"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                            <div className="flex-1">
                                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleFormChange}
                                    className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                >
                                    {publicationCategories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>
                            <button 
                                type="submit" 
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-lg"
                            >
                                Add Publication
                            </button>
                        </div>
                    </form>
                </div>

                {/* Publications List with Tabs */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
                    {/* Tab Headers */}
                    <div className="border-b border-gray-700">
                        <div className="flex gap-6 overflow-x-auto">
                            {publicationCategories.map((category) => {
                                const IconComponent = category.icon;
                                const categoryCount = publications.filter(pub => pub.category === category.id).length;
                                
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => setActiveCategory(category.id)}
                                        className={`flex items-center gap-3 py-4 px-6 font-medium transition-all whitespace-nowrap ${
                                            activeCategory === category.id
                                                ? 'border-b-2 border-green-500 text-green-400 bg-green-500/10'
                                                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                                        }`}
                                    >
                                        <IconComponent size={20} />
                                        <span>{category.label}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            activeCategory === category.id 
                                                ? 'bg-green-500/20 text-green-300' 
                                                : 'bg-gray-700 text-gray-400'
                                        }`}>
                                            {categoryCount}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                            </div>
                        ) : filteredPublications.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <div className="flex justify-center mb-4">
                                    {React.createElement(publicationCategories.find(cat => cat.id === activeCategory)?.icon, { 
                                        size: 48, 
                                        className: "opacity-50" 
                                    })}
                                </div>
                                <p className="text-lg mb-2">No {activeCategory.toLowerCase()} publications found</p>
                                <p className="text-sm">Add your first publication using the form above</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {sortedYears.map(year => (
                                    <div key={year} className="border border-gray-700 rounded-lg overflow-hidden">
                                        <div className="bg-gray-900/80 px-6 py-4 border-b border-gray-700">
                                            <h3 className="text-xl font-bold text-white">{year}</h3>
                                            <p className="text-gray-400 text-sm">
                                                {publicationsByYear[year].length} publication{publicationsByYear[year].length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        <div className="divide-y divide-gray-700">
                                            {publicationsByYear[year].map((pub, index) => (
                                                <div key={pub._id} className="p-6 hover:bg-gray-900/30 transition-colors">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <p className="text-gray-100 text-lg mb-2">{pub.title}</p>
                                                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                                                <span className="bg-gray-700 px-3 py-1 rounded-full">
                                                                    {pub.category}
                                                                </span>
                                                                <span>Year: {pub.year}</span>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={() => handleDeletePublication(pub._id)} 
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-900/30 p-2 rounded-lg transition-colors ml-4 flex-shrink-0"
                                                            title="Delete publication"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Statistics Summary */}
                {!loading && publications.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {publicationCategories.map(category => {
                            const count = publications.filter(pub => pub.category === category.id).length;
                            const IconComponent = category.icon;
                            
                            return (
                                <div key={category.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <IconComponent size={20} className="text-green-400" />
                                        <span className="text-gray-300 font-medium">{category.label}</span>
                                    </div>
                                    <div className="text-2xl font-bold text-white">{count}</div>
                                    <div className="text-gray-400 text-sm">publications</div>
                                </div>
                            );
                        })}
                    </div>
                )}

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

export default EditYear;