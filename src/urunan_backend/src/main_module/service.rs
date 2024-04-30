use candid::Principal;
use ic_cdk::{caller, trap};

use crate::core::{
    stable_memory::{EXPENSES, NEXT_EXPENSE_ID, NEXT_SPLIT_ID, PROFILES, SPLIT_DEBTS, USERS},
    types::{User, UserID, ID},
    utils,
};

use super::types::{Categories, ExpenseDetail, SplitBillDebtor, SplitBillExpense};

pub fn get_user_profile(username: UserID) -> Option<User> {
    PROFILES.with(|o| o.borrow().get(&username))
}

pub fn get_username_by_principal(principal: Principal) -> Option<UserID> {
    USERS.with_borrow(|o| o.get(&principal))
}

pub fn get_user_by_principal(principal: Principal) -> Option<User> {
    if let Some(username) = USERS.with_borrow(|o| o.get(&principal)) {
        return PROFILES.with_borrow(|o| o.get(&username));
    }
    None
}

pub fn new_user(username: UserID, principal: Principal, full_name: String, avatar: String) {
    let now = utils::timestamp_millis();
    USERS.with(|r| {
        if r.borrow().contains_key(&principal) {
            trap("already registered");
        }
        PROFILES.with(|o| {
            if o.borrow().contains_key(&username) {
                trap("username already taken");
            }
            o.borrow_mut().insert(
                username.clone(),
                User {
                    username: username.clone(),
                    full_name: full_name.clone(),
                    avatar: avatar.clone(),
                    created_at: now,
                },
            )
        });
        r.borrow_mut().insert(principal, username.clone());
    });
}

pub fn update_user(principal: Principal, full_name: Option<String>, avatar: Option<String>) {
    if full_name.is_none() && avatar.is_none() {
        return;
    }
    USERS.with(|r| {
        let username = r
            .borrow()
            .get(&principal)
            .unwrap_or_else(|| trap("user not found"));
        if let Some(mut user) = PROFILES.with_borrow_mut(|o| o.get(&username)) {
            if let Some(new_name) = full_name {
                user.full_name = new_name;
            }
            if let Some(new_avatar) = avatar {
                user.avatar = new_avatar;
            }
        }
    });
}

pub fn new_expense(
    principal: Principal,
    mut expense_detail: ExpenseDetail,
    mut debtors: Vec<SplitBillDebtor>,
) -> ID {
    let id = NEXT_EXPENSE_ID.with_borrow(|o| *o.get());
    let debt_id = NEXT_SPLIT_ID.with_borrow(|o| *o.get());

    let username = USERS
        .with_borrow(|o| o.get(&principal))
        .unwrap_or_else(|| trap("user not found"));

    expense_detail.timestamp = utils::timestamp_millis();
    debtors.iter_mut().for_each(|d| d.expense_id = id);

    SPLIT_DEBTS.with_borrow_mut(|o| {
        let mut sum: f64 = 0.0;
        debtors.iter_mut().for_each(|debtor| {
            debtor.expense_id = id;
            o.insert(debt_id, debtor.clone());
            sum += debtor.amount;
        });
        if expense_detail.amount != sum {
            expense_detail.amount = sum;
        }
    });

    let new_expense = SplitBillExpense {
        owner: username,
        detail: expense_detail,
    };

    EXPENSES.with_borrow_mut(|o| o.insert(id, new_expense));

    NEXT_EXPENSE_ID.with_borrow_mut(|next_id| {
        next_id
            .set(*next_id.get() + 1)
            .unwrap_or_else(|_| trap("Failed to set NEXT_EXPENSE_ID"))
    });
    NEXT_SPLIT_ID.with_borrow_mut(|next_id| {
        next_id
            .set(*next_id.get() + 1)
            .unwrap_or_else(|_| trap("Failed to set NEXT_SPLIT_ID"))
    });
    id
}
