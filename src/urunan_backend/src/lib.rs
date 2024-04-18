use ic_cdk::{export_candid, query};

mod core;
mod split_bill;

#[query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

export_candid!();
