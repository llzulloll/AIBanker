import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Chip,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    LinearProgress,
    Tabs,
    Tab,
    InputAdornment,
    Fab,
    Tooltip,
} from '@mui/material';
import {
    Add,
    FilterList,
    Search,
    MoreVert,
    Business,
    AttachMoney,
    Schedule,
    TrendingUp,
    Edit,
    Delete,
    Visibility,
    PlayArrow,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Deal, dealsApi } from '../../services/dealsApi';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`deals-tabpanel-${index}`}
            aria-labelledby={`deals-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
}

const Deals: React.FC = () => {
    const navigate = useNavigate();
    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTab, setSelectedTab] = useState(0);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [newDeal, setNewDeal] = useState({
        name: '',
        description: '',
        deal_type: 'mna',
        target_company: '',
        target_industry: '',
        deal_value: '',
        expected_close_date: '',
    });

    useEffect(() => {
        loadDeals();
    }, []);

    const loadDeals = async () => {
        try {
            setLoading(true);
            // Mock data for now
            const mockDeals: Deal[] = [
                {
                    id: 1,
                    name: 'TechCorp Acquisition',
                    description: 'Strategic acquisition of cloud infrastructure company',
                    deal_type: 'mna',
                    status: 'in_progress',
                    target_company: 'TechCorp Industries',
                    target_industry: 'Technology',
                    target_sector: 'Cloud Computing',
                    target_revenue: 50000000,
                    target_ebitda: 12000000,
                    deal_value: 150000000,
                    deal_currency: 'USD',
                    transaction_fee: 2500000,
                    success_fee_rate: 1.5,
                    expected_close_date: '2024-06-15',
                    due_diligence_deadline: '2024-05-15',
                    created_by: 1,
                    due_diligence_completed: false,
                    pitchbook_generated: true,
                    risk_analysis_completed: true,
                    ai_processing_status: 'completed',
                    processing_time: 1247.5,
                    created_at: '2024-03-01T10:00:00Z',
                    updated_at: '2024-03-15T14:30:00Z',
                },
                {
                    id: 2,
                    name: 'DataFlow IPO',
                    description: 'Initial public offering for data analytics platform',
                    deal_type: 'ipo',
                    status: 'due_diligence',
                    target_company: 'DataFlow Analytics',
                    target_industry: 'Technology',
                    target_sector: 'Data Analytics',
                    target_revenue: 75000000,
                    target_ebitda: 18000000,
                    deal_value: 300000000,
                    deal_currency: 'USD',
                    transaction_fee: 4500000,
                    success_fee_rate: 2.0,
                    expected_close_date: '2024-08-30',
                    due_diligence_deadline: '2024-06-30',
                    created_by: 1,
                    due_diligence_completed: true,
                    pitchbook_generated: false,
                    risk_analysis_completed: false,
                    ai_processing_status: 'processing',
                    created_at: '2024-02-15T09:00:00Z',
                    updated_at: '2024-03-10T16:45:00Z',
                },
                {
                    id: 3,
                    name: 'GreenTech PE Investment',
                    description: 'Private equity investment in renewable energy startup',
                    deal_type: 'private_equity',
                    status: 'completed',
                    target_company: 'GreenTech Solutions',
                    target_industry: 'Energy',
                    target_sector: 'Renewable Energy',
                    target_revenue: 25000000,
                    target_ebitda: 5000000,
                    deal_value: 40000000,
                    deal_currency: 'USD',
                    transaction_fee: 800000,
                    success_fee_rate: 1.0,
                    expected_close_date: '2024-02-28',
                    actual_close_date: '2024-02-25',
                    due_diligence_deadline: '2024-01-31',
                    created_by: 1,
                    due_diligence_completed: true,
                    pitchbook_generated: true,
                    risk_analysis_completed: true,
                    ai_processing_status: 'completed',
                    processing_time: 892.3,
                    created_at: '2024-01-10T11:00:00Z',
                    updated_at: '2024-02-25T17:20:00Z',
                },
            ];
            setDeals(mockDeals);
        } catch (error) {
            console.error('Error loading deals:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateDeal = async () => {
        try {
            // TODO: Implement actual API call
            setCreateDialogOpen(false);
            setNewDeal({
                name: '',
                description: '',
                deal_type: 'mna',
                target_company: '',
                target_industry: '',
                deal_value: '',
                expected_close_date: '',
            });
            loadDeals();
        } catch (error) {
            console.error('Error creating deal:', error);
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            draft: '#8E8E93',
            in_progress: '#007AFF',
            due_diligence: '#FF9500',
            pitchbook_ready: '#5856D6',
            completed: '#34C759',
            cancelled: '#FF3B30',
        };
        return colors[status] || '#8E8E93';
    };

    const getDealTypeIcon = (dealType: string) => {
        const icons: Record<string, React.ReactNode> = {
            mna: <Business />,
            ipo: <TrendingUp />,
            private_equity: <AttachMoney />,
            debt_financing: <Schedule />,
        };
        return icons[dealType] || <Business />;
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const filteredDeals = deals.filter(deal => {
        const matchesSearch = deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            deal.target_company?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesTab = selectedTab === 0 || 
                          (selectedTab === 1 && deal.status === 'in_progress') ||
                          (selectedTab === 2 && deal.status === 'due_diligence') ||
                          (selectedTab === 3 && deal.status === 'completed');
        
        return matchesSearch && matchesTab;
    });

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, deal: Deal) => {
        setAnchorEl(event.currentTarget);
        setSelectedDeal(deal);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedDeal(null);
    };

    if (loading) {
        return (
            <Box sx={{ width: '100%', mt: 4 }}>
                <LinearProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                        Deals
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage your deal pipeline and track progress
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setCreateDialogOpen(true)}
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

            {/* Search and Filters */}
            <Card sx={{ mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                            placeholder="Search deals..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ flex: 1 }}
                        />
                        <Button
                            variant="outlined"
                            startIcon={<FilterList />}
                            sx={{ px: 3, py: 1.5, borderRadius: 2 }}
                        >
                            Filters
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                    value={selectedTab}
                    onChange={(_, newValue) => setSelectedTab(newValue)}
                    sx={{
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '1rem',
                        },
                    }}
                >
                    <Tab label="All Deals" />
                    <Tab label="In Progress" />
                    <Tab label="Due Diligence" />
                    <Tab label="Completed" />
                </Tabs>
            </Box>

            {/* Deal Cards */}
            <TabPanel value={selectedTab} index={selectedTab}>
                <Grid container spacing={3}>
                    {filteredDeals.map((deal) => (
                        <Grid item xs={12} md={6} lg={4} key={deal.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                                    },
                                }}
                                onClick={() => navigate(`/deals/${deal.id}`)}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    {/* Header */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: `${getStatusColor(deal.status)}15`,
                                                    color: getStatusColor(deal.status),
                                                    width: 40,
                                                    height: 40,
                                                    mr: 2,
                                                }}
                                            >
                                                {getDealTypeIcon(deal.deal_type)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                    {deal.name}
                                                </Typography>
                                                <Chip
                                                    label={deal.status.replace('_', ' ')}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: `${getStatusColor(deal.status)}15`,
                                                        color: getStatusColor(deal.status),
                                                        textTransform: 'capitalize',
                                                        fontWeight: 500,
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMenuClick(e, deal);
                                            }}
                                        >
                                            <MoreVert />
                                        </IconButton>
                                    </Box>

                                    {/* Content */}
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {deal.description}
                                    </Typography>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                            Target Company
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {deal.target_company}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                            Deal Value
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#34C759' }}>
                                            {deal.deal_value ? formatCurrency(deal.deal_value) : 'TBD'}
                                        </Typography>
                                    </Box>

                                    {/* Progress Indicators */}
                                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                        <Tooltip title="Due Diligence">
                                            <Chip
                                                size="small"
                                                label="DD"
                                                sx={{
                                                    bgcolor: deal.due_diligence_completed ? '#34C75915' : '#8E8E9315',
                                                    color: deal.due_diligence_completed ? '#34C759' : '#8E8E93',
                                                    minWidth: 36,
                                                }}
                                            />
                                        </Tooltip>
                                        <Tooltip title="Pitchbook">
                                            <Chip
                                                size="small"
                                                label="PB"
                                                sx={{
                                                    bgcolor: deal.pitchbook_generated ? '#007AFF15' : '#8E8E9315',
                                                    color: deal.pitchbook_generated ? '#007AFF' : '#8E8E93',
                                                    minWidth: 36,
                                                }}
                                            />
                                        </Tooltip>
                                        <Tooltip title="Risk Analysis">
                                            <Chip
                                                size="small"
                                                label="RA"
                                                sx={{
                                                    bgcolor: deal.risk_analysis_completed ? '#FF950015' : '#8E8E9315',
                                                    color: deal.risk_analysis_completed ? '#FF9500' : '#8E8E93',
                                                    minWidth: 36,
                                                }}
                                            />
                                        </Tooltip>
                                    </Box>

                                    {/* Expected Close Date */}
                                    {deal.expected_close_date && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Expected close: {new Date(deal.expected_close_date).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </TabPanel>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={() => {
                    navigate(`/deals/${selectedDeal?.id}`);
                    handleMenuClose();
                }}>
                    <Visibility sx={{ mr: 1 }} />
                    View Details
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    <Edit sx={{ mr: 1 }} />
                    Edit Deal
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    <PlayArrow sx={{ mr: 1 }} />
                    Start AI Processing
                </MenuItem>
                <MenuItem onClick={handleMenuClose} sx={{ color: '#FF3B30' }}>
                    <Delete sx={{ mr: 1 }} />
                    Delete Deal
                </MenuItem>
            </Menu>

            {/* Create Deal Dialog */}
            <Dialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                    },
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Create New Deal
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Deal Name"
                                value={newDeal.name}
                                onChange={(e) => setNewDeal({ ...newDeal, name: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                multiline
                                rows={3}
                                value={newDeal.description}
                                onChange={(e) => setNewDeal({ ...newDeal, description: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Deal Type</InputLabel>
                                <Select
                                    value={newDeal.deal_type}
                                    onChange={(e) => setNewDeal({ ...newDeal, deal_type: e.target.value })}
                                    label="Deal Type"
                                >
                                    <MenuItem value="mna">M&A</MenuItem>
                                    <MenuItem value="ipo">IPO</MenuItem>
                                    <MenuItem value="private_equity">Private Equity</MenuItem>
                                    <MenuItem value="debt_financing">Debt Financing</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Target Company"
                                value={newDeal.target_company}
                                onChange={(e) => setNewDeal({ ...newDeal, target_company: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Industry"
                                value={newDeal.target_industry}
                                onChange={(e) => setNewDeal({ ...newDeal, target_industry: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Deal Value"
                                type="number"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                                value={newDeal.deal_value}
                                onChange={(e) => setNewDeal({ ...newDeal, deal_value: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Expected Close Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={newDeal.expected_close_date}
                                onChange={(e) => setNewDeal({ ...newDeal, expected_close_date: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 2 }}>
                    <Button onClick={() => setCreateDialogOpen(false)} sx={{ mr: 1 }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleCreateDeal}
                        sx={{ bgcolor: '#007AFF' }}
                    >
                        Create Deal
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Floating Action Button */}
            <Fab
                color="primary"
                aria-label="add"
                onClick={() => setCreateDialogOpen(true)}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    bgcolor: '#007AFF',
                    '&:hover': {
                        bgcolor: '#0051D0',
                    },
                }}
            >
                <Add />
            </Fab>
        </Box>
    );
};

export default Deals;