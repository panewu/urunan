import { SplitBillMode } from "@declarations/urunan_backend/urunan_backend.did";

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