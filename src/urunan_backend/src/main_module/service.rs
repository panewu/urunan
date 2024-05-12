use std::borrow::{Borrow, BorrowMut};

use candid::Principal;
use ic_cdk::trap;

use crate::core::{
    stable_memory::{
        EXPENSES, EXPENSE_RELS, NEXT_EXPENSE_ID, NEXT_SPLIT_ID, PROFILES, SPLIT_DEBTS, USERS,
        USER_RELS,
    },
    types::{User, UserID, ID},
    utils,
};

use super::types::{
    ExpenseDetail, ExpenseOutline, ExpenseQueryFilter, ExpenseRelIDs, SplitBillDebtor,
    SplitBillExpense, SplitBillOwnership, SplitBillStatus, UserRelIDs,
};

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

pub fn get_all_users() -> Vec<User> {
    return PROFILES.with_borrow(|o| o.iter().filter_map(|(k, v)| Some(v)).collect());
}

pub fn get_user_connections(principal: Principal) -> Vec<User> {
    let my_username =
        get_username_by_principal(principal).unwrap_or_else(|| trap("user not found"));
    if let Some(user_rel) = USER_RELS.with_borrow(|ur| ur.get(&my_username)) {
        let users = PROFILES.with_borrow(|o| {
            let connected_user = user_rel
                .user_connections
                .iter()
                .filter(|&connected_user| o.contains_key(connected_user))
                .map(|connected_user| o.get(connected_user).unwrap())
                .collect::<Vec<User>>();
            return connected_user;
        });
        return users;
    } else {
        return Vec::new();
    }
}

pub fn connect_with_user(principal: Principal, username: UserID) -> UserRelIDs {
    let my_username =
        &get_username_by_principal(principal).unwrap_or_else(|| trap("user not found"));
    USER_RELS.with_borrow_mut(|o| {
        // add connection to self
        let mut should_insert = false;
        let mut user_rel = match o.get(my_username) {
            None => {
                should_insert = true;
                UserRelIDs::default()
            }
            Some(obj) => obj,
        };
        user_rel.set_user_connection(&username);
        // add connection to other
        let mut other_user = match o.get(&username) {
            None => UserRelIDs::default(),
            Some(obj) => obj,
        };
        other_user.set_user_connection(my_username);
        if should_insert {
            o.insert(my_username.to_owned(), user_rel);
            o.insert(username.to_owned(), other_user);
        }
    });

    USER_RELS.with_borrow(|o| o.get(&my_username).unwrap())
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

pub fn delete_user(principal: Principal) {
    USERS.with_borrow_mut(|o| {
        if let Some(username) = o.get(&principal) {
            PROFILES.with_borrow_mut(|p| p.remove(&username));
            // let mut user_rel = USER_RELS.with_borrow_mut(|ur| ur.get(&username)).unwrap();
            // let owned_expense = &mut user_rel.owned_expenses;
        }
        o.remove(&principal);
    });
}

fn increment_next_split_bill_debtor_id() {
    NEXT_SPLIT_ID.with_borrow_mut(|next_id| {
        next_id
            .set(*next_id.get() + 1)
            .unwrap_or_else(|_| trap("Failed to set NEXT_SPLIT_ID"))
    });
}

impl UserRelIDs {
    fn set_user_connection(&mut self, user_id: &UserID) {
        let exist = match &self
            .user_connections
            .iter()
            .find(|&rel_id| rel_id == user_id)
        {
            None => false,
            Some(_) => true,
        };

        if !exist {
            let connections = &mut self.user_connections;
            connections.push(user_id.to_owned());
        }
    }

    fn set_user_owned_expense(&mut self, expense_id: &ID) {
        let exist = match &self
            .owned_expenses
            .iter()
            .find(|&rel_id| rel_id == expense_id)
        {
            None => false,
            Some(_) => true,
        };

        if !exist {
            let expenses = &mut self.owned_expenses;
            expenses.push(*expense_id);
        }
    }

    fn set_user_owed_bill(&mut self, split_bill_id: &ID) {
        let exist = match &self
            .owed_bills
            .iter()
            .find(|&rel_id| rel_id == split_bill_id)
        {
            None => false,
            Some(_) => true,
        };
        if !exist {
            let owed_bills = &mut self.owed_bills;
            owed_bills.push(*split_bill_id);
        }
    }
}

impl ExpenseRelIDs {
    fn set_expense_debtor(&mut self, split_bill_id: &ID) {
        let exist = match &self.debtors.iter().find(|&rel_id| rel_id == split_bill_id) {
            None => false,
            Some(_) => true,
        };
        if !exist {
            let debtors = &mut self.debtors;
            debtors.push(*split_bill_id);
        }
    }
}

pub fn new_expense(
    principal: Principal,
    mut expense_detail: ExpenseDetail,
    mut debtors: Vec<SplitBillDebtor>,
) -> ID {
    // get generate id
    let id = NEXT_EXPENSE_ID.with_borrow(|o| *o.get());

    // get user_id
    let username = USERS
        .with_borrow(|o| o.get(&principal))
        .unwrap_or_else(|| trap("user not found"));

    // put timestamp detail
    expense_detail.timestamp = utils::timestamp_millis();

    // get or default user relation & expense relation
    let mut user_rel = USER_RELS.with_borrow(|o| match o.get(&username) {
        None => UserRelIDs::default(),
        Some(obj) => obj,
    });
    let mut expense_rel = ExpenseRelIDs::default();

    // set owned expense relation
    user_rel.set_user_owned_expense(&id);
    // iterate debtor to fill the information gap & store them
    SPLIT_DEBTS.with_borrow_mut(|o| {
        let mut sum: f64 = 0.0;
        debtors.iter_mut().for_each(|debtor| {
            // get generated id
            let debt_id = NEXT_SPLIT_ID.with_borrow(|o| *o.get());
            // set expense id to debtor
            debtor.expense_id = id;
            // calculate sum amount
            sum += debtor.amount;
            // set expense relation with debtor
            expense_rel.debtors.push(debt_id);
            // set user connection if not self userID
            if username != debtor.username {
                // set owed bill relation for each debtor other than self
                let mut debtor_ur =
                    USER_RELS.with_borrow_mut(|ur| match ur.get(&debtor.username) {
                        None => UserRelIDs::default(),
                        Some(obj) => obj,
                    });
                debtor_ur.set_user_owed_bill(&debt_id);
                USER_RELS.with_borrow_mut(|o| o.insert(debtor.username.to_owned(), debtor_ur));
            } else {
                // set owed bill relation for self
                user_rel.set_user_owed_bill(&debt_id);
            }
            // set expense debtor relation
            expense_rel.set_expense_debtor(&debt_id);
            // insert to bTree
            o.insert(debt_id, debtor.clone());
            // increment id for debtor
            increment_next_split_bill_debtor_id();
        });
        if expense_detail.amount != sum {
            expense_detail.amount = sum;
        }
    });

    let new_expense = SplitBillExpense {
        owner: username.to_owned(),
        detail: expense_detail,
        status: SplitBillStatus::Active,
    };

    // store all data
    EXPENSES.with_borrow_mut(|o| o.insert(id, new_expense));
    EXPENSE_RELS.with_borrow_mut(|o| o.insert(id, expense_rel));
    USER_RELS.with_borrow_mut(|o| o.insert(username.to_owned(), user_rel));

    NEXT_EXPENSE_ID.with_borrow_mut(|next_id| {
        next_id
            .set(*next_id.get() + 1)
            .unwrap_or_else(|_| trap("Failed to set NEXT_EXPENSE_ID"))
    });
    id
}

pub fn get_all_expenses() -> Vec<SplitBillExpense> {
    EXPENSES.with_borrow(|o| o.iter().map(|(k, v)| v).collect())
}

pub fn get_expenses(
    principal: Principal,
    filter: Vec<ExpenseQueryFilter>,
    split_ownership: SplitBillOwnership,
) -> Vec<ExpenseOutline> {
    // get user_id
    let username = USERS
        .with_borrow(|o| o.get(&principal))
        .unwrap_or_else(|| trap("user not found"));
    let user_rel = match USER_RELS.with_borrow(|o| o.get(&username)) {
        None => return vec![],
        Some(obj) => obj,
    };

    let expenses: Vec<(ID, SplitBillExpense)> = match split_ownership {
        SplitBillOwnership::Owned => user_rel
            .owned_expenses
            .iter()
            .map(|id| (*id, EXPENSES.with_borrow(|o| o.get(id).unwrap())))
            .collect(),
        SplitBillOwnership::Participated => user_rel
            .owed_bills
            .iter()
            .map(|id| SPLIT_DEBTS.with_borrow(|o| o.get(id).unwrap()))
            .map(|debtor| debtor.expense_id)
            .map(|id| (id, EXPENSES.with_borrow(|o| o.get(&id).unwrap())))
            .collect(),
    };
    expenses
        .iter()
        .filter(|(_, expense)| {
            filter
                .iter()
                .any(|f| match f {
                    ExpenseQueryFilter::Status(status) => expense.status == *status,
                    _ => true,
                })
                .then(|| true)
                .unwrap_or(false)
        })
        .map(|(id, expense)| {
            let total_debtor = EXPENSE_RELS
                .with_borrow(|o| o.get(id))
                .unwrap()
                .debtors
                .len();
            return ExpenseOutline {
                amount: expense.detail.amount,
                currency: expense.detail.currency.to_owned(),
                title: expense.detail.title.to_owned(),
                timestamp: expense.detail.timestamp,
                tag: expense.detail.tag.as_slice().to_vec(),
                total_debtor,
                status: expense.status.to_owned(),
            };
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{ExpenseDetail, SplitBillDebtor};
    use candid::Principal;

    #[test]
    fn test_get_user_profile() {
        let user = get_user_profile(String::from("fulan"));
        assert!(user.is_none());
    }

    #[test]
    fn test_get_username_by_principal() {
        let username = get_username_by_principal(Principal::anonymous());
        assert!(username.is_none());
    }

    #[test]
    fn test_get_user_by_principal() {
        let user = get_user_by_principal(Principal::anonymous());
        assert!(user.is_none());
    }

    #[test]
    fn test_get_all_users() {
        let users = get_all_users();
        assert!(users.is_empty());
    }

    #[test]
    #[should_panic]
    fn test_get_user_connection() {
        let _ = get_user_connections(Principal::anonymous());
    }
}
