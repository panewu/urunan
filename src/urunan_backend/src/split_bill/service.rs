use crate::core::stable_memory::{PROFILES, USERS};

use super::types::User;

pub fn get_user_profile(username: String) -> Option<User> {
    PROFILES.with(|o| o.borrow_mut().get(&username))
}
