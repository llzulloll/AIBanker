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

export interface Document {
    id: number;
    filename: string;
    file_type: string;
    file_size: number;
    status: string;
    document_type: string;
    uploaded_by: number;
    deal_id?: number;
    ai_analysis_completed: boolean;
    ocr_completed: boolean;
    nlp_completed: boolean;
    risk_flags?: any;
    extracted_data?: any;
    processing_time?: number;
    created_at: string;
    updated_at: string;
}

export const documentsApi = {
    // Upload document
    uploadDocument: async (file: File, dealId?: number, documentType?: string) => {
        const formData = new FormData();
        formData.append('file', file);
        if (dealId) formData.append('deal_id', dealId.toString());
        if (documentType) formData.append('document_type', documentType);

        const response = await api.post('/documents/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    },

    // Get all documents
    getDocuments: async (params?: { 
        skip?: number; 
        limit?: number; 
        deal_id?: number; 
        document_type?: string;
        status?: string;
    }) => {
        const response = await api.get('/documents', { params });
        return response;
    },

    // Get document by ID
    getDocument: async (documentId: number) => {
        const response = await api.get(`/documents/${documentId}`);
        return response;
    },

    // Process document
    processDocument: async (documentId: number) => {
        const response = await api.post(`/documents/${documentId}/process`);
        return response;
    },

    // Delete document
    deleteDocument: async (documentId: number) => {
        const response = await api.delete(`/documents/${documentId}`);
        return response;
    },
};