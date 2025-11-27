import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import API_BASE_URL from '../config';
import FlashcardView from './FlashcardView';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dueCount, setDueCount] = useState(0);
    const [dueCards, setDueCards] = useState([]);
    const [showReview, setShowReview] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const offset = new Date().getTimezoneOffset();
                const response = await fetch(`${API_BASE_URL}/api/analytics/stats?timezone_offset=${offset}`);
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchDueCards = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/study/flashcards/due`);
                if (response.ok) {
                    const data = await response.json();
                    setDueCards(data);
                    setDueCount(data.length);
                }
            } catch (error) {
                console.error('Error fetching due cards:', error);
            }
        };

        fetchStats();
        fetchDueCards();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!stats) return null;

    // Prepare data for Pie Chart
    const pieData = Object.entries(stats.activity_breakdown || {}).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const historyData = stats.daily_history || [];

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Study Dashboard</h1>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Streak Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Current Streak</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.current_streak} <span className="text-lg">days</span></p>
                        </div>
                        <div className="text-4xl">🔥</div>
                    </div>
                </div>

                {/* Total Time Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Study Time</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.total_minutes} <span className="text-lg">min</span></p>
                        </div>
                        <div className="text-4xl">⏱️</div>
                    </div>
                </div>

                {/* Due Cards Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-sm text-gray-500">Due for Review</p>
                                <p className="text-3xl font-bold text-blue-600">{dueCount} <span className="text-lg">cards</span></p>
                            </div>
                            <div className="text-4xl">🧠</div>
                        </div>
                        {dueCount > 0 && (
                            <button
                                onClick={() => setShowReview(true)}
                                className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                            >
                                Review Now →
                            </button>
                        )}
                    </div>
                </div>

                {/* Sessions Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Sessions</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {Object.values(stats.activity_breakdown || {}).reduce((a, b) => a + b, 0)}
                            </p>
                        </div>
                        <div className="text-4xl">📚</div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Activity Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Activity Breakdown</h2>
                    <div className="h-64">
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">
                                No activity data yet
                            </div>
                        )}
                    </div>
                </div>

                {/* Study History */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Weekly Progress</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height={256}>
                            <BarChart data={historyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#F3F4F6' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="minutes" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* FlashcardView Modal */}
            {showReview && dueCards.length > 0 && (
                <FlashcardView
                    cards={dueCards}
                    onClose={() => {
                        setShowReview(false);
                        // Refresh due count after review
                        const fetchDueCards = async () => {
                            try {
                                const response = await fetch(`${API_BASE_URL}/api/study/flashcards/due`);
                                if (response.ok) {
                                    const data = await response.json();
                                    setDueCards(data);
                                    setDueCount(data.length);
                                }
                            } catch (error) {
                                console.error('Error fetching due cards:', error);
                            }
                        };
                        fetchDueCards();
                    }}
                    documentId={null}
                />
            )}
        </div>
    );
};

export default Dashboard;
