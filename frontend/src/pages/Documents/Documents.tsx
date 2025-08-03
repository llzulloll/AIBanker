import React from 'react';
import { Box, Typography } from '@mui/material';

const Documents: React.FC = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                Documents
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Document management page - Coming soon...
            </Typography>
        </Box>
    );
};

export default Documents;