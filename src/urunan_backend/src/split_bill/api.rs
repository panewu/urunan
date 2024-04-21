use ic_cdk::{caller, query, update};

use crate::core::{stable_memory::PROFILES, types::ID};

use super::{
    service,
    types::{Categories, ExpenseDetails},
};

#[query]
fn check_username(username: String) -> bool {
    match service::get_user_profile(username) {
        Some(_) => false,
        None => true,
    }
}

#[update]
async fn new_expense(expense: ExpenseDetails, category: Categories) -> ID {
    let caller = caller();

    0
}
