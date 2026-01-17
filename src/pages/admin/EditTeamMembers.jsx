import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, PlusCircle, Edit, CheckCircle, XCircle, AlertCircle, User, Users, Clock, Upload } from 'lucide-react';

const EditTeamMembers = () => {
    const [activeTab, setActiveTab] = useState('add');
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [showMessage, setShowMessage] = useState(false);
    const navigate = useNavigate();

    const [selectedMemberId, setSelectedMemberId] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        about: '',
        image: '',
        type: 'present'
    });
    
    // --- NEW STATE for handling upload ---
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    // ------------------------------------
    
    const [filterType, setFilterType] = useState('All');
    const types = [
        { id: 'present', label: 'Present Members', icon: Users },
        { id: 'past', label: 'Past Members', icon: Clock }
    ];

    const showNotification = (msg, type = 'success') => {
        setMessage(msg);
        setMessageType(type);
        setShowMessage(true);
    };

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/team`);
            const data = await response.json();
            setMembers(data);
        } catch (error) {
            showNotification('Failed to load team members.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
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
    
    // --- NEW FUNCTION: Clear form and file input ---
    const clearForm = () => {
        setFormData({ name: '', title: '', about: '', image: '', type: 'present' });
        setSelectedFile(null);
        setImagePreview('');
        if (document.getElementById('imageUploadInput')) {
            document.getElementById('imageUploadInput').value = null;
        }
    };

    useEffect(() => {
        setSelectedMemberId('');
        clearForm();
    }, [activeTab, filterType]);

    useEffect(() => {
        if (selectedMemberId) {
            const selectedMember = members.find(m => m._id === selectedMemberId);
            if (selectedMember) {
                setFormData(selectedMember);
                if (selectedMember.image) {
                        setImagePreview(`${import.meta.env.VITE_API_URL}/uploads/${selectedMember.image}`);
                    } else {
                        setImagePreview('');
                    }
                setSelectedFile(null);
            }
        } else {
            clearForm();
        }
    }, [selectedMemberId, members]);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    // --- NEW FUNCTION: Handles file selection ---
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file)); 
        }
    };

    // --- NEW FUNCTION: Uploads file, returns URL or throws error ---
    const uploadImage = async () => {
        if (!selectedFile) {
            throw new Error("No file selected for upload.");
        }
        
        const token = localStorage.getItem('adminToken');
        const fileFormData = new FormData();
        fileFormData.append('image', selectedFile);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: fileFormData
        });

        if (res.status === 401) {
            localStorage.removeItem('adminToken');
            navigate('/');
            throw new Error("Session expired. Please log in.");
        }
        if (!res.ok) throw new Error('Image upload failed.');
        
        const data = await res.json();
        return data.imageUrl; // Returns the server URL
    };

    // --- API Handlers ---
    const handleAdd = async (e) => {
        e.preventDefault();
        
        if (!selectedFile) {
            showNotification('Please select a profile image.', 'error');
            return;
        }
        
        const token = localStorage.getItem('adminToken');
        setIsSubmitting(true);
        try {
            // 1. Upload image
            const finalImageUrl = await uploadImage();
            
            // 2. Save member
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/team`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ ...formData, image: finalImageUrl })
            });
            if (res.status === 401) throw new Error("Session expired. Please log in.");
            if (!res.ok) throw new Error('Failed to add team member');
            
            showNotification('Team member added successfully!', 'success');
            fetchMembers();
            clearForm();
        } catch (error) { 
            showNotification(error.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        setIsSubmitting(true);
        try {
            let finalImageUrl = formData.image; // Default to existing
            
            // 1. If new file, upload it
            if (selectedFile) {
                finalImageUrl = await uploadImage();
            }
            
            // 2. Update member
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/team/${selectedMemberId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ ...formData, image: finalImageUrl })
            });
            if (res.status === 401) throw new Error("Session expired. Please log in.");
            if (!res.ok) throw new Error('Failed to update team member');
            
            showNotification('Team member updated successfully!', 'success');
            fetchMembers();
            setSelectedFile(null);
            setImagePreview(finalImageUrl);
            if (document.getElementById('imageUploadInput')) {
                document.getElementById('imageUploadInput').value = null;
            }
        } catch (error) { 
            showNotification(error.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this team member?')) return;
        const token = localStorage.getItem('adminToken');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/team/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to delete team member');
            
            showNotification('Team member deleted successfully!', 'success');
            setMembers(members.filter(m => m._id !== id));
        } catch (error) { 
            showNotification(error.message, 'error');
        }
    };

    const filteredMembers = members.filter(m => filterType === 'All' || m.type === filterType);

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                        <input 
                            name="name" 
                            value={formData.name} 
                            onChange={handleFormChange} 
                            required
                            className="w-full bg-gray-900 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="Enter team member's full name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Title/Role *</label>
                        <input 
                            name="title" 
                            value={formData.title} 
                            onChange={handleFormChange} 
                            required
                            className="w-full bg-gray-900 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="e.g., Research Assistant, PhD Student"
                        />
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">About/Bio</label>
                    <textarea 
                        name="about" 
                        value={formData.about} 
                        onChange={handleFormChange} 
                        rows="4" 
                        className="w-full bg-gray-900 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Describe the team member's role, research interests, or background..."
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Profile Image *</label>
                        {/* --- MODIFIED IMAGE INPUT --- */}
                        <input
                            type="file"
                            id="imageUploadInput"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4
                                      file:rounded-lg file:border-0 file:text-sm file:font-semibold
                                      file:bg-green-600 file:text-white hover:file:bg-green-700
                                      cursor-pointer"
                        />
                        {imagePreview && (
                            <div className="mt-4">
                                <p className="text-xs text-gray-400 mb-1">Image Preview:</p>
                                <img 
                                    src={imagePreview} 
                                    alt="Profile preview" 
                                    className="h-20 w-20 rounded-full border border-gray-600 object-cover"
                                    onError={(e) => { e.target.src = 'https://placehold.co/100x100/0f172a/34d399?text=Error'; }}
                                />
                            </div>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Member Type *</label>
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
            </div>
            
            {/* --- MODIFIED BUTTON --- */}
            <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 font-bold py-3 px-6 rounded-lg transition-colors shadow-lg disabled:opacity-50"
            >
                {isSubmitting ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                    </>
                ) : (
                    buttonText
                )}
            </button>
        </form>
    );

    const TypeFilter = () => (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Member Type</label>
            <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)} 
                className="w-full bg-gray-900 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
                <option value="All">All Members</option>
                {types.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                ))}
            </select>
        </div>
    );

    return (
        <div className="min-h-screen  text-white p-4 sm:p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={() => navigate('/admin')} 
                    className="flex items-center gap-2 text-gray-400 hover:text-green-400 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>
                
                <h1 className="text-3xl font-bold text-white mb-2">Manage Team Members</h1>
                <p className="text-gray-400 mb-8">Add and manage present and past team members</p>
                
                {/* ... (Tabs, loading spinner, delete tab, etc. remain the same) ... */}

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
                        Add Member
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
                        Edit Member
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
                        Delete Member
                    </button>
                </div>

                <div className=" border border-gray-700 rounded-xl p-6">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'add' && (
                                <div>
                                    <h2 className="text-xl font-bold text-green-400 mb-6 flex items-center gap-2">
                                        <User size={24} />
                                        Add New Team Member
                                    </h2>
                                    {renderForm(handleAdd, 'Add Team Member')}
                                </div>
                            )}
                            
                            {activeTab === 'edit' && (
                                <div>
                                    <h2 className="text-xl font-bold text-green-400 mb-6 flex items-center gap-2">
                                        <Edit size={24} />
                                        Edit Team Member
                                    </h2>
                                    <TypeFilter />
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Select Member to Edit
                                    </label>
                                    <select 
                                        value={selectedMemberId} 
                                        onChange={(e) => setSelectedMemberId(e.target.value)} 
                                        className="w-full bg-gray-900 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all mb-6"
                                    >
                                        <option value="">-- Choose a team member --</option>
                                        {filteredMembers.map(m => (
                                            <option key={m._id} value={m._id}>
                                                {m.name} - {m.type === 'present' ? 'Present' : 'Past'}
                                            </option>
                                        ))}
                                    </select>
                                    {selectedMemberId ? (
                                        renderForm(handleUpdate, 'Update Team Member')
                                    ) : (
                                        <div className="text-center py-8 text-gray-400">
                                            <Edit className="mx-auto mb-3 opacity-50" size={48} />
                                            <p>Select a team member from the dropdown to start editing</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {activeTab === 'delete' && (
                                <div>
                                    <h2 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-2">
                                        <Trash2 size={24} />
                                        Delete Team Members
                                    </h2>
                                    <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6">
                                        <p className="text-red-300 text-sm">
                                            ⚠️ Warning: Deleting team members is permanent and cannot be undone.
                                        </p>
                                    </div>
                                    <TypeFilter />
                                    
                                    {filteredMembers.length === 0 ? (
                                        <div className="text-center py-8 text-gray-400">
                                            <p>No team members found for the selected type</p>
                                        </div>
                                    ) : (
                                        <ul className="space-y-4">
                                            {filteredMembers.map(m => {
                                                const TypeIcon = types.find(t => t.id === m.type)?.icon || User;
                                                const typeColor = m.type === 'present' ? 'bg-green-900/30 text-green-300' : 'bg-yellow-900/30 text-yellow-300';
                                                
                                                return (
                                                    <li key={m._id} className="flex items-center justify-between bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                                                        <div className="flex items-start gap-4 flex-1">
                                                            <div className="flex-shrink-0">
                                                                {m.image ? (
                                                                    <img 
                                                                        src={`${import.meta.env.VITE_API_URL}/uploads/${m.image}`} 
                                                                        alt={m.name}
                                                                        className="h-12 w-12 rounded-full object-cover border border-gray-600"
                                                                    />
                                                                ) : (
                                                                    <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600">
                                                                        <User size={20} className="text-gray-400" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-white font-medium">{m.name}</p>
                                                                <p className="text-gray-300 text-sm mt-1">{m.title}</p>
                                                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                                                                    <span className={`px-3 py-1 rounded-full capitalize ${typeColor}`}>
                                                                        {m.type} Member
                                                                    </span>
                                                                </div>
                                                                {m.about && (
                                                                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                                                                        {m.about}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={() => handleDelete(m._id)} 
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-900/30 p-2 rounded-lg transition-colors ml-4 flex-shrink-0"
                                                            title="Delete team member"
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

export default EditTeamMembers;