import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001/api/v1';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export interface Deal {
    id: number;
    name: string;
    description?: string;
    deal_type: string;
    status: string;
    target_company?: string;
    target_industry?: string;
    target_sector?: string;
    target_revenue?: number;
    target_ebitda?: number;
    deal_value?: number;
    deal_currency: string;
    transaction_fee?: number;
    success_fee_rate?: number;
    expected_close_date?: string;
    actual_close_date?: string;
    due_diligence_deadline?: string;
    created_by: number;
    due_diligence_completed: boolean;
    pitchbook_generated: boolean;
    risk_analysis_completed: boolean;
    ai_processing_status: string;
    processing_time?: number;
    created_at: string;
    updated_at: string;
}

export interface CreateDealData {
    name: string;
    description?: string;
    deal_type: string;
    target_company?: string;
    target_industry?: string;
    target_sector?: string;
    target_revenue?: number;
    target_ebitda?: number;
    deal_value?: number;
    deal_currency?: string;
    transaction_fee?: number;
    success_fee_rate?: number;
    expected_close_date?: string;
    due_diligence_deadline?: string;
}

export interface UpdateDealData extends Partial<CreateDealData> {
    status?: string;
    actual_close_date?: string;
}

export const dealsApi = {
    // Get all deals
    getDeals: async (params?: { skip?: number; limit?: number; status?: string; deal_type?: string }) => {
        const response = await api.get('/deals', { params });
        return response;
    },

    // Get deal by ID
    getDeal: async (dealId: number) => {
        const response = await api.get(`/deals/${dealId}`);
        return response;
    },

    // Create new deal
    createDeal: async (dealData: CreateDealData) => {
        const response = await api.post('/deals', dealData);
        return response;
    },

    // Update deal
    updateDeal: async (dealId: number, dealData: UpdateDealData) => {
        const response = await api.put(`/deals/${dealId}`, dealData);
        return response;
    },

    // Delete deal
    deleteDeal: async (dealId: number) => {
        const response = await api.delete(`/deals/${dealId}`);
        return response;
    },

    // Start AI processing
    startProcessing: async (dealId: number) => {
        const response = await api.post(`/deals/${dealId}/start-processing`);
        return response;
    },

    // Get deal status
    getDealStatus: async (dealId: number) => {
        const response = await api.get(`/deals/${dealId}/status`);
        return response;
    },
};