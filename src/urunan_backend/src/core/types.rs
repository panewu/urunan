use std::{borrow::Cow, default};

use candid::{CandidType, Decode, Encode};
use ic_stable_structures::{storable::Bound, Storable};
use serde::{Deserialize, Serialize};

pub type ID = u128;
pub type UserID = String;

// User ----------------------------------

/// Role for a caller into the API service
#[derive(Debug, CandidType, Deserialize, Serialize, Default, Clone)]
pub enum UserRole {
    #[default]
    Guest,
    User,
    Admin,
}

/// Action is an API Call Classification for access control logic
#[derive(Debug, CandidType, Deserialize, Serialize, Default, Clone)]
pub enum UserAction {
    #[default]
    View,
    Create,
    Update,
    Admin,
}

#[derive(Debug, CandidType, Deserialize, Serialize, Default, Clone)]
pub struct User {
    pub username: UserID,
    pub full_name: String,
    pub avatar: String,
    pub created_at: u64,
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

// Error ---------------------------------------------

#[derive(Debug, CandidType, Deserialize, Serialize, Default, Clone)]
pub enum ErrorKind {
    NotFound,
    IllegalArgument,
    IllegalState,
    #[default]
    Unhandled,
}

#[derive(Debug, CandidType, Deserialize, Serialize, Default, Clone)]
pub struct UrunanError {
    pub error_kind: ErrorKind,
    pub message: String,
}

// Utility ----------------------------------------------

#[derive(Debug, CandidType, Deserialize, Serialize, Default, Clone)]
pub struct LogEntry {
    pub timestamp: u64,
    pub text: String,
}
