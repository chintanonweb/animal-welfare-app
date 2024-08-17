import {
  Contract,
  SorobanRpc,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  nativeToScVal,
  Address,
} from "@stellar/stellar-sdk";
import { userSignTransaction } from "../utils/Freighter";

let rpcUrl = "https://soroban-testnet.stellar.org";

let contractAddress =
  "CAJZYA7DJUJ7UJ6ZPUQDRBJ72DFTEIRTM4CZUMLOZRWAMB3EBABNC6GX";

// Convert Account Address to ScVal form
const accountToScVal = (account) => new Address(account).toScVal();

// Convert String to ScVal form
const stringToScValString = (value) => {
  return nativeToScVal(value);
};

// Convert Number to U64 ScVal form
const numberToU64 = (value) => {
  return nativeToScVal(value, { type: "u64" });
};

const numberToU32 = (value) => {
  return nativeToScVal(value, { type: "u32" });
};
let params = {
  fee: BASE_FEE,
  networkPassphrase: Networks.TESTNET,
};

async function contractInt(caller, functName, values) {
  const provider = new SorobanRpc.Server(rpcUrl, { allowHttp: true });
  const sourceAccount = await provider.getAccount(caller);
  const contract = new Contract(contractAddress);
  let buildTx;

  if (values == null) {
    buildTx = new TransactionBuilder(sourceAccount, params)
      .addOperation(contract.call(functName))
      .setTimeout(30)
      .build();
  } else if (Array.isArray(values)) {
    buildTx = new TransactionBuilder(sourceAccount, params)
      .addOperation(contract.call(functName, ...values))
      .setTimeout(30)
      .build();
  } else {
    buildTx = new TransactionBuilder(sourceAccount, params)
      .addOperation(contract.call(functName, values))
      .setTimeout(30)
      .build();
  }

  let _buildTx = await provider.prepareTransaction(buildTx);

  let prepareTx = _buildTx.toXDR(); // pre-encoding (converting it to XDR format)

  let signedTx = await userSignTransaction(prepareTx, "TESTNET", caller);

  let tx = TransactionBuilder.fromXDR(signedTx, Networks.TESTNET);

  try {
    let sendTx = await provider.sendTransaction(tx).catch(function (err) {
      console.error("Catch-1", err);
      return err;
    });
    if (sendTx.errorResult) {
      throw new Error("Unable to submit transaction");
    }
    if (sendTx.status === "PENDING") {
      let txResponse = await provider.getTransaction(sendTx.hash);
      while (txResponse.status === "NOT_FOUND") {
        txResponse = await provider.getTransaction(sendTx.hash);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      if (txResponse.status === "SUCCESS") {
        let result = txResponse.returnValue;
        return result;
      }
    }
  } catch (err) {
    console.log("Catch-2", err);
    return;
  }
}

// Function to add a post
async function addPost(
  caller,
  id,
  title,
  description,
  wallet_address,
  amount_requested,
  image_url
) {
  let idScVal = numberToU32(id);
  let titleScVal = stringToScValString(title);
  let descriptionScVal = stringToScValString(description);
  let walletAddressScVal = stringToScValString(wallet_address);
  let amountRequestedScVal = numberToU32(amount_requested);
  let imageUrlScVal = stringToScValString(image_url);

  let values = [
    idScVal,
    titleScVal,
    descriptionScVal,
    walletAddressScVal,
    amountRequestedScVal,
    imageUrlScVal,
  ];
  console.log(values);

  try {
    const result = await contractInt(caller, "add_post", values);
    console.log(`Post with ID ${id} added successfully!`);
    console.log(result);
    
    return result;
  } catch (error) {
    console.error("Failed to add post:", error);
  }
}

// Function to get all posts
async function getPosts(caller) {
  try {
    // Call the contract function to get all posts
    let result = await contractInt(caller, "get_posts", null);
    console.log(result);
    
    // Process each post from the result
    let posts = result?._value || [];
    let postsArray = [];

    for (let post of posts) {
      // Extract and convert values from the result
      let id = Number(post?._attributes?.id?._value);
      let title = post?._attributes?.title?._value?.toString();
      let description = post?._attributes?.description?._value?.toString();
      let walletAddress = post?._attributes?.wallet_address?._value?.toString();
      let amountRequested = Number(post?._attributes?.amount_requested?._value);
      let amountReceived = Number(post?._attributes?.amount_received?._value);
      let imageUrl = post?._attributes?.image_url?._value?.toString();

      // Log extracted values for debugging
      console.log(`Post ID: ${id}`);
      console.log(`Title: ${title}`);
      console.log(`Description: ${description}`);
      console.log(`Wallet Address: ${walletAddress}`);
      console.log(`Amount Requested: ${amountRequested}`);
      console.log(`Amount Received: ${amountReceived}`);
      console.log(`Image URL: ${imageUrl}`);

      // Create a post object and add it to the array
      postsArray.push({
        id,
        title,
        description,
        walletAddress,
        amountRequested,
        amountReceived,
        imageUrl,
      });
    }

    return postsArray;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
}

export { addPost, getPosts };
