import { ExpenseDetail, PaymentStatus, SplitBillDebtor, SplitBillMode, User } from "@declarations/urunan_backend/urunan_backend.did";
import { SplitDebtorCandidates } from "./views";

export const toSplitBillMode = (mode: string): SplitBillMode => {
    switch (mode.toLowerCase()) {
        case 'portion':
            return { Portion: null };
        case 'perpurchase':
            return { PerPurchase: null };
        default:
            return { Evenly: null };
    }
}

export const toPaymentStatus = (status: string | null | undefined): [] | [PaymentStatus] => {
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

export const toSplitBillDebtor = (debtors: SplitDebtorCandidates[]): SplitBillDebtor[] => {
    return debtors.map((debtor) => {
        return {
            username: debtor.username,
            payment_status: debtor.payment_status,
            expense_id: debtor.expense_id,
            amount: debtor.amount,
        } as SplitBillDebtor;
    });
}

export const userToDebtorCandidate = (user: User, amount: number): SplitDebtorCandidates => {
    return {
        ...user,
        payment_status: [],
        expense_id: BigInt(0),
        amount: amount,
    };
}