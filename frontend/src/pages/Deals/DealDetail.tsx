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
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Divider,
    LinearProgress,
    Alert,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import {
    ArrowBack,
    Edit,
    PlayArrow,
    Download,
    Upload,
    Business,
    Assessment,
    Analytics,
    Description,
    Schedule,
    AttachMoney,
    TrendingUp,
    People,
    Warning,
    CheckCircle,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { Deal } from '../../services/dealsApi';

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
            id={`deal-tabpanel-${index}`}
            aria-labelledby={`deal-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

const DealDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [deal, setDeal] = useState<Deal | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState(0);

    useEffect(() => {
        loadDeal();
    }, [id]);

    const loadDeal = async () => {
        try {
            setLoading(true);
            // Mock data for now
            const mockDeal: Deal = {
                id: parseInt(id || '1'),
                name: 'TechCorp Acquisition',
                description: 'Strategic acquisition of cloud infrastructure company focusing on enterprise SaaS solutions. Target has strong market position and recurring revenue model.',
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
            };
            setDeal(mockDeal);
        } catch (error) {
            console.error('Error loading deal:', error);
        } finally {
            setLoading(false);
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

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <Box sx={{ width: '100%', mt: 4 }}>
                <LinearProgress />
            </Box>
        );
    }

    if (!deal) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h5">Deal not found</Typography>
                <Button onClick={() => navigate('/deals')} sx={{ mt: 2 }}>
                    Back to Deals
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconButton onClick={() => navigate('/deals')} sx={{ mr: 1 }}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h3" sx={{ fontWeight: 700, flex: 1 }}>
                        {deal.name}
                    </Typography>
                    <Chip
                        label={deal.status.replace('_', ' ')}
                        sx={{
                            bgcolor: `${getStatusColor(deal.status)}15`,
                            color: getStatusColor(deal.status),
                            textTransform: 'capitalize',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            mr: 2,
                        }}
                    />
                    <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        sx={{ mr: 1 }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<PlayArrow />}
                        sx={{ bgcolor: '#007AFF' }}
                    >
                        Start AI Processing
                    </Button>
                </Box>
                <Typography variant="body1" color="text.secondary">
                    {deal.description}
                </Typography>
            </Box>

            {/* Key Metrics */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                            <Avatar sx={{ bgcolor: '#34C75915', color: '#34C759', mx: 'auto', mb: 2 }}>
                                <AttachMoney />
                            </Avatar>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                                {formatCurrency(deal.deal_value || 0)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Deal Value
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                            <Avatar sx={{ bgcolor: '#007AFF15', color: '#007AFF', mx: 'auto', mb: 2 }}>
                                <TrendingUp />
                            </Avatar>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                                {formatCurrency(deal.target_revenue || 0)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Target Revenue
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                            <Avatar sx={{ bgcolor: '#FF950015', color: '#FF9500', mx: 'auto', mb: 2 }}>
                                <Analytics />
                            </Avatar>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                                {formatCurrency(deal.target_ebitda || 0)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Target EBITDA
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                            <Avatar sx={{ bgcolor: '#5856D615', color: '#5856D6', mx: 'auto', mb: 2 }}>
                                <Schedule />
                            </Avatar>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                                {deal.expected_close_date ? 
                                    Math.ceil((new Date(deal.expected_close_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                                    : 'TBD'
                                }
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Days to Close
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Progress Alert */}
            <Alert 
                severity="info" 
                icon={<Analytics />}
                sx={{ mb: 4, borderRadius: 3 }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                        AI processing completed successfully. Risk analysis and pitchbook generation are ready for review.
                    </Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        sx={{ ml: 2 }}
                    >
                        View Results
                    </Button>
                </Box>
            </Alert>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 0 }}>
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
                    <Tab label="Overview" />
                    <Tab label="Documents" />
                    <Tab label="Due Diligence" />
                    <Tab label="Pitchbook" />
                    <Tab label="Activity" />
                </Tabs>
            </Box>

            {/* Tab Content */}
            <TabPanel value={selectedTab} index={0}>
                <Grid container spacing={3}>
                    {/* Deal Information */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                    Deal Information
                                </Typography>
                                <List sx={{ p: 0 }}>
                                    <ListItem sx={{ px: 0, py: 1 }}>
                                        <ListItemText
                                            primary="Deal Type"
                                            secondary={deal.deal_type.toUpperCase()}
                                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                            secondaryTypographyProps={{ variant: 'body1', color: 'text.primary', fontWeight: 500 }}
                                        />
                                    </ListItem>
                                    <ListItem sx={{ px: 0, py: 1 }}>
                                        <ListItemText
                                            primary="Target Company"
                                            secondary={deal.target_company}
                                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                            secondaryTypographyProps={{ variant: 'body1', color: 'text.primary', fontWeight: 500 }}
                                        />
                                    </ListItem>
                                    <ListItem sx={{ px: 0, py: 1 }}>
                                        <ListItemText
                                            primary="Industry"
                                            secondary={deal.target_industry}
                                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                            secondaryTypographyProps={{ variant: 'body1', color: 'text.primary', fontWeight: 500 }}
                                        />
                                    </ListItem>
                                    <ListItem sx={{ px: 0, py: 1 }}>
                                        <ListItemText
                                            primary="Sector"
                                            secondary={deal.target_sector}
                                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                            secondaryTypographyProps={{ variant: 'body1', color: 'text.primary', fontWeight: 500 }}
                                        />
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Financial Information */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                    Financial Information
                                </Typography>
                                <List sx={{ p: 0 }}>
                                    <ListItem sx={{ px: 0, py: 1 }}>
                                        <ListItemText
                                            primary="Transaction Fee"
                                            secondary={formatCurrency(deal.transaction_fee || 0)}
                                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                            secondaryTypographyProps={{ variant: 'body1', color: 'text.primary', fontWeight: 500 }}
                                        />
                                    </ListItem>
                                    <ListItem sx={{ px: 0, py: 1 }}>
                                        <ListItemText
                                            primary="Success Fee Rate"
                                            secondary={`${deal.success_fee_rate}%`}
                                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                            secondaryTypographyProps={{ variant: 'body1', color: 'text.primary', fontWeight: 500 }}
                                        />
                                    </ListItem>
                                    <ListItem sx={{ px: 0, py: 1 }}>
                                        <ListItemText
                                            primary="Expected Close Date"
                                            secondary={deal.expected_close_date ? formatDate(deal.expected_close_date) : 'TBD'}
                                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                            secondaryTypographyProps={{ variant: 'body1', color: 'text.primary', fontWeight: 500 }}
                                        />
                                    </ListItem>
                                    <ListItem sx={{ px: 0, py: 1 }}>
                                        <ListItemText
                                            primary="Due Diligence Deadline"
                                            secondary={deal.due_diligence_deadline ? formatDate(deal.due_diligence_deadline) : 'TBD'}
                                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                            secondaryTypographyProps={{ variant: 'body1', color: 'text.primary', fontWeight: 500 }}
                                        />
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Processing Status */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                    Processing Status
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={4}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {deal.due_diligence_completed ? (
                                                <CheckCircle sx={{ color: '#34C759', mr: 2 }} />
                                            ) : (
                                                <Warning sx={{ color: '#FF9500', mr: 2 }} />
                                            )}
                                            <Box>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                    Due Diligence
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {deal.due_diligence_completed ? 'Completed' : 'Pending'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {deal.pitchbook_generated ? (
                                                <CheckCircle sx={{ color: '#34C759', mr: 2 }} />
                                            ) : (
                                                <Warning sx={{ color: '#FF9500', mr: 2 }} />
                                            )}
                                            <Box>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                    Pitchbook
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {deal.pitchbook_generated ? 'Generated' : 'Pending'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {deal.risk_analysis_completed ? (
                                                <CheckCircle sx={{ color: '#34C759', mr: 2 }} />
                                            ) : (
                                                <Warning sx={{ color: '#FF9500', mr: 2 }} />
                                            )}
                                            <Box>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                    Risk Analysis
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {deal.risk_analysis_completed ? 'Completed' : 'Pending'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </TabPanel>

            <TabPanel value={selectedTab} index={1}>
                <Card>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Documents
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<Upload />}
                                sx={{ bgcolor: '#007AFF' }}
                            >
                                Upload Documents
                            </Button>
                        </Box>
                        <Alert severity="info" sx={{ mb: 3 }}>
                            No documents have been uploaded for this deal yet. Upload financial statements, contracts, and other relevant documents to begin AI analysis.
                        </Alert>
                    </CardContent>
                </Card>
            </TabPanel>

            <TabPanel value={selectedTab} index={2}>
                <Card>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                            Due Diligence Analysis
                        </Typography>
                        <Alert severity="warning" sx={{ mb: 3 }}>
                            Due diligence analysis will be available once documents are uploaded and processed.
                        </Alert>
                        <Button
                            variant="contained"
                            startIcon={<PlayArrow />}
                            disabled
                            sx={{ bgcolor: '#007AFF' }}
                        >
                            Start Due Diligence
                        </Button>
                    </CardContent>
                </Card>
            </TabPanel>

            <TabPanel value={selectedTab} index={3}>
                <Card>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Pitchbook
                            </Typography>
                            <Box>
                                <Button
                                    variant="outlined"
                                    startIcon={<Download />}
                                    sx={{ mr: 2 }}
                                    disabled={!deal.pitchbook_generated}
                                >
                                    Download
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<Analytics />}
                                    sx={{ bgcolor: '#007AFF' }}
                                >
                                    Generate New
                                </Button>
                            </Box>
                        </Box>
                        {deal.pitchbook_generated ? (
                            <Alert severity="success" sx={{ mb: 3 }}>
                                Pitchbook has been generated successfully. Click download to access the presentation.
                            </Alert>
                        ) : (
                            <Alert severity="info" sx={{ mb: 3 }}>
                                No pitchbook has been generated for this deal yet. Generate one using our AI-powered system.
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </TabPanel>

            <TabPanel value={selectedTab} index={4}>
                <Card>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                            Activity Timeline
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: '#007AFF15', color: '#007AFF' }}>
                                        <Business />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Deal created"
                                    secondary="Created on March 1, 2024"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: '#34C75915', color: '#34C759' }}>
                                        <CheckCircle />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary="AI processing completed"
                                    secondary="Completed on March 15, 2024"
                                />
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </TabPanel>
        </Box>
    );
};

export default DealDetail;