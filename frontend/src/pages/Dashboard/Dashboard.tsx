import React from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Paper,
} from '@mui/material';
import {
    Business,
    Description,
    Assessment,
    Analytics,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
    const stats = [
        {
            title: 'Active Deals',
            value: '12',
            icon: <Business />,
            color: '#1976d2',
        },
        {
            title: 'Documents Processed',
            value: '156',
            icon: <Description />,
            color: '#388e3c',
        },
        {
            title: 'Due Diligence Reports',
            value: '8',
            icon: <Assessment />,
            color: '#f57c00',
        },
        {
            title: 'Pitchbooks Generated',
            value: '15',
            icon: <Analytics />,
            color: '#7b1fa2',
        },
    ];

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>

            <Grid container spacing={3}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card>
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Box
                                        sx={{
                                            color: stat.color,
                                            mr: 2,
                                        }}
                                    >
                                        {stat.icon}
                                    </Box>
                                    <Typography variant="h6" component="div">
                                        {stat.title}
                                    </Typography>
                                </Box>
                                <Typography variant="h4" component="div" color="primary">
                                    {stat.value}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Activity
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            No recent activity to display.
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Quick Actions
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Create new deal, upload documents, or generate reports.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard; 