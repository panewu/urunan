# urunan

To get started, you might want to explore the project directory structure and the default configuration file. Working with this project in your development environment will not affect any production deployment or identity tokens.

To learn more before you start working with urunan, see the following documentation available online:

- [Quick Start](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
- [SDK Developer Tools](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [Rust Canister Development Guide](https://internetcomputer.org/docs/current/developer-docs/backend/rust/)
- [ic-cdk](https://docs.rs/ic-cdk)
- [ic-cdk-macros](https://docs.rs/ic-cdk-macros)
- [Candid Introduction](https://internetcomputer.org/docs/current/developer-docs/backend/candid/)

## urunan tech stack
| Aspect | <span style="width:290px; display:inline-block">Backend Canister</span> | Frontend Canister |
|---------------------|-----------------------------|------------------------|
| Language            | Rust                        | Typescript, javascript | 
| Framework           | Rust IC CDK                 | Vite.js + React.js     | 
| UI Library          | -                           | tailwind.css           |
| Datastore           | IC Stable Structure         | browser localStorage   | 
| Core Library        | IC CDK, candid, serde       | react, react-router-dom, @dfinity/auth-client, react-hook-form, tailwindcss | 
| Test Framework      | Rust                        | vitest                 |
| Package Manager     | Cargo                       | npm (Node v18)         | 

## Running the project locally

If you want to test your project locally, you can use the following commands:

```bash
# Starts the replica, running in the background
dfx start --background

# Install all necessary npm packages
npm i

# Deploys your canisters to the replica and generates your candid interface
dfx deploy
```

Please be mind that `cargo` must be installed through the official installation on the web.

If you have made changes to your backend canister, you can generate a new candid interface with

```bash
npm run candid
```

at any time. The script is executing `scripts/did.sh` which is a little bit hardcoded right now by setting the canister project name on `CANISTER` variable. It is a comma seperated value.

You also need to install [candid extractor](https://crates.io/crates/candid-extractor) first before the `npm run candid` can be executed successfully.

Which will start a server at `http://localhost:8080`, proxying API requests to the replica at port 4943.

## Frontend Project

React is used as the frontend canister. to run it, use
```bash
npm run start
```

<!-- ### Note on frontend environment variables

If you are hosting frontend code somewhere without using DFX, you may need to make one of the following adjustments to ensure your project does not fetch the root key in production:

- set`DFX_NETWORK` to `ic` if you are using Webpack
- use your own preferred method to replace `process.env.DFX_NETWORK` in the autogenerated declarations
  - Setting `canisters -> {asset_canister_id} -> declarations -> env_override to a string` in `dfx.json` will replace `process.env.DFX_NETWORK` with the string in the autogenerated declarations
- Write your own `createActor` constructor -->
