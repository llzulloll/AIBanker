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
    Grid,
} from '@mui/material';
import { PersonAddRounded } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        company_name: '',
        job_title: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const { register, isLoading, error, clearError } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.username) {
            newErrors.username = 'Username is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirm password is required';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.first_name) {
            newErrors.first_name = 'First name is required';
        }

        if (!formData.last_name) {
            newErrors.last_name = 'Last name is required';
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
            const { confirmPassword, ...registerData } = formData;
            await register(registerData);
            navigate('/dashboard');
        } catch (error) {
            console.error('Registration error:', error);
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
                    maxWidth: 600,
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
                            <PersonAddRounded sx={{ color: '#007AFF', fontSize: 32 }} />
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
                            Join AIBanker
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                            Create your account to start closing more deals
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

                    {/* Register Form */}
                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    error={!!errors.first_name}
                                    helperText={errors.first_name}
                                    required
                                    autoComplete="given-name"
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    error={!!errors.last_name}
                                    helperText={errors.last_name}
                                    required
                                    autoComplete="family-name"
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    required
                                    autoComplete="email"
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    error={!!errors.username}
                                    helperText={errors.username}
                                    required
                                    autoComplete="username"
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    required
                                    autoComplete="new-password"
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword}
                                    required
                                    autoComplete="new-password"
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Company Name"
                                    name="company_name"
                                    value={formData.company_name}
                                    onChange={handleChange}
                                    autoComplete="organization"
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Job Title"
                                    name="job_title"
                                    value={formData.job_title}
                                    onChange={handleChange}
                                    autoComplete="organization-title"
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                        </Grid>

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
                                'Create Account'
                            )}
                        </Button>

                        {/* Divider */}
                        <Divider sx={{ mb: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                Already have an account?
                            </Typography>
                        </Divider>

                        {/* Sign In Link */}
                        <Box sx={{ textAlign: 'center' }}>
                            <Link
                                href="/login"
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
                                Sign in to your account
                            </Link>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Register;