use ic_cdk::{caller, query, trap, update};

use crate::core::{
    stable_memory::PROFILES,
    types::{User, UserID, ID},
};

use super::{
    service,
    types::{Categories, ExpenseDetails, Expenses},
};

// User --------------------------------------------------

#[query]
fn is_my_user_exist() -> bool {
    let session = caller();
    service::is_user_exist(session)
}

#[query]
fn is_username_available(user_id: UserID) -> bool {
    match service::get_user_profile(user_id) {
        Some(_) => false,
        None => true,
    }
}

#[update]
async fn new_user(user_id: UserID, full_name: String, avatar: String) {
    let session = caller();
    service::new_user(user_id, session, full_name, avatar)
}

#[query]
fn get_my_profile() -> User {
    match service::get_user_by_principal(caller()) {
        Some(user) => user,
        None => trap("user not found. need to register"),
    }
}

#[query]
fn find_user(user_id: UserID) -> User {
    match service::get_user_profile(user_id) {
        Some(_user) => _user,
        None => trap("user not found"),
    }
}

#[update]
async fn put_user_avatar(avatar: String) {
    let session = caller();
    service::update_user(session, None, Some(avatar))
}

#[update]
async fn put_user_full_name(fullname: String) {
    let session = caller();
    service::update_user(session, Some(fullname), None)
}

// Expense--------------------------------------------------------------

#[update]
async fn new_expense(expense: ExpenseDetails, category: Categories) -> ID {
    let session = caller();
    // check
    service::new_expense(expense, category)
}
