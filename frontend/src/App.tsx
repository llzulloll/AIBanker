import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store/store';

// Components
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Deals from './pages/Deals/Deals';
import DealDetail from './pages/Deals/DealDetail';
import Documents from './pages/Documents/Documents';
import DueDiligence from './pages/DueDiligence/DueDiligence';
import Pitchbooks from './pages/Pitchbooks/Pitchbooks';
import Analytics from './pages/Analytics/Analytics';
import Profile from './pages/Profile/Profile';

// Hooks
import { useAuth } from './hooks/useAuth';

// Types
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';

// Create theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
        },
        secondary: {
            main: '#dc004e',
            light: '#ff5983',
            dark: '#9a0036',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 600,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 500,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 500,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
    },
});

function AppContent() {
    const { isAuthenticated } = useAuth();

    return (
        <Router>
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                <CssBaseline />
                <Routes>
                    {/* Public routes */}
                    <Route
                        path="/login"
                        element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />}
                    />
                    <Route
                        path="/register"
                        element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />}
                    />

                    {/* Protected routes */}
                    <Route path="/" element={<ProtectedRoute />}>
                        <Route element={<Layout />}>
                            <Route index element={<Navigate to="/dashboard" replace />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="deals" element={<Deals />} />
                            <Route path="deals/:id" element={<DealDetail />} />
                            <Route path="documents" element={<Documents />} />
                            <Route path="due-diligence" element={<DueDiligence />} />
                            <Route path="pitchbooks" element={<Pitchbooks />} />
                            <Route path="analytics" element={<Analytics />} />
                            <Route path="profile" element={<Profile />} />
                        </Route>
                    </Route>

                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Box>
        </Router>
    );
}

function App() {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <AppContent />
            </ThemeProvider>
        </Provider>
    );
}

export default App; 