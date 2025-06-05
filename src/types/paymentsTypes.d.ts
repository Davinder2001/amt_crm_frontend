interface RefundRequest {
    id: number;
    transaction_id: string;
    user_id: number;
    amount: number;
    refund: 'refund_processed' | 'refund_approved' | 'refunded' | 'refund_declined' | null;
    decline_reason?: string;
    created_at: string;
    updated_at: string;
}

interface RefundListResponse {
    success: boolean;
    message: string;
    data: RefundRequest[];
}

interface RefundActionResponse {
    success: boolean;
    message: string;
    data?: RefundRequest;
    current_refund_status?: string;
    errors?: Record<string, string[]>;
}

interface DeclineRefundPayload {
    reason: string;
}
