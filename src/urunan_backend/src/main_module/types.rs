use std::{borrow::Cow, default};

use candid::{CandidType, Decode, Encode};
use ic_stable_structures::{storable::Bound, Storable};
use serde::Deserialize;

use crate::core::types::{UserID, ID};

#[derive(Debug, CandidType, Deserialize, Default, Clone, PartialEq)]
pub enum SplitBillMode {
    #[default]
    Evenly,
    Portion,
    PerPurchase,
}

#[derive(Debug, CandidType, Deserialize, Default, Clone, PartialEq)]
pub enum SplitBillStatus {
    #[default]
    Active,
    Repaid,
    Closed,
}

#[derive(Debug, CandidType, Deserialize, Clone, PartialEq)]
pub enum PaymentStatus {
    Created,
    Filled,
    Settled,
    Cancelled,
}

#[derive(Debug, CandidType, Deserialize, Default, Clone, PartialEq)]
pub enum SplitBillOwnership {
    Owned,
    #[default]
    Participated,
}

#[derive(Debug, CandidType, Deserialize, Clone, PartialEq)]
pub enum ExpenseQueryFilter {
    Status(SplitBillStatus),
}

#[derive(Debug, CandidType, Deserialize, Default, Clone)]
pub struct Categories {
    pub name: String,
    pub icon: String,
}

/// Expense Entity that hold the split member
#[derive(Debug, CandidType, Deserialize, Clone)]
pub struct SplitBillExpense {
    pub detail: ExpenseDetail,
    pub owner: UserID,
    pub status: SplitBillStatus,
}

#[derive(Debug, CandidType, Deserialize, Default)]
pub struct UserRelIDs {
    pub user_connections: Vec<UserID>,
    pub owned_expenses: Vec<ID>,
    pub owed_bills: Vec<ID>,
}

#[derive(Debug, CandidType, Deserialize, Default)]
pub struct ExpenseRelIDs {
    pub debtors: Vec<ID>,
}

/// Expense Detail is the representation of expense in detail
#[derive(Debug, CandidType, Deserialize, Default, Clone)]
pub struct ExpenseDetail {
    pub title: String,
    pub description: String,
    pub amount: f64,
    pub currency: String,
    pub timestamp: u64,
    pub tag: Vec<String>,
    pub split_mode: SplitBillMode,
}

#[derive(Debug, CandidType, Deserialize, Clone)]
pub struct SplitBillDebtor {
    pub expense_id: ID,
    pub username: UserID,
    pub amount: f64,
    pub payment_status: Option<PaymentStatus>,
}

#[derive(Debug, CandidType, Deserialize, Default, Clone)]
pub struct ExpenseOutline {
    pub title: String,
    pub amount: f64,
    pub currency: String,
    pub timestamp: u64,
    pub tag: Vec<String>,
    pub total_debtor: usize,
    pub status: SplitBillStatus,
}

// Structs need to impl Storable to be used in Stable Memory
impl Storable for SplitBillExpense {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
    const BOUND: Bound = Bound::Unbounded;
}

// Structs need to impl Storable to be used in Stable Memory
impl Storable for SplitBillDebtor {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
    const BOUND: Bound = Bound::Unbounded;
}

// Structs need to impl Storable to be used in Stable Memory
impl Storable for UserRelIDs {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
    const BOUND: Bound = Bound::Unbounded;
}

// Structs need to impl Storable to be used in Stable Memory
impl Storable for ExpenseRelIDs {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
    const BOUND: Bound = Bound::Unbounded;
}
