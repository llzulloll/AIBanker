import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../services/authApi';

export interface User {
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
}

export interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null,
};

// Async thunks
export const login = createAsyncThunk(
    'auth/login',
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await authApi.login(credentials);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Login failed');
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (userData: {
        email: string;
        username: string;
        password: string;
        first_name?: string;
        last_name?: string;
        company_name?: string;
        job_title?: string;
    }, { rejectWithValue }) => {
        try {
            const response = await authApi.register(userData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Registration failed');
        }
    }
);

export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { auth: AuthState };
            const response = await authApi.refreshToken(state.auth.refreshToken!);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Token refresh failed');
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async () => {
        try {
            await authApi.logout();
        } catch (error) {
            // Continue with logout even if API call fails
        }
    }
);

export const getCurrentUser = createAsyncThunk(
    'auth/getCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authApi.getCurrentUser();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to get user info');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem('token', action.payload);
        },
        clearAuth: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.access_token;
                state.refreshToken = action.payload.refresh_token;
                localStorage.setItem('token', action.payload.access_token);
                localStorage.setItem('refreshToken', action.payload.refresh_token);
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Register
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.access_token;
                state.refreshToken = action.payload.refresh_token;
                localStorage.setItem('token', action.payload.access_token);
                localStorage.setItem('refreshToken', action.payload.refresh_token);
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Refresh Token
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.token = action.payload.access_token;
                state.refreshToken = action.payload.refresh_token;
                localStorage.setItem('token', action.payload.access_token);
                localStorage.setItem('refreshToken', action.payload.refresh_token);
            })
            .addCase(refreshToken.rejected, (state) => {
                state.user = null;
                state.token = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
            })
            // Get Current User
            .addCase(getCurrentUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, setToken, clearAuth } = authSlice.actions;
export default authSlice.reducer; 