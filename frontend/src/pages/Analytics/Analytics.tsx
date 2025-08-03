import React from 'react';
import { Box, Typography } from '@mui/material';

const Analytics: React.FC = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Performance analytics and insights - Coming soon...
            </Typography>
        </Box>
    );
};

export default Analytics;