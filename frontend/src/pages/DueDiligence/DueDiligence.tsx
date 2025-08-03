import React from 'react';
import { Box, Typography } from '@mui/material';

const DueDiligence: React.FC = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                Due Diligence
            </Typography>
            <Typography variant="body1" color="text.secondary">
                AI-powered due diligence automation - Coming soon...
            </Typography>
        </Box>
    );
};

export default DueDiligence;