use ic_cdk::api::time;

pub const NANOS_IN_SECONDS: u64 = 1_000_000_000;
pub const NANOS_IN_MILLIS: u64 = 1_000_000;

pub fn timestamp_millis() -> u64 {
    time() / NANOS_IN_MILLIS
}
