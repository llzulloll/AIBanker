import React from 'react';
import { Box, Typography } from '@mui/material';

const Profile: React.FC = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                Profile
            </Typography>
            <Typography variant="body1" color="text.secondary">
                User profile management - Coming soon...
            </Typography>
        </Box>
    );
};

export default Profile;