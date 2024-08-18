import * as StellarSdk from "@stellar/stellar-sdk";

const server = new StellarSdk.Horizon.Server(
  "https://horizon-testnet.stellar.org"
);

// Function to create and fund a new wallet
export async function createAndFundWallet() {
  const pair = StellarSdk.Keypair.random();
  const publicKey = pair.publicKey();
  const secretKey = pair.secret();

  try {
    // Fund the new account with Friendbot
    const response = await fetch(
      `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
    );
    const responseJSON = await response.json();
    console.log("SUCCESS! You have a new account :)\n", responseJSON);

    // Optionally, create another account (e.g., for testing or additional functionality)
    const parentAccount = await server.loadAccount(publicKey);
    const childAccount = StellarSdk.Keypair.random();

    const createAccountTx = new StellarSdk.TransactionBuilder(parentAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.createAccount({
          destination: childAccount.publicKey(),
          startingBalance: "5",
        })
      )
      .setTimeout(180)
      .build();

    createAccountTx.sign(pair);

    const txResponse = await server.submitTransaction(createAccountTx);
    console.log(txResponse);
    console.log("Created the new account", childAccount.publicKey());

    return {
      publicKey,
      secretKey,
    };
  } catch (e) {
    console.error("ERROR!", e);
    throw e;
  }
}

// Function to get account details
export async function getAccount(publicKey) {
  try {
    const account = await server.loadAccount(publicKey);
    return account;
  } catch (error) {
    console.error("Error loading account:", error);
    throw error;
  }
}

// Function to send funds
export async function sendFunds(destinationID, secretKey, amount) {
  try {
    const sourceKeys = StellarSdk.Keypair.fromSecret(secretKey);
    let transaction;

    return server
      .loadAccount(destinationID)
      .catch((error) => {
        if (error instanceof StellarSdk.NotFoundError) {
          throw new Error("The destination account does not exist!");
        } else {
          throw error;
        }
      })
      .then(() => server.loadAccount(sourceKeys.publicKey()))
      .then((sourceAccount) => {
        transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: StellarSdk.Networks.TESTNET,
        })
          .addOperation(
            StellarSdk.Operation.payment({
              destination: destinationID,
              asset: StellarSdk.Asset.native(),
              amount: amount.toString(),
            })
          )
          .addMemo(StellarSdk.Memo.text("Test Transaction"))
          .setTimeout(180)
          .build();

        transaction.sign(sourceKeys);
        return server.submitTransaction(transaction);
      })
      .then((result) => result)
      .catch((error) => {
        console.error("Error submitting transaction:", error);
        throw error;
      });
  } catch (error) {
    console.error("Error in sendFunds:", error);
    throw error;
  }
}

// Function to fetch payments (both sent and received) using the Horizon operations endpoint
export async function fetchPayments(accountId) {
  try {
    const response = await fetch(
      `https://horizon-testnet.stellar.org/accounts/${accountId}/operations`
    );
    const data = await response.json();

    const payments = data._embedded.records.map((op) => ({
      type: op.type, // Will differentiate between sent and received
      amount: op.amount,
      asset:
        op.asset_type === "native"
          ? "lumens"
          : `${op.asset_code}:${op.asset_issuer}`,
      from: op.from,
      to: op.to,
      timestamp: op.created_at,
    }));

    // Separate sent and received payments
    const sentPayments = payments.filter(
      (payment) => payment.from === accountId
    );
    const receivedPayments = payments.filter(
      (payment) => payment.to === accountId
    );

    return { sentPayments, receivedPayments };
  } catch (error) {
    console.error("Error fetching payments:", error);
    return { sentPayments: [], receivedPayments: [] };
  }
}

export async function fetchAccountDetails(accountId) {
  try {
    const account = await server.loadAccount(accountId);
    return account.balances;
  } catch (error) {
    console.error("Error loading account:", error);
    return [];
  }
}