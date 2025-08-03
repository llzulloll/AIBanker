import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

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
    original_filename: string;
    file_size: number;
    file_size_mb: number;
    content_type: string;
    document_type: string;
    status: string;
    deal_id: number;
    uploaded_by: number;
    processing_started?: string;
    processing_completed?: string;
    processing_time?: number;
    processing_score?: number;
    ocr_confidence?: number;
    risk_score?: number;
    risk_summary?: string;
    is_processed: boolean;
    is_failed: boolean;
    is_financial_document: boolean;
    created_at: string;
    updated_at: string;
}

export const documentsApi = {
    // Get documents
    getDocuments: async (dealId?: number) => {
        const url = dealId ? `/documents?deal_id=${dealId}` : '/documents';
        const response = await api.get<Document[]>(url);
        return response;
    },

    // Upload document
    uploadDocument: async (file: File, dealId: number, documentType: string) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('deal_id', dealId.toString());
        formData.append('document_type', documentType);

        const response = await api.post<Document>('/documents/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / (progressEvent.total || 1)
                );
                // You can dispatch this to Redux if needed
                console.log('Upload progress:', percentCompleted);
            },
        });
        return response;
    },

    // Delete document
    deleteDocument: async (documentId: number) => {
        const response = await api.delete(`/documents/${documentId}`);
        return response;
    },

    // Get document status
    getDocumentStatus: async (documentId: number) => {
        const response = await api.get<Document>(`/documents/${documentId}/status`);
        return response;
    },

    // Download document
    downloadDocument: async (documentId: number) => {
        const response = await api.get(`/documents/${documentId}/download`, {
            responseType: 'blob',
        });
        return response;
    },
}; 