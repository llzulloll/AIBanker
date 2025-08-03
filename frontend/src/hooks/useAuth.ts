import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { login, register, logout, getCurrentUser, clearError } from '../store/slices/authSlice';

export const useAuth = () => {
    const dispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.auth);

    const handleLogin = async (credentials: { email: string; password: string }) => {
        return await dispatch(login(credentials));
    };

    const handleRegister = async (userData: {
        email: string;
        username: string;
        password: string;
        first_name?: string;
        last_name?: string;
        company_name?: string;
        job_title?: string;
    }) => {
        return await dispatch(register(userData));
    };

    const handleLogout = async () => {
        return await dispatch(logout());
    };

    const handleGetCurrentUser = async () => {
        return await dispatch(getCurrentUser());
    };

    const handleClearError = () => {
        dispatch(clearError());
    };

    return {
        // State
        user: auth.user,
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.isLoading,
        error: auth.error,
        token: auth.token,

        // Actions
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        getCurrentUser: handleGetCurrentUser,
        clearError: handleClearError,
    };
}; 