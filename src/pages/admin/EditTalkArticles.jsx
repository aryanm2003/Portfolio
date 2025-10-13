import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, PlusCircle, Edit, CheckCircle, XCircle, AlertCircle, Mic, FileText } from 'lucide-react';

const EditTalkArticles = () => {
    const [activeTab, setActiveTab] = useState('add');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [showMessage, setShowMessage] = useState(false);
    const navigate = useNavigate();

    const [selectedItemId, setSelectedItemId] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: '',
        docLink: '',
        type: 'talk'
    });

    const [filterType, setFilterType] = useState('All');
    const types = [
        { id: 'talk', label: 'Talks', icon: Mic },
        { id: 'article', label: 'Articles', icon: FileText }
    ];

    const showNotification = (msg, type = 'success') => {
        setMessage(msg);
        setMessageType(type);
        setShowMessage(true);
    };

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/talks-articles');
            const data = await response.json();
            setItems(data);
        } catch (error) {
            showNotification('Failed to load items.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        setSelectedItemId('');
        setFormData({ title: '', content: '', image: '', docLink: '', type: 'talk' });
    }, [activeTab, filterType]);

    useEffect(() => {
        if (selectedItemId) {
            const selectedItem = items.find(i => i._id === selectedItemId);
            if (selectedItem) setFormData(selectedItem);
        } else {
            setFormData({ title: '', content: '', image: '', docLink: '', type: 'talk' });
        }
    }, [selectedItemId, items]);

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

    const handleAdd = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        try {
            const res = await fetch('http://localhost:5000/api/talks-articles', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error('Failed to add item');
            
            showNotification('Item added successfully!', 'success');
            fetchItems();
            setFormData({ title: '', content: '', image: '', docLink: '', type: 'talk' });
        } catch (error) { 
            showNotification(error.message, 'error');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        try {
            const res = await fetch(`http://localhost:5000/api/talks-articles/${selectedItemId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error('Failed to update item');
            
            showNotification('Item updated successfully!', 'success');
            fetchItems();
        } catch (error) { 
            showNotification(error.message, 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this?')) return;
        const token = localStorage.getItem('adminToken');
        try {
            const res = await fetch(`http://localhost:5000/api/talks-articles/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to delete item');
            
            showNotification('Item deleted successfully!', 'success');
            setItems(items.filter(i => i._id !== id));
        } catch (error) { 
            showNotification(error.message, 'error');
        }
    };

    const filteredItems = items.filter(i => filterType === 'All' || i.type === filterType);

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
                    <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                    <input 
                        name="title" 
                        value={formData.title} 
                        onChange={handleFormChange} 
                        required
                        className="w-full bg-gray-900 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Enter title of the talk or article"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Content/Description</label>
                    <textarea 
                        name="content" 
                        value={formData.content} 
                        onChange={handleFormChange} 
                        rows="4" 
                        className="w-full bg-gray-900 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Provide details about the talk or article content..."
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                        <input 
                            name="image" 
                            value={formData.image} 
                            onChange={handleFormChange} 
                            className="w-full bg-gray-900 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="https://example.com/image.jpg"
                        />
                        {formData.image && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-400 mb-1">Image Preview:</p>
                                <img 
                                    src={formData.image} 
                                    alt="Preview" 
                                    className="h-20 rounded border border-gray-600 object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Document Link</label>
                        <input 
                            name="docLink" 
                            value={formData.docLink} 
                            onChange={handleFormChange} 
                            className="w-full bg-gray-900 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="https://example.com/document.pdf"
                        />
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Type *</label>
                    <select 
                        name="type" 
                        value={formData.type} 
                        onChange={handleFormChange} 
                        required
                        className="w-full bg-gray-900 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    >
                        {types.map(type => (
                            <option key={type.id} value={type.id}>{type.label}</option>
                        ))}
                    </select>
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

    const TypeFilter = () => (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Type</label>
            <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)} 
                className="w-full bg-gray-900 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
                <option value="All">All Types</option>
                {types.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                ))}
            </select>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={() => navigate('/admin')} 
                    className="flex items-center gap-2 text-gray-400 hover:text-green-400 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>
                
                <h1 className="text-3xl font-bold text-white mb-2">Manage Talks & Articles</h1>
                <p className="text-gray-400 mb-8">Add and manage your academic talks and articles</p>

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
                        Add Item
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
                        Edit Item
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
                        Delete Item
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
                                        <PlusCircle size={24} />
                                        Add New Talk or Article
                                    </h2>
                                    {renderForm(handleAdd, 'Add Item')}
                                </div>
                            )}
                            
                            {activeTab === 'edit' && (
                                <div>
                                    <h2 className="text-xl font-bold text-green-400 mb-6 flex items-center gap-2">
                                        <Edit size={24} />
                                        Edit Talk or Article
                                    </h2>
                                    <TypeFilter />
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Select Item to Edit
                                    </label>
                                    <select 
                                        value={selectedItemId} 
                                        onChange={(e) => setSelectedItemId(e.target.value)} 
                                        className="w-full bg-gray-900 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all mb-6"
                                    >
                                        <option value="">-- Choose an item --</option>
                                        {filteredItems.map(i => (
                                            <option key={i._id} value={i._id}>
                                                {i.title} - {i.type === 'talk' ? 'Talk' : 'Article'}
                                            </option>
                                        ))}
                                    </select>
                                    {selectedItemId ? (
                                        renderForm(handleUpdate, 'Update Item')
                                    ) : (
                                        <div className="text-center py-8 text-gray-400">
                                            <Edit className="mx-auto mb-3 opacity-50" size={48} />
                                            <p>Select an item from the dropdown to start editing</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {activeTab === 'delete' && (
                                <div>
                                    <h2 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-2">
                                        <Trash2 size={24} />
                                        Delete Talks & Articles
                                    </h2>
                                    <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6">
                                        <p className="text-red-300 text-sm">
                                            ⚠️ Warning: Deleting items is permanent and cannot be undone.
                                        </p>
                                    </div>
                                    <TypeFilter />
                                    
                                    {filteredItems.length === 0 ? (
                                        <div className="text-center py-8 text-gray-400">
                                            <p>No items found for the selected type</p>
                                        </div>
                                    ) : (
                                        <ul className="space-y-4">
                                            {filteredItems.map(i => {
                                                const TypeIcon = types.find(t => t.id === i.type)?.icon || FileText;
                                                const typeColor = i.type === 'talk' ? 'bg-purple-900/30 text-purple-300' : 'bg-blue-900/30 text-blue-300';
                                                
                                                return (
                                                    <li key={i._id} className="flex items-center justify-between bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                                                        <div className="flex items-start gap-4 flex-1">
                                                            <div className="flex-shrink-0">
                                                                <TypeIcon size={24} className="text-green-400 mt-1" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-white font-medium">{i.title}</p>
                                                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                                                                    <span className={`px-3 py-1 rounded-full capitalize ${typeColor}`}>
                                                                        {i.type}
                                                                    </span>
                                                                </div>
                                                                {i.content && (
                                                                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                                                                        {i.content}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={() => handleDelete(i._id)} 
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-900/30 p-2 rounded-lg transition-colors ml-4 flex-shrink-0"
                                                            title="Delete item"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </li>
                                                );
                                            })}
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

export default EditTalkArticles;