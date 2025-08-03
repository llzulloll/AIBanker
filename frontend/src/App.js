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

// Apple-inspired theme with modern design
const theme = createTheme({
    palette: {
        primary: {
            main: '#007AFF', // iOS Blue
            light: '#5AC8FA',
            dark: '#0051D0',
        },
        secondary: {
            main: '#FF3B30', // iOS Red
            light: '#FF6961',
            dark: '#D70015',
        },
        background: {
            default: '#F2F2F7', // iOS Light Gray
            paper: '#FFFFFF',
        },
        text: {
            primary: '#000000',
            secondary: '#6D6D80',
        },
        grey: {
            50: '#FAFAFA',
            100: '#F2F2F7',
            200: '#E5E5EA',
            300: '#D1D1D6',
            400: '#C7C7CC',
            500: '#AEAEB2',
            600: '#8E8E93',
            700: '#636366',
            800: '#48484A',
            900: '#1C1C1E',
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"SF Pro Display"',
            '"SF Pro Text"',
            'system-ui',
            'sans-serif',
        ].join(','),
        h1: {
            fontSize: '2.75rem',
            fontWeight: 700,
            letterSpacing: '-0.022em',
        },
        h2: {
            fontSize: '2.25rem',
            fontWeight: 700,
            letterSpacing: '-0.022em',
        },
        h3: {
            fontSize: '1.875rem',
            fontWeight: 600,
            letterSpacing: '-0.021em',
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
            letterSpacing: '-0.021em',
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 600,
            letterSpacing: '-0.02em',
        },
        h6: {
            fontSize: '1.125rem',
            fontWeight: 600,
            letterSpacing: '-0.02em',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.47,
            letterSpacing: '-0.022em',
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.43,
            letterSpacing: '-0.016em',
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
            letterSpacing: '-0.022em',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    padding: '8px 20px',
                    transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 8px 25px rgba(0, 122, 255, 0.15)',
                    },
                },
                contained: {
                    boxShadow: '0 4px 12px rgba(0, 122, 255, 0.15)',
                    '&:hover': {
                        boxShadow: '0 8px 25px rgba(0, 122, 255, 0.25)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.06)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 10,
                        backgroundColor: '#FAFAFA',
                        transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                        '&:hover': {
                            backgroundColor: '#F5F5F5',
                        },
                        '&.Mui-focused': {
                            backgroundColor: '#FFFFFF',
                            boxShadow: '0 0 0 3px rgba(0, 122, 255, 0.1)',
                        },
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 500,
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRadius: 0,
                    borderRight: '1px solid rgba(0, 0, 0, 0.08)',
                    boxShadow: 'none',
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