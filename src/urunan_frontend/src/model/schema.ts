import { SplitBillMode } from "@declarations/urunan_backend/urunan_backend.did";
import currency from "currency.js";
import * as yup from "yup";

export const amountSchema = yup.number()
    .typeError(() => 'Amount must be a number')
    .transform((value, originalValue) => {
        if (typeof originalValue === "string") {
            return currency(originalValue).value;
        }
        return value;
    })
    .moreThan(0.00, 'Must be greater than 0')
    .required('Amount is required');

export const debtorSchema = yup.object({
    username: yup.string().required('Username is required'),
    amount: amountSchema,
    payment_status: yup.string().nullable(),
    expense_id: yup.number().required('Expense id is required'),
});

export const expenseDetailSchema = yup.object({
    tag: yup.array(yup.string().required()).default([]),
    title: yup.string().required('Title is required'),
    split_mode: yup.string().required().oneOf(['evenly', 'portion', 'perpurchase']),
    description: yup.string().default(''),
    currency: yup.string().required('Currency is required'),
    timestamp: yup.number().default(0),
    amount: amountSchema,
    debtor: yup.array(debtorSchema)
});