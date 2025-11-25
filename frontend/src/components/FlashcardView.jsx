import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FocusTrap from 'focus-trap-react';
import API_BASE_URL from '../config';

const FlashcardView = ({ cards, onClose, documentId }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const sessionIdRef = useRef(null);

    useEffect(() => {
        startSession();

        // Esc key handler
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);

        return () => {
            endSession();
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    const startSession = async () => {
        if (!documentId) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/analytics/session/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    document_id: documentId,
                    activity_type: 'flashcards'
                })
            });
            if (response.ok) {
                const data = await response.json();
                sessionIdRef.current = data.id;
            }
        } catch (error) {
            console.error('Error starting session:', error);
        }
    };

    const endSession = async () => {
        if (!sessionIdRef.current) return;
        try {
            await fetch(`${API_BASE_URL}/api/analytics/session/end`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionIdRef.current }),
                keepalive: true
            });
        } catch (error) {
            console.error('Error ending session:', error);
        }
    };

    const handleNext = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    };

    const handleRate = async (grade) => {
        const currentCard = cards[currentIndex];
        if (!currentCard.id) return;

        try {
            await fetch(`${API_BASE_URL}/api/study/flashcards/${currentCard.id}/review`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ grade })
            });
            handleNext();
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    if (!cards || cards.length === 0) return null;

    return (
        <FocusTrap
            focusTrapOptions={{
                initialFocus: false,
                escapeDeactivates: false,
                clickOutsideDeactivates: false,
                returnFocusOnDeactivate: true
            }}
        >
            <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="flashcard-title"
            >
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center">
                        <h3 id="flashcard-title" className="text-lg font-semibold text-gray-900">Flashcards ({currentIndex + 1}/{cards.length})</h3>
                        <button
                            onClick={onClose}
                            aria-label="Close flashcard viewer"
                            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="p-8 h-96 flex flex-col items-center justify-center bg-gray-50">
                        <div
                            className="relative w-full h-full cursor-pointer perspective-1000"
                            onClick={() => setIsFlipped(!isFlipped)}
                        >
                            <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                                {/* Front */}
                                <div className={`absolute inset-0 backface-hidden bg-white rounded-xl shadow-md flex items-center justify-center p-8 text-center border-2 border-blue-100 ${isFlipped ? 'hidden' : ''}`}>
                                    <p className="text-xl font-medium text-gray-800">{cards[currentIndex].front}</p>
                                    <p className="absolute bottom-4 text-sm text-gray-400">Click to flip</p>
                                </div>

                                {/* Back */}
                                <div className={`absolute inset-0 backface-hidden bg-blue-50 rounded-xl shadow-md flex items-center justify-center p-8 text-center border-2 border-blue-200 ${!isFlipped ? 'hidden' : ''}`}>
                                    <p className="text-xl text-gray-800">{cards[currentIndex].back}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t bg-white flex justify-between items-center">
                        {isFlipped ? (
                            <div className="flex space-x-2 w-full justify-center">
                                <button onClick={() => handleRate(0)} className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 font-medium">Again</button>
                                <button onClick={() => handleRate(3)} className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 font-medium">Hard</button>
                                <button onClick={() => handleRate(4)} className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-medium">Good</button>
                                <button onClick={() => handleRate(5)} className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 font-medium">Easy</button>
                            </div>
                        ) : (
                            <div className="flex justify-between w-full">
                                <button
                                    onClick={handlePrev}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </FocusTrap>
    );
};

export default FlashcardView;
