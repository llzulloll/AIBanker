import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dealsReducer from './slices/dealsSlice';
import documentsReducer from './slices/documentsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        deals: dealsReducer,
        documents: documentsReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 