import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { documentsApi } from '../../services/documentsApi';

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

export interface DocumentsState {
    documents: Document[];
    currentDocument: Document | null;
    isLoading: boolean;
    error: string | null;
    uploadProgress: number;
    isUploading: boolean;
}

const initialState: DocumentsState = {
    documents: [],
    currentDocument: null,
    isLoading: false,
    error: null,
    uploadProgress: 0,
    isUploading: false,
};

// Async thunks
export const fetchDocuments = createAsyncThunk(
    'documents/fetchDocuments',
    async (dealId: number | undefined, { rejectWithValue }) => {
        try {
            const response = await documentsApi.getDocuments(dealId);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to fetch documents');
        }
    }
);

export const uploadDocument = createAsyncThunk(
    'documents/uploadDocument',
    async ({ file, dealId, documentType }: {
        file: File;
        dealId: number;
        documentType: string;
    }, { rejectWithValue }) => {
        try {
            const response = await documentsApi.uploadDocument(file, dealId, documentType);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to upload document');
        }
    }
);

export const deleteDocument = createAsyncThunk(
    'documents/deleteDocument',
    async (documentId: number, { rejectWithValue }) => {
        try {
            await documentsApi.deleteDocument(documentId);
            return documentId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to delete document');
        }
    }
);

export const getDocumentStatus = createAsyncThunk(
    'documents/getDocumentStatus',
    async (documentId: number, { rejectWithValue }) => {
        try {
            const response = await documentsApi.getDocumentStatus(documentId);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to get document status');
        }
    }
);

const documentsSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setCurrentDocument: (state, action: PayloadAction<Document | null>) => {
            state.currentDocument = action.payload;
        },
        setUploadProgress: (state, action: PayloadAction<number>) => {
            state.uploadProgress = action.payload;
        },
        setUploading: (state, action: PayloadAction<boolean>) => {
            state.isUploading = action.payload;
            if (!action.payload) {
                state.uploadProgress = 0;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch documents
            .addCase(fetchDocuments.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDocuments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.documents = action.payload;
            })
            .addCase(fetchDocuments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Upload document
            .addCase(uploadDocument.pending, (state) => {
                state.isLoading = true;
                state.isUploading = true;
                state.error = null;
                state.uploadProgress = 0;
            })
            .addCase(uploadDocument.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isUploading = false;
                state.uploadProgress = 100;
                state.documents.unshift(action.payload);
            })
            .addCase(uploadDocument.rejected, (state, action) => {
                state.isLoading = false;
                state.isUploading = false;
                state.uploadProgress = 0;
                state.error = action.payload as string;
            })
            // Delete document
            .addCase(deleteDocument.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteDocument.fulfilled, (state, action) => {
                state.isLoading = false;
                state.documents = state.documents.filter(doc => doc.id !== action.payload);
                if (state.currentDocument?.id === action.payload) {
                    state.currentDocument = null;
                }
            })
            .addCase(deleteDocument.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Get document status
            .addCase(getDocumentStatus.fulfilled, (state, action) => {
                // Update document status without loading state
                const index = state.documents.findIndex(doc => doc.id === action.payload.id);
                if (index !== -1) {
                    state.documents[index] = { ...state.documents[index], ...action.payload };
                }
                if (state.currentDocument?.id === action.payload.id) {
                    state.currentDocument = { ...state.currentDocument, ...action.payload };
                }
            });
    },
});

export const { clearError, setCurrentDocument, setUploadProgress, setUploading } = documentsSlice.actions;
export default documentsSlice.reducer; 