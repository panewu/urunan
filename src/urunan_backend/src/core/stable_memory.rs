use candid::Principal;
use ic_stable_structures::{
    memory_manager::{MemoryId, MemoryManager, VirtualMemory},
    DefaultMemoryImpl, StableBTreeMap, StableCell,
};
use std::cell::RefCell;

use crate::main_module::types::{
    ExpenseDetail, ExpenseRelIDs, SplitBillDebtor, SplitBillExpense, UserRelIDs,
};

use super::types::{User, UserID, ID};

type Memory = VirtualMemory<DefaultMemoryImpl>;

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );

    /// Expenses.ID stable serial ID
    pub static NEXT_EXPENSE_ID: RefCell<StableCell<ID, Memory>> = RefCell::new(
        StableCell::init(
            MEMORY_MANAGER.with_borrow(|m| m.get(MemoryId::new(1))),
            1
        ).expect("failed to init NEXT_EXPENSE_ID")
    );

    /// All Expenses
    pub static EXPENSES: RefCell<StableBTreeMap<ID, SplitBillExpense, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with_borrow(|m| m.get(MemoryId::new(2))),
        )
    );

    /// SplitDebts.ID stable serial ID
    pub static NEXT_SPLIT_ID: RefCell<StableCell<ID, Memory>> = RefCell::new(
        StableCell::init(
            MEMORY_MANAGER.with_borrow(|m| m.get(MemoryId::new(3))),
            1
        ).expect("failed to init NEXT_SPLIT_ID")
    );

    /// All Split Debts aggregate
    pub static SPLIT_DEBTS: RefCell<StableBTreeMap<ID, SplitBillDebtor, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with_borrow(|m| m.get(MemoryId::new(4))),
        )
    );

    /// All User Profiles
    pub static PROFILES: RefCell<StableBTreeMap<UserID, User, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with_borrow(|m| m.get(MemoryId::new(5)))
        )
    );

    /// Relation of User by Principal
    pub static USERS: RefCell<StableBTreeMap<Principal, UserID, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with_borrow(|m| m.get(MemoryId::new(6)))
        )
    );

    /// One to Many Relation of User
    pub static USER_RELS: RefCell<StableBTreeMap<UserID, UserRelIDs, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with_borrow(|m| m.get(MemoryId::new(7)))
        )
    );

    /// One to Many Relation of Expense
    pub static EXPENSE_RELS: RefCell<StableBTreeMap<ID, ExpenseRelIDs, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with_borrow(|m| m.get(MemoryId::new(8)))
        )
    )

}
