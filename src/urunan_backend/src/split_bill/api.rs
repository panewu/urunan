use ic_cdk::{caller, query, update};

use super::types::ExpenseDetails;

#[query]
fn check_username(username: String) -> bool {
    true
}

#[update]
async fn new_expense(expense: ExpenseDetails) -> u128 {
    let caller = caller();

    0
}
