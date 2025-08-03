import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar,
    Menu,
    MenuItem,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard,
    Business,
    Description,
    Assessment,
    Analytics,
    Person,
    Logout,
    Settings,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { toggleSidebar } from '../../store/slices/uiSlice';

const drawerWidth = 280;

const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Deals', icon: <Business />, path: '/deals' },
    { text: 'Documents', icon: <Description />, path: '/documents' },
    { text: 'Due Diligence', icon: <Assessment />, path: '/due-diligence' },
    { text: 'Pitchbooks', icon: <Analytics />, path: '/pitchbooks' },
    { text: 'Analytics', icon: <Analytics />, path: '/analytics' },
];

export const Layout: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const dispatch = useDispatch();
    const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);
    
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleDrawerToggle = () => {
        dispatch(toggleSidebar());
    };

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await logout();
        handleProfileMenuClose();
    };

    const isActive = (path: string) => location.pathname === path;

    const SidebarContent = () => (
        <Box sx={{ height: '100%', bgcolor: '#FAFAFA', borderRight: '1px solid #E5E5EA' }}>
            {/* Logo */}
            <Box sx={{ p: 3, borderBottom: '1px solid #E5E5EA' }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        color: '#007AFF',
                        letterSpacing: '-0.02em',
                    }}
                >
                    AIBanker
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Deal Lifecycle Platform
                </Typography>
            </Box>

            {/* Navigation */}
            <List sx={{ px: 2, py: 2 }}>
                {menuItems.map((item) => (
                    <ListItem
                        key={item.text}
                        onClick={() => navigate(item.path)}
                        sx={{
                            borderRadius: 2,
                            mb: 0.5,
                            cursor: 'pointer',
                            transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                            bgcolor: isActive(item.path) ? '#007AFF15' : 'transparent',
                            color: isActive(item.path) ? '#007AFF' : 'text.primary',
                            '&:hover': {
                                bgcolor: isActive(item.path) ? '#007AFF15' : '#F2F2F7',
                                transform: 'translateX(4px)',
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                color: 'inherit',
                                minWidth: 40,
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{
                                fontWeight: isActive(item.path) ? 600 : 500,
                                fontSize: '0.95rem',
                            }}
                        />
                    </ListItem>
                ))}
            </List>

            {/* User Profile */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 2,
                    borderTop: '1px solid #E5E5EA',
                    bgcolor: '#FFFFFF',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                        '&:hover': {
                            bgcolor: '#F2F2F7',
                        },
                    }}
                    onClick={handleProfileMenuOpen}
                >
                    <Avatar
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: '#007AFF',
                            mr: 2,
                            fontSize: '1rem',
                            fontWeight: 600,
                        }}
                    >
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 600,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {user?.first_name || user?.email}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {user?.job_title || 'User'}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* App Bar */}
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    bgcolor: '#FFFFFF',
                    borderBottom: '1px solid #E5E5EA',
                    color: 'text.primary',
                }}
            >
                <Toolbar sx={{ px: 3 }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    
                    <Box sx={{ flexGrow: 1 }} />
                    
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-controls="profile-menu"
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                    >
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: '#007AFF',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                            }}
                        >
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </Avatar>
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Navigation Drawer */}
            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
                aria-label="navigation"
            >
                {/* Mobile drawer */}
                <Drawer
                    variant="temporary"
                    open={sidebarOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            border: 'none',
                        },
                    }}
                >
                    <SidebarContent />
                </Drawer>
                
                {/* Desktop drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            border: 'none',
                        },
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
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    bgcolor: '#F2F2F7',
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>

            {/* Profile Menu */}
            <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                onClick={handleProfileMenuClose}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        borderRadius: 2,
                        mt: 1.5,
                        minWidth: 180,
                        '& .MuiMenuItem-root': {
                            px: 2,
                            py: 1,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={() => navigate('/profile')}>
                    <Person sx={{ mr: 2 }} />
                    Profile
                </MenuItem>
                <MenuItem onClick={handleProfileMenuClose}>
                    <Settings sx={{ mr: 2 }} />
                    Settings
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: '#FF3B30' }}>
                    <Logout sx={{ mr: 2 }} />
                    Logout
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default Layout;