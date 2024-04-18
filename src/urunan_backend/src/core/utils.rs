use ic_cdk::api::time;
use uuid::Uuid;

pub const NANOS_IN_SECONDS: u64 = 1_000_000_000;
pub const NANOS_IN_MILLIS: u64 = 1_000_000;

pub fn random_uuid() -> u128 {
    Uuid::new_v4().as_u128()
}

pub fn timestamp_uuid() -> u128 {
    Uuid::now_v7().as_u128()
}

pub fn timestamp_millis() -> u64 {
    time() / NANOS_IN_MILLIS
}
