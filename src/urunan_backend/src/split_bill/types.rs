use std::borrow::Cow;

use candid::{CandidType, Decode, Encode, Principal};
use ic_stable_structures::{storable::Bound, Storable};
use serde::{Deserialize, Serialize};

use crate::core::types::{UserID, ID};

#[derive(Debug, CandidType, Deserialize, Serialize, Default, Clone)]
pub enum SplitBillMode {
    #[default]
    Evenly,
    Portion,
    PerPurchase,
}

#[derive(Debug, CandidType, Deserialize, Serialize, Clone)]
pub struct User {
    pub username: UserID,
    pub created_at: u64,
}

#[derive(Debug, CandidType, Deserialize, Serialize, Default, Clone)]
pub struct Categories {
    pub name: String,
}

/// Expense Entity that hold the split member
#[derive(Debug, CandidType, Deserialize, Serialize, Clone)]
pub struct Expenses {
    pub detail: ExpenseDetails,
    pub owner: UserID,
}

/// Expense Detail is the representation of expense in detail
#[derive(Debug, CandidType, Deserialize, Serialize, Default, Clone)]
pub struct ExpenseDetails {
    pub title: String,
    pub amount: f64,
    pub currency: String,
    pub timestamp: u64,
    pub tag: Vec<String>,
    pub category: Categories,
    pub split_mode: SplitBillMode,
}

#[derive(Debug, CandidType, Deserialize, Serialize, Clone)]
pub struct SplitDebts {
    pub expense_id: ID,
    pub user_id: UserID,
    pub amount: f64,
}

// Structs need to impl Storable to be used in Stable Memory
impl Storable for User {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
    const BOUND: Bound = Bound::Unbounded;
}

// Structs need to impl Storable to be used in Stable Memory
impl Storable for Expenses {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
    const BOUND: Bound = Bound::Unbounded;
}

// Structs need to impl Storable to be used in Stable Memory
impl Storable for SplitDebts {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
    const BOUND: Bound = Bound::Unbounded;
}
