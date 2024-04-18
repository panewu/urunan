use std::cell::RefCell;

use candid::CandidType;
use serde::{Deserialize, Serialize};

thread_local! {
    pub static RUNTIME_STATE: RefCell<RuntimeState> = RefCell::default();
}

#[derive(Serialize, Deserialize, Clone, Default)]
pub struct RuntimeState {
    pub stats: WorkingStats,
}

#[derive(Serialize, Deserialize, CandidType, Clone, Default)]
pub struct WorkingStats {
    pub metrics: Metrics,
    pub last_updated_time: u64,
}

impl WorkingStats {
    pub fn get_metrics(&self) -> Metrics {
        return self.metrics.clone();
    }
}

/// Mini version of on-chain metrics
#[derive(Serialize, Deserialize, CandidType, Clone, Default)]
pub struct Metrics {
    total_errors: u64,
    total_api_requests: u64,
}

impl Metrics {
    pub fn add_error(&mut self) {
        self.total_errors += 1;
    }

    pub fn add_api_request(&mut self) {
        self.total_api_requests += 1;
    }
}
