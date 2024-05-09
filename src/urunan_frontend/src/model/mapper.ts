import { PaymentStatus, SplitBillMode } from "@declarations/urunan_backend/urunan_backend.did";

const toSplitBillMode = (mode: string): SplitBillMode => {
    switch (mode.toLowerCase()) {
        case 'portion':
            return { Portion: null };
        case 'perpurchase':
            return { PerPurchase: null };
        default:
            return { Evenly: null };
    }
}

const toPaymentStatus = (status: string | null | undefined): [] | [PaymentStatus] => {
    switch (status?.toLowerCase() || '') {
        case 'filled':
            return [{ Filled: null }];
        case 'cancelled':
            return [{ Cancelled: null }];
        case 'created':
            return [{ Created: null }];
        case 'settled':
            return [{ Settled: null }];
        default:
            return [];
    }
}