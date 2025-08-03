import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Tabs,
    Tab,
    Button,
    Chip,
    LinearProgress,
    Avatar,
    AvatarGroup,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Divider,
    Badge,
    Tooltip,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Business,
    Assignment,
    Description,
    Analytics,
    Chat,
    Timeline,
    People,
    Settings,
    Add,
    Edit,
    Delete,
    Visibility,
    Download,
    Share,
    Notifications,
    AI
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';

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
            id={`deal-room-tabpanel-${index}`}
            aria-labelledby={`deal-room-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const DealRoom: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);
    const [showTaskDialog, setShowTaskDialog] = useState(false);
    const [showCommentDialog, setShowCommentDialog] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);

    // Mock data - replace with real API calls
    const dealRoom = {
        id: 1,
        name: "TechCorp Acquisition",
        status: "active",
        phase: "Due Diligence",
        progress: 65,
        team: [
            { id: 1, name: "John Smith", role: "Lead", avatar: "JS" },
            { id: 2, name: "Sarah Johnson", role: "Analyst", avatar: "SJ" },
            { id: 3, name: "Mike Wilson", role: "Legal", avatar: "MW" }
        ],
        tasks: [
            { id: 1, title: "Financial Due Diligence", status: "in_progress", assigned: "Sarah Johnson", due: "2024-02-15", priority: "high" },
            { id: 2, title: "Legal Review", status: "pending", assigned: "Mike Wilson", due: "2024-02-20", priority: "medium" },
            { id: 3, title: "Market Analysis", status: "completed", assigned: "John Smith", due: "2024-02-10", priority: "high" }
        ],
        documents: [
            { id: 1, name: "Financial Statements Q4 2023", type: "financial", status: "reviewed", uploaded: "2024-02-01" },
            { id: 2, name: "Legal Contracts", type: "legal", status: "pending", uploaded: "2024-02-05" },
            { id: 3, name: "Market Research Report", type: "research", status: "approved", uploaded: "2024-02-03" }
        ],
        aiInsights: [
            { type: "risk", message: "High leverage detected in financial statements", confidence: 85 },
            { type: "opportunity", message: "Strong market position in growing sector", confidence: 92 },
            { type: "recommendation", message: "Consider earn-out structure for valuation gap", confidence: 78 }
        ],
        comments: [
            { id: 1, author: "John Smith", content: "Financial DD looks good, proceeding to legal review", timestamp: "2024-02-08T10:30:00Z" },
            { id: 2, author: "Sarah Johnson", content: "Found some concerning items in Q4 statements", timestamp: "2024-02-08T14:15:00Z" },
            { id: 3, author: "AI Assistant", content: "Risk analysis complete - 3 high-priority items identified", timestamp: "2024-02-08T16:45:00Z", isAI: true }
        ]
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleCreateTask = () => {
        setShowTaskDialog(true);
    };

    const handleAddComment = () => {
        setShowCommentDialog(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'success';
            case 'in_progress': return 'warning';
            case 'pending': return 'info';
            case 'blocked': return 'error';
            default: return 'default';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'success';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    {dealRoom.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Chip label={dealRoom.status} color="primary" />
                    <Chip label={dealRoom.phase} color="secondary" />
                    <Typography variant="body2" color="text.secondary">
                        Progress: {dealRoom.progress}%
                    </Typography>
                </Box>
                <LinearProgress variant="determinate" value={dealRoom.progress} sx={{ mb: 2 }} />

                {/* Team Members */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Team:
                    </Typography>
                    <AvatarGroup max={4}>
                        {dealRoom.team.map((member) => (
                            <Tooltip key={member.id} title={`${member.name} (${member.role})`}>
                                <Avatar>{member.avatar}</Avatar>
                            </Tooltip>
                        ))}
                    </AvatarGroup>
                    <Button size="small" startIcon={<Add />}>
                        Add Member
                    </Button>
                </Box>
            </Box>

            {/* AI Insights Banner */}
            <Alert severity="info" sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AI />
                    <Typography variant="body2">
                        AI has identified 3 new insights and 2 recommendations for this deal
                    </Typography>
                </Box>
            </Alert>

            {/* Main Content */}
            <Card>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="deal room tabs">
                        <Tab label="Overview" />
                        <Tab label="Tasks" />
                        <Tab label="Documents" />
                        <Tab label="AI Analysis" />
                        <Tab label="Comments" />
                        <Tab label="Timeline" />
                    </Tabs>
                </Box>

                {/* Overview Tab */}
                <TabPanel value={tabValue} index={0}>
                    <Grid container spacing={3}>
                        {/* Key Metrics */}
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Key Metrics
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography variant="body2">Tasks Completed</Typography>
                                        <Typography variant="body2" fontWeight="bold">8/12</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography variant="body2">Documents Reviewed</Typography>
                                        <Typography variant="body2" fontWeight="bold">15/20</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography variant="body2">Days Remaining</Typography>
                                        <Typography variant="body2" fontWeight="bold">12</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2">Risk Score</Typography>
                                        <Typography variant="body2" fontWeight="bold" color="warning.main">Medium</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* AI Insights */}
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        AI Insights
                                    </Typography>
                                    {dealRoom.aiInsights.map((insight, index) => (
                                        <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                <Chip
                                                    label={insight.type}
                                                    size="small"
                                                    color={insight.type === 'risk' ? 'error' : insight.type === 'opportunity' ? 'success' : 'primary'}
                                                />
                                                <Typography variant="caption" color="text.secondary">
                                                    {insight.confidence}% confidence
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2">{insight.message}</Typography>
                                        </Box>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Recent Activity */}
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Recent Activity
                                    </Typography>
                                    <List>
                                        {dealRoom.comments.slice(0, 3).map((comment) => (
                                            <ListItem key={comment.id} alignItems="flex-start">
                                                <ListItemAvatar>
                                                    <Avatar>{comment.author.split(' ').map(n => n[0]).join('')}</Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Typography variant="body2" fontWeight="bold">
                                                                {comment.author}
                                                            </Typography>
                                                            {comment.isAI && <Chip label="AI" size="small" color="primary" />}
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <>
                                                            <Typography variant="body2" color="text.primary">
                                                                {comment.content}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {new Date(comment.timestamp).toLocaleString()}
                                                            </Typography>
                                                        </>
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* Tasks Tab */}
                <TabPanel value={tabValue} index={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Tasks</Typography>
                        <Button variant="contained" startIcon={<Add />} onClick={handleCreateTask}>
                            Create Task
                        </Button>
                    </Box>

                    <Grid container spacing={2}>
                        {dealRoom.tasks.map((task) => (
                            <Grid item xs={12} key={task.id}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Box>
                                                <Typography variant="h6">{task.title}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Assigned to: {task.assigned}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Chip label={task.status} color={getStatusColor(task.status) as any} size="small" />
                                                <Chip label={task.priority} color={getPriorityColor(task.priority) as any} size="small" />
                                            </Box>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Due: {new Date(task.due).toLocaleDateString()}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                            <Button size="small" startIcon={<Edit />}>Edit</Button>
                                            <Button size="small" startIcon={<Visibility />}>View</Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </TabPanel>

                {/* Documents Tab */}
                <TabPanel value={tabValue} index={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Documents</Typography>
                        <Button variant="contained" startIcon={<Add />}>
                            Upload Document
                        </Button>
                    </Box>

                    <Grid container spacing={2}>
                        {dealRoom.documents.map((doc) => (
                            <Grid item xs={12} md={6} key={doc.id}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Box>
                                                <Typography variant="h6">{doc.name}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Type: {doc.type}
                                                </Typography>
                                            </Box>
                                            <Chip label={doc.status} color={getStatusColor(doc.status) as any} size="small" />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Uploaded: {new Date(doc.uploaded).toLocaleDateString()}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                            <Button size="small" startIcon={<Visibility />}>View</Button>
                                            <Button size="small" startIcon={<Download />}>Download</Button>
                                            <Button size="small" startIcon={<Chat />}>Comment</Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </TabPanel>

                {/* AI Analysis Tab */}
                <TabPanel value={tabValue} index={3}>
                    <Typography variant="h6" gutterBottom>
                        AI Analysis
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Risk Assessment
                                    </Typography>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" gutterBottom>
                                            Overall Risk Score: 65/100
                                        </Typography>
                                        <LinearProgress variant="determinate" value={65} color="warning" />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        • High leverage detected in financial statements
                                        • Regulatory compliance concerns identified
                                        • Market volatility impact on valuation
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Valuation Analysis
                                    </Typography>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" gutterBottom>
                                            Recommended Range: $150M - $200M
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Based on comparable transactions and DCF analysis
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        • Revenue multiple: 2.5x
                                        • EBITDA multiple: 12.0x
                                        • Premium to market: 15%
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* Comments Tab */}
                <TabPanel value={tabValue} index={4}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Comments</Typography>
                        <Button variant="contained" startIcon={<Add />} onClick={handleAddComment}>
                            Add Comment
                        </Button>
                    </Box>

                    <List>
                        {dealRoom.comments.map((comment) => (
                            <ListItem key={comment.id} alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar>{comment.author.split(' ').map(n => n[0]).join('')}</Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body2" fontWeight="bold">
                                                {comment.author}
                                            </Typography>
                                            {comment.isAI && <Chip label="AI" size="small" color="primary" />}
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(comment.timestamp).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    }
                                    secondary={
                                        <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
                                            {comment.content}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </TabPanel>

                {/* Timeline Tab */}
                <TabPanel value={tabValue} index={5}>
                    <Typography variant="h6" gutterBottom>
                        Deal Timeline
                    </Typography>
                    <Box sx={{ position: 'relative', pl: 3 }}>
                        <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, bgcolor: 'primary.main' }} />
                        {[
                            { date: '2024-01-15', event: 'Deal Initiated', status: 'completed' },
                            { date: '2024-01-30', event: 'LOI Signed', status: 'completed' },
                            { date: '2024-02-01', event: 'Due Diligence Started', status: 'in_progress' },
                            { date: '2024-02-15', event: 'Financial DD Complete', status: 'pending' },
                            { date: '2024-02-20', event: 'Legal Review Complete', status: 'pending' },
                            { date: '2024-03-01', event: 'Closing', status: 'pending' }
                        ].map((milestone, index) => (
                            <Box key={index} sx={{ position: 'relative', mb: 3 }}>
                                <Box sx={{
                                    position: 'absolute',
                                    left: -6,
                                    top: 0,
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    bgcolor: milestone.status === 'completed' ? 'success.main' :
                                        milestone.status === 'in_progress' ? 'warning.main' : 'grey.300'
                                }} />
                                <Box sx={{ ml: 2 }}>
                                    <Typography variant="body2" fontWeight="bold">
                                        {milestone.event}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(milestone.date).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </TabPanel>
            </Card>

            {/* Task Creation Dialog */}
            <Dialog open={showTaskDialog} onClose={() => setShowTaskDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Task Title" margin="normal" />
                    <TextField fullWidth label="Description" margin="normal" multiline rows={3} />
                    <TextField fullWidth label="Assigned To" margin="normal" />
                    <TextField fullWidth label="Due Date" margin="normal" type="date" InputLabelProps={{ shrink: true }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowTaskDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={() => setShowTaskDialog(false)}>Create</Button>
                </DialogActions>
            </Dialog>

            {/* Comment Dialog */}
            <Dialog open={showCommentDialog} onClose={() => setShowCommentDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add Comment</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Comment" margin="normal" multiline rows={4} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowCommentDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={() => setShowCommentDialog(false)}>Post</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DealRoom; 