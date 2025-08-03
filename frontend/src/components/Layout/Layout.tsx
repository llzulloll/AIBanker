import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import { Menu as MenuIcon, Dashboard, Business, Description, Assessment, Analytics, Person } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { toggleSidebar, setSidebarOpen } from '../../store/slices/uiSlice';

const drawerWidth = 240;

const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Deals', icon: <Business />, path: '/deals' },
    { text: 'Documents', icon: <Description />, path: '/documents' },
    { text: 'Due Diligence', icon: <Assessment />, path: '/due-diligence' },
    { text: 'Pitchbooks', icon: <Analytics />, path: '/pitchbooks' },
    { text: 'Analytics', icon: <Analytics />, path: '/analytics' },
    { text: 'Profile', icon: <Person />, path: '/profile' },
];

export const Layout: React.FC = () => {
    const theme = useTheme();
    const { user, logout } = useAuth();
    const dispatch = useDispatch();
    const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);

    const handleDrawerToggle = () => {
        dispatch(toggleSidebar());
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <Box sx={{ display: 'flex' }}>
            {/* App Bar */}
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        AIBanker
                    </Typography>
                    <Typography variant="body2" sx={{ mr: 2 }}>
                        {user?.email}
                    </Typography>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <Person />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={sidebarOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    <SidebarContent />
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    <SidebarContent />
                </Drawer>
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    mt: 8,
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

const SidebarContent: React.FC = () => {
    return (
        <Box>
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    AIBanker
                </Typography>
            </Toolbar>
            <List>
                {menuItems.map((item) => (
                    <ListItem button key={item.text}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default Layout; 