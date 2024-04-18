use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(Debug, CandidType, Deserialize, Serialize, Default, Clone)]
pub enum SplitBillMode {
    #[default]
    Evenly,
    Portion,
    PerPurchase,
}

#[derive(Debug, CandidType, Deserialize, Serialize, Clone)]
pub struct User {
    pub id: Principal,
    pub username: String,
    pub email: String,
}

#[derive(Debug, CandidType, Deserialize, Serialize, Default, Clone)]
pub struct Categories {
    pub id: u128,
    pub name: String,
}

/// Expense Entity that hold the split member
#[derive(Debug, CandidType, Deserialize, Serialize, Clone)]
pub struct Expenses {
    id: u128,
    detail: ExpenseDetails,
    owner: Principal,
}

/// Expense Detail is the representation of expense in detail
#[derive(Debug, CandidType, Deserialize, Serialize, Default, Clone)]
pub struct ExpenseDetails {
    title: String,
    amount: f64,
    currency: String,
    timestamp: u64,
    tag: Vec<String>,
    category: Categories,
    split_mode: SplitBillMode,
}

#[derive(Debug, CandidType, Deserialize, Serialize, Clone)]
pub struct SplitDebts {
    id: u128,
    expense_id: u128,
    user_id: Principal,
    amount: f64,
}
