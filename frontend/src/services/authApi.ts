import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await api.post('/auth/refresh', {
                        refresh_token: refreshToken,
                    });

                    const { access_token, refresh_token } = response.data;
                    localStorage.setItem('token', access_token);
                    localStorage.setItem('refreshToken', refresh_token);

                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    username: string;
    password: string;
    first_name?: string;
    last_name?: string;
    company_name?: string;
    job_title?: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    user: {
        id: number;
        email: string;
        username: string;
        first_name?: string;
        last_name?: string;
        role: string;
        status: string;
        company_name?: string;
        job_title?: string;
        is_active: boolean;
        is_verified: boolean;
        created_at: string;
    };
}

export const authApi = {
    // Login
    login: async (credentials: LoginCredentials) => {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        return response;
    },

    // Register
    register: async (userData: RegisterData) => {
        const response = await api.post<AuthResponse>('/auth/register', userData);
        return response;
    },

    // Refresh token
    refreshToken: async (refreshToken: string) => {
        const response = await api.post<AuthResponse>('/auth/refresh', {
            refresh_token: refreshToken,
        });
        return response;
    },

    // Logout
    logout: async () => {
        const response = await api.post('/auth/logout');
        return response;
    },

    // Get current user
    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response;
    },

    // Change password
    changePassword: async (data: { current_password: string; new_password: string }) => {
        const response = await api.post('/auth/change-password', data);
        return response;
    },
}; 