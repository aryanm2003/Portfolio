import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Edit, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const EditBooks = () => {
    const [activeTab, setActiveTab] = useState('add');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [showMessage, setShowMessage] = useState(false);
    const navigate = useNavigate();

    // State for forms
    const [selectedBookId, setSelectedBookId] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        about: '',
        image: '',
        buyLinks: [{ name: '', url: '' }],
        reviews: [{ reviewer: '', text: '' }]
    });

    const showNotification = (msg, type = 'success') => {
        setMessage(msg);
        setMessageType(type);
        setShowMessage(true);
    };

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/books');
            const data = await response.json();
            setBooks(data);
        } catch (error) {
            showNotification('Failed to load books.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
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

    // Reset form function
    const resetForm = () => {
        setFormData({
            title: '',
            about: '',
            image: '',
            buyLinks: [{ name: '', url: '' }],
            reviews: [{ reviewer: '', text: '' }]
        });
        setSelectedBookId('');
    };

    // Effect to populate form when a book is selected for editing
    useEffect(() => {
        if (selectedBookId) {
            const fetchFullBookData = async () => {
                try {
                    const book = books.find(b => b._id === selectedBookId);
                    if (!book) return;
                    
                    const response = await fetch(`http://localhost:5000/api/books/${book.slug}`);
                    const fullBookData = await response.json();
                    
                    setFormData({
                        ...fullBookData,
                        buyLinks: fullBookData.buyLinks || [{ name: '', url: '' }],
                        reviews: fullBookData.reviews || [{ reviewer: '', text: '' }],
                    });
                } catch (error) {
                    showNotification("Could not fetch full book details.", "error");
                }
            };
            fetchFullBookData();
        } else {
            resetForm();
        }
    }, [selectedBookId, books]);

    // Handler for form input changes
    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handlers for dynamically adding/removing/updating sub-document fields
    const handleSubDocChange = (index, event, field) => {
        const values = [...formData[field]];
        values[index][event.target.name] = event.target.value;
        setFormData({ ...formData, [field]: values });
    };

    const addSubDocField = (field) => {
        const newField = field === 'buyLinks' ? { name: '', url: '' } : { reviewer: '', text: '' };
        setFormData({ ...formData, [field]: [...formData[field], newField] });
    };
    
    const removeSubDocField = (index, field) => {
        const values = [...formData[field]];
        values.splice(index, 1);
        setFormData({ ...formData, [field]: values });
    };
    
    // API Call Handlers
    const handleAddBook = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        try {
            const res = await fetch('http://localhost:5000/api/books', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error('Failed to add book');
            
            showNotification('Book added successfully!', 'success');
            fetchBooks();
            resetForm();
        } catch (error) { 
            showNotification(error.message, 'error');
        }
    };
    
    const handleUpdateBook = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        try {
            const res = await fetch(`http://localhost:5000/api/books/${selectedBookId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error('Failed to update book');
            
            showNotification('Book updated successfully!', 'success');
            fetchBooks();
        } catch (error) { 
            showNotification(error.message, 'error');
        }
    };
    
    const handleDeleteBook = async (id) => {
        if (!window.confirm('Are you sure? This action is irreversible.')) return;
        const token = localStorage.getItem('adminToken');
        try {
            const res = await fetch(`http://localhost:5000/api/books/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to delete book');
            
            showNotification('Book deleted successfully!', 'success');
            setBooks(books.filter(b => b._id !== id));
        } catch (error) { 
            showNotification(error.message, 'error');
        }
    };

    // Tab change handler with reset
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'add') {
            resetForm();
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
    
    // UI Components for each tab (keep all your existing render methods exactly as they are)
    const renderAddTab = () => (
        <div className="rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Add New Book</h2>
            <form onSubmit={handleAddBook} className="space-y-8">
                {renderBookFormFields()}
            </form>
        </div>
    );

    const renderEditTab = () => (
        <div className="rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Edit Existing Book</h2>
            <div className="mb-8">
                <label htmlFor="book-select" className="block text-sm font-medium text-gray-300 mb-3">
                    Select a Book to Edit
                </label>
                <select
                    id="book-select"
                    className="w-full max-w-lg bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    value={selectedBookId}
                    onChange={(e) => setSelectedBookId(e.target.value)}
                >
                    <option value="">-- Please choose a book --</option>
                    {books.map(book => (
                        <option key={book._id} value={book._id}>{book.title}</option>
                    ))}
                </select>
            </div>
            
            {selectedBookId && (
                <form onSubmit={handleUpdateBook} className="space-y-8">
                    {renderBookFormFields('update')}
                </form>
            )}
            
            {!selectedBookId && (
                <div className="text-center py-8 text-gray-400">
                    <Edit className="mx-auto mb-3 opacity-50" size={48} />
                    <p>Select a book from the dropdown to start editing</p>
                </div>
            )}
        </div>
    );

    const renderDeleteTab = () => (
        <div className="rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Delete Books</h2>
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6">
                <p className="text-red-300 text-sm">
                    ⚠️ Warning: Deleting books is permanent and cannot be undone.
                </p>
            </div>
            
            {books.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                    <p>No books available to delete</p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {books.map(book => (
                        <li key={book._id} className="flex items-center justify-between bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                            <div>
                                <p className="text-white font-medium">{book.title}</p>
                                {book.about && (
                                    <p className="text-gray-400 text-sm mt-1 line-clamp-1">
                                        {book.about}
                                    </p>
                                )}
                            </div>
                            <button 
                                onClick={() => handleDeleteBook(book._id)} 
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/30 p-2 rounded-lg transition-colors"
                                title="Delete book"
                            >
                                <Trash2 size={20} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

    const renderBookFormFields = (mode = 'add') => (
        <>
            {/* Basic Information Section */}
            <div className="space-y-6">
                <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-2">
                    Basic Information
                </h3>
                
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Title *
                        </label>
                        <input 
                            name="title" 
                            value={formData.title} 
                            onChange={handleFormChange} 
                            required
                            className="w-full bg-gray-900 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-white"
                            placeholder="Enter book title"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            About the Book
                        </label>
                        <textarea 
                            name="about" 
                            value={formData.about} 
                            onChange={handleFormChange} 
                            rows="4"
                            className="w-full bg-gray-900 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-white"
                            placeholder="Describe the book..."
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Cover Image URL
                        </label>
                        <input 
                            name="image" 
                            value={formData.image} 
                            onChange={handleFormChange} 
                            className="w-full bg-gray-900 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-white"
                            placeholder="https://example.com/book-cover.jpg"
                        />
                        {formData.image && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-400 mb-1">Preview:</p>
                                <img 
                                    src={formData.image} 
                                    alt="Book cover preview" 
                                    className="h-20 rounded border border-gray-600 object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Buy Links Section */}
            <div className="border-t border-gray-700 pt-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">Buy Links</h3>
                    <button 
                        type="button" 
                        onClick={() => addSubDocField('buyLinks')} 
                        className="flex items-center gap-2 text-green-400 hover:text-green-300 text-sm font-medium"
                    >
                        <PlusCircle size={16} />
                        Add Link
                    </button>
                </div>
                
                <div className="space-y-4">
                    {formData.buyLinks.map((link, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-3 items-start p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                            <div className="flex-1 w-full">
                                <label className="block text-xs text-gray-400 mb-1">Platform Name</label>
                                <input 
                                    name="name" 
                                    placeholder="Amazon, Barnes & Noble, etc." 
                                    value={link.name} 
                                    onChange={e => handleSubDocChange(index, e, 'buyLinks')} 
                                    className="w-full bg-gray-800 p-2 rounded border border-gray-600 focus:ring-1 focus:ring-green-500 text-white text-sm"
                                />
                            </div>
                            <div className="flex-1 w-full">
                                <label className="block text-xs text-gray-400 mb-1">Purchase URL</label>
                                <input 
                                    name="url" 
                                    placeholder="https://..." 
                                    value={link.url} 
                                    onChange={e => handleSubDocChange(index, e, 'buyLinks')} 
                                    className="w-full bg-gray-800 p-2 rounded border border-gray-600 focus:ring-1 focus:ring-green-500 text-white text-sm"
                                />
                            </div>
                            <button 
                                type="button" 
                                onClick={() => removeSubDocField(index, 'buyLinks')} 
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/30 p-2 rounded transition-colors mt-5"
                                title="Remove link"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-gray-700 pt-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">Reviews</h3>
                    <button 
                        type="button" 
                        onClick={() => addSubDocField('reviews')} 
                        className="flex items-center gap-2 text-green-400 hover:text-green-300 text-sm font-medium"
                    >
                        <PlusCircle size={16} />
                        Add Review
                    </button>
                </div>
                
                <div className="space-y-4">
                    {formData.reviews.map((review, index) => (
                        <div key={index} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 space-y-3">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Reviewer Name</label>
                                <input 
                                    name="reviewer" 
                                    placeholder="John Doe, Book Magazine, etc." 
                                    value={review.reviewer} 
                                    onChange={e => handleSubDocChange(index, e, 'reviews')} 
                                    className="w-full bg-gray-800 p-2 rounded border border-gray-600 focus:ring-1 focus:ring-green-500 text-white text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Review Text</label>
                                <textarea 
                                    name="text" 
                                    placeholder="This book is amazing..." 
                                    value={review.text} 
                                    onChange={e => handleSubDocChange(index, e, 'reviews')} 
                                    rows="3"
                                    className="w-full bg-gray-800 p-2 rounded border border-gray-600 focus:ring-1 focus:ring-green-500 text-white text-sm"
                                />
                            </div>
                            <button 
                                type="button" 
                                onClick={() => removeSubDocField(index, 'reviews')} 
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/30 p-2 rounded transition-colors"
                                title="Remove review"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Submit Button */}
            <div className="border-t border-gray-700 pt-6">
                <button 
                    type="submit" 
                    className="bg-green-600 hover:bg-green-700 font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
                >
                    {mode === 'add' ? 'Add New Book' : 'Update Book'}
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button 
                        onClick={() => navigate('/admin')} 
                        className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors"
                    >
                        <ArrowLeft size={20} /> 
                        Back to Dashboard
                    </button>
                </div>

                <h1 className="text-3xl font-bold text-white mb-2">Manage Books</h1>
                <p className="text-gray-400 mb-8">Add, edit, or remove books from your collection</p>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-700 mb-8 gap-2">
                    {[
                        { id: 'add', label: 'Add Book', icon: PlusCircle },
                        { id: 'edit', label: 'Edit Book', icon: Edit },
                        { id: 'delete', label: 'Delete Book', icon: Trash2 }
                    ].map((tab) => (
                        <button 
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`flex items-center gap-2 py-3 px-6 font-medium transition-all ${
                                activeTab === tab.id 
                                    ? 'border-b-2 border-green-500 text-green-400 bg-green-500/10' 
                                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                            } rounded-t-lg`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="mb-8">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'add' && renderAddTab()}
                            {activeTab === 'edit' && renderEditTab()}
                            {activeTab === 'delete' && renderDeleteTab()}
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

export default EditBooks;