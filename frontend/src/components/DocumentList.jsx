import React, { useEffect, useState } from 'react';
import FlashcardView from './FlashcardView';
import QuizView from './QuizView';
import ChatInterface from './ChatInterface';
import API_BASE_URL from '../config';

const DocumentList = ({ refreshTrigger }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFlashcards, setActiveFlashcards] = useState(null);
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [activeChat, setActiveChat] = useState(null); // { id: 1, title: "..." }
    const [generatingState, setGeneratingState] = useState(null); // { docId: 1, type: 'flashcards' | 'quiz' }
    const [searchQuery, setSearchQuery] = useState('');

    // Flashcard Configuration Modal State
    const [flashcardConfig, setFlashcardConfig] = useState(null); // { docId: 1 }
    const [flashcardCount, setFlashcardCount] = useState(5);

    useEffect(() => {
        fetchDocuments();
    }, [refreshTrigger]);

    const fetchDocuments = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/documents/`);
            if (response.ok) {
                const data = await response.json();
                setDocuments(data);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const initiateFlashcardGeneration = (docId) => {
        setFlashcardConfig({ docId });
        setFlashcardCount(5); // Reset to default
    };

    const confirmGenerateFlashcards = async () => {
        if (!flashcardConfig) return;
        const docId = flashcardConfig.docId;
        setFlashcardConfig(null); // Close modal

        setGeneratingId(docId);
        try {
            const response = await fetch(`${API_BASE_URL}/api/study/flashcards/${docId}?num_cards=${flashcardCount}`, {
                method: 'POST'
            });
            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    setActiveFlashcards({ docId, cards: data });
                } else {
                    alert("No flashcards generated. Please check backend logs for errors.");
                }
            } else {
                const errorData = await response.json();
                alert(`Failed to generate flashcards: ${errorData.detail || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error generating flashcards:', error);
            alert('Failed to generate flashcards. Check console for details.');
        } finally {
            setGeneratingId(null);
        }
    };

    const generateFlashcards = async (docId) => {
        setGeneratingState({ docId, type: 'flashcards' });
        try {
            const response = await fetch(`${API_BASE_URL}/api/study/flashcards/${docId}`, {
                method: 'POST'
            });
            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    setActiveFlashcards({ docId, cards: data });
                } else {
                    alert("No flashcards generated. Please check backend logs for errors.");
                }
            }
        } catch (error) {
            console.error('Error generating flashcards:', error);
            alert('Failed to generate flashcards. Check console for details.');
        } finally {
            setGeneratingId(null);
        }
    };

    const generateQuiz = async (docId) => {
        setGeneratingState({ docId, type: 'quiz' });
        try {
            const response = await fetch(`${API_BASE_URL}/api/study/quiz/${docId}`, {
                method: 'POST'
            });
            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    setActiveQuiz({ docId, questions: data });
                } else {
                    alert("No quiz generated. Please check backend logs for errors.");
                }
            }
        } catch (error) {
            console.error('Error generating quiz:', error);
            alert('Failed to generate quiz. Check console for details.');
        } finally {
            setGeneratingId(null);
        }
    };

    const handleDelete = async (docId, e) => {
        e.stopPropagation(); // Prevent triggering other clicks if any
        if (!window.confirm('Are you sure you want to delete this document?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/documents/${docId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Remove from local state
                setDocuments(prev => prev.filter(doc => doc.id !== docId));
            } else {
                alert('Failed to delete document');
            }
        } catch (error) {
            console.error('Error deleting document:', error);
            alert('Error deleting document');
        }
    };

    const handleUpdateCategory = async (docId, currentCategory) => {
        const newCategory = prompt("Enter new category:", currentCategory);
        if (newCategory && newCategory !== currentCategory) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/documents/${docId}/category?category=${encodeURIComponent(newCategory)}`, {
                    method: 'PUT'
                });

                if (response.ok) {
                    setDocuments(prev => prev.map(doc =>
                        doc.id === docId ? { ...doc, category: newCategory } : doc
                    ));
                } else {
                    alert('Failed to update category');
                }
            } catch (error) {
                console.error('Error updating category:', error);
                alert('Error updating category');
            }
        }
    };

    const filteredDocuments = documents.filter(doc =>
        doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <div className="text-center py-8 text-gray-500">Loading library...</div>;
    }

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Your Library</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm w-64"
                    />
                    <svg className="w-4 h-4 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {filteredDocuments.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <p className="text-gray-500">No documents found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDocuments.map((doc) => (
                        <div key={doc.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group">
                            <button
                                onClick={(e) => handleDelete(doc.id, e)}
                                className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                title="Delete document"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                    <div
                                        onClick={() => handleUpdateCategory(doc.id, doc.category)}
                                        className={`p-2 rounded-lg cursor-pointer hover:opacity-80 ${doc.file_type === 'PDF' ? 'bg-red-100 text-red-600' :
                                            doc.file_type === 'PPTX' ? 'bg-orange-100 text-orange-600' :
                                                'bg-blue-100 text-blue-600'
                                            }`}>
                                        <span className="text-xs font-bold">{doc.file_type}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900 truncate max-w-[150px]" title={doc.filename}>{doc.filename}</h3>
                                        <p
                                            className="text-xs text-gray-500 cursor-pointer hover:text-blue-600"
                                            onClick={() => handleUpdateCategory(doc.id, doc.category)}
                                        >
                                            {doc.category} • {new Date(doc.upload_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex space-x-2">
                                <button
                                    onClick={() => setActiveChat({ id: doc.id, title: doc.filename })}
                                    className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center justify-center space-x-1"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                    <span>Chat</span>
                                </button>
                                <button
                                    onClick={() => initiateFlashcardGeneration(doc.id)}
                                    disabled={generatingState?.docId === doc.id}
                                    className="flex-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 disabled:opacity-50"
                                >
                                    {generatingState?.docId === doc.id && generatingState?.type === 'flashcards' ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Generating...
                                        </>
                                    ) : 'Flashcards'}
                                </button>
                                <button
                                    onClick={() => generateQuiz(doc.id)}
                                    disabled={generatingState?.docId === doc.id}
                                    className="flex-1 px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 disabled:opacity-50"
                                >
                                    {generatingState?.docId === doc.id && generatingState?.type === 'quiz' ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Generating...
                                        </>
                                    ) : 'Quiz'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modals */}
            {/* Modals */}
            {activeFlashcards && (
                <FlashcardView
                    cards={activeFlashcards.cards}
                    documentId={activeFlashcards.docId}
                    onClose={() => setActiveFlashcards(null)}
                />
            )}
            {activeQuiz && (
                <QuizView
                    questions={activeQuiz.questions}
                    documentId={activeQuiz.docId}
                    onClose={() => setActiveQuiz(null)}
                />
            )}
            {activeChat && (
                <ChatInterface
                    documentId={activeChat.id}
                    documentTitle={activeChat.title}
                    onClose={() => setActiveChat(null)}
                />
            )}

            {/* Flashcard Configuration Modal */}
            {flashcardConfig && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Flashcards</h3>
                        <p className="text-sm text-gray-600 mb-4">How many flashcards would you like to generate?</p>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Cards</label>
                            <select
                                value={flashcardCount}
                                onChange={(e) => setFlashcardCount(Number(e.target.value))}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value={5}>5 Cards</option>
                                <option value={10}>10 Cards</option>
                                <option value={15}>15 Cards</option>
                            </select>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setFlashcardConfig(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmGenerateFlashcards}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                Generate
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentList;
