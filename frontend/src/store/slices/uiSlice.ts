import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
    sidebarOpen: boolean;
    notifications: Notification[];
    theme: 'light' | 'dark';
    loadingStates: Record<string, boolean>;
    modals: {
        createDeal: boolean;
        uploadDocument: boolean;
        confirmDelete: boolean;
    };
}

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    title?: string;
    duration?: number;
    timestamp: number;
}

const initialState: UIState = {
    sidebarOpen: true,
    notifications: [],
    theme: 'light',
    loadingStates: {},
    modals: {
        createDeal: false,
        uploadDocument: false,
        confirmDelete: false,
    },
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
        addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
            const notification: Notification = {
                ...action.payload,
                id: Date.now().toString(),
                timestamp: Date.now(),
            };
            state.notifications.push(notification);
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(
                notification => notification.id !== action.payload
            );
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload;
        },
        setLoadingState: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
            state.loadingStates[action.payload.key] = action.payload.loading;
        },
        clearLoadingState: (state, action: PayloadAction<string>) => {
            delete state.loadingStates[action.payload];
        },
        openModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
            state.modals[action.payload] = true;
        },
        closeModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
            state.modals[action.payload] = false;
        },
        closeAllModals: (state) => {
            Object.keys(state.modals).forEach(key => {
                state.modals[key as keyof UIState['modals']] = false;
            });
        },
    },
});

export const {
    toggleSidebar,
    setSidebarOpen,
    addNotification,
    removeNotification,
    clearNotifications,
    setTheme,
    setLoadingState,
    clearLoadingState,
    openModal,
    closeModal,
    closeAllModals,
} = uiSlice.actions;

export default uiSlice.reducer; 