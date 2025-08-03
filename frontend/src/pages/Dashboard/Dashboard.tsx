import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Paper,
    LinearProgress,
    Chip,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    IconButton,
    Button,
    Divider,
} from '@mui/material';
import {
    Business,
    Description,
    Assessment,
    Analytics,
    TrendingUp,
    Schedule,
    AttachMoney,
    People,
    ArrowUpward,
    ArrowDownward,
    MoreVert,
    Add,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
    total_deals: number;
    active_deals: number;
    completed_deals: number;
    documents_processed: number;
    due_diligence_reports: number;
    pitchbooks_generated: number;
    total_deal_value: number;
    avg_processing_time: number;
    deals_by_status: Record<string, number>;
    deals_by_type: Record<string, number>;
    recent_activity: Array<{
        type: string;
        message: string;
        timestamp: string;
    }>;
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data for now
        const mockStats: DashboardStats = {
            total_deals: 24,
            active_deals: 12,
            completed_deals: 8,
            documents_processed: 156,
            due_diligence_reports: 18,
            pitchbooks_generated: 15,
            total_deal_value: 2400000000,
            avg_processing_time: 45.5,
            deals_by_status: {
                'in_progress': 8,
                'due_diligence': 4,
                'completed': 8,
                'draft': 4,
            },
            deals_by_type: {
                'mna': 12,
                'ipo': 3,
                'private_equity': 6,
                'debt_financing': 3,
            },
            recent_activity: [
                {
                    type: 'deal_created',
                    message: 'New M&A deal "TechCorp Acquisition" created',
                    timestamp: new Date().toISOString(),
                },
                {
                    type: 'document_processed',
                    message: 'Due diligence document processed for DataFlow Inc',
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                },
                {
                    type: 'pitchbook_generated',
                    message: 'Pitchbook generated for CloudTech acquisition',
                    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                },
            ],
        };
        
        setStats(mockStats);
        setLoading(false);
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatTimeAgo = (timestamp: string) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        return `${Math.floor(diffInHours / 24)}d ago`;
    };

    if (loading) {
        return (
            <Box sx={{ width: '100%', mt: 4 }}>
                <LinearProgress />
            </Box>
        );
    }

    const mainStats = [
        {
            title: 'Active Deals',
            value: stats?.active_deals || 0,
            icon: <Business />,
            color: '#007AFF',
            change: '+12%',
            changeType: 'up' as const,
        },
        {
            title: 'Total Deal Value',
            value: formatCurrency(stats?.total_deal_value || 0),
            icon: <AttachMoney />,
            color: '#34C759',
            change: '+8.2%',
            changeType: 'up' as const,
        },
        {
            title: 'Documents Processed',
            value: stats?.documents_processed || 0,
            icon: <Description />,
            color: '#FF9500',
            change: '+25%',
            changeType: 'up' as const,
        },
        {
            title: 'Avg Processing Time',
            value: `${stats?.avg_processing_time || 0}min`,
            icon: <Schedule />,
            color: '#5856D6',
            change: '-15%',
            changeType: 'down' as const,
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                        Welcome back! 👋
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Here's what's happening with your deals today.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/deals')}
                    sx={{
                        bgcolor: '#007AFF',
                        px: 3,
                        py: 1.5,
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                    }}
                >
                    New Deal
                </Button>
            </Box>

            {/* Main Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {mainStats.map((stat, index) => (
                    <Grid item xs={12} sm={6} lg={3} key={index}>
                        <Card
                            sx={{
                                height: '100%',
                                background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
                                border: '1px solid rgba(0, 0, 0, 0.06)',
                                cursor: 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                                },
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: `${stat.color}15`,
                                            color: stat.color,
                                            width: 48,
                                            height: 48,
                                            mr: 2,
                                        }}
                                    >
                                        {stat.icon}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                            {stat.title}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography variant="h4" sx={{ fontWeight: 700, mr: 1 }}>
                                                {stat.value}
                                            </Typography>
                                            <Chip
                                                icon={stat.changeType === 'up' ? <ArrowUpward /> : <ArrowDownward />}
                                                label={stat.change}
                                                size="small"
                                                sx={{
                                                    bgcolor: stat.changeType === 'up' ? '#34C75915' : '#FF3B3015',
                                                    color: stat.changeType === 'up' ? '#34C759' : '#FF3B30',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    '& .MuiChip-icon': {
                                                        fontSize: '0.875rem',
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {/* Deal Pipeline */}
                <Grid item xs={12} lg={8}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                    Deal Pipeline
                                </Typography>
                                <IconButton size="small">
                                    <MoreVert />
                                </IconButton>
                            </Box>
                            
                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Progress
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        68% of goal
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={68}
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: '#F2F2F7',
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 4,
                                            background: 'linear-gradient(90deg, #007AFF 0%, #5AC8FA 100%)',
                                        },
                                    }}
                                />
                            </Box>

                            <Grid container spacing={2}>
                                {Object.entries(stats?.deals_by_status || {}).map(([status, count]) => (
                                    <Grid item xs={6} sm={3} key={status}>
                                        <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: '#F8F9FA' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                                {count}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                                                {status.replace('_', ' ')}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Activity */}
                <Grid item xs={12} lg={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                                Recent Activity
                            </Typography>
                            
                            <List sx={{ p: 0 }}>
                                {stats?.recent_activity.map((activity, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem sx={{ px: 0, py: 1.5 }}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        bgcolor: '#007AFF15',
                                                        color: '#007AFF',
                                                    }}
                                                >
                                                    {activity.type === 'deal_created' && <Business />}
                                                    {activity.type === 'document_processed' && <Description />}
                                                    {activity.type === 'pitchbook_generated' && <Analytics />}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                                                        {activity.message}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography variant="body2" color="text.secondary">
                                                        {formatTimeAgo(activity.timestamp)}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                        {index < stats.recent_activity.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                                Quick Actions
                            </Typography>
                            
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<Add />}
                                        onClick={() => navigate('/deals')}
                                        sx={{
                                            py: 2,
                                            borderRadius: 3,
                                            borderColor: '#E5E5EA',
                                            color: '#007AFF',
                                            '&:hover': {
                                                borderColor: '#007AFF',
                                                bgcolor: '#007AFF05',
                                            },
                                        }}
                                    >
                                        Create Deal
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<Description />}
                                        onClick={() => navigate('/documents')}
                                        sx={{
                                            py: 2,
                                            borderRadius: 3,
                                            borderColor: '#E5E5EA',
                                            color: '#FF9500',
                                            '&:hover': {
                                                borderColor: '#FF9500',
                                                bgcolor: '#FF950005',
                                            },
                                        }}
                                    >
                                        Upload Documents
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<Assessment />}
                                        onClick={() => navigate('/due-diligence')}
                                        sx={{
                                            py: 2,
                                            borderRadius: 3,
                                            borderColor: '#E5E5EA',
                                            color: '#34C759',
                                            '&:hover': {
                                                borderColor: '#34C759',
                                                bgcolor: '#34C75905',
                                            },
                                        }}
                                    >
                                        Run Due Diligence
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<Analytics />}
                                        onClick={() => navigate('/pitchbooks')}
                                        sx={{
                                            py: 2,
                                            borderRadius: 3,
                                            borderColor: '#E5E5EA',
                                            color: '#5856D6',
                                            '&:hover': {
                                                borderColor: '#5856D6',
                                                bgcolor: '#5856D605',
                                            },
                                        }}
                                    >
                                        Generate Pitchbook
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;