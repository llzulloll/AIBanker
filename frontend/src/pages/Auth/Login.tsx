import React, { useState } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Link,
    Alert,
    CircularProgress,
    Card,
    CardContent,
    Divider,
} from '@mui/material';
import { LoginRounded, PersonRounded } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const { login, isLoading, error, clearError } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if (!validateForm()) {
            return;
        }

        try {
            await login(formData);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: 3,
            }}
        >
            <Card
                sx={{
                    width: '100%',
                    maxWidth: 440,
                    borderRadius: 4,
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    overflow: 'hidden',
                }}
            >
                <CardContent sx={{ p: 5 }}>
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 64,
                                height: 64,
                                borderRadius: '50%',
                                bgcolor: '#007AFF15',
                                mb: 2,
                            }}
                        >
                            <LoginRounded sx={{ color: '#007AFF', fontSize: 32 }} />
                        </Box>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                mb: 1,
                                background: 'linear-gradient(45deg, #007AFF, #5856D6)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            AIBanker
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                            Welcome back
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Sign in to your deal lifecycle platform
                        </Typography>
                    </Box>

                    {/* Error Alert */}
                    {error && (
                        <Alert 
                            severity="error" 
                            sx={{ 
                                mb: 3, 
                                borderRadius: 2,
                                '& .MuiAlert-message': {
                                    fontSize: '0.875rem',
                                }
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    {/* Login Form */}
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            margin="normal"
                            required
                            autoComplete="email"
                            autoFocus
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                                    '&:hover': {
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#007AFF',
                                        },
                                    },
                                    '&.Mui-focused': {
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#007AFF',
                                            borderWidth: 2,
                                        },
                                    },
                                },
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            margin="normal"
                            required
                            autoComplete="current-password"
                            sx={{
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                                    '&:hover': {
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#007AFF',
                                        },
                                    },
                                    '&.Mui-focused': {
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#007AFF',
                                            borderWidth: 2,
                                        },
                                    },
                                },
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading}
                            sx={{
                                py: 1.5,
                                mb: 3,
                                borderRadius: 3,
                                bgcolor: '#007AFF',
                                fontSize: '1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                boxShadow: '0 4px 12px rgba(0, 122, 255, 0.15)',
                                transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                                '&:hover': {
                                    bgcolor: '#0051D0',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 8px 25px rgba(0, 122, 255, 0.25)',
                                },
                                '&:disabled': {
                                    bgcolor: '#AEAEB2',
                                    transform: 'none',
                                    boxShadow: 'none',
                                },
                            }}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Sign In'
                            )}
                        </Button>

                        {/* Divider */}
                        <Divider sx={{ mb: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                Don't have an account?
                            </Typography>
                        </Divider>

                        {/* Sign Up Link */}
                        <Box sx={{ textAlign: 'center' }}>
                            <Link
                                href="/register"
                                variant="body1"
                                sx={{
                                    color: '#007AFF',
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                                    '&:hover': {
                                        color: '#0051D0',
                                        textDecoration: 'underline',
                                    },
                                }}
                            >
                                Create your account
                            </Link>
                        </Box>
                    </Box>

                    {/* Demo credentials hint */}
                    <Box
                        sx={{
                            mt: 4,
                            p: 2,
                            borderRadius: 2,
                            bgcolor: '#F2F2F7',
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Demo Credentials
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Email: demo@aibanker.com
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Password: demo123
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Login;