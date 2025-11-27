import API_BASE_URL from '../config';

export const authenticatedFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('authToken');

    const headers = {
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Ensure Content-Type is JSON unless it's FormData (upload)
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        // Force reload to clear state and show login
        window.location.href = '/';
    }

    return response;
};
