import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../config';

const QuizView = ({ questions, onClose, documentId }) => {
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const sessionIdRef = useRef(null);

    useEffect(() => {
        startSession();
        return () => {
            endSession();
        };
    }, []);

    const startSession = async () => {
        if (!documentId) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/analytics/session/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    document_id: documentId,
                    activity_type: 'quiz'
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

    const handleAnswer = (questionIndex, option) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: option
        }));
    };

    const calculateScore = () => {
        let correct = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correct_answer) correct++;
        });
        return correct;
    };

    if (!questions || !Array.isArray(questions) || questions.length === 0) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                    <h3 className="text-lg font-semibold text-gray-900">Quiz</h3>
                    <button
                        onClick={onClose}
                        aria-label="Close quiz"
                        className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {showResults && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center mb-6">
                            <p className="text-lg font-bold text-green-800">
                                Score: {calculateScore()} / {questions.length}
                            </p>
                        </div>
                    )}

                    {questions.map((q, idx) => (
                        <div key={idx} className="space-y-3">
                            <p className="font-medium text-gray-900">{idx + 1}. {q.question}</p>
                            <div className="space-y-2">
                                {q.options.map((option, optIdx) => {
                                    const isSelected = answers[idx] === option;
                                    const isCorrect = option === q.correct_answer;
                                    let className = "w-full text-left p-3 rounded-lg border transition-colors ";

                                    if (showResults) {
                                        if (isCorrect) className += "bg-green-100 border-green-300 text-green-800";
                                        else if (isSelected && !isCorrect) className += "bg-red-100 border-red-300 text-red-800";
                                        else className += "bg-gray-50 border-gray-200 text-gray-500";
                                    } else {
                                        if (isSelected) className += "bg-blue-50 border-blue-300 text-blue-700";
                                        else className += "bg-white border-gray-200 hover:bg-gray-50";
                                    }

                                    return (
                                        <button
                                            key={optIdx}
                                            onClick={() => !showResults && handleAnswer(idx, option)}
                                            className={className}
                                            disabled={showResults}
                                        >
                                            <span className="flex items-center justify-between">
                                                <span>{option}</span>
                                                {showResults && isCorrect && (
                                                    <span className="ml-2 text-green-700 font-bold" aria-label="Correct answer">✓</span>
                                                )}
                                                {showResults && isSelected && !isCorrect && (
                                                    <span className="ml-2 text-red-700 font-bold" aria-label="Incorrect answer">✗</span>
                                                )}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t bg-white sticky bottom-0">
                    {!showResults ? (
                        <button
                            onClick={() => setShowResults(true)}
                            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                            disabled={Object.keys(answers).length < questions.length}
                        >
                            Submit Quiz
                        </button>
                    ) : (
                        <button
                            onClick={onClose}
                            className="w-full py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-medium"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizView;
