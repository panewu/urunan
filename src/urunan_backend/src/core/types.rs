use candid::CandidType;
use serde::{Deserialize, Serialize};

#[derive(Debug, CandidType, Deserialize, Serialize, Default, Clone)]
pub struct LogEntry {
    pub timestamp: u64,
    pub text: String,
}
