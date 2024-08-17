## Set Up Environment / Project Installation Guide

### A) Environment Setup:

- Install Rust, using command:
  `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`

- Install the Soroban CLI using below mentioned command. For more info visit => [Soroban docs](https://developers.stellar.org/docs/smart-contracts)
  `cargo install --locked soroban-cli`

- Install [Node.js](https://nodejs.org/en)

- Get the [Freighter Wallet](https://www.freighter.app/) extension for you browser.
  Once enabled, then got to the network section and connect your wallet to the testnet.

- Install wasm32-unknown-unknown package using command:
  `rustup target add wasm32-unknown-unknown`

- To configure your CLI to interact with Testnet, run the following command:

```
soroban network add \
  --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"
```

- In order to deploy the smartcontract you will need an account. You can either use the an account from the `Freighter Wallet` or can configure an account named `alice` in the testnet using the command:
  `soroban keys generate --global alice --network testnet`

- You can see the public key of account `alice`:
  `soroban keys address alice`

---

### B) Backend (Smart-contract) Setup:

- Clone the repository:
  `git clone https://github.com/chintanonweb/animal-welfare-app.git`

- Smart-contracts folder Structure:

```.
smart-contracts
    |──animal-welfare
        ├── Cargo.lock
        ├── Cargo.toml
        ├── README.md
        └── contracts
            └── animal_welfare
                ├── Cargo.toml
                └── src
                    └── lib.rs
```

***=> Go inside the `/smart-contracts` directory and do the below mentioned steps:***

- Build the contract:

```
soroban contract build
```

- Alternte command:

```
cargo build --target wasm32-unknown-unknown --release
```

- Install Optimizer:

```
cargo install --locked soroban-cli --features opt
```

- Build an Opmize the contract:

```
soroban contract optimize --wasm target/wasm32-unknown-unknown/release/Gate_Pass_Dapp.wasm
```

### Steps to the Deploy smart-contract on testnet:

- deploy the smartcontract on the testnet and get deployed address of the smartcontract using the following command:

```
stellar contract deploy --wasm target\wasm32-unknown-unknown\release\animal_welfare.wasm  --network testnet --source alice
```

**_Deployed address of this smartcontract:_** `CAJZYA7DJUJ7UJ6ZPUQDRBJ72DFTEIRTM4CZUMLOZRWAMB3EBABNC6GX`

\*NOTE: If you get the XDR Error `error: xdr processing error: xdr value invalid`, then follow this [article](https://stellar.org/blog/developers/protocol-21-upgrade-guide).

### Invoke functions from the smart-contract:

- #### To invoke any of the function from the smartcontract you can use this command fromat.

```
soroban contract invoke \
  --id <DEPLOYED_CONTRACT_ADDRESS> \
  --source <YOUR_ACCOUNT_NAME> \
  --network testnet \
  -- \
  <FUNCTION_NAME> --<FUNCTION_PARAMETER> <ARGUMENT>
```

- #### For example:

1. add_post
```
stellar contract invoke --id YOUR_CONTRACT_ID --network testnet --source YOUR_KEYNAME -- add_post --id 1 --title "Save the Cats" --description "Donation for feeding cats" --wallet_address "GA3F45EXAMPLEWALLET" --amount_requested 1000 --image_url "https://example.com/cat.jpg"
```

2. delete_post
```
stellar contract invoke --id YOUR_CONTRACT_ID --network testnet --source YOUR_KEYNAME -- delete_post --id 1
```

3. update_post
```
stellar contract invoke --id YOUR_CONTRACT_ID --network testnet --source YOUR_KEYNAME -- update_post --id 1 --new_title "Save the Kittens" --new_description "Updated donation for feeding kittens"
```

4. get_posts
```
stellar contract invoke --id YOUR_CONTRACT_ID --network testnet --source YOUR_KEYNAME -- get_posts
```

5. donate
```
stellar contract invoke --id YOUR_CONTRACT_ID --network testnet --source YOUR_KEYNAME -- donate --post_id 1 --donor "GD6X5UEXAMPLEWALLET" --amount 100
```

6. get_donations
```
stellar contract invoke --id YOUR_CONTRACT_ID --network testnet --source YOUR_KEYNAME -- get_donations --post_id 1
```

7. view_post_by_id
```
stellar contract invoke --id YOUR_CONTRACT_ID --network testnet --source YOUR_KEYNAME -- view_post_by_id --post_id 1
```

---

### C) Frontend Setup (React JS):
***=> Now come outside of the `/smart-contract` directory and do the below mentioned steps:***

- Install essential nodejs dependencies, using command:
```
npm install
```

- run the development server:
```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

***=> Inside the Soroban.js file you will find a variable named ```contractAddress```, which contains the deployed smart-contract address. File path: ```./src/components/Soroban/Soroban.js```***


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
