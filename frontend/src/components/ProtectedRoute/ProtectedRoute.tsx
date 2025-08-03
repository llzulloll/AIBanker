import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { CircularProgress, Box } from '@mui/material';

export const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}; 