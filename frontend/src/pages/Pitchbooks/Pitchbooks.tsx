import React from 'react';
import { Box, Typography } from '@mui/material';

const Pitchbooks: React.FC = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                Pitchbooks
            </Typography>
            <Typography variant="body1" color="text.secondary">
                AI-powered pitchbook generation - Coming soon...
            </Typography>
        </Box>
    );
};

export default Pitchbooks;