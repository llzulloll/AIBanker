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
} from '@mui/material';
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

        const result = await login(formData);
        if (login.fulfilled.match(result)) {
            navigate('/dashboard');
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
                bgcolor: 'background.default',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    width: '100%',
                    maxWidth: 400,
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    AIBanker
                </Typography>
                <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary">
                    Sign in to your account
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        margin="normal"
                        required
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
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
                    </Button>
                    <Box sx={{ textAlign: 'center' }}>
                        <Link href="/register" variant="body2">
                            Don't have an account? Sign up
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default Login; 