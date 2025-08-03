import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
    loading: boolean;
    notifications: Array<{
        id: string;
        type: 'info' | 'success' | 'warning' | 'error';
        message: string;
        timestamp: number;
    }>;
}

const initialState: UIState = {
    sidebarOpen: true,
    theme: 'light',
    loading: false,
    notifications: [],
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebarOpen: (state, action: PayloadAction<boolean>) => {
            state.sidebarOpen = action.payload;
        },
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        addNotification: (state, action: PayloadAction<{
            type: 'info' | 'success' | 'warning' | 'error';
            message: string;
        }>) => {
            const notification = {
                id: Date.now().toString(),
                ...action.payload,
                timestamp: Date.now(),
            };
            state.notifications.push(notification);
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(
                notif => notif.id !== action.payload
            );
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
    },
});

export const {
    toggleSidebar,
    setSidebarOpen,
    setTheme,
    setLoading,
    addNotification,
    removeNotification,
    clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;