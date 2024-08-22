## Set Up Environment / Project Installation Guide

[Deploy URL](https://animal-welfare-app.vercel.app/)

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

```
smart-contracts
    |──animal-walfare
        ├── Cargo.lock
        ├── Cargo.toml
        ├── README.md
        └── contracts
            └── hello_world
                ├── Cargo.toml
                └── src
                    └── lib.rs
```

***=> Go inside the `/smart-contracts/animal-walfare` directory and do the below mentioned steps:***

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
soroban contract optimize --wasm target/wasm32-unknown-unknown/release/hello_world.wasm 
```

### Steps to the Deploy smart-contract on testnet:

- deploy the smartcontract on the testnet and get deployed address of the smartcontract using the following command:

```
stellar contract deploy --wasm target\wasm32-unknown-unknown\release\hello_world.wasm  --network testnet --source alice
```

**_Deployed address of this smartcontract:_** `CADDQMSNMHHEU6SWMD3BLWPCTSQ44TNCPOUZ2VRXGSZM4DPSGJPLNFA3`

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

1. Create Post
```
stellar contract invoke --id YOUR_CONTRACT_ID --network testnet --source YOUR_KEYNAME -- create_post --title "Feed the Cats" --description "Donation to feed stray cats" --amount_requested 500 --image_url "https://example.com/cat_food.jpg" --feeder_address "GA3F45EXAMPLEWALLET"
```

2. Get Post By ID
```
stellar contract invoke --id YOUR_CONTRACT_ID --network testnet --source YOUR_KEYNAME -- get_post_by_id --post_id 1
```

3. Update Post
```
stellar contract invoke --id YOUR_CONTRACT_ID --network testnet --source YOUR_KEYNAME -- update_post --post_id 1 --new_title "Feed the Kittens" --new_description "Updated donation for feeding kittens" --new_amount_requested 600 --new_image_url "https://example.com/kitten_food.jpg" --deactivate false
```

4. Get All Posts
```
stellar contract invoke --id YOUR_CONTRACT_ID --network testnet --source YOUR_KEYNAME -- get_all_posts
```

5. Delete Post
```
stellar contract invoke --id YOUR_CONTRACT_ID --network testnet --source YOUR_KEYNAME -- delete_post --post_id 1
```

6. Permanently Delete Post
```
stellar contract invoke --id YOUR_CONTRACT_ID --network testnet --source YOUR_KEYNAME -- delete_post_permanently --post_id 1
```

7. Donate
```
stellar contract invoke --id YOUR_CONTRACT_ID --network testnet --source YOUR_KEYNAME -- donate --post_id 1 --amount 100
```

---

### C) Frontend Setup (Next JS):
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

***=> Inside the Soroban.js file you will find a variable named ```contractAddress```, which contains the deployed smart-contract address. File path: ```./src/app/utils/soroban.js```***


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
