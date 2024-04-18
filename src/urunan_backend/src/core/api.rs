use ic_cdk::{api::canister_balance, query, update};

#[query]
fn get_cycles_balance() -> u64 {
    canister_balance()
}
