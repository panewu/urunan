use ic_cdk::{api::canister_balance, query, update};

use super::runtime::{Metrics, RUNTIME_STATE};

#[query]
fn get_cycles_balance() -> u64 {
    canister_balance()
}

#[query]
fn get_metrics() -> Metrics {
    RUNTIME_STATE.with(|o| o.borrow_mut().stats.get_metrics())
}

pub fn add_error_trace() {
    RUNTIME_STATE.with(|s| s.borrow_mut().stats.metrics.add_error());
}
