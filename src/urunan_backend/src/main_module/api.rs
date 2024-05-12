use ic_cdk::{caller, query, trap, update};

use crate::core::types::{User, UserID, ID};

use super::{
    service,
    types::{
        ExpenseDetail, ExpenseOutline, ExpenseQueryFilter, SplitBillDebtor, SplitBillOwnership,
        SplitBillStatus, UserRelIDs,
    },
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
async fn new_user(user: User) {
    let session = caller();
    service::new_user(user.username, session, user.full_name, user.avatar)
}

#[query]
fn get_my_profile() -> Option<User> {
    service::get_user_by_principal(caller())
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

#[query]
fn get_all_users() -> Vec<User> {
    service::get_all_users()
}

#[query]
fn get_peers() -> Vec<User> {
    let session = caller();
    service::get_user_connections(session)
}

#[update]
async fn connect_with_user(user_id: UserID) -> UserRelIDs {
    let session = caller();
    service::connect_with_user(session, user_id)
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

#[query]
async fn participated_expense(mut filter: Vec<ExpenseQueryFilter>) -> Vec<ExpenseOutline> {
    let session = caller();
    // if filter is empty, or no status filter found, default to all status filter
    let default_filter = vec![
        ExpenseQueryFilter::Status(SplitBillStatus::Active),
        ExpenseQueryFilter::Status(SplitBillStatus::Repaid),
        ExpenseQueryFilter::Status(SplitBillStatus::Closed),
    ];
    let contain_status_filter = filter.iter().any(|f| default_filter.contains(f));
    if filter.len() == 0 || !contain_status_filter {
        filter.push(ExpenseQueryFilter::Status(SplitBillStatus::Active));
        filter.extend(default_filter);
    }
    service::get_expenses(session, filter, SplitBillOwnership::Participated)
}
