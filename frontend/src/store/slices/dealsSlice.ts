import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { dealsApi } from '../../services/dealsApi';

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

export interface DealsState {
    deals: Deal[];
    currentDeal: Deal | null;
    isLoading: boolean;
    error: string | null;
    filters: {
        status?: string;
        deal_type?: string;
    };
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}

const initialState: DealsState = {
    deals: [],
    currentDeal: null,
    isLoading: false,
    error: null,
    filters: {},
    pagination: {
        page: 0,
        limit: 10,
        total: 0,
    },
};

// Async thunks
export const fetchDeals = createAsyncThunk(
    'deals/fetchDeals',
    async (params: {
        page?: number;
        limit?: number;
        status?: string;
        deal_type?: string;
    } = {}, { rejectWithValue }) => {
        try {
            const response = await dealsApi.getDeals(params);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to fetch deals');
        }
    }
);

export const fetchDealById = createAsyncThunk(
    'deals/fetchDealById',
    async (dealId: number, { rejectWithValue }) => {
        try {
            const response = await dealsApi.getDealById(dealId);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to fetch deal');
        }
    }
);

export const createDeal = createAsyncThunk(
    'deals/createDeal',
    async (dealData: Partial<Deal>, { rejectWithValue }) => {
        try {
            const response = await dealsApi.createDeal(dealData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to create deal');
        }
    }
);

export const updateDeal = createAsyncThunk(
    'deals/updateDeal',
    async ({ dealId, dealData }: { dealId: number; dealData: Partial<Deal> }, { rejectWithValue }) => {
        try {
            const response = await dealsApi.updateDeal(dealId, dealData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to update deal');
        }
    }
);

export const deleteDeal = createAsyncThunk(
    'deals/deleteDeal',
    async (dealId: number, { rejectWithValue }) => {
        try {
            await dealsApi.deleteDeal(dealId);
            return dealId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to delete deal');
        }
    }
);

export const startAIProcessing = createAsyncThunk(
    'deals/startAIProcessing',
    async (dealId: number, { rejectWithValue }) => {
        try {
            const response = await dealsApi.startAIProcessing(dealId);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to start AI processing');
        }
    }
);

export const getDealStatus = createAsyncThunk(
    'deals/getDealStatus',
    async (dealId: number, { rejectWithValue }) => {
        try {
            const response = await dealsApi.getDealStatus(dealId);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to get deal status');
        }
    }
);

const dealsSlice = createSlice({
    name: 'deals',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setCurrentDeal: (state, action: PayloadAction<Deal | null>) => {
            state.currentDeal = action.payload;
        },
        setFilters: (state, action: PayloadAction<{ status?: string; deal_type?: string }>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {};
        },
        setPagination: (state, action: PayloadAction<{ page: number; limit: number; total: number }>) => {
            state.pagination = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch deals
            .addCase(fetchDeals.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDeals.fulfilled, (state, action) => {
                state.isLoading = false;
                state.deals = action.payload.deals || action.payload;
                if (action.payload.pagination) {
                    state.pagination = action.payload.pagination;
                }
            })
            .addCase(fetchDeals.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Fetch deal by ID
            .addCase(fetchDealById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDealById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentDeal = action.payload;
            })
            .addCase(fetchDealById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Create deal
            .addCase(createDeal.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createDeal.fulfilled, (state, action) => {
                state.isLoading = false;
                state.deals.unshift(action.payload);
                state.currentDeal = action.payload;
            })
            .addCase(createDeal.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Update deal
            .addCase(updateDeal.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateDeal.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.deals.findIndex(deal => deal.id === action.payload.id);
                if (index !== -1) {
                    state.deals[index] = action.payload;
                }
                if (state.currentDeal?.id === action.payload.id) {
                    state.currentDeal = action.payload;
                }
            })
            .addCase(updateDeal.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Delete deal
            .addCase(deleteDeal.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteDeal.fulfilled, (state, action) => {
                state.isLoading = false;
                state.deals = state.deals.filter(deal => deal.id !== action.payload);
                if (state.currentDeal?.id === action.payload) {
                    state.currentDeal = null;
                }
            })
            .addCase(deleteDeal.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Start AI processing
            .addCase(startAIProcessing.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(startAIProcessing.fulfilled, (state, action) => {
                state.isLoading = false;
                // Update current deal if it's the one being processed
                if (state.currentDeal) {
                    state.currentDeal.ai_processing_status = 'processing';
                }
            })
            .addCase(startAIProcessing.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Get deal status
            .addCase(getDealStatus.fulfilled, (state, action) => {
                // Update deal status without loading state
                if (state.currentDeal?.id === action.payload.deal_id) {
                    state.currentDeal = {
                        ...state.currentDeal,
                        status: action.payload.status,
                        ai_processing_status: action.payload.ai_processing_status,
                        due_diligence_completed: action.payload.due_diligence_completed,
                        pitchbook_generated: action.payload.pitchbook_generated,
                        risk_analysis_completed: action.payload.risk_analysis_completed,
                        processing_time: action.payload.processing_time,
                    };
                }
            });
    },
});

export const { clearError, setCurrentDeal, setFilters, clearFilters, setPagination } = dealsSlice.actions;
export default dealsSlice.reducer; 