use ic_cdk::{caller, query, trap, update};

use crate::core::types::{User, UserID, ID};

use super::{
    service,
    types::{ExpenseDetail, SplitBillDebtor, SplitBillExpense},
};

// User --------------------------------------------------

#[query]
fn is_my_user_exist() -> bool {
    let session = caller();
    service::get_username_by_principal(session).is_some()
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
async fn new_expense(expense: ExpenseDetail, debtors: Vec<SplitBillDebtor>) -> ID {
    let session = caller();

    if expense.title.is_empty() {
        trap("title should not be empty");
    }
    if expense.currency.is_empty() {
        trap("currency should not be empty");
    }
    if expense.amount <= 0.0 {
        trap("amount should be greater than zero")
    }

    if debtors.is_empty() {
        trap("there is no one to split the bill with")
    } else if debtors.len() == 1 {
        if let Some(my_username) = service::get_username_by_principal(session) {
            if debtors[0].username == my_username {
                trap("cannot split bill with given user")
            } else if debtors[0].amount <= 0.0 {
                trap("amount should be greater than zero")
            }
        }
    } else if debtors.iter().any(|debtor| debtor.amount <= 0.0) {
        trap("amount should be greater than zero")
    }

    service::new_expense(session, expense, debtors)
}
