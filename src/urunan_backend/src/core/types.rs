use candid::CandidType;
use serde::{Deserialize, Serialize};

pub type ID = u128;
pub type UserID = String;

#[derive(Debug, CandidType, Deserialize, Serialize, Default, Clone)]
pub struct LogEntry {
    pub timestamp: u64,
    pub text: String,
}
